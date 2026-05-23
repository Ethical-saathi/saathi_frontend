import { useState, useEffect } from "react";
import { apiClient } from "@/lib/apiClient";

export type MoodType = 'calm' | 'mild_stress' | 'high_distress' | 'neutral' | 'Okay';

export interface TranscriptItem {
  sender: 'saathi' | 'user';
  text: string;
  hasBreakAfter?: boolean;
  timestamp?: string;
}

export interface SessionData {
  id: string;
  date: string;
  monthGroup: string;
  title: string;
  summary: string;
  openingMood: MoodType;
  closingMood: MoodType;
  transcript: TranscriptItem[];
}

export interface SessionHistoryResponse {
  totalCount: number;
  firstSessionMonth: string;
  sessions: SessionData[];
}

export const useSessionHistory = (sessionId?: string) => {
  const [data, setData] = useState<SessionHistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const result = await apiClient.fetchSessions();
        if (!isMounted) return;

        const backendSessions = result.sessions || [];
        
        const formattedSessions: SessionData[] = backendSessions.map((s: any) => {
          const dt = new Date(s.created_at);
          return {
            id: s.session_id,
            date: dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            monthGroup: dt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            title: s.dominant_themes?.length ? `Themes: ${s.dominant_themes.join(', ')}` : "Therapy Session",
            summary: s.summary_text || "No summary available.",
            openingMood: (s.mood_start || "Okay") as MoodType,
            closingMood: "calm" as MoodType, // Or map from emotional_arc
            transcript: [] // Transcript fetched on-demand if needed
          };
        });

        // Backend returns descending by created_at
        setData({
          totalCount: formattedSessions.length,
          firstSessionMonth: formattedSessions.length > 0 
            ? formattedSessions[formattedSessions.length - 1].monthGroup 
            : "No sessions",
          sessions: formattedSessions
        });
      } catch (error) {
        console.error("Failed to fetch session history:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchHistory();
    return () => { isMounted = false; };
  }, [sessionId]);

  const deleteSession = async (id: string) => {
    // API deletion endpoint not implemented yet, just optimistic UI update
    if (data) {
      setData({
        ...data,
        totalCount: data.totalCount - 1,
        sessions: data.sessions.filter(s => s.id !== id)
      });
    }
  };

  return { data, isLoading, deleteSession };
};

