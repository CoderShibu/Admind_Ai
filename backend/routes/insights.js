import express from "express";
import { runInsightAgent }      from "../agents/insightAgent.js";
import { runOptimizationAgent } from "../agents/optimizationAgent.js";
import { runCreativeAgent }     from "../agents/creativeAgent.js";

const router = express.Router();

/**
 * POST /api/insights/generate
 * Re-generate all AI outputs from existing analytics data.
 * Body: { analytics: {} }
 */
router.post("/generate", async (req, res) => {
  try {
    const { analytics } = req.body;
    if (!analytics?.campaigns?.length) {
      return res.status(400).json({ error: "analytics.campaigns array is required" });
    }

    // Run all three LLM agents in parallel for speed
    const [insights, creative] = await Promise.all([
      runInsightAgent(analytics),
      runCreativeAgent(analytics),
    ]);

    // Optimization needs insights as input — run after
    const optimization = await runOptimizationAgent(analytics, insights);

    res.json({ success: true, data: { insights, optimization, creative } });

  } catch (err) {
    console.error("[/api/insights/generate]", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
