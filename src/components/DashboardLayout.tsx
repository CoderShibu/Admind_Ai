import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Megaphone, Lightbulb, MessageSquare, FileText, Upload, LogOut, Zap, Menu, X, Home, Info, Bell, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useApp } from "@/context/AppContext";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Campaigns", url: "/campaigns", icon: Megaphone },
  { title: "AI Insights", url: "/insights", icon: Lightbulb },
  { title: "Chat", url: "/chat", icon: MessageSquare },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Upload Data", url: "/upload", icon: Upload },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { hasRealData, handleRefreshInsights, isLoading } = useApp();

  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("sidebar_collapsed") === "true");
  const [dateRange, setDateRange] = useState("last_30_days");
  const [showNotifs, setShowNotifs] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("sidebar_collapsed", String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("nagent_auth");
    navigate("/login");
  };

  const runAnalysis = () => {
    if (hasRealData && handleRefreshInsights) handleRefreshInsights();
    else navigate("/upload");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 shrink-0 flex flex-col border-r border-border/50 bg-sidebar transition-all duration-300 ease-in-out md:relative ${isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0"} ${collapsed ? "md:w-16" : "md:w-60"}`}>
        {/* Mobile close button */}
        <button
          className="absolute right-4 top-5 text-muted-foreground md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>
        {/* Logo */}
        <div className={`flex items-center gap-2 px-5 py-5 ${collapsed ? "justify-center px-0" : ""}`}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          {!collapsed && <span className="font-heading text-lg font-bold tracking-tight text-foreground truncate">Admind AI</span>}
        </div>

        {/* Collapse toggle (Desktop only) */}
        <button
          className="hidden md:flex absolute -right-3 top-6 h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground z-[100]"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>

        {/* Nav links */}
        <nav className="flex-1 space-y-1 px-3 mt-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <NavLink
                key={item.url}
                to={item.url}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-sidebar-accent ${isActive ? "bg-sidebar-accent text-primary border-l-2 border-primary" : "text-sidebar-foreground"}`}
              >
                <div className={`flex items-center w-full ${collapsed ? "justify-center" : "justify-between"}`}>
                  <div className="flex items-center gap-3">
                    <item.icon className={`h-5 w-5 shrink-0 ${isActive ? "text-primary" : ""}`} />
                    {!collapsed && <span className="truncate">{item.title}</span>}
                  </div>
                  {!collapsed && hasRealData && ["Dashboard", "AI Insights", "Chat", "Reports"].includes(item.title) && (
                    <div className="h-2 w-2 rounded-full bg-success shadow-[0_0_8px_hsl(var(--success))]" />
                  )}
                </div>
              </NavLink>
            )
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-border/50 p-4">
          <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
              MK
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">Marketing Team</p>
                <p className="text-xs text-muted-foreground truncate">admin@admind.ai</p>
              </div>
            )}
            {!collapsed && (
              <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
          {collapsed && (
            <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground transition-colors mt-4 w-full flex justify-center">
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto flex flex-col relative">

        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/50 bg-card/80 backdrop-blur-md p-4 shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 -ml-2 text-muted-foreground hover:bg-secondary rounded-md">
              <Menu className="h-6 w-6" />
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={() => navigate("/")} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors hidden sm:block" title="Home">
              <Home className="h-5 w-5" />
            </button>

            <button onClick={() => setShowAbout(true)} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors hidden sm:block" title="About App">
              <Info className="h-5 w-5" />
            </button>

            <div className="relative" ref={notifRef}>
              <button onClick={() => setShowNotifs(!showNotifs)} className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border border-card shadow-[0_0_8px_hsl(var(--destructive))]"></span>
              </button>

              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border/50 bg-card shadow-lg p-4 z-50">
                  <h3 className="text-sm font-semibold mb-3 text-foreground">Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0 shadow-[0_0_8px_hsl(var(--primary))]" />
                      <div>
                        <p className="text-xs font-medium text-foreground">New AI Insights available</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="h-2 w-2 rounded-full bg-success mt-1.5 shrink-0 shadow-[0_0_8px_hsl(var(--success))]" />
                      <div>
                        <p className="text-xs font-medium text-foreground">Weekly report generated</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground mt-1.5 shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-foreground">System updated to v2.4</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* About App Modal */}
      {showAbout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowAbout(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
              <Zap className="h-5 w-5 text-primary glow-cyan" /> Admind AI
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>Welcome to Admind AI — your intelligent performance marketing assistant.</p>
              <p>Version: 2.4.0 <span className="inline-block h-1.5 w-1.5 rounded-full bg-success ml-2 mr-1"></span> Stable</p>
              <p className="pt-2">Features included:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>AI Campaign Insights & Optimization</li>
                <li>Cross-platform Analytics (Meta, Google, Amazon)</li>
                <li>Automated PDF Weekly Reports</li>
                <li>Natural Language Chat Interface</li>
                <li>Global Interactive Filtering</li>
              </ul>
              <div className="mt-6 pt-4 border-t border-border/50 text-xs opacity-70">
                © 2026 Admind AI Inc. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
