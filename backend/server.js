import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import uploadRoutes from "./routes/upload.js";
import insightsRoutes from "./routes/insights.js";
import chatRoutes from "./routes/chat.js";
import reportsRoutes from "./routes/reports.js";
import analyticsRoutes from "./routes/analytics.js";

dotenv.config();

const isVercel = !!process.env.VERCEL;
const storageDir = isVercel ? "/tmp" : __dirname;

// ── Ensure required directories exist ─────────────────────────
["uploads", "reports"].forEach((dir) => {
  const p = path.join(storageDir, dir);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

// ── CORS ──────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return cb(null, true);
      // Allow any localhost origin dynamically
      if (origin.startsWith("http://localhost:")) return cb(null, true);
      if (allowedOrigins.some((o) => origin.startsWith(o))) return cb(null, true);
      cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

// ── Body parsers ──────────────────────────────────────────────
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// ── Request logger (dev) ──────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ── Routes ────────────────────────────────────────────────────
app.use("/api/upload", uploadRoutes);
app.use("/api/insights", insightsRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/analytics", analyticsRoutes);

// ── Health check ──────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Admind AI Backend",
    timestamp: new Date().toISOString(),
    groqConfigured: !!process.env.GROQ_API_KEY,
  });
});

// ── 404 ───────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Global error handler ──────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("[Server Error]", err.message);
  res.status(500).json({ error: err.message || "Internal server error" });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`\n🚀 Admind AI backend running on http://localhost:${PORT}`);
    console.log(`   Groq API: ${process.env.GROQ_API_KEY ? "✅ configured" : "❌ MISSING"}`);
    console.log(`   Frontend URL:  ${process.env.FRONTEND_URL || "http://localhost:5173"}\n`);
  });
}

export default app;
