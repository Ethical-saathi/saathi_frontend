import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { SessionHistoryItem } from "./useChat";

export type MoodType = 'Struggling' | 'Anxious' | 'Okay' | 'Alright' | 'Good';

export interface HomeData {
  userName: string;
  contextLine: string;
  lastSession: {
    date: string;
    summary: string;
    openingMood: 'calm' | 'mild_stress' | 'high_distress' | 'neutral';
    closingMood: 'calm' | 'mild_stress' | 'high_distress' | 'neutral';
  } | null;
  insight: string | null;
  sessionCount: number;
}

// Reusing mock history from useChat for consistency in the Sidebar
const MOCK_HISTORY: SessionHistoryItem[] = [
  { id: "2", date: "Mar 16", summary: "Feeling stuck at work", isActive: false },
  { id: "3", date: "Mar 12", summary: "Anxiety about the presentation", isActive: false },
  { id: "4", date: "Feb 28", summary: "Reflecting on boundaries", isActive: false }
];

export const useHome = (sessionId: string) => {
  const { user, userProfile } = useAuth();
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Derive user's display name from auth context
  const userName = userProfile?.first_name
    || user?.user_metadata?.full_name
    || user?.user_metadata?.name
    || user?.email?.split("@")[0]
    || "there";

  useEffect(() => {
    // MOCK: GET /api/home?sessionId=xxx
    // TODO: Replace with real Supabase query when session tables are integrated
    const timer = setTimeout(() => {
      setHomeData({
        userName,
        contextLine: "Last time you talked about feeling overwhelmed at work. That was 3 days ago.",
        lastSession: {
          date: "March 16",
          summary: "You talked about work pressure and feeling like you're falling behind. Toward the end you mentioned wanting to take a small break this weekend.",
          openingMood: "mild_stress",
          closingMood: "calm"
        },
        insight: "You tend to feel lighter toward the end of your sessions.",
        sessionCount: 4
      });
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [sessionId, userName]);

  // Update userName in homeData if it changes (e.g., profile loaded after initial render)
  useEffect(() => {
    if (homeData && homeData.userName !== userName) {
      setHomeData(prev => prev ? { ...prev, userName } : prev);
    }
  }, [userName, homeData]);

  const submitMoodCheckin = useCallback((mood: MoodType) => {
    // MOCK: POST /api/home/mood-checkin
    console.log("POST /api/home/mood-checkin", { sessionId, mood });
  }, [sessionId]);

  return {
    homeData,
    isLoading,
    submitMoodCheckin,
    sessionHistory: MOCK_HISTORY
  };
};
