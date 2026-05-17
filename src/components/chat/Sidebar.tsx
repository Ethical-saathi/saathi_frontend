import { useState } from "react";
import { Home, Layers, Clock, User, HelpCircle, Settings, Menu, TrendingUp } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Logo from "@/components/landing/Logo";

const mainNavItems = [
  { name: "Home", path: "/home", icon: Home },
  { name: "Session", path: "/session/prep", icon: Layers },
  { name: "History", path: "/history", icon: Clock },
  { name: "Trends", path: "/history/trends", icon: TrendingUp },
];

const bottomNavItems = [
  { name: "Profile", path: "/profile", icon: User },
  { name: "Help", path: "/help", icon: HelpCircle },
];

export const Sidebar = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  const renderNavItem = (item: { name: string; path: string; icon: any }) => {
    const isActive = location.pathname.startsWith(item.path);
    const Icon = item.icon;

    return (
      <Link
        key={item.path}
        to={item.path}
        title={!isExpanded ? item.name : undefined}
        className="flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all duration-200 text-[14px]"
        style={{
          background: isActive ? "var(--saathi-coral-muted)" : "transparent",
          color: isActive ? "var(--saathi-coral)" : "var(--saathi-text-mid)",
          fontWeight: isActive ? 500 : 400,
        }}
      >
        <Icon
          className="shrink-0"
          size={18}
          strokeWidth={isActive ? 2.2 : 1.8}
        />
        {isExpanded && (
          <span className="whitespace-nowrap overflow-hidden">{item.name}</span>
        )}
      </Link>
    );
  };

  return (
    <div
      className="hidden md:flex flex-col h-full shrink-0 transition-all duration-300"
      style={{
        width: isExpanded ? 200 : 72,
        borderRight: "1px solid var(--saathi-border)",
        background: "var(--saathi-bg-card)",
      }}
    >
      {/* Branding */}
      <div className="p-5 pb-3 flex items-center justify-between">
        {isExpanded ? (
          <div className="flex items-center gap-2">
            <Logo size={32} />
            <span
              className="text-[18px] font-medium"
              style={{ color: "var(--saathi-text-dark)", fontFamily: "var(--font-serif)" }}
            >
              Saathi
            </span>
          </div>
        ) : (
          <div className="mx-auto">
            <Logo size={28} />
          </div>
        )}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded-lg transition-colors hover:bg-gray-100"
          style={{ color: "var(--saathi-text-soft)" }}
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Divider */}
      <div className="mx-4 mb-2" style={{ height: 1, background: "var(--saathi-border)" }} />

      {/* Main Nav */}
      <div className="flex-1 px-3 flex flex-col gap-1 pt-1">
        {mainNavItems.map(renderNavItem)}
      </div>

      {/* Bottom Nav */}
      <div className="px-3 pb-5 flex flex-col gap-1 border-t pt-3" style={{ borderColor: "var(--saathi-border)" }}>
        {bottomNavItems.map(renderNavItem)}
      </div>
    </div>
  );
};
