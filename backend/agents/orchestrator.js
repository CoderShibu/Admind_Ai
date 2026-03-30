import { runIngestionAgent }    from "./ingestionAgent.js";
import { runAnalyticsAgent }    from "./analyticsAgent.js";
import { runInsightAgent }      from "./insightAgent.js";
import { runOptimizationAgent } from "./optimizationAgent.js";
import { runCreativeAgent }     from "./creativeAgent.js";
import { runReportingAgent }    from "./reportingAgent.js";

/**
 * AGENT ORCHESTRATOR
 * Runs the full pipeline in sequence:
 *   Ingest → Analytics → Insights → Optimization → Creative → Report
 *
 * Each agent's output feeds the next one.
 */

export async function runFullPipeline(csvBuffer, options = {}) {
  const { generateReport = true, reportType = "weekly" } = options;
  const t0 = Date.now();

  console.log("\n================================================");
  console.log("   Admind AI — Full Agent Pipeline Starting");
  console.log("================================================\n");

  // Step 1 — Ingest
  const ingestion = await runIngestionAgent(csvBuffer);

  // Step 2 — Analytics (pure JS, instant)
  const analytics = await runAnalyticsAgent(ingestion.campaigns);

  // Step 3 — Insights (LLM)
  const insights = await runInsightAgent(analytics);

  // Step 4 — Optimization (LLM)
  const optimization = await runOptimizationAgent(analytics, insights);

  // Step 5 — Creative (LLM)
  const creative = await runCreativeAgent(analytics);

  // Step 6 — Report (PDF generation, optional)
  let report = null;
  if (generateReport) {
    report = await runReportingAgent(analytics, insights, optimization, reportType);
  }

  const duration = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\n✅ Pipeline complete in ${duration}s\n`);

  return {
    ingestion: {
      rowCount: ingestion.rowCount,
      warnings: ingestion.warnings,
    },
    analytics,
    insights,
    optimization,
    creative,
    report: report
      ? {
          reportId:    report.reportId,
          filename:    report.filename,
          downloadUrl: `/api/reports/download/${report.filename}`,
        }
      : null,
    meta: {
      processedAt:   new Date().toISOString(),
      duration:      `${duration}s`,
      campaignCount: ingestion.rowCount,
    },
  };
}

/**
 * Re-run LLM agents on already-parsed campaign data.
 * Useful when user wants fresh insights without re-uploading.
 */
export async function runAnalyticsOnly(campaigns) {
  const analytics    = await runAnalyticsAgent(campaigns);
  const insights     = await runInsightAgent(analytics);
  const optimization = await runOptimizationAgent(analytics, insights);
  const creative     = await runCreativeAgent(analytics);
  return { analytics, insights, optimization, creative };
}
