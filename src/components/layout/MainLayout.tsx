import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/chat/Sidebar";

export const MainLayout = () => {
  return (
    <div 
      className="flex h-[100dvh] w-full overflow-hidden bg-gradient-to-br from-[#FAF7F2] via-[#e8e5ce] to-[#CCC9A4] relative"
      style={{ fontFamily: "'Inter', 'DM Sans', var(--font-heading), sans-serif" }}
    >
      {/* Soft Top Glow for the dashboard */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[40vh] bg-gradient-to-b from-white/60 via-white/20 to-transparent blur-3xl pointer-events-none z-0" />
      
      <Sidebar />
      <div className="flex-1 relative z-10 flex overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
