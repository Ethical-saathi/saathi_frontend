import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/chat/Sidebar";
import { MobileNavBar } from "@/components/layout/MobileNavBar";
import { useViewportHeight } from "@/hooks/useViewportHeight";

export const MainLayout = () => {
  const viewportHeight = useViewportHeight();

  return (
    <div
      className="flex w-full overflow-hidden relative"
      style={{
        height: viewportHeight ? `${viewportHeight}px` : "100dvh",
        background: "var(--saathi-bg)",
        fontFamily: "var(--font-app)",
      }}
    >
      <Sidebar />
      {/* pb-[72px] reserves space for the MobileNavBar on mobile devices. env(safe-area) is handled in the components. */}
      <div className="flex-1 relative flex overflow-hidden pb-[72px] md:pb-0">
        <Outlet />
      </div>
      <MobileNavBar />
    </div>
  );
};

export default MainLayout;
