import { fetchOpenAIUsage } from "../services/openai.service.js";
import { fetchApifyUsage } from "../services/apify.service.js";
import { fetchApolloUsage } from "../services/apollo.service.js";
import { fetchPerplexityUsage } from "../services/perplexity.service.js";

export const getOpenAIUsage = async (req, res) => {
  try {
    const data = await fetchOpenAIUsage();
    // console.log("openaidata: ",data);

    res.status(200).json({
      success: true,
      provider: "OpenAI",
      ...data,
    });
  } catch (error) {
    console.log("openai usage error:", error.message);
    res.status(500).json({success:false,message:"something went wrong",error:error.message});
  }
};

export const getApifyUsage = async (req, res) => {
  try {
    const data = await fetchApifyUsage();
    // console.log("data: ",data);

    res.status(200).json({
      success: true,
      provider: "Apify",
      ...data,
    });
  } catch (error) {
    console.log("apify usage error:", error.message);
    res.status(500).json({success:false,message:"something went wrong",error:error.message});
  }
};


export const getApolloUsage = async (req, res) => {
  try {
    const data = await fetchApolloUsage();
    // console.log("data: ",data);

    res.status(200).json({
      success: true,
      provider: "Apollo",
      ...data,
    });
  } catch (error) {
    console.log("apollo usage error:", error.message);
    res.status(500).json({success:false,message:"something went wrong",error:error.message});
  }
};

export const getPerplexityUsage = async (req, res) => {
  try {
    const data = await fetchPerplexityUsage();
    // console.log("data: ",data);

    res.status(200).json({
      success: true,
      provider: "Perplexity",
      ...data,
    });
  } catch (error) {
    console.log("perplexity usage error:", error.message);
    res.status(500).json({success:false,message:"something went wrong",error:error.message});
  }
};
