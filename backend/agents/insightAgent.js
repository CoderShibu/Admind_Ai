import Groq from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * INSIGHT AGENT
 * Feeds structured analytics into Claude and returns
 * categorised, actionable marketing insights as JSON.
 */

const SYSTEM = `You are an expert D2C performance marketing analyst with 10+ years experience 
on Meta Ads, Google Ads, and Amazon. You analyse campaign data and generate precise, 
actionable insights for marketing teams.

Rules:
- Always mention specific campaign names and real numbers from the data
- Every insight must have a clear, single next action
- Prioritise by business impact
- Be direct — no fluff, no hedging

Respond ONLY with a valid JSON array. No markdown, no preamble, no explanation outside the array.

Each object in the array must have exactly these fields:
{
  "id": "unique-string",
  "category": "performance" | "budget" | "creative" | "audience",
  "title": "max 10 words",
  "detail": "2-3 sentences with specific numbers from the data",
  "impact": "high" | "medium" | "low",
  "recommendation": "one specific action the team should take now"
}`;

function buildPrompt({ portfolio, patterns, campaigns }) {
  const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

  return `Analyse this D2C brand's campaign performance and generate 8–10 insights.

PORTFOLIO SUMMARY
Total Spend:       ${fmt(portfolio.totalSpend)}
Total Revenue:     ${fmt(portfolio.totalRevenue)}
Average ROAS:      ${portfolio.avgROAS}x
Average CTR:       ${portfolio.avgCTR}%
Average CAC:       ${fmt(portfolio.avgCAC)}
Total Conversions: ${portfolio.totalConversions}

ALL CAMPAIGNS
${campaigns
  .map(
    (c) =>
      `• ${c.campaign_name} | Platform: ${c.platform || "N/A"} | Spend: ${fmt(c.spend)} | ROAS: ${c.roas}x | CTR: ${c.ctr}% | CAC: ${fmt(c.cac)} | Conv: ${c.conversions} | Status: ${c.status}`
  )
  .join("\n")}

TOP PERFORMERS (ROAS ≥ 3.5)
${patterns.topPerformers.length
  ? patterns.topPerformers.map((c) => `• ${c.campaign_name}: ROAS ${c.roas}x, Spend ${fmt(c.spend)}`).join("\n")
  : "None"}

UNDERPERFORMERS (ROAS < 1.0)
${patterns.underperformers.length
  ? patterns.underperformers.map((c) => `• ${c.campaign_name}: ROAS ${c.roas}x, Spend ${fmt(c.spend)}, CAC ${fmt(c.cac)}`).join("\n")
  : "None"}

NEEDS REVIEW (ROAS 1–2)
${patterns.reviewCampaigns.length
  ? patterns.reviewCampaigns.map((c) => `• ${c.campaign_name}: ROAS ${c.roas}x`).join("\n")
  : "None"}

PLATFORM BREAKDOWN
${patterns.platformBreakdown.map((p) => `• ${p.platform}: ROAS ${p.roas}x, ${p.count} campaigns, Spend ${fmt(p.spend)}`).join("\n")}

CREATIVE FORMAT BREAKDOWN
${patterns.creativeBreakdown.length
  ? patterns.creativeBreakdown.map((c) => `• ${c.format}: ROAS ${c.roas}x, CTR ${c.ctr}%`).join("\n")
  : "No creative format data"}

HIGH CAC CAMPAIGNS
${patterns.highCACCampaigns.length
  ? patterns.highCACCampaigns.map((c) => `• ${c.campaign_name}: CAC ${fmt(c.cac)} vs avg ${fmt(portfolio.avgCAC)}`).join("\n")
  : "None"}

Generate 8–10 specific, actionable insights as a JSON array only.`;
}

export async function runInsightAgent(analytics) {
  console.log("[InsightAgent] Generating insights with Claude…");

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 2500,
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: buildPrompt(analytics) }
    ],
  });

  const text = response.choices[0].message.content.replace(/```json|```/g, "").trim();

  let insights;
  try {
    insights = JSON.parse(text);
  } catch {
    throw new Error("InsightAgent: Claude returned invalid JSON");
  }

  // Guarantee unique IDs
  insights = insights.map((ins, i) => ({
    ...ins,
    id: ins.id || `insight-${Date.now()}-${i}`,
  }));

  console.log(`[InsightAgent] Generated ${insights.length} insights`);
  return insights;
}
