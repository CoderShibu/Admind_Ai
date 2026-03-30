import Groq from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * CREATIVE INTELLIGENCE AGENT
 * Analyses creative format performance and generates
 * ready-to-use ad copy with hooks, body, and CTAs.
 */

const SYSTEM = `You are a creative strategist for D2C brands specialising in 
high-converting ad copy for Meta Ads, Google Ads, and Amazon.

Respond ONLY with a valid JSON object. No markdown, no preamble.

Required structure:
{
  "creativeAnalysis": {
    "bestFormat": "format name",
    "formatInsight": "2 sentences on what creative data shows",
    "messagingPatterns": ["winning pattern 1", "winning pattern 2", "winning pattern 3"]
  },
  "adCopySuggestions": [
    {
      "id": "copy-1",
      "hook": "attention-grabbing first line (max 10 words)",
      "body": "2-3 sentence ad body copy",
      "cta": "call to action text",
      "format": "video" | "image" | "carousel",
      "angle": "emotional" | "rational" | "social_proof" | "urgency"
    }
  ],
  "testingRecommendations": [
    {
      "test": "what to A/B test",
      "hypothesis": "expected outcome",
      "priority": "high" | "medium" | "low"
    }
  ]
}`;

function buildPrompt({ portfolio, patterns, campaigns }) {
  const topNames = patterns.topPerformers.slice(0, 3).map((c) => c.campaign_name).join(", ");
  const creativeData = patterns.creativeBreakdown.length
    ? patterns.creativeBreakdown.map((c) => `${c.format}: ROAS ${c.roas}x, CTR ${c.ctr}%`).join("\n")
    : "No creative format breakdown available";

  // Infer brand category from campaign names
  const allNames = campaigns.map((c) => c.campaign_name).join(" ").toLowerCase();
  const category =
    allNames.includes("skin") || allNames.includes("care")
      ? "skincare/beauty D2C"
      : allNames.includes("hair")
      ? "haircare D2C"
      : allNames.includes("health") || allNames.includes("wellness")
      ? "health & wellness D2C"
      : "D2C consumer brand";

  return `Generate creative intelligence for a ${category}.

TOP PERFORMING CAMPAIGNS: ${topNames || "N/A"}

CREATIVE FORMAT PERFORMANCE
${creativeData}

PORTFOLIO METRICS
Average CTR: ${portfolio.avgCTR}%
Average Conversion Rate: ${portfolio.avgCVR}%
Average ROAS: ${portfolio.avgROAS}x

Generate:
1. Creative format analysis (what's working and why)
2. 5 ad copy suggestions with hooks, body copy, and CTA
3. 3 A/B test recommendations

Make the copy feel authentic and specific to the brand category.
Return JSON only.`;
}

export async function runCreativeAgent(analytics) {
  console.log("[CreativeAgent] Generating creative strategy…");

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 1800,
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: buildPrompt(analytics) }
    ],
  });

  const text = response.choices[0].message.content.replace(/```json|```/g, "").trim();

  let creative;
  try {
    creative = JSON.parse(text);
  } catch {
    throw new Error("CreativeAgent: Claude returned invalid JSON");
  }

  // Ensure IDs on copy suggestions
  if (creative.adCopySuggestions) {
    creative.adCopySuggestions = creative.adCopySuggestions.map((s, i) => ({
      ...s,
      id: s.id || `copy-${i + 1}`,
    }));
  }

  console.log("[CreativeAgent] Creative strategy generated");
  return creative;
}
