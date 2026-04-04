import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/chat/Sidebar";

export const MainLayout = () => {
  return (
    <div 
      className="flex h-[100dvh] w-full overflow-hidden bg-[#F5F0E8]"
      style={{ fontFamily: "'Inter', 'DM Sans', var(--font-heading), sans-serif" }}
    >
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default MainLayout;
