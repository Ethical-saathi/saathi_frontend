import { useRef, useState, useEffect } from "react";
import { AGREEMENT_SECTIONS } from "@/data/agreement";
import { X } from "lucide-react";

interface AgreementDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const AgreementDrawer = ({ open, onClose }: AgreementDrawerProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!open) {
      setScrollProgress(0);
      return;
    }

    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const progress = scrollHeight <= clientHeight ? 100 : (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollProgress(Math.round(progress));
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="relative w-full max-w-[600px] bg-white rounded-t-[24px] flex flex-col"
        style={{
          height: "90vh",
          fontFamily: "var(--font-app)",
        }}
      >
        {/* Scroll Progress Bar */}
        <div className="w-full h-[3px] bg-gray-100 rounded-t-[24px] overflow-hidden shrink-0">
          <div
            className="h-full transition-all duration-150"
            style={{
              width: `${scrollProgress}%`,
              background: "var(--saathi-coral)",
            }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0" style={{ borderColor: "var(--saathi-border)" }}>
          <h3
            className="text-[16px] font-medium"
            style={{ color: "var(--saathi-text-dark)" }}
          >
            Full Agreement
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100"
          >
            <X size={18} style={{ color: "var(--saathi-text-mid)" }} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">
          {AGREEMENT_SECTIONS.map((section) => (
            <div key={section.id} className="mb-8">
              <h4
                className="text-[15px] font-medium mb-3"
                style={{ color: "var(--saathi-text-dark)" }}
              >
                {section.id}. {section.title}
              </h4>
              {section.content.split("\n\n").map((paragraph, i) => (
                <p
                  key={i}
                  className="text-[14px] leading-[1.8] mb-3"
                  style={{ color: "var(--saathi-text-mid)" }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t shrink-0" style={{ borderColor: "var(--saathi-border)" }}>
          <button
            onClick={onClose}
            className="saathi-btn-coral w-full"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
