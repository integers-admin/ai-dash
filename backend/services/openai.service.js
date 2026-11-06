async function fetchAllOpenAI(endpoint, headers, startTime, params = {}) {
  let allData = [];
  let hasMore = true;
  let nextPage = null;
  let pageCount = 0;
  const MAX_PAGES = 100;

  while (hasMore) {
    if (pageCount >= MAX_PAGES) {
      const error = new Error(
        `openai api ${endpoint} exceeded max pages (${MAX_PAGES})`,
      );
      error.status = 500;
      throw error;
    }
    pageCount++;

    const queryParams = {
      start_time: startTime.toString(),
      ...params,
    };
    if (nextPage) queryParams.page = nextPage;

    const query = new URLSearchParams(queryParams).toString();

    let response;
    try {
      response = await fetch(`https://api.openai.com/v1${endpoint}?${query}`, {
        method: "GET",
        headers,
      });
    } catch (networkError) {
      const error = new Error(
        `openai api ${endpoint} network error: ${networkError.message}`,
      );
      error.status = 503;
      throw error;
    }

    let text;
    try {
      text = await response.text();
    } catch (readError) {
      const error = new Error(
        `openai api ${endpoint} response read failed: ${readError.message}`,
      );
      error.status = response.status || 502;
      throw error;
    }

    let body;
    try {
      body = text ? JSON.parse(text) : {};
    } catch {
      body = { rawResponse: text };
    }

    if (!response.ok) {
      const error = new Error(
        `openai api ${endpoint} failed: ${response.status}`,
      );
      error.status = response.status;
      error.code = body?.error?.code || null;
      throw error;
    }

    if (Array.isArray(body.data)) {
      allData.push(...body.data);
    }

    hasMore = body?.has_more === true;
    nextPage = body?.next_page ?? null;
  }

  return allData;
}

export const fetchOpenAIUsage = async () => {
  const token = process.env.OPENAI_ADMIN_API_KEY;
  const orgId = process.env.OPENAI_ORG_ID;

  if (!token) {
    const error = new Error("please provide OPENAI_ADMIN_API_KEY");
    error.status = 500;
    throw error;
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    ...(orgId && { "OpenAI-Organization": orgId }),
  };

  if (orgId && !orgId.startsWith("org-")) {
    const error = new Error("OPENAI_ORG_ID must start with 'org-'");
    error.status = 500;
    throw error;
  }

  const endTime = Math.floor(Date.now() / 1000);
  const startTime = endTime - 30 * 24 * 60 * 60;

  const results = await Promise.allSettled([
    fetchAllOpenAI("/organization/costs", headers, startTime, {
      bucket_width: "1d",
    }),
    fetchAllOpenAI("/organization/usage/completions", headers, startTime, {
      bucket_width: "1d",
      group_by: "model",
    }),
    fetchAllOpenAI("/organization/costs", headers, startTime, {
      bucket_width: "1d",
      group_by: "line_item",
    }),
  ]);

  const allCosts = results[0].status === "fulfilled" ? results[0].value : [];
  const allUsage = results[1].status === "fulfilled" ? results[1].value : [];
  const allModelCosts =
    results[2].status === "fulfilled" ? results[2].value : [];

  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(
        `OpenAI request ${i} failed:`,
        r.reason?.message,
        "code:",
        r.reason?.code,
      );
    }
  });

  const allFailed = results.every((r) => r.status === "rejected");
  if (allFailed) {
    const BILLING_CODES = new Set([
      "credit_balance_exhausted",
      "organization_spend_limit_exceeded",
      "project_spend_limit_exceeded",
      "organization_usage_limit_exceeded",
    ]);

    const rejected = results
      .filter((r) => r.status === "rejected")
      .map((r) => r.reason);

    const billingError = rejected.find((e) => BILLING_CODES.has(e?.code));
    const firstError = billingError || rejected[0];

    const error = new Error(`openai usage fetch failed: ${firstError.message}`);
    error.status = firstError.status || 502;
    error.code = firstError.code || null;
    error.retryable = !BILLING_CODES.has(error.code);

    throw error;
  }

  const safeCosts = Array.isArray(allCosts) ? allCosts : [];
  const safeUsage = Array.isArray(allUsage) ? allUsage : [];
  const safeModelCosts = Array.isArray(allModelCosts) ? allModelCosts : [];

  let totalCostUSD = 0;
  const dailyCostsMap = new Map();

  safeCosts.forEach((bucket) => {
    if (!bucket) return;
    let dailyTotal = 0;
    if (Array.isArray(bucket.results)) {
      bucket.results.forEach((item) => {
        const amount = Number(item?.amount?.value);
        dailyTotal += Number.isFinite(amount) ? amount : 0;
      });
    }

    totalCostUSD += dailyTotal;

    const rawStart = Number(bucket.start_time);
    if (!Number.isFinite(rawStart)) return;

    const dateStr = new Date(rawStart * 1000).toISOString().split("T")[0];

    if (dailyCostsMap.has(dateStr)) {
      dailyCostsMap.set(
        dateStr,
        Number((dailyCostsMap.get(dateStr) + dailyTotal).toFixed(4)),
      );
    } else {
      dailyCostsMap.set(dateStr, Number(dailyTotal.toFixed(4)));
    }
  });

  const dailyCosts = Array.from(dailyCostsMap.entries())
    .map(([date, costUSD]) => ({ date, costUSD }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const modelCostsMap = {};
  safeModelCosts.forEach((bucket) => {
    if (!bucket) return;
    if (Array.isArray(bucket.results)) {
      bucket.results.forEach((item) => {
        const lineItem = item.line_item;
        if (!lineItem) return;
        const rawModel = lineItem.split(",")[0].trim();
        const modelName = rawModel.includes(" ")
          ? rawModel.split(" ")[0]
          : rawModel;
        const cost = Number(item?.amount?.value) || 0;

        if (!modelCostsMap[modelName]) {
          modelCostsMap[modelName] = 0;
        }
        modelCostsMap[modelName] += cost;
      });
    }
  });

  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  const modelUsage = {};

  safeUsage.forEach((bucket) => {
    if (!bucket) return;
    if (Array.isArray(bucket.results)) {
      bucket.results.forEach((item) => {
        if (!item) return;

        const inputTokens = Number(item.input_tokens) || 0;
        const outputTokens = Number(item.output_tokens) || 0;

        totalInputTokens += inputTokens;
        totalOutputTokens += outputTokens;

        const modelName = item.model || "unknown";
        if (!modelUsage[modelName]) {
          modelUsage[modelName] = { inputTokens: 0, outputTokens: 0 };
        }
        modelUsage[modelName].inputTokens += inputTokens;
        modelUsage[modelName].outputTokens += outputTokens;
      });
    }
  });

  Object.keys(modelUsage).forEach((modelName) => {
    let cost = modelCostsMap[modelName];

    if (cost === undefined) {
      const matchingKey = Object.keys(modelCostsMap).find(
        (key) => modelName.startsWith(key) || key.startsWith(modelName),
      );
      if (matchingKey) {
        cost = modelCostsMap[matchingKey];
      }
    }

    modelUsage[modelName].costUSD = Number((cost || 0).toFixed(4));
  });

  const result = {
    fetchedAt: new Date().toISOString(),
    period: {
      start: new Date(startTime * 1000).toISOString().split("T")[0],
      end: new Date(endTime * 1000).toISOString().split("T")[0],
    },
    summary: {
      totalCostUSD: Number(totalCostUSD.toFixed(4)),
      totalInputTokens,
      totalOutputTokens,
      totalTokens: totalInputTokens + totalOutputTokens,
    },
    dailyCosts,
    modelUsage,
  };

  return result;
};
