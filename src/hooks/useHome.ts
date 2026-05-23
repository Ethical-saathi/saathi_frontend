import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { apiClient } from "@/lib/apiClient";

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

export const useHome = (sessionId: string) => {
  const { user, userProfile } = useAuth();
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // STRICT PREFERRED NAME EXTRACTION
  const userName = userProfile?.preferred_name
    || userProfile?.first_name
    || user?.user_metadata?.given_name
    || (user?.user_metadata?.full_name ? user.user_metadata.full_name.split(" ")[0] : null)
    || "Friend";

  useEffect(() => {
    let isMounted = true;
    
    Promise.all([
      apiClient.fetchSessions(),
      apiClient.fetchTrends()
    ]).then(([sessionsData, trendsData]) => {
      if (!isMounted) return;
      
      const sessions = sessionsData?.sessions || [];
      const sessionCount = sessions.length; // Canonical DB Count
      
      let lastSession = null;
      if (sessions.length > 0) {
        const last = sessions[0];
        const dateStr = new Date(last.created_at).toLocaleDateString("en-IN", {
          month: "short", day: "numeric"
        });
        
        lastSession = {
          date: dateStr,
          summary: last.summary_text || "A session focused on reflection and understanding.",
          openingMood: last.mood_start || "neutral",
          closingMood: "calm"
        };
      }
      
      const notices = trendsData?.notices || [];
      const insight = notices.length > 0 ? notices[0] : null;

      setHomeData({
        userName,
        contextLine: "Welcome to your safe space. I am here whenever you're ready.",
        lastSession,
        insight,
        sessionCount
      });
      setIsLoading(false);
    }).catch(err => {
      console.error("Failed to load home data", err);
      if (isMounted) {
        setHomeData({
          userName,
          contextLine: "Welcome to your safe space. I am here whenever you're ready.",
          lastSession: null,
          insight: null,
          sessionCount: 0
        });
        setIsLoading(false);
      }
    });

    return () => { isMounted = false; };
  }, [sessionId, userName]);

  const submitMoodCheckin = useCallback((mood: MoodType) => {
    localStorage.setItem("saathi_pre_session_mood", mood);
  }, []);

  return {
    homeData,
    isLoading,
    submitMoodCheckin,
    sessionHistory: []
  };
};
