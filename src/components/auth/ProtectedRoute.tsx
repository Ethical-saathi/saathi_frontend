import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Minimal loading skeleton matching app background
    return (
      <div className="min-h-screen bg-[#EDE6D3] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#5BA8A0] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to auth, preserving the intended destination
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
