/**
 * Admind AI — App Context
 */

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { uploadCSV, sendChatMessage, generateReport, generateInsights } from "@/services/api";

export interface AppContextType {
  campaigns: any[] | null;
  analytics: any | null;
  insights: any[];
  optimization: any | null;
  creative: any | null;
  reports: any[];
  chatHistory: { role: string; content: string }[];
  uploadMeta: any | null;
  isLoading: boolean;
  hasRealData: boolean;
  error: string | null;
  handleUpload: (file: File, options?: any) => Promise<any>;
  handleRefreshInsights: () => Promise<void>;
  handleChat: (message: string) => Promise<string>;
  handleGenerateReport: (reportType?: string) => Promise<any>;
  clearChat: () => void;
  resetAll: () => void;
  setError: (err: string | null) => void;
  loadDemoData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const DEMO_DATA = {
  analytics: {
    portfolio: {
      totalSpend: 428500,
      totalRevenue: 1589785,
      totalImpressions: 24250000,
      totalClicks: 428500,
      totalConversions: 1720,
      avgROAS: 3.71,
      avgCTR: 4.19,
      avgCAC: 249,
      avgCVR: 0.40,
    },
    campaigns: [
      { campaign_name: "Summer Skincare Launch", platform: "Meta", spend: 85000, impressions: 2650000, clicks: 84800, conversions: 342, revenue: 365100, roas: 4.3, ctr: 3.2, cac: 248, cpc: 1.0, cpm: 32, conversion_rate: 0.40, status: "scaling", audience: "Lookalike 2%", creative_format: "Video" },
      { campaign_name: "Monsoon Haircare", platform: "Meta", spend: 62000, impressions: 2952380, clicks: 62000, conversions: 198, revenue: 173600, roas: 2.8, ctr: 2.1, cac: 313, cpc: 1.0, cpm: 21, conversion_rate: 0.32, status: "stable", audience: "Interest Based", creative_format: "Image" },
      { campaign_name: "Google Brand Search", platform: "Google", spend: 45000, impressions: 535714, clicks: 45000, conversions: 289, revenue: 274550, roas: 6.1, ctr: 8.4, cac: 156, cpc: 1.0, cpm: 84, conversion_rate: 0.64, status: "scaling", audience: "Keyword", creative_format: "Text" },
      { campaign_name: "YouTube Awareness", platform: "Google", spend: 38000, impressions: 4750000, clicks: 38000, conversions: 67, revenue: 53200, roas: 1.4, ctr: 0.8, cac: 567, cpc: 1.0, cpm: 8, conversion_rate: 0.18, status: "review", audience: "Interest", creative_format: "Video" },
      { campaign_name: "Amazon Sponsored", platform: "Amazon", spend: 29000, impressions: 557692, clicks: 29000, conversions: 156, revenue: 113100, roas: 3.9, ctr: 5.2, cac: 186, cpc: 1.0, cpm: 52, conversion_rate: 0.54, status: "stable", audience: "Keyword", creative_format: "Image" },
      { campaign_name: "Retargeting Cart", platform: "Meta", spend: 18500, impressions: 385416, clicks: 18500, conversions: 201, revenue: 133200, roas: 7.2, ctr: 4.8, cac: 92, cpc: 1.0, cpm: 48, conversion_rate: 1.09, status: "scaling", audience: "Custom - Cart", creative_format: "Image" },
      { campaign_name: "Broad Awareness", platform: "Meta", spend: 55000, impressions: 5000000, clicks: 55000, conversions: 43, revenue: 49500, roas: 0.9, ctr: 1.1, cac: 1279, cpc: 1.0, cpm: 11, conversion_rate: 0.08, status: "pause", audience: "Broad", creative_format: "Video" },
      { campaign_name: "Lookalike 2%", platform: "Meta", spend: 41000, impressions: 1413793, clicks: 41000, conversions: 178, revenue: 143500, roas: 3.5, ctr: 2.9, cac: 230, cpc: 1.0, cpm: 29, conversion_rate: 0.43, status: "stable", audience: "Lookalike 2%", creative_format: "Carousel" },
      { campaign_name: "Competitor Keywords", platform: "Google", spend: 33000, impressions: 523809, clicks: 33000, conversions: 112, revenue: 72600, roas: 2.2, ctr: 6.3, cac: 295, cpc: 1.0, cpm: 63, conversion_rate: 0.34, status: "stable", audience: "Keyword", creative_format: "Text" },
      { campaign_name: "Zepto Listing Ads", platform: "Amazon", spend: 22000, impressions: 309859, clicks: 22000, conversions: 134, revenue: 105600, roas: 4.8, ctr: 7.1, cac: 164, cpc: 1.0, cpm: 71, conversion_rate: 0.61, status: "scaling", audience: "Keyword", creative_format: "Image" },
    ],
    patterns: {
      topPerformers: [] as any[],
      underperformers: [] as any[],
      reviewCampaigns: [] as any[],
      platformBreakdown: [
        { platform: "Meta", spend: 261500, revenue: 864900, roas: 3.31, count: 6 },
        { platform: "Google", spend: 116000, revenue: 400350, roas: 3.45, count: 3 },
        { platform: "Amazon", spend: 51000, revenue: 218700, roas: 4.29, count: 2 },
      ],
      creativeBreakdown: [
        { format: "Video", spend: 178000, revenue: 468000, roas: 2.63, ctr: 2.1 },
        { format: "Image", spend: 134500, revenue: 525400, roas: 3.91, ctr: 5.2 },
        { format: "Carousel", spend: 41000, revenue: 143500, roas: 3.5, ctr: 2.9 },
        { format: "Text", spend: 78000, revenue: 347150, roas: 4.45, ctr: 7.1 },
      ],
      highCACCampaigns: [] as any[],
      bestCampaign: null as any,
      worstCampaign: null as any,
    },
  },
  insights: [
    { id: "d1", category: "performance", title: "Retargeting Cart has 7.2x ROAS", detail: "Cart abandonment retargeting is your highest performing campaign with 7.2x ROAS and 201 conversions. This campaign is severely underfunded at Rs.18,500 spend. Increasing budget here will have immediate revenue impact.", impact: "High", recommendation: "Increase Retargeting Cart budget by 50% to Rs.27,750 this week" },
    { id: "d2", category: "budget", title: "Broad Awareness burning budget at 0.9x ROAS", detail: "Broad Awareness is spending Rs.55,000 and generating only Rs.49,500 revenue — a net loss of Rs.5,500. This campaign is below break-even and should be paused immediately.", impact: "High", recommendation: "Pause Broad Awareness immediately and reallocate Rs.55,000 to top performers" },
    { id: "d3", category: "audience", title: "Lookalike 1% audiences outperforming broad by 4x", detail: "Campaigns using Lookalike 1-2% audiences show average ROAS of 4.3x compared to 0.9x for broad targeting. The data clearly shows precision audiences deliver superior results for this brand.", impact: "High", recommendation: "Shift 70% of Meta budget to Lookalike 1-2% audiences" },
    { id: "d4", category: "creative", title: "Text ads showing highest ROAS at 4.45x", detail: "Google text ads are outperforming all other creative formats with 4.45x ROAS and 7.1% CTR. Video ads on Meta show the lowest ROAS at 2.63x despite consuming the most budget.", impact: "Medium", recommendation: "Increase Google text ad budget and test shorter video formats on Meta" },
    { id: "d5", category: "performance", title: "Google Brand Search delivering 6.1x ROAS", detail: "Brand search campaigns on Google show 6.1x ROAS with 8.4% CTR — significantly above portfolio average of 3.71x. This indicates strong brand demand that is currently undercapitalised.", impact: "High", recommendation: "Double Google Brand Search budget to capture more branded demand" },
    { id: "d6", category: "audience", title: "Amazon campaigns showing 4.29x avg ROAS", detail: "Amazon as a platform is delivering the best average ROAS at 4.29x across 2 campaigns. Zepto Listing Ads at 4.8x ROAS shows strong quick commerce performance.", impact: "Medium", recommendation: "Expand to Blinkit and Swiggy Instamart listing ads" },
    { id: "d7", category: "budget", title: "YouTube Awareness needs immediate review", detail: "YouTube Awareness has spent Rs.38,000 with only 67 conversions and 1.4x ROAS. At Rs.567 CAC this is 2.3x above portfolio average. The awareness objective is not translating to conversions.", impact: "Medium", recommendation: "Reduce YouTube budget by 50% and shift to conversion objective" },
    { id: "d8", category: "creative", title: "Carousel format showing strong engagement", detail: "Lookalike 2% campaign using Carousel format shows 3.5x ROAS with good engagement metrics. Carousel ads allow multiple product showcasing which suits skincare product ranges.", impact: "Low", recommendation: "Test carousel format on 2 more Meta campaigns this month" },
  ],
  optimization: {
    budgetReallocations: [
      { campaign: "Retargeting Cart", currentSpend: 18500, recommendedSpend: 35000, changePercent: 89, rationale: "Highest ROAS at 7.2x — significantly underfunded" },
      { campaign: "Google Brand Search", currentSpend: 45000, recommendedSpend: 65000, changePercent: 44, rationale: "6.1x ROAS with untapped branded search demand" },
      { campaign: "Broad Awareness", currentSpend: 55000, recommendedSpend: 0, changePercent: -100, rationale: "Below break-even at 0.9x ROAS — immediate pause" },
      { campaign: "YouTube Awareness", currentSpend: 38000, recommendedSpend: 19000, changePercent: -50, rationale: "1.4x ROAS at 567 CAC — reduce and optimise" },
      { campaign: "Zepto Listing Ads", currentSpend: 22000, recommendedSpend: 35000, changePercent: 59, rationale: "4.8x ROAS on quick commerce — scale aggressively" },
    ],
    audienceRecommendations: [
      { type: "expand", audience: "Lookalike 1% from purchasers", rationale: "Most valuable seed audience — create and scale immediately" },
      { type: "pause", audience: "Broad targeting on Meta", rationale: "Consistently underperforming at 0.9x ROAS vs 4.3x for Lookalike" },
      { type: "test", audience: "25-34 age segment on Google", rationale: "This demographic shows 48% of conversions but only 32% of budget" },
      { type: "expand", audience: "Customer list retargeting", rationale: "Cart retargeting ROAS of 7.2x suggests high purchase intent audience" },
    ],
    bidStrategies: [
      { campaign: "Retargeting Cart", recommendation: "Switch to Target ROAS bidding at 6x target", expectedImpact: "Estimated 20-30% efficiency improvement" },
      { campaign: "Google Brand Search", recommendation: "Use Target Impression Share at 90% for branded terms", expectedImpact: "Capture more branded demand, protect market share" },
      { campaign: "Summer Skincare Launch", recommendation: "Increase bid multiplier for 25-34 female segment by 30%", expectedImpact: "Estimated CTR improvement of 15-20%" },
    ],
    quickWins: [
      "Pause Broad Awareness Campaign today — saving Rs.55,000 in wasted spend",
      "Increase Retargeting Cart budget from Rs.18,500 to Rs.35,000 immediately",
      "Add 25-34 age bid multiplier of +30% on all Meta campaigns",
    ],
    weeklyPriorities: [
      "Reallocate Rs.55,000 from Broad Awareness to Retargeting and Brand Search",
      "Create Lookalike 1% audience from last 180-day purchasers",
      "Launch Blinkit Sponsored Listing campaign to expand quick commerce presence",
    ],
  },
  creative: {
    creativeAnalysis: {
      bestFormat: "Text Ads",
      formatInsight: "Google text ads deliver the highest ROAS at 4.45x with 7.1% CTR, significantly outperforming video at 2.63x. Short-form video under 15 seconds shows better performance than long-form awareness videos.",
      messagingPatterns: [
        "Results-focused messaging (visible results in X days) drives higher CTR",
        "Social proof headlines (trusted by X customers) improve conversion rate",
        "Urgency + scarcity messaging works best for retargeting audiences",
      ],
    },
    adCopySuggestions: [
      { id: "copy-1", hook: "Visible results in just 7 days.", body: "Our dermatologist-approved formula targets the root cause of skin concerns. Over 50,000 customers have seen visible transformation. Clinically tested, loved by real people.", cta: "Shop Now — Free Shipping", format: "image", angle: "rational" },
      { id: "copy-2", hook: "Tired of products that promise but never deliver?", body: "We were too. That's why we built a skincare line backed by science, not marketing hype. Real ingredients. Real results. No compromises.", cta: "Try Risk-Free Today", format: "video", angle: "emotional" },
      { id: "copy-3", hook: "Dermatologists recommend it. Customers love it.", body: "Join over 50,000 happy customers who've transformed their skin with our bestselling range. Rated 4.8 stars across 12,000+ verified reviews.", cta: "Get Yours Now", format: "carousel", angle: "social_proof" },
      { id: "copy-4", hook: "Only 48 hours left — 30% off sitewide.", body: "Our biggest sale of the season ends soon. Stock up on your favourite products before they sell out. Free gift with every order above Rs.999.", cta: "Claim Your Discount", format: "image", angle: "urgency" },
      { id: "copy-5", hook: "Your skin deserves better than this.", body: "Most skincare products are 90% water and 10% marketing. Ours are different — concentrated actives, honest formulas, real transformation. See the difference in 14 days.", cta: "Start Your Journey", format: "video", angle: "emotional" },
    ],
    testingRecommendations: [
      { test: "Hook messaging — Results vs Emotional", hypothesis: "Results-focused hooks will drive 20% higher CTR for cold audiences", priority: "high" },
      { test: "Video length — 15 seconds vs 30 seconds", hypothesis: "15-second videos will show better completion rate and lower CPM", priority: "high" },
      { test: "CTA button text — Shop Now vs Try Free vs Get Yours", hypothesis: "Try Free will drive higher CTR but Shop Now will drive higher purchase rate", priority: "medium" },
    ],
  },
};

// Compute patterns from campaigns
DEMO_DATA.analytics.patterns.topPerformers = DEMO_DATA.analytics.campaigns.filter((c: any) => c.roas >= 3.5);
DEMO_DATA.analytics.patterns.underperformers = DEMO_DATA.analytics.campaigns.filter((c: any) => c.roas < 1.0);
DEMO_DATA.analytics.patterns.reviewCampaigns = DEMO_DATA.analytics.campaigns.filter((c: any) => c.roas >= 1.0 && c.roas < 2.0);
DEMO_DATA.analytics.patterns.highCACCampaigns = DEMO_DATA.analytics.campaigns.filter((c: any) => c.cac > 400);
DEMO_DATA.analytics.patterns.bestCampaign = DEMO_DATA.analytics.campaigns[2]; // Google Brand Search
DEMO_DATA.analytics.patterns.worstCampaign = DEMO_DATA.analytics.campaigns[6]; // Broad Awareness

export function AppProvider({ children }: { children: ReactNode }) {
  // ── Data state ──────────────────────────────────────────────
  const [campaigns,    setCampaigns]    = useState<any[] | null>(null);
  const [analytics,    setAnalytics]    = useState<any | null>(null);
  const [insights,     setInsights]     = useState<any[]>([]);
  const [optimization, setOptimization] = useState<any | null>(null);
  const [creative,     setCreative]     = useState<any | null>(null);
  const [reports,      setReports]      = useState<any[]>([]);

  // ── UI state ────────────────────────────────────────────────
  const [isLoading,    setIsLoading]    = useState(false);
  const [hasRealData,  setHasRealData]  = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [uploadMeta,   setUploadMeta]   = useState<any | null>(null);

  // ── Chat state ──────────────────────────────────────────────
  const [chatHistory,  setChatHistory]  = useState<{ role: string; content: string }[]>([]);

  // ── Effects ──────────────────────────────────────────────────

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nagent_hasRealData');
      if (saved === 'true') {
        const a = localStorage.getItem('nagent_analytics');
        const i = localStorage.getItem('nagent_insights');
        const o = localStorage.getItem('nagent_optimization');
        const cr = localStorage.getItem('nagent_creative');
        const ca = localStorage.getItem('nagent_campaigns');
        if (a) setAnalytics(JSON.parse(a));
        if (i) setInsights(JSON.parse(i));
        if (o) setOptimization(JSON.parse(o));
        if (cr) setCreative(JSON.parse(cr));
        if (ca) setCampaigns(JSON.parse(ca));
        setHasRealData(true);
      }
    } catch (e) {
      console.warn('Storage restore failed:', e);
    }
  }, []);

  useEffect(() => {
    if (hasRealData) {
      try {
        localStorage.setItem('nagent_analytics', JSON.stringify(analytics));
        localStorage.setItem('nagent_insights', JSON.stringify(insights));
        localStorage.setItem('nagent_optimization', JSON.stringify(optimization));
        localStorage.setItem('nagent_creative', JSON.stringify(creative));
        localStorage.setItem('nagent_campaigns', JSON.stringify(campaigns));
        localStorage.setItem('nagent_hasRealData', 'true');
      } catch (e) {
        console.warn('Storage save failed:', e);
      }
    }
  }, [analytics, insights, optimization, creative, campaigns, hasRealData]);

  // ── Actions ─────────────────────────────────────────────────

  const loadDemoData = useCallback(() => {
    setCampaigns(DEMO_DATA.analytics.campaigns);
    setAnalytics(DEMO_DATA.analytics);
    setInsights(DEMO_DATA.insights);
    setOptimization(DEMO_DATA.optimization);
    setCreative(DEMO_DATA.creative);
    setHasRealData(true);
    setUploadMeta({
      rowCount: 10,
      duration: "0.1s",
      processedAt: new Date().toISOString(),
      isDemo: true,
    });
  }, []);

  const handleUpload = useCallback(async (file: File, options: any = {}) => {
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
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [analytics]);

  const handleChat = useCallback(async (message: string) => {
    const userMsg = { role: "user", content: message };
    setChatHistory((prev) => [...prev, userMsg]);

    try {
      const result = await sendChatMessage(
        message,
        chatHistory.slice(-10), 
        analytics               
      );
      const assistantMsg = { role: "assistant", content: result.reply };
      setChatHistory((prev) => [...prev, assistantMsg]);
      return result.reply;
    } catch (err: any) {
      const errMsg = { role: "assistant", content: `Sorry, something went wrong: ${err.message}` };
      setChatHistory((prev) => [...prev, errMsg]);
      throw err;
    }
  }, [chatHistory, analytics]);

  const handleGenerateReport = useCallback(async (reportType: string = "weekly") => {
    if (!analytics) throw new Error("No analytics data to generate report from");
    setIsLoading(true);
    try {
      const result = await generateReport(analytics, insights, optimization, reportType);
      setReports((prev) => [result.data, ...prev]);
      return result.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [analytics, insights, optimization]);

  const clearChat = useCallback(() => setChatHistory([]), []);

  const resetAll = useCallback(() => {
    localStorage.removeItem('nagent_analytics');
    localStorage.removeItem('nagent_insights');
    localStorage.removeItem('nagent_optimization');
    localStorage.removeItem('nagent_creative');
    localStorage.removeItem('nagent_campaigns');
    localStorage.removeItem('nagent_hasRealData');
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

  const value: AppContextType = {
    campaigns,
    analytics,
    insights,
    optimization,
    creative,
    reports,
    chatHistory,
    uploadMeta,
    isLoading,
    hasRealData,
    error,
    handleUpload,
    handleRefreshInsights,
    handleChat,
    handleGenerateReport,
    clearChat,
    resetAll,
    setError,
    loadDemoData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
