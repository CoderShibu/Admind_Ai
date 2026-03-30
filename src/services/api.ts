/**
 * Admind AI — Frontend API Service
 */

const API_BASE = import.meta.env.VITE_API_URL || ""; // Use relative path by default in production

// ── Helper ────────────────────────────────────────────────────
async function apiFetch(endpoint: string, options: any = {}): Promise<any> {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...(options.headers || {}),
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `Request failed: ${res.status}`);
    }

    return data;
  } catch (err: any) {
    console.error(`[API] ${endpoint}`, err.message);
    throw err;
  }
}

// ── Health check ──────────────────────────────────────────────
export async function checkHealth(): Promise<any> {
  return apiFetch("/api/health");
}

// ── Upload CSV → triggers full 6-agent pipeline ───────────────
export async function uploadCSV(file: File, generateReport = true, reportType = "weekly"): Promise<any> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("generateReport", String(generateReport));
  formData.append("reportType", reportType);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(`${API_BASE}/api/upload`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: "Upload failed" }));
      throw new Error(err.error || "Upload failed");
    }

    return response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

// ── Re-run AI agents on existing campaign data ────────────────
export async function reanalyze(campaigns: any[]): Promise<any> {
  return apiFetch("/api/upload/analyze", {
    method: "POST",
    body: JSON.stringify({ campaigns }),
  });
}

// ── Compute KPIs only (no LLM, instant) ──────────────────────
export async function computeAnalytics(campaigns: any[]): Promise<any> {
  return apiFetch("/api/analytics/compute", {
    method: "POST",
    body: JSON.stringify({ campaigns }),
  });
}

// ── Re-generate AI insights from analytics ────────────────────
export async function generateInsights(analytics: any): Promise<any> {
  return apiFetch("/api/insights/generate", {
    method: "POST",
    body: JSON.stringify({ analytics }),
  });
}

// ── Chat with the AI agent ────────────────────────────────────
export async function sendChatMessage(message: string, conversationHistory: any[] = [], campaignContext: any = null): Promise<any> {
  return apiFetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ message, conversationHistory, campaignContext }),
  });
}

// ── Generate PDF report ───────────────────────────────────────
export async function generateReport(analytics: any, insights: any[], optimization: any, reportType = "weekly"): Promise<any> {
  return apiFetch("/api/reports/generate", {
    method: "POST",
    body: JSON.stringify({ analytics, insights, optimization, reportType }),
  });
}

// ── List all generated reports ────────────────────────────────
export async function listReports(): Promise<any> {
  return apiFetch("/api/reports/list");
}

// ── Get PDF download URL (full URL for anchor tag) ───────────
export function getReportDownloadUrl(filename: string): string {
  return `${API_BASE}/api/reports/download/${filename}`;
}
