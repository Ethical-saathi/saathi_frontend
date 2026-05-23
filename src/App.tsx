import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ConsentGuard } from "@/components/auth/ConsentGuard";
import { OnboardingGuard } from "@/components/auth/OnboardingGuard";
import { SessionProvider } from "@/context/SessionContext";
import LandingPage from "./pages/LandingPage.tsx";
import Auth from "./pages/Auth.tsx";
import About from "./pages/About.tsx";
import HowItWorks from "./pages/HowItWorks.tsx";
import NotFound from "./pages/NotFound.tsx";
import ConsentFlow from "./pages/ConsentFlow.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import Home from "./pages/Home.tsx";
import SessionPrep from "./pages/SessionPrep.tsx";
import SessionActive from "./pages/SessionActive.tsx";
import SessionSummary from "./pages/SessionSummary.tsx";
import SessionHistory from "./pages/SessionHistory.tsx";
import SessionTranscript from "./pages/SessionTranscript.tsx";
import HistoryTrends from "./pages/HistoryTrends.tsx";
import CrisisEscalation from "./pages/CrisisEscalation.tsx";
import Help from "./pages/Help.tsx";
import Settings from "./pages/Settings.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import { MainLayout } from "./components/layout/MainLayout.tsx";
import { SystemHealthGuard } from "./components/layout/SystemHealthGuard.tsx";

const queryClient = new QueryClient();

/**
 * Route Architecture:
 * 
 * PUBLIC:
 *   /         → Landing page (untouched)
 *   /auth     → Login / Sign-up
 *   /about    → About page
 * 
 * AUTHENTICATED (requires login):
 *   /consent  → 2-screen DPDPA consent flow
 *   /onboarding → 6-step onboarding
 * 
 * FULLY ONBOARDED (requires login + consent + onboarding):
 *   /home             → Dashboard (with SessionBudgetWidget)
 *   /session/prep     → Pre-session intention setting
 *   /session/active   → Therapy conversation
 *   /session/summary/:id → Post-session reflection
 *   /chat             → Redirects to /session/prep (backwards compat)
 *   /history          → Session history timeline
 *   /history/trends   → 3-month VAD emotion graphing
 *   /history/:id      → Session transcript view
 *   /settings → Settings page
 *   /profile  → Profile page
 *   /help     → Help & crisis resources
 *   /escalation → Crisis escalation
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <SessionProvider>
            <Routes>
              {/* PUBLIC ROUTES — Landing page is untouched */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/about" element={<About />} />
              <Route path="/how-it-works" element={<HowItWorks />} />

              {/* AUTHENTICATED: Consent flow (requires login, but NOT consent/onboarding) */}
              <Route
                path="/consent"
                element={
                  <ProtectedRoute>
                    <ConsentFlow />
                  </ProtectedRoute>
                }
              />

              {/* AUTHENTICATED: Onboarding (requires login + consent, but NOT onboarding) */}
              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute>
                    <ConsentGuard>
                      <Onboarding />
                    </ConsentGuard>
                  </ProtectedRoute>
                }
              />

              {/* FULLY ONBOARDED: Main app routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <ConsentGuard>
                      <OnboardingGuard>
                        <SystemHealthGuard>
                          <MainLayout />
                        </SystemHealthGuard>
                      </OnboardingGuard>
                    </ConsentGuard>
                  </ProtectedRoute>
                }
              >
                <Route path="/home" element={<Home />} />

                {/* Session flow */}
                <Route path="/session/prep" element={<SessionPrep />} />
                <Route path="/session/active" element={<SessionActive />} />
                <Route path="/session/summary/:sessionId" element={<SessionSummary />} />

                {/* Backwards compat: /chat → /session/prep */}
                <Route path="/chat" element={<Navigate to="/session/prep" replace />} />

                {/* History */}
                <Route path="/history" element={<SessionHistory />} />
                <Route path="/history/trends" element={<HistoryTrends />} />
                <Route path="/history/session/:sessionId" element={<SessionTranscript />} />

                <Route path="/help" element={<Help />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              {/* Crisis escalation — auth-gated but no consent/onboarding guard */}
              <Route
                path="/escalation"
                element={
                  <ProtectedRoute>
                    <CrisisEscalation />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </SessionProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
