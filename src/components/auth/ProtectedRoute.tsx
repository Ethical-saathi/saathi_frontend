import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Show skeleton loading while auth state resolves
    return (
      <div className="min-h-screen saathi-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-full saathi-dot-breathe"
            style={{ backgroundColor: "var(--saathi-coral)" }}
          />
          <p
            style={{
              color: "var(--saathi-text-soft)",
              fontFamily: "var(--font-app)",
              fontSize: 14,
            }}
          >
            Loading…
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
