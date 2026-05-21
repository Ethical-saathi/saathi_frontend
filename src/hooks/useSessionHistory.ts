import { useState, useEffect } from "react";

export type MoodType = 'calm' | 'mild_stress' | 'high_distress' | 'neutral';

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

const mockSessions: SessionData[] = [];
let globalMockSessions: SessionData[] = [...mockSessions];

export const useSessionHistory = (sessionId?: string) => {
  const [data, setData] = useState<SessionHistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData({
        totalCount: globalMockSessions.length,
        firstSessionMonth: "January 2026",
        sessions: globalMockSessions
      });
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [sessionId]);

  const deleteSession = async (id: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    globalMockSessions = globalMockSessions.filter(s => s.id !== id);
    if (data) {
      setData({
        ...data,
        totalCount: globalMockSessions.length,
        sessions: globalMockSessions
      });
    }
  };

  return { data, isLoading, deleteSession };
};

