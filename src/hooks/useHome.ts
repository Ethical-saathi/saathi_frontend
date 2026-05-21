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

const MOCK_HISTORY: SessionHistoryItem[] = [];

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
        contextLine: "Welcome to your safe space. I am here whenever you're ready.",
        lastSession: null,
        insight: null,
        sessionCount: 0
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
