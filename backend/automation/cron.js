import cron from "node-cron";
import { pool } from "../config/db.js";
import { fetchOpenAIUsage } from "../services/openai.service.js";
import { fetchApifyUsage } from "../services/apify.service.js";
import { fetchApolloUsage } from "../services/apollo.service.js";
import { fetchPerplexityUsage } from "../services/perplexity.service.js";

const providerUsageAutomation = () => {
    console.log("provider usage automation started...");

    cron.schedule(
        "0 10 * * *",
        async () => {
            console.log("provider usage cron started");
            console.log(
                "Time:",
                new Date().toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                })
            );

            const safeExecute = async (fetchFn, insertQuery, name) => {
                try {
                    console.log(` Fetching: ${name}`);
                    const result = await fetchFn();

                    if (!result) {
                        console.log(` ${name} failed: no data returned`);
                        return { success: false, error: "no data" };
                    }

                    await pool.query(insertQuery, [result]);
                    console.log(` ${name} saved successfully`);
                    return { success: true, data: result };
                } catch (error) {
                    console.log(` ${name} error:`, error.message);
                    return { success: false, error: error.message };
                }
            };

            await safeExecute(
                fetchOpenAIUsage,
                `INSERT INTO dash.openai_data (data) VALUES ($1)`,
                "OpenAI"
            );

            await safeExecute(
                fetchApifyUsage,
                `INSERT INTO dash.apify_data (data) VALUES ($1)`,
                "Apify"
            );

            await safeExecute(
                fetchApolloUsage,
                `INSERT INTO dash.apollo_data (data) VALUES ($1)`,
                "Apollo"
            );

            await safeExecute(
                fetchPerplexityUsage,
                `INSERT INTO dash.perplexity_data (data) VALUES ($1)`,
                "Perplexity"
            );
        },
        {
            timezone: "Asia/Kolkata",
        }
    );
};

export default providerUsageAutomation;
