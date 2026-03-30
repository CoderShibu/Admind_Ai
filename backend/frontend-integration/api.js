/**
 * Admind AI — Frontend API Service
 * ─────────────────────────────────────────────────────────────
 * Drop this file into your Lovable project at:
 *   src/services/api.js
 *
 * Then import and use in any component:
 *   import { uploadCSV, sendChatMessage } from "@/services/api";
 *
 * Set your backend URL in .env.local:
 *   VITE_API_URL=https://your-railway-url.up.railway.app
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

// ── Helper ────────────────────────────────────────────────────
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `Request failed: ${res.status}`);
    }

    return data;
  } catch (err) {
    console.error(`[API] ${endpoint}`, err.message);
    throw err;
  }
}

// ── Health check ──────────────────────────────────────────────
export async function checkHealth() {
  return apiFetch("/api/health");
}

// ── Upload CSV → triggers full 6-agent pipeline ───────────────
/**
 * @param {File} file - The CSV file from input or drag-drop
 * @param {boolean} generateReport - Whether to generate PDF (default true)
 * @param {string} reportType - "weekly" | "monthly" (default "weekly")
 * @returns Full pipeline result: { analytics, insights, optimization, creative, report }
 */
export async function uploadCSV(file, generateReport = true, reportType = "weekly") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("generateReport", String(generateReport));
  formData.append("reportType", reportType);

  return apiFetch("/api/upload", {
    method: "POST",
    body: formData,
    // Do NOT set Content-Type — browser sets it with boundary for multipart
  });
}

// ── Re-run AI agents on existing campaign data ────────────────
/**
 * @param {Array} campaigns - Array of campaign objects from previous upload
 * @returns { analytics, insights, optimization, creative }
 */
export async function reanalyze(campaigns) {
  return apiFetch("/api/upload/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ campaigns }),
  });
}

// ── Compute KPIs only (no LLM, instant) ──────────────────────
/**
 * @param {Array} campaigns
 * @returns analytics object with portfolio KPIs and patterns
 */
export async function computeAnalytics(campaigns) {
  return apiFetch("/api/analytics/compute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ campaigns }),
  });
}

// ── Re-generate AI insights from analytics ────────────────────
/**
 * @param {Object} analytics - Analytics object from pipeline
 * @returns { insights, optimization, creative }
 */
export async function generateInsights(analytics) {
  return apiFetch("/api/insights/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ analytics }),
  });
}

// ── Chat with the AI agent ────────────────────────────────────
/**
 * @param {string} message - User's question
 * @param {Array}  conversationHistory - [{role, content}] last N turns
 * @param {Object} campaignContext - analytics object to give AI data context
 * @returns { reply: string }
 */
export async function sendChatMessage(message, conversationHistory = [], campaignContext = null) {
  return apiFetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, conversationHistory, campaignContext }),
  });
}

// ── Generate PDF report ───────────────────────────────────────
/**
 * @param {Object} analytics
 * @param {Array}  insights
 * @param {Object} optimization
 * @param {string} reportType - "weekly" | "monthly" | "custom"
 * @returns { reportId, filename, downloadUrl }
 */
export async function generateReport(analytics, insights, optimization, reportType = "weekly") {
  return apiFetch("/api/reports/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ analytics, insights, optimization, reportType }),
  });
}

// ── List all generated reports ────────────────────────────────
export async function listReports() {
  return apiFetch("/api/reports/list");
}

// ── Get PDF download URL (full URL for anchor tag) ───────────
export function getReportDownloadUrl(filename) {
  return `${API_BASE}/api/reports/download/${filename}`;
}
