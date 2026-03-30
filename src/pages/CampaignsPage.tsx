import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ChevronDown, ChevronUp, Pause, Download, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { SkeletonRow } from "@/components/ui/SkeletonLoader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { campaigns as mockCampaigns, type Campaign, type Platform } from "@/data/mockData";
import DashboardLayout from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";

const statusColors: Record<string, string> = {
  Scaling: "bg-success/20 text-success border-success/30",
  Stable: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Review: "bg-warning/20 text-warning border-warning/30",
  Pause: "bg-destructive/20 text-destructive border-destructive/30",
};

const platformColors: Record<Platform, string> = {
  Meta: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Google: "bg-red-500/20 text-red-400 border-red-500/30",
  Amazon: "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

export default function CampaignsPage() {
  const { analytics, hasRealData, handleRefreshInsights, isLoading } = useApp();
  
  const displayCampaigns = hasRealData && analytics
    ? analytics.campaigns.map((c: any, i: number) => ({
        id: `real-${i}`,
        name: c.campaign_name,
        platform: c.platform || "Meta",
        adSpend: c.spend || 0,
        impressions: c.impressions || 0,
        clicks: c.clicks || 0,
        ctr: c.ctr || 0,
        conversions: c.conversions || 0,
        convRate: c.conversion_rate || 0,
        revenue: c.revenue || 0,
        roas: c.roas || 0,
        status: (c.status || "stable").charAt(0).toUpperCase() + (c.status || "stable").slice(1).toLowerCase(),
        audience: c.audience || "Broad",
        creative_format: c.creative_format || "Image",
        cpm: c.cpm || 0,
        cpc: c.cpc || 0,
        conversion_rate: c.conversion_rate || 0,
      }))
    : mockCampaigns.map((c: any) => ({ ...c, convRate: c.convRate || c.conversion_rate || 0, revenue: c.revenue || 0 }));

  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sortField, setSortField] = useState("roas");
  const [sortDir, setSortDir] = useState("desc");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const filtered = displayCampaigns.filter((c: any) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (platformFilter !== "All" && c.platform !== platformFilter) return false;
    if (statusFilter !== "All" && c.status !== statusFilter) return false;
    return true;
  });

  const sortedCampaigns = [...filtered].sort((a: any, b: any) => {
    let valA = a[sortField] ?? "";
    let valB = b[sortField] ?? "";
    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();
    if (valA < valB) return sortDir === "asc" ? -1 : 1;
    if (valA > valB) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const paginated = sortedCampaigns.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(sortedCampaigns.length / PAGE_SIZE));

  const formatINR = (n: number | string) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const exportCSV = () => {
    if (sortedCampaigns.length === 0) return;
    const headers = ["Campaign","Platform","Spend","ROAS","CTR","Conversions","Revenue","Status"];
    const rows = sortedCampaigns.map((c: any) => [
      `"${c.name}"`, c.platform, c.adSpend, c.roas, 
      c.ctr, c.conversions, c.revenue, c.status
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "campaigns.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePauseSelected = () => {
    if (selected.length === 0) return;
    alert(`Pausing ${selected.length} campaigns...`);
  };

  const toggleSelectAll = () => {
    if (selected.length === paginated.length && paginated.length > 0) setSelected([]);
    else setSelected(paginated.map((c: any) => c.name));
  };

  const toggleSelect = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };

  const runAnalysis = () => {
    if (hasRealData && handleRefreshInsights) handleRefreshInsights();
    else window.location.href = "/upload";
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <h1 className="font-heading text-2xl font-bold">Campaigns</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePauseSelected} className="border-border/50 text-muted-foreground gap-2"><Pause className="h-3.5 w-3.5" /> Pause Selected</Button>
            <Button variant="outline" size="sm" onClick={exportCSV} className="border-border/50 text-muted-foreground gap-2"><Download className="h-3.5 w-3.5" /> Export CSV</Button>
            <Button size="sm" onClick={runAnalysis} disabled={isLoading} className="bg-primary text-primary-foreground glow-cyan gap-2">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Run AI Analysis
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search campaigns..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 border-border/50 bg-secondary/30 input-glow" />
          </div>
          <div className="flex w-full sm:w-auto items-center gap-3">
            {[{ label: "Platform", value: platformFilter, set: setPlatformFilter, options: ["All", "Meta", "Google", "Amazon"] },
            { label: "Status", value: statusFilter, set: setStatusFilter, options: ["All", "Scaling", "Stable", "Review", "Pause"] }].map((f) => (
            <select key={f.label} value={f.value} onChange={(e) => f.set(e.target.value)} className="rounded-lg border border-border/50 bg-secondary/30 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
              {f.options.map((o) => <option key={o} value={o}>{o === "All" ? `All ${f.label}s` : o}</option>)}
            </select>
          ))}
          </div>
        </div>

        {/* Table */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-x-auto w-full max-w-[100vw]">
          {isLoading ? (
            <div className="p-5">
              {Array(8).fill(0).map((_, i) => <SkeletonRow key={i} />)}
            </div>
          ) : !hasRealData ? (
             <EmptyState
                icon="📊"
                title="No campaign data yet"
                description="Upload your campaign CSV to see all your campaigns with performance metrics and AI analysis."
                buttonText="Upload Campaign Data"
                onButtonClick={() => window.location.href = '/upload'}
              />
          ) : (
            <Table>
            <TableHeader>
              <TableRow className="border-border/30 hover:bg-transparent">
                <TableHead className="w-12 text-center">
                  <Checkbox checked={selected.length === paginated.length && paginated.length > 0} onCheckedChange={toggleSelectAll} />
                </TableHead>
                <TableHead className="text-xs cursor-pointer hover:text-primary shrink-0" onClick={() => handleSort("name")}>Campaign</TableHead>
                <TableHead className="text-xs cursor-pointer hover:text-primary" onClick={() => handleSort("platform")}>Platform</TableHead>
                <TableHead className="text-xs text-right cursor-pointer hover:text-primary" onClick={() => handleSort("adSpend")}>Spend</TableHead>
                <TableHead className="text-xs text-right cursor-pointer hover:text-primary" onClick={() => handleSort("roas")}>ROAS</TableHead>
                <TableHead className="text-xs text-right cursor-pointer hover:text-primary" onClick={() => handleSort("ctr")}>CTR</TableHead>
                <TableHead className="text-xs text-right cursor-pointer hover:text-primary" onClick={() => handleSort("conversions")}>Conv.</TableHead>
                <TableHead className="text-xs text-right cursor-pointer hover:text-primary hidden md:table-cell" onClick={() => handleSort("revenue")}>Revenue</TableHead>
                <TableHead className="text-xs cursor-pointer hover:text-primary shrink-0" onClick={() => handleSort("status")}>Status</TableHead>
                <TableHead className="w-8 shrink-0"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((c: any) => (
                <React.Fragment key={c.id}>
                  <TableRow 
                    className="border-border/20 hover:bg-secondary/30 cursor-pointer transition-colors" 
                    onClick={() => setExpandedRow(expandedRow === c.id ? null : c.id)}
                  >
                    <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                      <Checkbox checked={selected.includes(c.name)} onCheckedChange={() => toggleSelect(c.name, { stopPropagation: () => {} } as React.MouseEvent)} />
                    </TableCell>
                    <TableCell className="text-sm font-medium">{c.name}</TableCell>
                    <TableCell><span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${platformColors[c.platform as Platform] || "bg-secondary text-foreground"}`}>{c.platform}</span></TableCell>
                    <TableCell className="text-sm text-right font-mono">{formatINR(c.adSpend)}</TableCell>
                    <TableCell className={`text-sm text-right font-mono font-bold ${c.roas >= 3 ? "text-success" : c.roas >= 1 ? "text-warning" : "text-destructive"}`}>{c.roas}x</TableCell>
                    <TableCell className="text-sm text-right font-mono">{c.ctr}%</TableCell>
                    <TableCell className="text-sm text-right font-mono">{c.conversions.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-right font-mono hidden md:table-cell">{formatINR(c.revenue)}</TableCell>
                    <TableCell><span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusColors[c.status] || "bg-secondary text-foreground"}`}>{c.status}</span></TableCell>
                    <TableCell>{expandedRow === c.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}</TableCell>
                  </TableRow>
                  {expandedRow === c.id && (
                    <TableRow className="border-border/10 bg-secondary/10 hover:bg-secondary/10">
                      <TableCell colSpan={10} className="p-4">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
                          <div className="flex flex-col"><span className="text-muted-foreground mb-1">Audience:</span><span className="font-semibold">{c.audience || "N/A"}</span></div>
                          <div className="flex flex-col"><span className="text-muted-foreground mb-1">Creative:</span><span className="font-semibold">{c.creative_format || "N/A"}</span></div>
                          <div className="flex-col hidden md:flex"><span className="text-muted-foreground mb-1">CPM:</span><span className="font-mono">{formatINR(c.cpm)}</span></div>
                          <div className="flex-col hidden md:flex"><span className="text-muted-foreground mb-1">CPC:</span><span className="font-mono">{formatINR(c.cpc)}</span></div>
                          <div className="flex flex-col"><span className="text-muted-foreground mb-1">Conv. Rate:</span><span className="font-mono">{(c.convRate || c.conversion_rate || 0).toFixed(2)}%</span></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
          )}
        </motion.div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Showing {Math.min(filtered.length, ((page - 1) * PAGE_SIZE) + 1)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} campaigns</p>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="h-7 w-7"><ChevronLeft className="h-4 w-4" /></Button>
            <div className="flex gap-1 h-7 items-center">
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${page === i + 1 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{i + 1}</button>
              ))}
            </div>
            <Button variant="ghost" size="icon" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="h-7 w-7"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
