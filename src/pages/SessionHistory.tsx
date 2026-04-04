import { useState, useRef, useEffect } from "react";
import { Sidebar } from "@/components/chat/Sidebar";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import { TimelineView } from "@/components/session-history/TimelineView";
import { DetailView } from "@/components/session-history/DetailView";
import { AnimatePresence, motion } from "framer-motion";

export const SessionHistory = () => {
  const [view, setView] = useState<'timeline' | 'detail'>('timeline');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const mainAreaRef = useRef<HTMLDivElement>(null);
  
  // Real app would pass user's context, default to some session id
  const { data, isLoading, deleteSession } = useSessionHistory("session_123");

  // Reset scroll to top when view changes
  useEffect(() => {
    if (mainAreaRef.current) {
      mainAreaRef.current.scrollTop = 0;
    }
  }, [view]);

  const handleSelectSession = (id: string) => {
    setSelectedSessionId(id);
    setView('detail');
  };

  const handleBack = () => {
    setView('timeline');
    // We intentionally do not nullify selectedSessionId immediately to prevent flashes
    // during the animated exit. Let standard unmount handle cleanup or leave it.
  };

  const selectedSession = data?.sessions.find(s => s.id === selectedSessionId);

  return (
    <div 
      ref={mainAreaRef}
      className="flex-1 overflow-y-auto w-full relative"
    >
      <div className="px-[24px] md:px-[48px] py-10 md:py-16">
          
          {isLoading ? (
             <div className="max-w-3xl mx-auto animate-pulse flex flex-col gap-4 mt-8">
                <div className="h-8 bg-black/5 rounded w-1/3" />
                <div className="h-4 bg-black/5 rounded w-1/2" />
             </div>
          ) : (
            <AnimatePresence mode="popLayout" initial={false}>
              {view === 'timeline' && data && (
                <motion.div
                  key="timeline"
                  initial={{ x: -40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -40, opacity: 0 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                >
                  <TimelineView 
                    sessions={data.sessions}
                    totalCount={data.totalCount}
                    firstSessionMonth={data.firstSessionMonth}
                    onSelectSession={handleSelectSession}
                    onDeleteSession={deleteSession}
                  />
                </motion.div>
              )}

              {view === 'detail' && selectedSession && (
                <motion.div
                  key="detail"
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 40, opacity: 0 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                >
                  <DetailView 
                    session={selectedSession}
                    onBack={handleBack}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )}

      </div>
    </div>
  );
};

export default SessionHistory;
