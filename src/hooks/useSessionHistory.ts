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
  sessionNumber: number;
  themes: string[];
  keyMoment?: string;
  sessionTone?: string;
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
          
          // Humanize and cap themes to 2
          const rawThemes = Array.isArray(s.themes) ? s.themes : [];
          const THEME_HUMANIZER: Record<string, string> = {
            "existential_crisis": "existential uncertainty",
            "fear_of_death": "fears around mortality",
            "social_isolation": "social isolation",
            "imposter_syndrome": "feelings of inadequacy",
            "family_conflict": "family dynamics",
            "burnout": "emotional exhaustion",
            "abandonment_issues": "fears of abandonment",
            "perfectionism": "high self-expectations",
            "grief": "grief and loss",
            "anxiety": "feelings of anxiety"
          };
          const humanizedThemes = rawThemes
            .map(t => THEME_HUMANIZER[t] || t.replace(/_/g, " "))
            .slice(0, 2);

          // Get top key moment
          let topMomentText = undefined;
          if (Array.isArray(s.key_moments) && s.key_moments.length > 0) {
            const sortedMoments = [...s.key_moments].sort((a, b) => (b.score || 0) - (a.score || 0));
            topMomentText = sortedMoments[0].text;
          }

          return {
            id: s.session_id,
            date: dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
            monthGroup: dt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            title: s.dominant_themes?.length ? `Themes: ${s.dominant_themes.join(', ')}` : "Therapy Session",
            summary: s.summary_text || "No summary available.",
            openingMood: (s.mood_start || "Okay") as MoodType,
            closingMood: "calm" as MoodType,
            transcript: [], // Transcript fetched on-demand
            sessionNumber: s.session_number || 1,
            themes: humanizedThemes,
            keyMoment: topMomentText,
            sessionTone: s.session_tone
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

