import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { runReportingAgent } from "../agents/reportingAgent.js";

const router = express.Router();
const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const REPORTS_DIR = path.join(__dirname, "../reports");

/**
 * POST /api/reports/generate
 * Body: { analytics, insights, optimization, reportType }
 */
router.post("/generate", async (req, res) => {
  try {
    const { analytics, insights, optimization, reportType = "weekly" } = req.body;

    if (!analytics?.campaigns?.length) {
      return res.status(400).json({ error: "analytics.campaigns is required" });
    }

    const report = await runReportingAgent(
      analytics,
      insights || [],
      optimization || null,
      reportType
    );

    res.json({
      success: true,
      data: {
        reportId:    report.reportId,
        filename:    report.filename,
        downloadUrl: `/api/reports/download/${report.filename}`,
        generatedAt: new Date().toISOString(),
      },
    });

  } catch (err) {
    console.error("[/api/reports/generate]", err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/reports/download/:filename
 * Streams the PDF file to the client.
 */
router.get("/download/:filename", (req, res) => {
  try {
    const { filename } = req.params;

    // Security: no path traversal, only .pdf files
    if (!filename.endsWith(".pdf") || filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return res.status(400).json({ error: "Invalid filename" });
    }

    const filepath = path.join(REPORTS_DIR, filename);
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    fs.createReadStream(filepath).pipe(res);

  } catch (err) {
    console.error("[/api/reports/download]", err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/reports/list
 * Returns metadata for all generated reports, newest first.
 */
router.get("/list", (_req, res) => {
  try {
    if (!fs.existsSync(REPORTS_DIR)) return res.json({ success: true, data: [] });

    const files = fs
      .readdirSync(REPORTS_DIR)
      .filter((f) => f.endsWith(".pdf"))
      .map((f) => {
        const stats = fs.statSync(path.join(REPORTS_DIR, f));
        return {
          filename:    f,
          reportId:    f.replace(".pdf", ""),
          sizeBytes:   stats.size,
          createdAt:   stats.birthtime,
          downloadUrl: `/api/reports/download/${f}`,
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ success: true, data: files });

  } catch (err) {
    console.error("[/api/reports/list]", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
