import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Copy, RefreshCw } from "lucide-react";
import { SkeletonInsightCard } from "@/components/ui/SkeletonLoader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { insights as mockInsights, adCopySuggestions as mockAdCopy } from "@/data/mockData";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";

const tabs = ["All", "Performance", "Budget", "Creative", "Audience"] as const;

const categoryColors: Record<string, string> = {
  Performance: "bg-primary/20 text-primary",
  Budget: "bg-warning/20 text-warning",
  Creative: "bg-purple-500/20 text-purple-400",
  Audience: "bg-success/20 text-success",
};

const impactDots: Record<string, string> = {
  High: "bg-destructive",
  Medium: "bg-warning",
  Low: "bg-muted-foreground",
};

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [completedOpts, setCompletedOpts] = useState<Set<string>>(new Set());
  const { insights: realInsights, optimization, creative, handleRefreshInsights, isLoading, hasRealData } = useApp();

  const displayInsights = hasRealData && realInsights?.length ? realInsights : mockInsights;
  const displayAdCopy = hasRealData && creative?.adCopySuggestions ? creative.adCopySuggestions : mockAdCopy;

  const filtered = displayInsights.filter((i: any) => {
    if (dismissed.has(i.id)) return false;
    if (activeTab === "All") return true;
    return i.category === activeTab;
  });

  const handleApply = (id: string, title: string) => {
    toast.success(`Applied insight: ${title}`);
    setDismissed(new Set([...dismissed, id]));
  };

  const toggleOpt = (item: string) => {
    setCompletedOpts(prev => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold">AI Marketing Insights</h1>
            <p className="text-sm text-muted-foreground mt-1">Last analyzed: Today at 9:41 AM</p>
          </div>
          {hasRealData && (
            <Button onClick={handleRefreshInsights} disabled={isLoading} className="bg-primary text-primary-foreground gap-2">
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh Insights
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-lg border border-border/50 bg-secondary/30 p-1 w-fit">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${activeTab === tab ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{tab}</button>
          ))}
        </div>

        {/* Insight Cards */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => <SkeletonInsightCard key={i} />)
          ) : !hasRealData ? (
            <div className="col-span-1 md:col-span-2">
              <EmptyState 
                icon="💡" 
                title="No Insights Available" 
                description="Upload campaign data to unlock AI-driven insights and optimization suggestions." 
                buttonText="Upload Data" 
                onButtonClick={() => window.location.href = '/upload'} 
              />
            </div>
          ) : (
            filtered.map((insight, i) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="glass-card-hover p-5 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${categoryColors[insight.category]}`}>{insight.category}</span>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className={`h-2 w-2 rounded-full ${impactDots[insight.impact]}`} />
                    {insight.impact} Impact
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2">{insight.title}</h3>
                <p className="text-xs text-muted-foreground flex-1 leading-relaxed">{insight.detail}</p>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" onClick={() => handleApply(insight.id, insight.title)} className="border-primary/30 text-primary hover:bg-primary/10 text-xs gap-1.5"><Check className="h-3 w-3" /> Apply</Button>
                  <Button size="sm" variant="ghost" className="text-muted-foreground text-xs gap-1.5" onClick={() => setDismissed(new Set([...dismissed, insight.id]))}><X className="h-3 w-3" /> Dismiss</Button>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Ad Copy Suggestions */}
        <div>
          <h2 className="font-heading text-lg font-semibold mb-4">AI-Generated Ad Copy Suggestions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayAdCopy.map((ad: any) => (
              <div key={ad.id || ad.hook} className="glass-card p-5">
                <p className="text-sm font-semibold text-foreground mb-2">{ad.hook}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{ad.body || ad.copy}</p>
                {ad.cta && <p className="text-xs font-medium text-primary mb-4">CTA: {ad.cta}</p>}
                <Button size="sm" variant="outline" className="border-border/50 text-xs gap-1.5" onClick={() => { navigator.clipboard.writeText(`${ad.hook}\n${ad.body || ad.copy}`); toast.success("Copied to clipboard"); }}>
                  <Copy className="h-3 w-3" /> Copy Text
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Optimization Plan */}
        {hasRealData && optimization && (
          <div className="pt-4">
            <h2 className="font-heading text-lg font-semibold mb-4">Optimization Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {optimization.quickWins && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-success mb-3">Quick Wins</h3>
                  <ul className="space-y-3">
                    {optimization.quickWins.map((win: string, i: number) => (
                      <li key={i} className={`text-xs flex gap-2 cursor-pointer transition-colors ${completedOpts.has(win) ? "text-muted-foreground opacity-50 line-through" : "text-foreground"}`} onClick={() => toggleOpt(win)}>
                        <Checkbox checked={completedOpts.has(win)} className="mt-0.5" />
                        <span className="leading-tight pt-0.5">{win}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {optimization.weeklyPriorities && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-primary mb-3">Weekly Priorities</h3>
                  <ul className="space-y-3">
                    {optimization.weeklyPriorities.map((pri: string, i: number) => (
                      <li key={i} className={`text-xs flex gap-2 cursor-pointer transition-colors ${completedOpts.has(pri) ? "text-muted-foreground opacity-50 line-through" : "text-foreground"}`} onClick={() => toggleOpt(pri)}>
                        <Checkbox checked={completedOpts.has(pri)} className="mt-0.5" />
                        <span className="leading-tight pt-0.5">{pri}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {optimization.budgetReallocations && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-warning mb-3">Budget Allocations</h3>
                  <ul className="space-y-3">
                    {optimization.budgetReallocations.map((alloc: string, i: number) => (
                      <li key={i} className={`text-xs flex gap-2 cursor-pointer transition-colors ${completedOpts.has(alloc) ? "text-muted-foreground opacity-50 line-through" : "text-foreground"}`} onClick={() => toggleOpt(alloc)}>
                        <Checkbox checked={completedOpts.has(alloc)} className="mt-0.5" />
                        <span className="leading-tight pt-0.5">{alloc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
