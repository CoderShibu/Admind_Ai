export const kpiData = {
  totalAdSpend: 482300,
  avgROAS: 3.8,
  avgCTR: 2.4,
  totalConversions: 12847,
};

export const spendRevenueData = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const spend = 12000 + Math.sin(i * 0.3) * 4000 + Math.random() * 2000;
  const revenue = spend * (2.8 + Math.random() * 2);
  return {
    day: `Day ${day}`,
    spend: Math.round(spend),
    revenue: Math.round(revenue),
  };
});

export const roasByCampaign = [
  { name: "Summer Skincare", roas: 4.3, tier: "high" },
  { name: "Monsoon Hair Care", roas: 3.8, tier: "high" },
  { name: "Protein Bars Launch", roas: 3.2, tier: "medium" },
  { name: "Festival Cosmetics", roas: 2.7, tier: "medium" },
  { name: "Winter Wellness", roas: 1.9, tier: "low" },
  { name: "Organic Juices", roas: 1.2, tier: "low" },
];

export type CampaignStatus = "Scaling" | "Stable" | "Review" | "Pause";
export type Platform = "Meta" | "Google" | "Amazon";

export interface Campaign {
  id: string;
  name: string;
  platform: Platform;
  adSpend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  convRate: number;
  revenue: number;
  roas: number;
  status: CampaignStatus;
  adSets?: { name: string; spend: number; roas: number; ctr: number }[];
}

export const campaigns: Campaign[] = [
  { id: "1", name: "Summer Skincare Collection", platform: "Meta", adSpend: 85200, impressions: 1250000, clicks: 37500, ctr: 3.0, conversions: 2850, convRate: 7.6, revenue: 366360, roas: 4.3, status: "Scaling", adSets: [{ name: "Lookalike 1%", spend: 42600, roas: 4.8, ctr: 3.4 }, { name: "Interest Based", spend: 42600, roas: 3.8, ctr: 2.6 }] },
  { id: "2", name: "Monsoon Hair Care Bundle", platform: "Google", adSpend: 62400, impressions: 980000, clicks: 27440, ctr: 2.8, conversions: 1920, convRate: 7.0, revenue: 237120, roas: 3.8, status: "Scaling", adSets: [{ name: "Search - Brand", spend: 31200, roas: 5.1, ctr: 4.2 }, { name: "Search - Generic", spend: 31200, roas: 2.5, ctr: 1.4 }] },
  { id: "3", name: "Protein Bars Launch", platform: "Meta", adSpend: 54800, impressions: 820000, clicks: 21320, ctr: 2.6, conversions: 1580, convRate: 7.4, revenue: 175360, roas: 3.2, status: "Stable" },
  { id: "4", name: "Festival Cosmetics Sale", platform: "Amazon", adSpend: 48200, impressions: 720000, clicks: 18720, ctr: 2.6, conversions: 1340, convRate: 7.2, revenue: 130140, roas: 2.7, status: "Stable" },
  { id: "5", name: "Winter Wellness Kit", platform: "Google", adSpend: 38600, impressions: 580000, clicks: 13920, ctr: 2.4, conversions: 890, convRate: 6.4, revenue: 73340, roas: 1.9, status: "Review" },
  { id: "6", name: "Organic Cold-Pressed Juices", platform: "Meta", adSpend: 32400, impressions: 480000, clicks: 10560, ctr: 2.2, conversions: 620, convRate: 5.9, revenue: 38880, roas: 1.2, status: "Pause" },
  { id: "7", name: "Premium Face Serums", platform: "Meta", adSpend: 72100, impressions: 1100000, clicks: 33000, ctr: 3.0, conversions: 2640, convRate: 8.0, revenue: 302820, roas: 4.2, status: "Scaling" },
  { id: "8", name: "Herbal Tea Range", platform: "Amazon", adSpend: 28900, impressions: 420000, clicks: 9660, ctr: 2.3, conversions: 580, convRate: 6.0, revenue: 57800, roas: 2.0, status: "Review" },
  { id: "9", name: "Fitness Supplements", platform: "Google", adSpend: 44500, impressions: 650000, clicks: 16250, ctr: 2.5, conversions: 1140, convRate: 7.0, revenue: 142350, roas: 3.2, status: "Stable" },
  { id: "10", name: "Baby Care Essentials", platform: "Meta", adSpend: 56700, impressions: 890000, clicks: 24920, ctr: 2.8, conversions: 1870, convRate: 7.5, revenue: 238140, roas: 4.2, status: "Scaling" },
  { id: "11", name: "Ayurvedic Hair Oil", platform: "Amazon", adSpend: 22300, impressions: 340000, clicks: 7480, ctr: 2.2, conversions: 420, convRate: 5.6, revenue: 33360, roas: 1.5, status: "Review" },
  { id: "12", name: "Vitamin D3 Drops", platform: "Google", adSpend: 18900, impressions: 280000, clicks: 6440, ctr: 2.3, conversions: 380, convRate: 5.9, revenue: 47880, roas: 2.5, status: "Stable" },
  { id: "13", name: "Collagen Peptides", platform: "Meta", adSpend: 41200, impressions: 610000, clicks: 15860, ctr: 2.6, conversions: 1100, convRate: 6.9, revenue: 148720, roas: 3.6, status: "Scaling" },
  { id: "14", name: "Sunscreen SPF50", platform: "Google", adSpend: 35800, impressions: 520000, clicks: 13520, ctr: 2.6, conversions: 980, convRate: 7.2, revenue: 100240, roas: 2.8, status: "Stable" },
  { id: "15", name: "Detox Green Smoothie", platform: "Amazon", adSpend: 15400, impressions: 210000, clicks: 4620, ctr: 2.2, conversions: 280, convRate: 6.1, revenue: 18480, roas: 1.2, status: "Pause" },
];

export interface Insight {
  id: string;
  category: "Performance" | "Budget" | "Creative" | "Audience";
  title: string;
  detail: string;
  impact: "High" | "Medium" | "Low";
}

export const insights: Insight[] = [
  { id: "1", category: "Performance", title: "Summer Skincare ROAS at 4.3x", detail: "This campaign is significantly outperforming benchmarks. Recommend increasing budget by 25% to maximize returns during peak season.", impact: "High" },
  { id: "2", category: "Budget", title: "Broad targeting showing 3x higher CAC", detail: "Broad audience segments on Meta are acquiring customers at ₹890 vs ₹280 for lookalike audiences. Consider pausing broad targeting.", impact: "High" },
  { id: "3", category: "Creative", title: "Video ads outperforming static by 67%", detail: "Video creatives on Meta are generating 67% higher CTR and 45% more conversions than static image ads across all campaigns.", impact: "High" },
  { id: "4", category: "Audience", title: "Lookalike segments converting best", detail: "1% lookalike audiences are showing 2.3x better conversion rates compared to interest-based targeting. Expand lookalike seed audiences.", impact: "Medium" },
  { id: "5", category: "Performance", title: "Sunday 8–11 PM is peak conversion window", detail: "Analysis shows 34% of all conversions happen between 8-11 PM on Sundays. Consider increasing bid multipliers during this window.", impact: "Medium" },
  { id: "6", category: "Budget", title: "Google Search brand terms underinvested", detail: "Brand search campaigns have a 5.1x ROAS but only 18% of total Google budget. Recommend reallocating 15% from generic to brand.", impact: "Medium" },
  { id: "7", category: "Creative", title: "UGC content driving 2x engagement", detail: "User-generated content style ads are showing 2x higher engagement rates and 30% lower CPA compared to polished studio content.", impact: "Low" },
  { id: "8", category: "Audience", title: "25-34 age group dominates conversions", detail: "The 25-34 demographic accounts for 48% of all conversions while only receiving 32% of impressions. Increase allocation to this segment.", impact: "High" },
  { id: "9", category: "Budget", title: "Amazon campaigns need restructuring", detail: "Two Amazon campaigns have sub-1.5x ROAS. Consider pausing Detox Green Smoothie and reducing Ayurvedic Hair Oil spend by 40%.", impact: "Medium" },
  { id: "10", category: "Creative", title: "Carousel ads underperforming on Google", detail: "Carousel format on Google Discovery shows 45% lower CTR than single-image. Switch to responsive display ads for better performance.", impact: "Low" },
];

export const adCopySuggestions = [
  { id: "1", hook: "Your skin deserves better ✨", copy: "Discover our dermatologist-approved skincare collection. Clinically proven ingredients, visible results in 14 days. Shop now and get 20% off your first order." },
  { id: "2", hook: "Tired of hair fall? We have the answer 💪", copy: "Our Ayurvedic hair care range combines ancient wisdom with modern science. 89% of users saw reduced hair fall in 30 days. Try risk-free today." },
  { id: "3", hook: "Fuel your fitness goals 🏋️", copy: "Clean protein, zero compromise. Our plant-based protein bars pack 22g protein with no artificial sweeteners. Perfect for your post-workout recovery." },
];

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string;
}

export const chatMessages: ChatMessage[] = [
  { id: "1", role: "user", content: "Which campaigns should I scale this week?", timestamp: "9:30 AM" },
  { id: "2", role: "ai", content: "Based on the last 7 days of performance data, I recommend scaling these campaigns:\n\n**1. Summer Skincare Collection** (Meta)\n- ROAS: 4.3x → Recommend +25% budget\n- Strong conversion rate at 7.6%\n\n**2. Premium Face Serums** (Meta)\n- ROAS: 4.2x → Recommend +20% budget\n- High CTR of 3.0%\n\n**3. Baby Care Essentials** (Meta)\n- ROAS: 4.2x → Recommend +15% budget\n\n⚠️ Monitor Protein Bars Launch closely — it's at 3.2x ROAS but showing signs of audience fatigue.", timestamp: "9:31 AM" },
  { id: "3", role: "user", content: "What about the Google campaigns?", timestamp: "9:33 AM" },
  { id: "4", role: "ai", content: "For Google campaigns:\n\n✅ **Monsoon Hair Care** is performing well at 3.8x ROAS. The brand search component is excellent at 5.1x — I'd increase brand search budget by 30%.\n\n⚠️ **Winter Wellness Kit** at 1.9x ROAS needs attention. Consider:\n- Refining keyword targeting\n- Testing new ad copy variations\n- Reducing bids on underperforming keywords\n\n📊 Overall, your Google spend efficiency could improve by 18% with the suggested optimizations.", timestamp: "9:34 AM" },
];

export const suggestedQuestions = [
  "Which campaigns should I scale this week?",
  "What is my best performing audience?",
  "Where should I reduce budget?",
  "Generate a performance summary",
  "Which creatives are underperforming?",
  "What is my average CAC this month?",
];

export const reports = [
  { id: "1", name: "Weekly Performance Summary", date: "Mar 14, 2026", type: "Weekly" as const, status: "Ready" as const },
  { id: "2", name: "Monthly Campaign Overview — Feb 2026", date: "Mar 1, 2026", type: "Monthly" as const, status: "Ready" as const },
  { id: "3", name: "Creative Analysis Report", date: "Mar 10, 2026", type: "Weekly" as const, status: "Ready" as const },
  { id: "4", name: "Q1 2026 Performance Deep Dive", date: "Generating...", type: "Monthly" as const, status: "Generating" as const },
];

export const uploadHistory = [
  { id: "1", fileName: "meta_campaigns_mar2026.csv", uploadDate: "Mar 12, 2026", rows: 1847, status: "Processed" as const },
  { id: "2", fileName: "google_ads_feb2026.xlsx", uploadDate: "Mar 1, 2026", rows: 3254, status: "Processed" as const },
  { id: "3", fileName: "amazon_sp_data.csv", uploadDate: "Feb 28, 2026", rows: 892, status: "Processed" as const },
];
