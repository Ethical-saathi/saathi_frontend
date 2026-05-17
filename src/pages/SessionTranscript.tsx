import { useParams, useNavigate } from "react-router-dom";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import { ArrowLeft } from "lucide-react";
import { MoodDotArc } from "@/components/ui/MoodDotArc";

const SessionTranscript = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useSessionHistory(sessionId);

  if (isLoading || !data) {
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

  const session = data.sessions.find((s) => s.id === sessionId);
  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p style={{ color: "var(--saathi-text-soft)" }}>Session not found.</p>
      </div>
    );
  }

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
            {session.date}
          </p>
          <h1 className="text-[24px] font-medium mb-4" style={{ color: "var(--saathi-text-dark)" }}>
            {session.title}
          </h1>
          <div className="inline-block">
            <MoodDotArc openingMood={session.openingMood} closingMood={session.closingMood} />
          </div>
        </div>

        {/* Transcript */}
        <div className="flex flex-col gap-4">
          {session.transcript.map((msg, i) => (
            <div key={i}>
              <div
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[80%] rounded-2xl px-5 py-3"
                  style={{
                    background:
                      msg.sender === "saathi"
                        ? "var(--saathi-bg-card)"
                        : "var(--saathi-coral)",
                    color:
                      msg.sender === "saathi"
                        ? "var(--saathi-text-dark)"
                        : "#FFFFFF",
                    border:
                      msg.sender === "saathi"
                        ? "1px solid var(--saathi-border)"
                        : "none",
                  }}
                >
                  {msg.sender === "saathi" && (
                    <p
                      className="text-[11px] font-medium uppercase tracking-wider mb-1"
                      style={{ color: "var(--saathi-text-soft)" }}
                    >
                      Saathi
                    </p>
                  )}
                  <p className="text-[15px] leading-[1.7] whitespace-pre-wrap">
                    {msg.text}
                  </p>
                  {msg.timestamp && (
                    <p
                      className="text-[11px] mt-1 opacity-60"
                      style={{
                        color: msg.sender === "saathi" ? "var(--saathi-text-soft)" : "rgba(255,255,255,0.7)",
                      }}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              </div>

              {msg.hasBreakAfter && (
                <div className="flex items-center gap-3 py-4">
                  <div className="flex-1 h-px" style={{ background: "var(--saathi-border)" }} />
                  <span className="text-[11px] italic" style={{ color: "var(--saathi-text-soft)" }}>
                    pause
                  </span>
                  <div className="flex-1 h-px" style={{ background: "var(--saathi-border)" }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Rating */}
        <div className="mt-12 text-center">
          <p className="text-[14px] mb-4" style={{ color: "var(--saathi-text-mid)" }}>
            How did this session feel?
          </p>
          <div className="flex justify-center gap-4">
            {["😟", "😕", "😐", "🙂", "😊"].map((emoji, i) => (
              <button
                key={i}
                className="w-12 h-12 rounded-full flex items-center justify-center text-[20px] transition-all duration-200 hover:scale-110"
                style={{
                  border: "1.5px solid var(--saathi-border)",
                  background: "var(--saathi-bg-card)",
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionTranscript;
