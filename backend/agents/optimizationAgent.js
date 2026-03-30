import Groq from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * OPTIMIZATION AGENT
 * Generates a complete optimization plan: budget reallocations,
 * audience moves, bid strategy changes, quick wins, weekly priorities.
 */

const SYSTEM = `You are a senior D2C performance marketing strategist.
You produce numbers-driven optimization plans for marketing teams.

Respond ONLY with a valid JSON object. No markdown, no preamble.

Required structure:
{
  "budgetReallocations": [
    {
      "campaign": "exact campaign name from the data",
      "currentSpend": number,
      "recommendedSpend": number,
      "changePercent": number,
      "rationale": "one sentence"
    }
  ],
  "audienceRecommendations": [
    {
      "type": "expand" | "pause" | "test",
      "audience": "audience description",
      "rationale": "why this will improve performance"
    }
  ],
  "bidStrategies": [
    {
      "campaign": "campaign name",
      "recommendation": "specific bid strategy change",
      "expectedImpact": "expected outcome with estimated improvement"
    }
  ],
  "quickWins": ["action doable today", "action doable today", "action doable today"],
  "weeklyPriorities": ["top priority this week", "second priority", "third priority"]
}`;

function buildPrompt({ portfolio, patterns, campaigns }, insights) {
  const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
  const highImpact = insights
    .filter((i) => i.impact === "high")
    .map((i) => `• ${i.title}: ${i.recommendation}`)
    .join("\n");

  return `Generate a complete optimization plan for this marketing portfolio.

TOTAL BUDGET: ${fmt(portfolio.totalSpend)}
AVERAGE ROAS: ${portfolio.avgROAS}x
AVERAGE CAC:  ${fmt(portfolio.avgCAC)}

ALL CAMPAIGNS
${campaigns
  .map(
    (c) =>
      `${c.campaign_name} | ${c.platform || "N/A"} | Spend: ${fmt(c.spend)} | ROAS: ${c.roas}x | CTR: ${c.ctr}% | CAC: ${fmt(c.cac)} | Status: ${c.status}`
  )
  .join("\n")}

HIGH-IMPACT INSIGHTS ALREADY IDENTIFIED
${highImpact || "None yet"}

Instructions:
1. Budget reallocation: Keep total budget the same — just redistribute it
2. Audience: Give 3–4 specific audience segment actions
3. Bid strategies: Focus on top 3–4 campaigns
4. Quick wins: 3 things the team can do TODAY
5. Weekly priorities: Top 3 strategic priorities for this week

Return JSON only.`;
}

export async function runOptimizationAgent(analytics, insights) {
  console.log("[OptimizationAgent] Generating optimization plan…");

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 2000,
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: buildPrompt(analytics, insights) }
    ],
  });

  const text = response.choices[0].message.content.replace(/```json|```/g, "").trim();

  let optimization;
  try {
    optimization = JSON.parse(text);
  } catch {
    throw new Error("OptimizationAgent: Claude returned invalid JSON");
  }

  console.log("[OptimizationAgent] Plan generated");
  return optimization;
}
