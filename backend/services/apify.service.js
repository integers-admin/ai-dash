function toNumber(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function calculateMetric(limitValue, usedValue) {
  const limit = toNumber(limitValue);
  const used = toNumber(usedValue);

  if (limit === null || used === null || limit <= 0) {
    return {
      limit,
      used,
      remaining: null,
      usedPercent: null,
      remainingPercent: null,
    };
  }

  const remaining = Math.max(limit - used, 0);

  return {
    limit,
    used,
    remaining,
    usedPercent: Number(((used / limit) * 100).toFixed(2)),
    remainingPercent: Number(((remaining / limit) * 100).toFixed(2)),
  };
}

async function fetchApify(endpoint, headers) {
  let response;

  try {
    response = await fetch(`https://api.apify.com/v2${endpoint}`, {
      method: "GET",
      headers,
    });
  } catch (networkError) {
    const error = new Error(
      `apify api ${endpoint} network error: ${networkError.message}`
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
      `apify api ${endpoint} response read failed: ${readError.message}`
    );
    error.status = response.status || 502;
    error.details = { cause: readError.message };
    throw error;
  }

  let body;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { rawResponse: text };
  }

  if (!response.ok) {
    const error = new Error(`apify api ${endpoint} failed: ${response.status}`);
    error.status = response.status;
    error.details = body;
    throw error;
  }

  return body;
}

async function fetchAllActors(headers) {
  let allActors = [];
  let offset = 0;
  const limit = 100;
  let total = 1;

  while (offset < total) {
    const actorsJson = await fetchApify(
      `/actors?limit=${limit}&offset=${offset}`,
      headers
    );
    const actorsData = actorsJson.data ?? actorsJson;

    if (!actorsData || !Array.isArray(actorsData.items)) {
      break;
    }

    allActors.push(...actorsData.items);
    total = actorsData.total || allActors.length;
    offset += limit;

    if (actorsData.items.length === 0) break;
  }

  return allActors;
}

export const fetchApifyUsage = async () => {
  const token = process.env.APIFY_API_TOKEN;
  const planAmountEnv = process.env.APIFY_PLAN_PREPAID_AMOUNT;

  if (!token) {
    const error = new Error("please provide APIFY_API_TOKEN");
    error.status = 500;
    throw error;
  }

  if (!planAmountEnv) {
    const error = new Error("please provide APIFY_PLAN_PREPAID_AMOUNT");
    error.status = 500;
    throw error;
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  let limitsJson;
  let usageJson;
  let userJson;
  let allActors;

  try {
    [limitsJson, usageJson, userJson, allActors] = await Promise.all([
      fetchApify("/users/me/limits", headers),
      fetchApify("/users/me/usage/monthly", headers),
      fetchApify("/users/me", headers),
      fetchAllActors(headers),
    ]);
  } catch (fetchError) {
    const error = new Error(`apify usage fetch failed: ${fetchError.message}`);
    error.status = fetchError.status || 502;
    error.details = fetchError.details || null;
    throw error;
  }

  const safeLimitsJson = limitsJson ?? {};
  const safeUsageJson = usageJson ?? {};
  const safeUserJson = userJson ?? {};
  const safeActorsList = Array.isArray(allActors) ? allActors : [];

  const limitsData = safeLimitsJson.data ?? safeLimitsJson;
  const usageData = safeUsageJson.data ?? safeUsageJson;
  const userData = safeUserJson.data ?? safeUserJson;

  const limits = limitsData?.limits ?? {};
  const current = limitsData?.current ?? {};

  const prepaidLimit = toNumber(planAmountEnv);
  const currentUsage = toNumber(current?.monthlyUsageUsd);
  let prepaidUsageMetric = null;

  if (prepaidLimit !== null && currentUsage !== null && prepaidLimit > 0) {
    const remaining = Math.max(prepaidLimit - currentUsage, 0);
    prepaidUsageMetric = {
      limit: prepaidLimit,
      used: currentUsage,
      remaining: Number(remaining.toFixed(2)),
      usedPercent: Number(((currentUsage / prepaidLimit) * 100).toFixed(2)),
      remainingPercent: Number(((remaining / prepaidLimit) * 100).toFixed(2)),
    };
  }


  const myActors = safeActorsList
    .filter((actor) => actor !== null && actor !== undefined)
    .map((actor) => ({
      id: actor.id ?? null,
      name: actor.name ?? "Unknown Actor",
      username: actor.username ?? null,
      createdAt: actor.createdAt ?? null,
      url: actor.id ? `https://console.apify.com/actors/${actor.id}` : null,
    }));

  const result = {
    fetchedAt: new Date().toISOString(),
    usageCycle: limitsData?.monthlyUsageCycle ?? null,

    account: {
      username: userData?.username ?? null,
      email: userData?.email ?? null,
      plan: userData?.plan?.name ?? null,
    },

    myActors,

    monthlySpend: calculateMetric(
      limits.maxMonthlyUsageUsd,
      current.monthlyUsageUsd
    ),
    prepaidUsage: prepaidUsageMetric,

    actorComputeUnits: calculateMetric(
      limits.maxMonthlyActorComputeUnits,
      current.monthlyActorComputeUnits
    ),

    externalDataTransferGB: calculateMetric(
      limits.maxMonthlyExternalDataTransferGbytes,
      current.monthlyExternalDataTransferGbytes
    ),

    proxySerps: calculateMetric(
      limits.maxMonthlyProxySerps,
      current.monthlyProxySerps
    ),

    monthlyUsageDetails: {
      usageCycle: usageData?.usageCycle ?? null,
      totalUsageCreditsUsd:
        usageData?.totalUsageCreditsUsdAfterVolumeDiscount ?? null,
      monthlyServiceUsage: usageData?.monthlyServiceUsage ?? null,
      dailyServiceUsages: usageData?.dailyServiceUsages ?? null,
    },
  };

  return result;
};
