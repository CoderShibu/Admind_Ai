/**
 * ANALYTICS AGENT
 * Computes ROAS, CTR, CAC, CVR, CPM, CPC for every campaign,
 * rolls up portfolio-level KPIs, and detects performance patterns.
 * Pure JS — no LLM call, runs instantly.
 */

const r2 = (n) => Math.round(n * 100) / 100;
const safeDivide = (a, b) => (b && b !== 0 ? a / b : 0);

function campaignMetrics(c) {
  const ctr            = r2(safeDivide(c.clicks, c.impressions) * 100);
  const conversionRate = r2(safeDivide(c.conversions, c.clicks) * 100);
  const cac            = r2(safeDivide(c.spend, c.conversions));
  const roas           = r2(safeDivide(c.revenue, c.spend));
  const cpm            = r2(safeDivide(c.spend, c.impressions) * 1000);
  const cpc            = r2(safeDivide(c.spend, c.clicks));

  let status = "stable";
  if (roas >= 3.5)                  status = "scaling";
  else if (roas < 1.0)              status = "pause";
  else if (roas >= 1.0 && roas < 2) status = "review";

  return { ...c, ctr, conversion_rate: conversionRate, cac, roas, cpm, cpc, status };
}

function portfolioKPIs(arr) {
  const totalSpend       = r2(arr.reduce((s, c) => s + c.spend, 0));
  const totalRevenue     = r2(arr.reduce((s, c) => s + c.revenue, 0));
  const totalImpressions =    arr.reduce((s, c) => s + c.impressions, 0);
  const totalClicks      =    arr.reduce((s, c) => s + c.clicks, 0);
  const totalConversions =    arr.reduce((s, c) => s + c.conversions, 0);

  return {
    totalSpend,
    totalRevenue,
    totalImpressions,
    totalClicks,
    totalConversions,
    avgROAS: r2(safeDivide(totalRevenue, totalSpend)),
    avgCTR:  r2(safeDivide(totalClicks, totalImpressions) * 100),
    avgCAC:  r2(safeDivide(totalSpend, totalConversions)),
    avgCVR:  r2(safeDivide(totalConversions, totalClicks) * 100),
  };
}

function detectPatterns(arr, portfolio) {
  const sorted       = [...arr].sort((a, b) => b.roas - a.roas);
  const topPerformers   = arr.filter((c) => c.roas >= 3.5);
  const underperformers = arr.filter((c) => c.roas < 1.0);
  const reviewCampaigns = arr.filter((c) => c.roas >= 1.0 && c.roas < 2.0);

  // Platform rollup
  const platMap = {};
  arr.forEach((c) => {
    if (!platMap[c.platform]) platMap[c.platform] = { spend: 0, revenue: 0, conversions: 0, count: 0 };
    platMap[c.platform].spend       += c.spend;
    platMap[c.platform].revenue     += c.revenue;
    platMap[c.platform].conversions += c.conversions;
    platMap[c.platform].count++;
  });
  const platformBreakdown = Object.entries(platMap).map(([platform, d]) => ({
    platform, ...d, roas: r2(safeDivide(d.revenue, d.spend)),
  }));

  // Creative format rollup
  const creativeMap = {};
  arr.forEach((c) => {
    const fmt = c.creative_format || "unknown";
    if (!creativeMap[fmt]) creativeMap[fmt] = { spend: 0, revenue: 0, clicks: 0, impressions: 0 };
    creativeMap[fmt].spend       += c.spend;
    creativeMap[fmt].revenue     += c.revenue;
    creativeMap[fmt].clicks      += c.clicks;
    creativeMap[fmt].impressions += c.impressions;
  });
  const creativeBreakdown = Object.entries(creativeMap).map(([format, d]) => ({
    format, ...d,
    roas: r2(safeDivide(d.revenue, d.spend)),
    ctr:  r2(safeDivide(d.clicks, d.impressions) * 100),
  }));

  const highCACCampaigns = arr.filter(
    (c) => c.cac > portfolio.avgCAC * 1.5 && c.cac > 0
  );

  return {
    topPerformers,
    underperformers,
    reviewCampaigns,
    platformBreakdown,
    creativeBreakdown,
    highCACCampaigns,
    bestCampaign:  sorted[0]                  || null,
    worstCampaign: sorted[sorted.length - 1]  || null,
  };
}

export async function runAnalyticsAgent(campaigns) {
  console.log(`[AnalyticsAgent] Computing metrics for ${campaigns.length} campaigns…`);
  const enriched  = campaigns.map(campaignMetrics);
  const portfolio = portfolioKPIs(enriched);
  const patterns  = detectPatterns(enriched, portfolio);
  console.log(`[AnalyticsAgent] Done — avgROAS ${portfolio.avgROAS}x, spend ₹${portfolio.totalSpend}`);
  return { campaigns: enriched, portfolio, patterns };
}
