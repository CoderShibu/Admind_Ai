import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthGuard } from "@/components/AuthGuard";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CampaignsPage from "./pages/CampaignsPage";
import InsightsPage from "./pages/InsightsPage";
import ChatPage from "./pages/ChatPage";
import ReportsPage from "./pages/ReportsPage";
import UploadPage from "./pages/UploadPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<AuthGuard><DashboardPage /></AuthGuard>} />
          <Route path="/campaigns" element={<AuthGuard><CampaignsPage /></AuthGuard>} />
          <Route path="/insights" element={<AuthGuard><InsightsPage /></AuthGuard>} />
          <Route path="/chat" element={<AuthGuard><ChatPage /></AuthGuard>} />
          <Route path="/reports" element={<AuthGuard><ReportsPage /></AuthGuard>} />
          <Route path="/upload" element={<AuthGuard><UploadPage /></AuthGuard>} />
          <Route path="*" element={<AuthGuard><NotFound /></AuthGuard>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
