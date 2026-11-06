function formatCredit(data) {
  if (!data) return null;
  return {
    limit: Number(data.limit) || 0,
    consumed: Number(data.consumed) || 0,
    leftOver: Number(data.left_over) || 0,
  };
}

async function fetchApollo(endpoint, headers, method = "POST") {
  const options = {
    method,
    headers,
  };

  if (method === "POST") {
    options.body = JSON.stringify({});
  }

  let response;

  try {
    response = await fetch(`https://api.apollo.io/api/v1${endpoint}`, options);
  } catch (networkError) {
    const error = new Error(
      `apollo api ${endpoint} network error: ${networkError.message}`
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
      `apollo api ${endpoint} response read failed: ${readError.message}`
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
    const error = new Error(
      `apollo api ${endpoint} failed: ${response.status}`
    );
    error.status = response.status;
    error.details = body;
    throw error;
  }

  return body;
}

export const fetchApolloUsage = async () => {
  const token = process.env.APOLLO_MASTER_API_KEY;

  if (!token) {
    const error = new Error(
      "please provide APOLLO_MASTER_API_KEY"
    );
    error.status = 500;
    throw error;
  }

  const headers = {
    "x-api-key": token,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  let creditJson;
  let rateLimitJson;

  try {
    [creditJson, rateLimitJson] = await Promise.all([
      fetchApollo("/usage_stats/credit_usage_stats", headers, "POST"),
      fetchApollo("/usage_stats/api_usage_stats", headers, "POST"),
    ]);
  } catch (fetchError) {
    const error = new Error(
      `apollo usage fetch failed: ${fetchError.message}`
    );
    error.status = fetchError.status || 502;
    error.details = fetchError.details || null;
    throw error;
  }

  const safeCreditJson = creditJson ?? {};
  const safeRateLimitJson = rateLimitJson ?? {};

  const rawCreditData = safeCreditJson.credit_usage_stats ?? {};
  const rawCycle = safeCreditJson.current_credit_cycle ?? {};

  const rawRateLimits = safeRateLimitJson ?? {};
  const importantEndpoints = [
    '["api/v1/people", "search"]',
    '["api/v1/organizations", "search"]',
    '["api/v1/contacts", "search"]',
    '["api/v1/mixed_people", "search"]',
    '["api/v1/enrich", "create"]',
  ];

  const filteredRateLimits = {};
  importantEndpoints.forEach((endpoint) => {
    if (rawRateLimits[endpoint]) {
      filteredRateLimits[endpoint] = rawRateLimits[endpoint];
    }
  });

  const result = {
    fetchedAt: new Date().toISOString(),

    billingCycle: {
      startDate: rawCycle?.start_date ?? null,
      endDate: rawCycle?.end_date ?? null,
    },

    credits: {
      leadCredits: formatCredit(rawCreditData?.lead_credit),
      directDialCredits: formatCredit(rawCreditData?.direct_dial_credit),
      exportCredits: formatCredit(rawCreditData?.export_credit),
      aiCredits: formatCredit(rawCreditData?.ai_credit),
      conversationCredits: formatCredit(rawCreditData?.conversation_credit),
      dialerCredits: formatCredit(rawCreditData?.dialer),
      broadcastCredits: formatCredit(rawCreditData?.broadcast_credit),
    },

    rateLimits: filteredRateLimits,
  };

  return result;
};
