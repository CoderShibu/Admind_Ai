import express from "express";
import { runAnalyticsAgent } from "../agents/analyticsAgent.js";

const router = express.Router();

/**
 * POST /api/analytics/compute
 * Instant KPI computation — no LLM call, returns in milliseconds.
 * Body: { campaigns: [] }
 */
router.post("/compute", async (req, res) => {
  try {
    const { campaigns } = req.body;
    if (!Array.isArray(campaigns) || !campaigns.length) {
      return res.status(400).json({ error: "campaigns array is required" });
    }
    const analytics = await runAnalyticsAgent(campaigns);
    res.json({ success: true, data: analytics });

  } catch (err) {
    console.error("[/api/analytics/compute]", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
