async function fetchPerplexity(url, headers) {
  let response;

  try {
    response = await fetch(url, { method: "GET", headers });
  } catch (networkError) {
    const error = new Error(
      `perplexity api network error: ${networkError.message}`,
    );
    error.status = 503;
    error.details = { cause: networkError.message };
    throw error;
  }

  let text;
  try {
    text = await response.text();
  } catch (readError) {
    const error = new Error(
      `perplexity api response read failed: ${readError.message}`,
    );
    error.status = response.status || 502;
    error.details = { cause: readError.message };
    throw error;
  }

  if (text.includes("Just a moment...")) {
    const error = new Error("cloudflare blocked. cookies expired.");
    error.status = 403;
    throw error;
  }

  if (!response.ok) {
    const error = new Error(`perplexity api ${url} failed: ${response.status}`);
    error.status = response.status;
    error.details = text;
    throw error;
  }

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    const error = new Error("failed to parse perplexity response");
    error.status = 500;
    error.details = text;
    throw error;
  }
}

export const fetchPerplexityUsage = async () => {
  const cookieString = process.env.PERPLEXITY_COOKIE;
  const groupId = process.env.PERPLEXITY_GROUP_ID;

  if (!cookieString) {
    const error = new Error("please provide PERPLEXITY_COOKIE");
    error.status = 500;
    throw error;
  }

  if (!groupId) {
    const error = new Error("please provide PERPLEXITY_GROUP_ID");
    error.status = 500;
    throw error;
  }

  const usageHeaders = {
    accept: "*/*",
    "accept-encoding": "gzip, deflate, br, zstd",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    cookie: cookieString,
    "user-agent":
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
    "x-app-apiclient": "api-console",
    "x-app-apiversion": "2.18",
    "x-app-domain": "api-console",
    "x-perplexity-request-reason": "billing-page",
    "x-perplexity-request-try-number": "1",
    referer: `https://console.perplexity.ai/project/${groupId}/billing`,
  };

  const balanceHeaders = {
    accept: "*/*",
    cookie: cookieString,
    "user-agent":
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  };

  const usageUrl = `https://console.perplexity.ai/rest/pplx-api/v2/groups/${groupId}/usage-analytics?time_bucket=day&time_range=past_month&version=2.18&source=default`;
  const balanceUrl = `https://www.perplexity.ai/rest/pplx-api/v2/groups/${groupId}`;

  let data;
  let balanceData;

  try {
    [data, balanceData] = await Promise.all([
      fetchPerplexity(usageUrl, usageHeaders),
      fetchPerplexity(balanceUrl, balanceHeaders).catch(() => null),
    ]);
  } catch (fetchError) {
    const error = new Error(
      `perplexity usage fetch failed: ${fetchError.message}`,
    );
    error.status = fetchError.status || 502;
    error.details = fetchError.details || null;
    throw error;
  }

  const safeData = Array.isArray(data) ? data : [];

  let totalCostUSD = 0;
  let totalApiRequests = 0;
  let totalInputTokens = 0;
  let totalOutputTokens = 0;

  const dailyCosts = {};
  const modelUsage = {};

  safeData.forEach((meter) => {
    if (!meter) return;
    if (meter.meter_event_summaries && meter.meter_event_summaries.length > 0) {
      meter.meter_event_summaries.forEach((event) => {
        if (!event) return;
        if (event.cost) {
          totalCostUSD += event.cost;
          const rawStart = Number(event.start_time);
          if (Number.isFinite(rawStart)) {
            const dateStr = new Date(rawStart * 1000)
              .toISOString()
              .split("T")[0];
            if (!dailyCosts[dateStr]) dailyCosts[dateStr] = 0;
            dailyCosts[dateStr] += event.cost;
          }
        }

        const modelName =
          event.dimensions?.model_name ||
          event.dimensions?.response_api_model ||
          "other";

        if (!modelUsage[modelName]) {
          modelUsage[modelName] = {
            inputTokens: 0,
            outputTokens: 0,
            requests: 0,
            cost: 0,
          };
        }
        modelUsage[modelName].cost += event.cost || 0;

        const usageValue = Number(event.usage) || 0;

        if (
          meter.name === "input_tokens" ||
          meter.name === "response_api_uncached_input_tokens"
        ) {
          totalInputTokens += usageValue;
          modelUsage[modelName].inputTokens += usageValue;
        } else if (
          meter.name === "output_tokens" ||
          meter.name === "response_api_output_tokens"
        ) {
          totalOutputTokens += usageValue;
          modelUsage[modelName].outputTokens += usageValue;
        } else if (meter.name === "api_requests") {
          totalApiRequests += usageValue;
          modelUsage[modelName].requests += usageValue;
        }
      });
    }
  });

  const dailyCostsArray = Object.keys(dailyCosts)
    .map((date) => ({
      date,
      costUSD: Number(dailyCosts[date].toFixed(4)),
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  totalCostUSD = Number(totalCostUSD.toFixed(4));
  Object.keys(modelUsage).forEach((model) => {
    modelUsage[model].cost = Number(modelUsage[model].cost.toFixed(4));
  });

  let remainingBalance = null;
  if (balanceData) {
    remainingBalance =
      balanceData.customerInfo?.balance ||
      balanceData.balance ||
      balanceData.data?.customerInfo?.balance ||
      null;
  }

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 30);

  const result = {
    fetchedAt: new Date().toISOString(),

    period: {
      startDate: startDate ?? null,
      endDate: endDate ?? null,
    },

    remainingBalanceUSD: remainingBalance,

    summary: {
      totalCostUSD,
      totalApiRequests,
      totalInputTokens,
      totalOutputTokens,
    },

    dailyCosts: dailyCostsArray,
    modelUsage,
  };

  return result;
};
