import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import LandingPage from "./pages/LandingPage.tsx";
import Auth from "./pages/Auth.tsx";
import About from "./pages/About.tsx";
import Profile from "./pages/Profile.tsx";
import NotFound from "./pages/NotFound.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import Chat from "./pages/Chat.tsx";
import Home from "./pages/Home.tsx";
import SessionHistory from "./pages/SessionHistory.tsx";
import CrisisEscalation from "./pages/CrisisEscalation.tsx";
import Help from "./pages/Help.tsx";
import { MainLayout } from "./components/layout/MainLayout.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Auth />} />
            {/* Temporarily unprotected so you can test the UI without Supabase email issues */}
            <Route path="/onboarding" element={<Onboarding />} />
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route path="/home" element={<Home />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/history" element={<SessionHistory />} />
              <Route path="/help" element={<Help />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/escalation" element={<ProtectedRoute><CrisisEscalation /></ProtectedRoute>} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
