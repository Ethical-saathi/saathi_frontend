import { Home, Layers, Clock, User, TrendingUp, HelpCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const mobileNavItems = [
  { name: "Home", path: "/home", icon: Home },
  { name: "Session", path: "/session/prep", icon: Layers },
  { name: "History", path: "/history", icon: Clock },
  { name: "Profile", path: "/profile", icon: User },
];

export const MobileNavBar = () => {
  const location = useLocation();

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-3"
      style={{
        background: "var(--saathi-bg-card)",
        borderTop: "1px solid var(--saathi-border)",
        boxShadow: "0 -4px 12px rgba(0,0,0,0.03)",
        // env(safe-area-inset-bottom) handles the iOS home indicator bar
        paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))",
      }}
    >
      {mobileNavItems.map((item) => {
        // Precise matching for active state
        const isActive =
          item.path === "/history/trends"
            ? location.pathname === "/history/trends"
            : location.pathname.startsWith(item.path);
        
        const Icon = item.icon;

        return (
          <Link
            key={item.path}
            to={item.path}
            className="flex flex-col items-center justify-center gap-1 flex-1 min-w-[64px] max-w-[80px]"
            style={{
              color: isActive ? "var(--saathi-coral)" : "var(--saathi-text-soft)",
            }}
          >
            <div
              className={`flex items-center justify-center w-12 h-8 rounded-full transition-colors duration-300 ${
                isActive ? "bg-[#E8643A12]" : "bg-transparent"
              }`}
            >
              <Icon size={19} strokeWidth={isActive ? 2.0 : 1.6} />
            </div>
            <span
              className="text-[9px] font-medium tracking-wide"
              style={{
                color: isActive ? "var(--saathi-text-dark)" : "var(--saathi-text-soft)",
              }}
            >
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
};
