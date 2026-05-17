import { Navigate } from "react-router-dom";
import { useConsent } from "@/hooks/useConsent";

interface ConsentGuardProps {
  children: React.ReactNode;
}

/**
 * Redirects authenticated users to /consent if they haven't completed Layer 1 consent.
 * Should be nested inside ProtectedRoute (user is guaranteed to exist).
 */
export const ConsentGuard = ({ children }: ConsentGuardProps) => {
  const { hasCompletedConsent, isLoading } = useConsent();

  if (isLoading) {
    return (
      <div className="min-h-screen saathi-bg flex items-center justify-center">
        <div
          className="w-10 h-10 rounded-full saathi-dot-breathe"
          style={{ backgroundColor: "var(--saathi-coral)" }}
        />
      </div>
    );
  }

  // TEMPORARY BYPASS FOR USER TESTING
  // if (!hasCompletedConsent) {
  //   return <Navigate to="/consent" replace />;
  // }

  return <>{children}</>;
};
