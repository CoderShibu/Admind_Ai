import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Eye, Plus, Sparkles, X, Calendar } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { reports as mockReports } from "@/data/mockData";
import DashboardLayout from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { getReportDownloadUrl } from "@/services/api";
import { toast } from "sonner";

const reportTypes = ["Weekly Summary", "Monthly Overview", "Campaign Deep Dive", "Creative Analysis"];
const sections = ["KPI Summary", "Campaign Performance", "Audience Analysis", "Creative Insights", "Recommendations"];

export default function ReportsPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState(reportTypes[0]);
  const [selectedSections, setSelectedSections] = useState<Set<string>>(new Set(sections));
  const { handleGenerateReport, reports: realReports, isLoading, analytics, hasRealData } = useApp();

  const displayReports = hasRealData && realReports?.length ? realReports : mockReports;

  const toggleSection = (s: string) => {
    const next = new Set(selectedSections);
    next.has(s) ? next.delete(s) : next.add(s);
    setSelectedSections(next);
  };

  const generateReport = async () => {
    try {
      await handleGenerateReport(selectedType.toLowerCase().replace(" ", "_"));
      setShowModal(false);
      toast.success("Report generated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate report");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <h1 className="font-heading text-2xl font-bold">Performance Reports</h1>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!analytics && (
              <span className="text-xs text-muted-foreground mr-2 hidden sm:block">Upload campaign data first to generate a report</span>
            )}
            <Button disabled={!analytics} onClick={() => setShowModal(true)} className="bg-primary text-primary-foreground glow-cyan gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" /> Generate New Report
            </Button>
          </div>
        </div>

        {/* Report cards */}
        {!analytics ? (
          <EmptyState 
            icon="📄" 
            title="No Data Available" 
            description="Please upload your campaign data first to generate AI-powered performance reports." 
            buttonText="Upload Data" 
            onButtonClick={() => window.location.href = "/upload"} 
          />
        ) : (
          <div className="space-y-3">
            {displayReports.map((r: any, i: number) => {
              const isMock = !r.reportId;
              const id = r.reportId || r.id;
              const name = isMock ? r.name : r.filename;
              const date = isMock ? r.date : new Date(r.generatedAt).toLocaleDateString();
              const type = isMock ? r.type : r.reportType || "Analysis";
              const status = isMock ? r.status : "Ready";
              
              return (
                <motion.div key={id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card-hover flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{date} · {type}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium w-fit ${status === "Ready" ? "bg-success/20 text-success border-success/30" : "bg-warning/20 text-warning border-warning/30"}`}>
                      {status === "Generating" && <span className="h-1.5 w-1.5 rounded-full bg-warning animate-pulse" />}
                      {status}
                    </span>
                    {status === "Ready" && (
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Button size="sm" variant="outline" className="border-border/50 text-xs gap-1.5 w-full sm:w-auto"><Eye className="h-3 w-3" /> View</Button>
                        <a href={!isMock && r.filename ? getReportDownloadUrl(r.filename) : "#"} download className="w-full sm:w-auto">
                          <Button size="sm" variant="outline" className="border-border/50 text-xs gap-1.5 cursor-pointer w-full sm:w-auto">
                            <Download className="h-3 w-3" /> PDF
                          </Button>
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setShowModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card w-full max-w-lg p-6 relative" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-lg font-semibold">Generate New Report</h2>
                <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Report Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {reportTypes.map((t) => (
                      <button key={t} onClick={() => setSelectedType(t)} className={`rounded-lg border p-3 text-xs font-medium text-left transition-all ${selectedType === t ? "border-primary bg-primary/10 text-primary" : "border-border/50 text-muted-foreground hover:border-primary/30"}`}>{t}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Date Range</label>
                  <button className="flex items-center gap-2 rounded-lg border border-border/50 bg-secondary/30 px-3 py-2 text-sm text-foreground w-full">
                    <Calendar className="h-4 w-4 text-muted-foreground" /> Last 30 days
                  </button>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Include Sections</label>
                  <div className="space-y-2">
                    {sections.map((s) => (
                      <label key={s} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                        <Checkbox checked={selectedSections.has(s)} onCheckedChange={() => toggleSection(s)} />
                        {s}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="w-full border-border/50" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button disabled={isLoading} className="w-full bg-primary text-primary-foreground glow-cyan gap-2" onClick={generateReport}>
                    {isLoading ? <Sparkles className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    {isLoading ? "Generating..." : "Generate with AI"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
