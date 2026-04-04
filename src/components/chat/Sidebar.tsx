import { useState } from "react";
import { Home, MessageCircle, Clock, User, HelpCircle, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export const Sidebar = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  const mainNavItems = [
    { name: "Home", path: "/home", icon: Home },
    { name: "Chat", path: "/chat", icon: MessageCircle },
    { name: "History", path: "/history", icon: Clock },
  ];

  const bottomNavItems = [
    { name: "Profile", path: "/profile", icon: User },
    { name: "Help", path: "/help", icon: HelpCircle },
  ];

  const renderNavItem = (item: { name: string; path: string; icon: any }) => {
    const isActive = location.pathname.startsWith(item.path);
    const Icon = item.icon;
    
    return (
      <Link
        key={item.path}
        to={item.path}
        title={!isExpanded ? item.name : undefined}
        className={cn(
          "flex items-center py-3 rounded-xl transition-all duration-300 ease-in-out group text-[14px]",
          isExpanded ? "px-3 gap-3" : "px-0 justify-center w-[48px] mx-auto",
          isActive 
            ? "bg-[#E6E2DA] shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)] text-teal-800 font-medium" 
            : "text-slate-600 font-medium hover:bg-[#EAE7DF] hover:text-slate-800"
        )}
      >
        <Icon 
          className={cn(
            "w-[18px] h-[18px] transition-opacity shrink-0",
            isActive ? "text-teal-700 opacity-100" : "opacity-70 group-hover:opacity-100"
          )} 
          strokeWidth={isActive ? 2.5 : 2} 
        />
        <span className={cn(
          "transition-all duration-300 whitespace-nowrap overflow-hidden",
          isExpanded ? "w-auto opacity-100" : "w-0 opacity-0 hidden"
        )}>
          {item.name}
        </span>
      </Link>
    );
  };

  return (
    <div className={cn(
      "hidden md:flex flex-col h-full bg-[#F0EDE8] border-r border-[#E6E2DA] shrink-0 transition-all duration-300 ease-in-out",
      isExpanded ? "w-[260px]" : "w-[80px]"
    )}>
      
      {/* Branding Block */}
      <div className={cn(
        "p-6 pb-4 flex flex-col transition-all duration-300",
        isExpanded ? "" : "items-center px-4"
      )}>
        <div className={cn("flex items-center", isExpanded ? "justify-between mb-2 w-full" : "justify-center mb-4")}>
          <div className={cn(
            "flex items-center gap-2.5 transition-all duration-300 overflow-hidden whitespace-nowrap",
            isExpanded ? "w-auto opacity-100" : "w-0 opacity-0 hidden"
          )}>
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-emerald-400 shrink-0" />
            <span className="text-[15px] font-semibold text-slate-800 tracking-tight">MindEase</span>
          </div>

          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-500 hover:text-slate-800 transition-colors shrink-0 p-1"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {!isExpanded && (
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-emerald-400 shrink-0 mb-2" />
        )}
        
        <h1 
          className={cn(
            "text-teal-800 italic transition-all duration-[400ms] overflow-hidden whitespace-nowrap",
            isExpanded ? "text-[24px] ml-1 opacity-100 h-8" : "opacity-0 h-0 text-[0px]"
          )}
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Saathi
        </h1>
      </div>
      
      <div className={cn(
        "mb-4 transition-all duration-300",
        isExpanded ? "px-6" : "px-4"
      )}>
        <div className="w-full h-[1px] bg-black/5 rounded-full" />
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 flex flex-col gap-1.5 pt-2">
        {mainNavItems.map(renderNavItem)}
      </div>

      {/* Footer Navigation */}
      <div className="p-4 flex flex-col gap-1.5 border-t border-black/5 mt-auto pb-6">
        {bottomNavItems.map(renderNavItem)}
      </div>
    </div>
  );
};
