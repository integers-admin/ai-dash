import { pool } from "../config/db.js";

export const createProviderUsageTables = async () => {
  const query = `
    CREATE EXTENSION IF NOT EXISTS pgcrypto;
    CREATE SCHEMA IF NOT EXISTS dash;

    CREATE TABLE IF NOT EXISTS dash.openai_data (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS dash.apify_data (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS dash.apollo_data (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS dash.perplexity_data (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log("Provider usage tables created successfully");
  } catch (error) {
    console.log("Provider table creation error:", error.message);
    throw error;
  }
};