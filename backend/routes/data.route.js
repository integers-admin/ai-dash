import express from "express";
import {getOpenAIUsage,getApifyUsage,getApolloUsage,getPerplexityUsage} from "../controllers/data.controller.js";

const router = express.Router();

router.get("/openai/usage", getOpenAIUsage);
router.get("/apify/usage", getApifyUsage);
router.get("/apollo/usage", getApolloUsage);
router.get("/perplexity/usage", getPerplexityUsage);

export default router;
