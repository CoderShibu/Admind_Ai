import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Calendar, Sparkles, IndianRupee, TrendingUp, MousePointerClick, ShoppingCart, Info, ChevronDown, ChevronUp } from "lucide-react";
import { SkeletonCard } from "@/components/ui/SkeletonLoader";
import { Button } from "@/components/ui/button";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import AnimatedCounter from "@/components/AnimatedCounter";
import { kpiData, spendRevenueData, roasByCampaign, campaigns, insights } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";

const statusColors: Record<string, string> = {
  Scaling: "bg-success/20 text-success border-success/30",
  Stable: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Review: "bg-warning/20 text-warning border-warning/30",
  Pause: "bg-destructive/20 text-destructive border-destructive/30",
};

const categoryColors: Record<string, string> = {
  Performance: "bg-primary/20 text-primary",
  Budget: "bg-warning/20 text-warning",
  Creative: "bg-purple-500/20 text-purple-400",
  Audience: "bg-success/20 text-success",
};

const tierColors: Record<string, string> = { high: "#00E87A", medium: "#00D4FF", low: "#FFB347" };

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const color = 
    d.roas >= 4.0 ? '#00E87A' :
    d.roas >= 2.5 ? '#00D4FF' :
    d.roas >= 1.5 ? '#FFB347' : '#FF6B6B';
  return (
    <div style={{
      background: '#0F172A',
      border: `1px solid ${color}`,
      borderRadius: '10px',
      padding: '12px 16px',
      boxShadow: `0 0 20px ${color}33`,
    }}>
      <p style={{ color: '#fff', fontWeight: 700, fontSize: '13px', marginBottom: '6px' }}>
        {d.name}
      </p>
      <p style={{ color: color, fontSize: '20px', fontWeight: 800 }}>
        {d.roas}x ROAS
      </p>
      <p style={{ color: '#6B7280', fontSize: '11px', marginTop: '4px' }}>
        {d.roas >= 4.0 ? '🚀 Scale immediately' :
         d.roas >= 2.5 ? '✅ Performing well' :
         d.roas >= 1.5 ? '⚠️ Monitor closely' : 
         '🔴 Consider pausing'}
      </p>
    </div>
  );
};

export default function DashboardPage() {
  const [dateFilter, setDateFilter] = useState<'7' | '30' | '90'>('30');
  const navigate = useNavigate();
  const { analytics, insights: realInsights, hasRealData, isLoading, loadDemoData } = useApp();

  const getFilteredCampaigns = (campaignsList: any[], days: string) => {
    if (!campaignsList?.length) return campaigns;
    if (days === '7') {
      return campaignsList.slice(0, 4).map((c: any) => ({
        ...c,
        spend: Math.round((c.spend || c.adSpend) * 0.23),
        revenue: Math.round((c.revenue || ((c.spend || c.adSpend) * c.roas)) * 0.23),
        conversions: Math.round(c.conversions * 0.23),
        clicks: Math.round(c.clicks * 0.23),
        impressions: Math.round(c.impressions * 0.23),
      }));
    }
    if (days === '90') {
      return campaignsList.map((c: any) => ({
        ...c,
        spend: Math.round((c.spend || c.adSpend) * 3),
        revenue: Math.round((c.revenue || ((c.spend || c.adSpend) * c.roas)) * 3),
        conversions: Math.round(c.conversions * 3),
        clicks: Math.round(c.clicks * 3),
        impressions: Math.round(c.impressions * 3),
      }));
    }
    return campaignsList.map((c: any) => ({
      ...c,
      revenue: c.revenue || ((c.spend || c.adSpend) * c.roas)
    }));
  };

  const baseCampaigns = hasRealData && analytics ? analytics.campaigns : campaigns;
  const filteredCampaignsData = getFilteredCampaigns(baseCampaigns, dateFilter);

  const totalSpend = filteredCampaignsData.reduce((s: number, c: any) => s + (c.spend || c.adSpend || 0), 0);
  const totalRevenue = filteredCampaignsData.reduce((s: number, c: any) => s + (c.revenue || 0), 0);
  const avgROAS = totalSpend > 0 ? (totalRevenue / totalSpend) : 0;
  const totalConversions = filteredCampaignsData.reduce((s: number, c: any) => s + (c.conversions || 0), 0);
  
  // calculate average CTR from total clicks and impressions if available, else standard average
  const avgCTR = filteredCampaignsData.length 
    ? filteredCampaignsData.reduce((s: number, c: any) => s + (c.ctr || 0), 0) / filteredCampaignsData.length 
    : 0;

  const displayKpiData = {
    totalAdSpend: totalSpend,
    avgROAS: avgROAS,
    avgCTR: avgCTR,
    totalConversions: totalConversions,
  };

  const formatINR = (n: number | string) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

  const [sortField, setSortField] = useState("roas");
  const [sortDir, setSortDir] = useState("desc");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const displayCampaigns = filteredCampaignsData.map((c: any, idx: number) => ({
    id: idx,
    name: c.campaign_name || c.name,
    adSpend: c.spend || c.adSpend,
    roas: c.roas,
    ctr: c.ctr,
    conversions: c.conversions,
    status: c.status ? c.status.charAt(0).toUpperCase() + c.status.slice(1).toLowerCase() : "Stable",
    ad_set_name: c.ad_set_name || "N/A",
    cpm: c.cpm || 0,
    cpc: c.cpc || 0,
    conversion_rate: c.conversion_rate || 0,
  }));

  const sortedCampaigns = [...displayCampaigns].sort((a, b) => {
    let valA = a[sortField] ?? "";
    let valB = b[sortField] ?? "";
    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();
    if (valA < valB) return sortDir === "asc" ? -1 : 1;
    if (valA > valB) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const topCampaigns = sortedCampaigns.slice(0, 6);
  const topInsights = (hasRealData && realInsights?.length ? realInsights : insights).slice(0, 3);

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const generateTrendData = (days: string, baseSpend: number) => {
    const points = days === '7' ? 7 : days === '30' ? 30 : 12;
    const data = [];
    const dailySpend = baseSpend / points || 2000;
    
    // Smooth random walk for realistic charts
    for (let i = 0; i < points; i++) {
      const modifier = 0.7 + (Math.random() * 0.6); // random 0.7 to 1.3
      const daySpend = Math.round(dailySpend * modifier);
      const dayRev = Math.round(daySpend * (avgROAS > 0 ? avgROAS * modifier : 2.5));
      data.push({
        day: days === '90' ? `W${i+1}` : `D${i+1}`,
        spend: daySpend,
        revenue: dayRev,
      });
    }
    return data;
  };

  const displaySpendRevenue = React.useMemo(() => generateTrendData(dateFilter, totalSpend), [dateFilter, totalSpend]);

  const displayRoasByCampaign = displayCampaigns.slice(0, 5).map((c: any) => ({
    name: c.name.length > 15 ? c.name.substring(0, 15) + '...' : c.name,
    roas: c.roas,
  }));

  const containerAnim = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
  const itemAnim = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <h1 className="font-heading text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="flex gap-2">
              {[
                { label: "Last 7 days", val: '7' },
                { label: "Last 30 days", val: '30' },
                { label: "Last 90 days", val: '90' }
              ].map((r) => (
                <button
                  key={r.val}
                  onClick={() => setDateFilter(r.val as '7' | '30' | '90')}
                  className="rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200"
                  style={
                    dateFilter === r.val
                      ? { background: 'rgba(0, 212, 255, 0.15)', border: '1px solid #00D4FF', color: '#00D4FF' }
                      : { background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#6B7280' }
                  }
                >
                  {r.label}
                </button>
              ))}
            </div>
            <Button size="sm" className="bg-primary text-primary-foreground glow-cyan gap-2">
              <Sparkles className="h-4 w-4" /> Run AI Analysis
            </Button>
            <button className="relative rounded-lg border border-border/50 p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
            </button>
          </div>
        </div>

        {/* Demo Banner */}
        {!hasRealData && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(0,232,122,0.1))',
            border: '1px solid rgba(0,212,255,0.3)',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }} className="flex-col sm:flex-row gap-4 sm:gap-0">
            <div>
              <p style={{ color: '#fff', fontWeight: 600, margin: 0 }}>
                Welcome to Admind AI
              </p>
              <p style={{ color: '#9CA3AF', fontSize: '13px', margin: '4px 0 0' }}>
                Load demo data to explore all features instantly
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }} className="flex-col sm:flex-row w-full sm:w-auto">
              <button
                onClick={loadDemoData}
                style={{
                  background: '#00D4FF',
                  color: '#0A0F1E',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 20px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                Load Demo Data
              </button>
              <button
                onClick={() => navigate('/upload')}
                style={{
                  background: 'transparent',
                  color: '#00D4FF',
                  border: '1px solid #00D4FF',
                  borderRadius: '8px',
                  padding: '8px 20px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                Upload Your CSV
              </button>
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <motion.div variants={containerAnim} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            [
              { label: "Total Ad Spend", icon: IndianRupee, value: <AnimatedCounter value={displayKpiData.totalAdSpend} prefix="₹" formatIndian />, sub: "+12.3% vs last period", subColor: "text-success" },
              { label: "Avg ROAS", icon: TrendingUp, value: <AnimatedCounter value={displayKpiData.avgROAS} suffix="x" decimals={1} />, sub: "Above benchmark", subColor: "text-success" },
              { label: "Avg CTR", icon: MousePointerClick, value: <AnimatedCounter value={displayKpiData.avgCTR} suffix="%" decimals={1} />, sub: "Industry avg: 1.8%", subColor: "text-primary" },
              { label: "Total Conversions", icon: ShoppingCart, value: <AnimatedCounter value={displayKpiData.totalConversions} formatIndian />, sub: "+8.7% vs last period", subColor: "text-success" },
            ].map((kpi, i) => (
              <motion.div key={i} variants={itemAnim} className="glass-card-hover p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-muted-foreground">{kpi.label}</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <kpi.icon className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
                <p className={`text-xs mt-1 ${kpi.subColor}`}>{kpi.sub}</p>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Charts Row */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Spend vs Revenue */}
          <div className="glass-card p-5">
            <h3 className="font-heading text-sm font-semibold mb-4">Spend vs Revenue</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={displaySpendRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(215 20% 55%)" }} tickLine={false} axisLine={false} interval={4} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(215 20% 55%)" }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "hsl(228 60% 12%)", border: "1px solid hsl(228 20% 18%)", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "hsl(215 20% 55%)" }}
                  formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, ""]}
                />
                <Line type="monotone" dataKey="spend" stroke="#00D4FF" strokeWidth={2} dot={false} name="Spend" />
                <Line type="monotone" dataKey="revenue" stroke="#00E87A" strokeWidth={2} dot={false} name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* ROAS by Campaign */}
          <div className="glass-card p-5">
            <h3 className="font-heading text-sm font-semibold mb-4">ROAS by Campaign</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={displayRoasByCampaign} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" tick={{ fill: "#4B5563", fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: "#9CA3AF", fontSize: 11 }} tickLine={false} axisLine={false} width={130} />
                <Tooltip content={<CustomTooltip />} cursor={false} />
                <ReferenceLine x={1} stroke="#FF6B6B" strokeDasharray="4 4" strokeOpacity={0.5} label={{ value: 'Break-even', fill: '#FF6B6B', fontSize: 10 }} />
                <ReferenceLine x={3} stroke="#00E87A" strokeDasharray="4 4" strokeOpacity={0.4} />
                <Bar dataKey="roas" radius={[0, 6, 6, 0] as any} barSize={28} background={false} opacity={0.9} activeBar={{ opacity: 1.0 }}>
                  {displayRoasByCampaign.map((entry: any, index: number) => (
                    <Cell 
                      key={index}
                      fill={
                        entry.roas >= 4.0 ? '#00E87A' :
                        entry.roas >= 2.5 ? '#00D4FF' :
                        entry.roas >= 1.5 ? '#FFB347' : '#FF6B6B'
                      }
                      radius={[0, 6, 6, 0] as any}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Campaigns table */}
          <div className="lg:col-span-3 glass-card p-5 overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-sm font-semibold">Top Campaigns</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate("/campaigns")} className="text-primary text-xs">View All</Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-border/30 hover:bg-transparent">
                  <TableHead className="text-xs shrink-0 w-8"></TableHead>
                  <TableHead className="text-xs cursor-pointer hover:text-primary" onClick={() => handleSort("name")}>Campaign</TableHead>
                  <TableHead className="text-xs text-right cursor-pointer hover:text-primary" onClick={() => handleSort("adSpend")}>Spend</TableHead>
                  <TableHead className="text-xs text-right cursor-pointer hover:text-primary" onClick={() => handleSort("roas")}>ROAS</TableHead>
                  <TableHead className="text-xs text-right cursor-pointer hover:text-primary" onClick={() => handleSort("ctr")}>CTR</TableHead>
                  <TableHead className="text-xs text-right cursor-pointer hover:text-primary" onClick={() => handleSort("conversions")}>Conv.</TableHead>
                  <TableHead className="text-xs cursor-pointer hover:text-primary shrink-0" onClick={() => handleSort("status")}>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topCampaigns.map((c: any) => (
                  <React.Fragment key={c.id}>
                    <TableRow 
                      onClick={() => setExpandedRow(expandedRow === c.id ? null : c.id)} 
                      className="border-border/20 hover:bg-secondary/30 transition-colors cursor-pointer"
                    >
                      <TableCell className="w-8 shrink-0 text-muted-foreground">{expandedRow === c.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</TableCell>
                      <TableCell className="text-sm font-medium">{c.name}</TableCell>
                      <TableCell className="text-sm text-right font-mono">{formatINR(c.adSpend)}</TableCell>
                      <TableCell className={`text-sm text-right font-mono ${c.roas >= 3 ? "text-success" : c.roas >= 1 ? "text-warning" : "text-destructive"}`}>{c.roas}x</TableCell>
                      <TableCell className="text-sm text-right font-mono">{c.ctr}%</TableCell>
                      <TableCell className="text-sm text-right font-mono">{c.conversions.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${statusColors[c.status] || "bg-secondary text-foreground"}`}>{c.status}</span>
                      </TableCell>
                    </TableRow>
                    {expandedRow === c.id && (
                      <TableRow className="bg-secondary/10 hover:bg-secondary/10">
                        <TableCell colSpan={7} className="p-4 border-b border-border/20">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                            <div className="flex flex-col"><span className="text-muted-foreground mb-1">Ad Set:</span><span className="font-semibold">{c.ad_set_name || "N/A"}</span></div>
                            <div className="flex flex-col"><span className="text-muted-foreground mb-1">CPM:</span><span className="font-mono">{formatINR(c.cpm)}</span></div>
                            <div className="flex flex-col"><span className="text-muted-foreground mb-1">CPC:</span><span className="font-mono">{formatINR(c.cpc)}</span></div>
                            <div className="flex flex-col"><span className="text-muted-foreground mb-1">Conv. Rate:</span><span className="font-mono">{(c.conversion_rate || 0).toFixed(2)}%</span></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* AI Insights Preview */}
          <div className="lg:col-span-2 glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-sm font-semibold">AI Insights</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate("/insights")} className="text-primary text-xs">View All</Button>
            </div>
            <div className="space-y-3">
              {topInsights.map((insight) => (
                <div key={insight.id} className="rounded-lg border border-border/30 bg-secondary/20 p-3 hover:border-primary/20 transition-colors">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${categoryColors[insight.category]}`}>{insight.category}</span>
                    <span className={`flex items-center gap-1 text-[10px] ${insight.impact === "High" ? "text-destructive" : insight.impact === "Medium" ? "text-warning" : "text-muted-foreground"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${insight.impact === "High" ? "bg-destructive" : insight.impact === "Medium" ? "bg-warning" : "bg-muted-foreground"}`} />
                      {insight.impact}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-foreground">{insight.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{insight.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
