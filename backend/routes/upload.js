import express from "express";
import multer from "multer";
import { runFullPipeline, runAnalyticsOnly } from "../agents/orchestrator.js";

const router = express.Router();

// Store file in memory — we pass the buffer directly to the ingestion agent
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
  fileFilter: (_req, file, cb) => {
    const ok = file.mimetype === "text/csv" ||
               file.originalname.toLowerCase().endsWith(".csv");
    ok ? cb(null, true) : cb(new Error("Only .csv files are accepted"));
  },
});

/**
 * POST /api/upload
 * Multipart form — field name: "file"
 * Optional body fields: generateReport (boolean), reportType (string)
 *
 * Response: full pipeline result with analytics, insights,
 *           optimization, creative, and report download URL.
 */
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded. Use field name: file" });

    const generateReport = req.body.generateReport !== "false";
    const reportType     = req.body.reportType || "weekly";

    const result = await runFullPipeline(req.file.buffer, { generateReport, reportType });
    res.json({ success: true, data: result });

  } catch (err) {
    console.error("[/api/upload]", err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/upload/analyze
 * Re-run AI agents on existing campaign array (no file re-upload needed).
 * Body: { campaigns: [] }
 */
router.post("/analyze", async (req, res) => {
  try {
    const { campaigns } = req.body;
    if (!Array.isArray(campaigns) || !campaigns.length) {
      return res.status(400).json({ error: "campaigns array is required and must not be empty" });
    }
    const result = await runAnalyticsOnly(campaigns);
    res.json({ success: true, data: result });

  } catch (err) {
    console.error("[/api/upload/analyze]", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
