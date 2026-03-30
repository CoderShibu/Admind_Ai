/**
 * Admind AI — App Context
 * ─────────────────────────────────────────────────────────────
 * Drop this file into your Lovable project at:
 *   src/context/AppContext.jsx
 *
 * Then wrap your app in main.jsx:
 *   import { AppProvider } from "@/context/AppContext";
 *   <AppProvider><App /></AppProvider>
 *
 * Use in any component:
 *   import { useApp } from "@/context/AppContext";
 *   const { analytics, insights, isLoading } = useApp();
 */

import { createContext, useContext, useState, useCallback } from "react";
import { uploadCSV, sendChatMessage, generateReport, generateInsights } from "@/services/api";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // ── Data state ──────────────────────────────────────────────
  const [campaigns,    setCampaigns]    = useState(null);   // raw campaign array
  const [analytics,   setAnalytics]    = useState(null);   // portfolio + patterns
  const [insights,    setInsights]     = useState([]);     // AI insight cards
  const [optimization,setOptimization] = useState(null);   // budget + strategy plan
  const [creative,    setCreative]     = useState(null);   // ad copy suggestions
  const [reports,     setReports]      = useState([]);     // generated report list

  // ── UI state ────────────────────────────────────────────────
  const [isLoading,   setIsLoading]    = useState(false);
  const [hasRealData, setHasRealData]  = useState(false);  // false = showing mock data
  const [error,       setError]        = useState(null);
  const [uploadMeta,  setUploadMeta]   = useState(null);   // { rowCount, duration, processedAt }

  // ── Chat state ──────────────────────────────────────────────
  const [chatHistory, setChatHistory]  = useState([]);

  // ── Actions ─────────────────────────────────────────────────

  /**
   * Upload a CSV file and run the full agent pipeline.
   * Call this from the Upload page.
   */
  const handleUpload = useCallback(async (file, options = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await uploadCSV(file, options.generateReport, options.reportType);
      const { data } = result;

      setCampaigns(data.analytics.campaigns);
      setAnalytics(data.analytics);
      setInsights(data.insights || []);
      setOptimization(data.optimization || null);
      setCreative(data.creative || null);
      setHasRealData(true);
      setUploadMeta(data.meta);

      if (data.report) {
        setReports((prev) => [data.report, ...prev]);
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Re-generate AI insights from current analytics data.
   * Call this from the Insights page "Refresh" button.
   */
  const handleRefreshInsights = useCallback(async () => {
    if (!analytics) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateInsights(analytics);
      const { data } = result;
      setInsights(data.insights || []);
      setOptimization(data.optimization || null);
      setCreative(data.creative || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [analytics]);

  /**
   * Send a chat message to the AI agent.
   * Returns the assistant reply string.
   */
  const handleChat = useCallback(async (message) => {
    // Optimistically add user message
    const userMsg = { role: "user", content: message };
    setChatHistory((prev) => [...prev, userMsg]);

    try {
      const result = await sendChatMessage(
        message,
        chatHistory.slice(-10), // last 10 turns
        analytics               // pass live campaign context
      );
      const assistantMsg = { role: "assistant", content: result.reply };
      setChatHistory((prev) => [...prev, assistantMsg]);
      return result.reply;
    } catch (err) {
      const errMsg = { role: "assistant", content: `Sorry, something went wrong: ${err.message}` };
      setChatHistory((prev) => [...prev, errMsg]);
      throw err;
    }
  }, [chatHistory, analytics]);

  /**
   * Generate a PDF report and add it to the reports list.
   */
  const handleGenerateReport = useCallback(async (reportType = "weekly") => {
    if (!analytics) throw new Error("No analytics data to generate report from");
    setIsLoading(true);
    try {
      const result = await generateReport(analytics, insights, optimization, reportType);
      setReports((prev) => [result.data, ...prev]);
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [analytics, insights, optimization]);

  /**
   * Clear chat history.
   */
  const clearChat = useCallback(() => setChatHistory([]), []);

  /**
   * Clear all data (e.g. on logout or reset).
   */
  const resetAll = useCallback(() => {
    setCampaigns(null);
    setAnalytics(null);
    setInsights([]);
    setOptimization(null);
    setCreative(null);
    setReports([]);
    setChatHistory([]);
    setHasRealData(false);
    setUploadMeta(null);
    setError(null);
  }, []);

  const value = {
    // Data
    campaigns,
    analytics,
    insights,
    optimization,
    creative,
    reports,
    chatHistory,
    uploadMeta,

    // UI state
    isLoading,
    hasRealData,
    error,

    // Actions
    handleUpload,
    handleRefreshInsights,
    handleChat,
    handleGenerateReport,
    clearChat,
    resetAll,
    setError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
