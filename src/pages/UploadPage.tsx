import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, FileSpreadsheet, CheckCircle, Info, Loader2, Plus, X, Plug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { uploadHistory } from "@/data/mockData";
import DashboardLayout from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);
  const { handleUpload, isLoading, error } = useApp();
  const navigate = useNavigate();

  const handleConnect = async (platform: string) => {
    setConnecting(platform);
    await new Promise(r => setTimeout(r, 2000));
    setConnecting(null);
    toast.success(`${platform} connected successfully!`);
    setShowModal(false);
  };

  const checkBackend = async () => {
    try {
      const apiHost = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${apiHost}/api/health`, {
        signal: AbortSignal.timeout(3000)
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  const loadingMessages = [
    "Parsing campaign data...",
    "Computing ROAS, CTR, CAC...",
    "Generating AI insights...",
    "Building optimization plan...",
    "Creating your report...",
  ];
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setLoadingMsgIdx((prev) => (prev + 1) % loadingMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleDrag = useCallback((e: React.DragEvent, entering: boolean) => {
    e.preventDefault();
    setIsDragging(entering);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const selected = e.dataTransfer.files?.[0];
    if (selected) setFile(selected);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleProcess = async () => {
    if (!file) return;

    const isBackendUp = await checkBackend();
    if (!isBackendUp) {
      toast.error("Backend server is not reachable. Please ensure it is deployed and running.");
      return;
    }

    try {
      const data = await handleUpload(file, { generateReport: true, reportType: "weekly" });
      const campaignCount = data?.analytics?.campaigns?.length || 0;
      toast.success(`Analysis complete! ${campaignCount} campaigns processed.`);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Upload error:", err);
      const errMsg = err.message || "";
      let displayMsg = "An error occurred during upload.";
      
      if (errMsg.toLowerCase().includes("fetch")) {
        displayMsg = "Cannot connect to backend. Please ensure the server is running.";
      } else if (errMsg.toLowerCase().includes("timeout") || errMsg.toLowerCase().includes("aborted")) {
        displayMsg = "Request timed out. The AI is taking longer than expected. Please try again.";
      } else {
        displayMsg = errMsg;
      }
      
      toast.error(displayMsg);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <h1 className="font-heading text-2xl font-bold">Data Integration</h1>
          <Button onClick={() => setShowModal(true)} className="bg-primary text-primary-foreground glow-cyan gap-2">
            <Plus className="h-4 w-4" /> Connect Platform
          </Button>
        </div>

        {/* Drop zone */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onDragOver={(e) => handleDrag(e, true)}
          onDragLeave={(e) => handleDrag(e, false)}
          onDrop={handleDrop}
          className={`glass-card flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-all ${isDragging ? "border-primary bg-primary/5" : "border-border/50"}`}
        >
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl mb-4 transition-colors ${isDragging ? "bg-primary/20" : "bg-secondary/50"}`}>
            <Upload className={`h-6 w-6 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">Drag & drop your data files here</p>
          <p className="text-xs text-muted-foreground mb-4">or click to browse files</p>
          <input 
            type="file" 
            accept=".csv,.xlsx,.xls" 
            className="hidden" 
            id="fileUpload" 
            onChange={handleFileChange}
          />
          {!file && !isLoading && (
            <label htmlFor="fileUpload" className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 glow-cyan transition-all">
              Browse Files
            </label>
          )}

          {file && !isLoading && (
            <div className="flex flex-col items-center mt-4">
              <div className="flex items-center gap-2 mb-4 text-sm font-medium text-foreground bg-secondary/30 px-4 py-2 rounded-full border border-border/50">
                <FileSpreadsheet className="h-4 w-4 text-primary" />
                {file.name}
              </div>
              <button 
                onClick={handleProcess}
                className="rounded-lg bg-primary px-6 py-2 border-none cursor-pointer text-sm font-bold text-primary-foreground hover:bg-primary/90 glow-cyan transition-all"
              >
                Process with AI
              </button>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center mt-6">
              <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
              <p className="text-sm font-medium text-foreground mb-2">
                AI agents are analyzing your campaigns... (15-20 seconds)
              </p>
              <p className="text-sm font-semibold text-primary animate-pulse">
                {loadingMessages[loadingMsgIdx]}
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500 rounded text-red-500 text-sm max-w-md text-center">
              {error}
            </div>
          )}
        </motion.div>

        {/* File format guidelines */}
        <div className="glass-card p-5 flex items-start gap-3">
          <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">Supported Formats</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              CSV (.csv) and Excel (.xlsx, .xls) files are supported. Ensure your data includes columns for Campaign Name, Platform, Spend, Impressions, Clicks, Conversions, and Revenue. Maximum file size: 50MB.
            </p>
          </div>
        </div>

        {/* Upload history */}
        <div>
          <h2 className="font-heading text-lg font-semibold mb-4">Upload History</h2>
          <div className="glass-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/30 hover:bg-transparent">
                  <TableHead className="text-xs">File Name</TableHead>
                  <TableHead className="text-xs">Upload Date</TableHead>
                  <TableHead className="text-xs text-right">Rows</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uploadHistory.map((f) => (
                  <TableRow key={f.id} className="border-border/20 hover:bg-secondary/30 transition-colors">
                    <TableCell className="flex items-center gap-2 text-sm">
                      <FileSpreadsheet className="h-4 w-4 text-primary" />
                      {f.fileName}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{f.uploadDate}</TableCell>
                    <TableCell className="text-sm text-right font-mono">{f.rows.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
                        <CheckCircle className="h-3 w-3" /> {f.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Platform Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setShowModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card w-full max-w-lg p-6 relative" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-lg font-semibold">Connect Ad Platform</h2>
                <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
              </div>

              <div className="space-y-4">
                {["Meta Ads", "Google Ads", "Amazon Advertising"].map(platform => (
                  <div key={platform} className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-secondary/20 hover:border-primary/30 transition-colors">
                    <span className="font-medium text-sm">{platform}</span>
                    <Button 
                      variant="outline" 
                      onClick={() => handleConnect(platform)}
                      disabled={connecting !== null}
                      className="gap-2 border-primary/30 hover:bg-primary/10 text-primary w-28"
                    >
                      {connecting === platform ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plug className="h-4 w-4" />}
                      {connecting === platform ? "Connecting" : "Connect"}
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
