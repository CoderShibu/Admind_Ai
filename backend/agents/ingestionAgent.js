import { parse } from "csv-parse/sync";

/**
 * INGESTION AGENT
 * Parses raw CSV buffer, normalises column names,
 * validates data, and returns clean campaign records.
 */

// Maps any common CSV header variant → our internal field name
const ALIASES = {
  campaign: "campaign_name",
  "campaign name": "campaign_name",
  "campaign_name": "campaign_name",
  "ad spend": "spend",
  "marketing spend": "spend",
  "marketing_spend": "spend",
  budget: "spend",
  cost: "spend",
  spend: "spend",
  impression: "impressions",
  impressions: "impressions",
  click: "clicks",
  clicks: "clicks",
  conversion: "conversions",
  conversions: "conversions",
  "ad set": "ad_set_name",
  "ad set name": "ad_set_name",
  "ad_set_name": "ad_set_name",
  platform: "platform",
  channel: "platform",
  revenue: "revenue",
  "revenue generated": "revenue",
  "revenue_generated": "revenue",
  audience: "audience",
  "audience targeting": "audience",
  creative: "creative_format",
  "creative format": "creative_format",
  "creative_format": "creative_format",
  "creative type": "creative_format",
};

function normaliseKey(raw) {
  return ALIASES[raw.trim().toLowerCase()] ?? raw.trim().toLowerCase().replace(/\s+/g, "_");
}

function toNumber(val) {
  if (val === null || val === undefined || val === "") return 0;
  return parseFloat(String(val).replace(/[₹$,\s%]/g, "")) || 0;
}

function validateRow(row, idx) {
  const errs = [];
  ["campaign_name", "spend", "impressions", "clicks", "conversions"].forEach((f) => {
    if (row[f] === undefined || row[f] === "" || row[f] === null)
      errs.push(`Row ${idx + 2}: missing "${f}"`);
  });
  if (row.clicks > row.impressions && row.impressions > 0)
    errs.push(`Row ${idx + 2}: clicks > impressions`);
  return errs;
}

export async function runIngestionAgent(csvBuffer) {
  console.log("[IngestionAgent] Parsing CSV…");

  let raw;
  try {
    raw = parse(csvBuffer, { columns: true, skip_empty_lines: true, trim: true });
  } catch (e) {
    throw new Error(`CSV parse error: ${e.message}`);
  }

  if (!raw.length) throw new Error("CSV file is empty");

  const warnings = [];

  const campaigns = raw.map((row, i) => {
    // Normalise all keys
    const n = {};
    Object.entries(row).forEach(([k, v]) => (n[normaliseKey(k)] = v));

    const campaign = {
      campaign_name: String(n.campaign_name || `Campaign ${i + 1}`).trim(),
      ad_set_name:   String(n.ad_set_name   || "").trim(),
      platform:      String(n.platform       || "unknown").trim(),
      spend:         toNumber(n.spend),
      impressions:   toNumber(n.impressions),
      clicks:        toNumber(n.clicks),
      conversions:   toNumber(n.conversions),
      revenue:       toNumber(n.revenue),
      audience:      String(n.audience        || "").trim(),
      creative_format: String(n.creative_format || "").trim(),
    };

    warnings.push(...validateRow(campaign, i));
    return campaign;
  });

  if (warnings.length) console.warn("[IngestionAgent] Warnings:", warnings);
  console.log(`[IngestionAgent] Parsed ${campaigns.length} campaigns`);
  return { campaigns, rowCount: campaigns.length, warnings };
}
