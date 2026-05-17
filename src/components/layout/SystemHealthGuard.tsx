import { useState, useEffect, type ReactNode } from "react";
import { apiClient } from "@/lib/apiClient";
import { AlertTriangle, RefreshCw } from "lucide-react";

export const SystemHealthGuard = ({ children }: { children: ReactNode }) => {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  const checkHealth = async () => {
    setIsChecking(true);
    const healthy = await apiClient.checkHealth();
    setIsHealthy(healthy);
    setIsChecking(false);
  };

  useEffect(() => {
    checkHealth();
    // Poll every 60 seconds
    const interval = setInterval(checkHealth, 60000);
    return () => clearInterval(interval);
  }, []);

  if (isHealthy === false) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--saathi-bg)] p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center border border-red-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="text-red-500 w-8 h-8" />
          </div>
          <h2 className="text-[22px] font-semibold text-gray-900 mb-3">
            System Currently Offline
          </h2>
          <p className="text-[15px] text-gray-600 mb-8 leading-relaxed">
            The Saathi therapeutic backend is currently unreachable. We pause sessions during outages to ensure your safety and continuous therapeutic context.
          </p>
          <button
            onClick={checkHealth}
            disabled={isChecking}
            className="flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? "animate-spin" : ""}`} />
            {isChecking ? "Checking Connection..." : "Try Reconnecting"}
          </button>
        </div>
      </div>
    );
  }

  // If null (initial check), we just render children to not block paint, 
  // but if they try to start a session, it will fail at the API layer anyway.
  return <>{children}</>;
};
