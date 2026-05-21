import { Navigate } from "react-router-dom";
import { useOnboarding } from "@/hooks/useOnboarding";

interface OnboardingGuardProps {
  children: React.ReactNode;
}

/**
 * Redirects authenticated users to /onboarding if they haven't completed onboarding.
 * Should be nested inside ConsentGuard (consent is guaranteed to exist).
 */
export const OnboardingGuard = ({ children }: OnboardingGuardProps) => {
  const { hasCompletedOnboarding, isLoading } = useOnboarding();

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

  if (!hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};
