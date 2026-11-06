import express from "express";
import "dotenv/config";
import dataRoutes from "./routes/data.route.js";
import cors from 'cors';
import connectDB from "./config/db.js";
import providerUsageAutomation from "./automation/cron.js";
import { createProviderUsageTables } from "./model/data.model.js";

const app = express();

const port = process.env.PORT || 4000;

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://invigorating-optimism-production.up.railway.app",
    ],
  }),
);

app.get("/test", (req, res) => {
  try{
    res.status(200).json({success:true,message:"Api Working"});
  }
  catch(err){
    return res.status(500).json({success:false,message:"something went wrong"});
  }
});

app.use("/api", dataRoutes);

const startServer = async () => {
  try {
    await connectDB();

    await createProviderUsageTables();

    providerUsageAutomation();

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

  } catch (error) {
    console.log("Error:", error.message);

    process.exit(1);
  }
};

startServer();
