import express from "express";
import Groq from "groq-sdk";

const router = express.Router();
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM = `You are Admind AI — an expert AI marketing analyst built for D2C brands.
You help performance marketing teams understand their campaign data, make smart optimisation 
decisions, and grow their brands profitably.

You will receive campaign analytics data in each message as context.
Always use real numbers from the data when they are available.
Be specific, be direct, and always end with one concrete next action.

Formatting:
- Use **bold** for campaign names and key metrics
- Use bullet points for lists of recommendations
- Keep responses under 250 words
- Always end with: "**Next action:** [one specific thing to do today]"`;

/**
 * POST /api/chat
 * Body:
 *   message            {string}  — the user's question
 *   conversationHistory {array}  — [{role, content}] last N turns
 *   campaignContext     {object} — analytics object from the pipeline (optional)
 */
router.post("/", async (req, res) => {
  try {
    const { message, conversationHistory = [], campaignContext = null } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "message is required" });
    }

    // Build context block prepended to the user's message
    let contextBlock = "";
    if (campaignContext?.portfolio) {
      const p = campaignContext.portfolio;
      const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
      contextBlock = `
[LIVE CAMPAIGN DATA CONTEXT]
Total Spend: ${fmt(p.totalSpend)} | Total Revenue: ${fmt(p.totalRevenue)} | Avg ROAS: ${p.avgROAS}x | Avg CTR: ${p.avgCTR}% | Avg CAC: ${fmt(p.avgCAC)} | Conversions: ${p.totalConversions}

Top performers: ${(campaignContext.patterns?.topPerformers || []).slice(0, 3).map((c) => `${c.campaign_name} (ROAS ${c.roas}x)`).join(", ") || "none"}
Underperformers: ${(campaignContext.patterns?.underperformers || []).slice(0, 3).map((c) => `${c.campaign_name} (ROAS ${c.roas}x)`).join(", ") || "none"}
[END CONTEXT]

`;
    } else {
      contextBlock = "[No campaign data uploaded yet — provide general D2C marketing advice]\n\n";
    }

    // Keep last 10 turns of history to stay within context limits
    const history = (conversationHistory || []).slice(-10).map((m) => ({
      role:    m.role === "assistant" ? "assistant" : "user",
      content: String(m.content),
    }));

    const messages = [
      { role: "system", content: SYSTEM },
      ...history,
      { role: "user", content: contextBlock + message },
    ];

    const response = await client.chat.completions.create({
      model:      "llama-3.3-70b-versatile",
      max_tokens: 700,
      messages,
    });

    res.json({
      success: true,
      reply:   response.choices[0].message.content,
      usage:   response.usage,
    });

  } catch (err) {
    console.error("[/api/chat]", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
