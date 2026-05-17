import { useSessionHistory } from "@/hooks/useSessionHistory";
import { TimelineView } from "@/components/session-history/TimelineView";
import { useNavigate } from "react-router-dom";

const SessionHistory = () => {
  const { data, isLoading, deleteSession } = useSessionHistory();
  const navigate = useNavigate();

  // Skeleton loading
  if (isLoading || !data) {
    return (
      <div className="flex-1 overflow-y-auto px-6 md:px-12 py-10">
        <div className="max-w-2xl mx-auto">
          <div className="saathi-skeleton h-10 w-80 mb-4" />
          <div className="saathi-skeleton h-5 w-56 mb-12" />
          <div className="saathi-skeleton h-64 w-full mb-8 rounded-3xl" />
          <div className="saathi-skeleton h-48 w-full mb-6 rounded-3xl" />
          <div className="saathi-skeleton h-48 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto w-full pb-20">
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-10 md:py-16">
        <TimelineView
          sessions={data.sessions}
          totalCount={data.totalCount}
          firstSessionMonth={data.firstSessionMonth}
          onSelectSession={(id) => navigate(`/history/${id}`)}
          onDeleteSession={deleteSession}
        />
      </div>
    </div>
  );
};

export default SessionHistory;
