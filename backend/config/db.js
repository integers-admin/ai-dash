import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const connectDB = async () => {
  try {
    const client = await pool.connect();

    console.log("Neon PostgreSQL Connected");

    client.release();
  } catch (error) {
    console.log("PostgreSQL Connection Failed:", error.message);
    process.exit(1);
  }
};

export { pool };
export default connectDB;
