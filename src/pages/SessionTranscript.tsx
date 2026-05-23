import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

const SessionTranscript = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;
    apiClient.fetchTranscript(sessionId)
      .then(res => {
        setData(res);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load transcript:", err);
        setIsLoading(false);
      });
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto px-6 md:px-12 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="saathi-skeleton h-8 w-60 mb-6" />
          <div className="saathi-skeleton h-5 w-40 mb-10" />
          <div className="saathi-skeleton h-20 w-full mb-4" />
          <div className="saathi-skeleton h-16 w-3/4 mb-4" />
          <div className="saathi-skeleton h-20 w-full mb-4" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20">
        <p className="mb-4" style={{ color: "var(--saathi-text-soft)" }}>Session transcript not found or access denied.</p>
        <button
          onClick={() => navigate("/history")}
          className="px-4 py-2 rounded-full text-[13px] border hover:bg-black/5"
          style={{ borderColor: "var(--saathi-border)", color: "var(--saathi-text-mid)" }}
        >
          Return to History
        </button>
      </div>
    );
  }

  const { metadata, summary, turns, created_at } = data;
  const dateStr = new Date(created_at).toLocaleDateString("en-IN", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div className="flex-1 overflow-y-auto w-full pb-20">
      <div className="max-w-2xl mx-auto px-6 md:px-12 py-10 md:py-16">
        {/* Back */}
        <button
          onClick={() => navigate("/history")}
          className="flex items-center gap-2 text-[14px] mb-8 transition-colors hover:opacity-80"
          style={{ color: "var(--saathi-text-mid)" }}
        >
          <ArrowLeft size={16} /> Back to History
        </button>

        {/* Header */}
        <div className="mb-10">
          <p className="text-[12px] uppercase tracking-wider mb-2" style={{ color: "var(--saathi-text-soft)" }}>
            {dateStr}
          </p>
          <h1 className="text-[24px] font-medium mb-4" style={{ color: "var(--saathi-text-dark)" }}>
            Session Reflection
          </h1>
          {summary.text && (
            <p className="text-[14px] leading-relaxed italic p-4 rounded-xl" style={{ background: "rgba(245,237,216,0.3)", color: "var(--saathi-text-mid)" }}>
              {summary.text}
            </p>
          )}
        </div>

        {/* Transcript */}
        <div className="flex flex-col gap-4">
          {turns.map((turn: any) => (
            <div key={turn.turn_index} className="flex flex-col gap-4 mb-2">
              {/* User Bubble */}
              {turn.user_message && (
                <div className="flex justify-end">
                  <div
                    className="max-w-[80%] rounded-2xl px-5 py-3"
                    style={{ background: "var(--saathi-coral)", color: "#FFFFFF" }}
                  >
                    <p className="text-[15px] leading-[1.7] whitespace-pre-wrap">
                      {turn.user_message}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Saathi Bubble */}
              {turn.assistant_response && (
                <div className="flex justify-start">
                  <div
                    className="max-w-[80%] rounded-2xl px-5 py-3"
                    style={{ background: "var(--saathi-bg-card)", border: "1px solid var(--saathi-border)", color: "var(--saathi-text-dark)" }}
                  >
                    <p className="text-[11px] font-medium uppercase tracking-wider mb-1" style={{ color: "var(--saathi-text-soft)" }}>
                      Saathi
                    </p>
                    <p className="text-[15px] leading-[1.7] whitespace-pre-wrap">
                      {turn.assistant_response}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
          {turns.length === 0 && (
            <p className="text-center italic text-gray-400 py-10">No messages recorded for this session.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionTranscript;
