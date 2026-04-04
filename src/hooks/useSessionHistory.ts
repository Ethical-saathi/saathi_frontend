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

// Mock data
const mockSessions: SessionData[] = [
  {
    id: "session_103",
    date: "Tuesday, March 15",
    monthGroup: "March 2026",
    title: "Work pressure and needing a break",
    summary: "You shared feeling overwhelmed with upcoming deadlines. We practiced a quick grounding exercise, which seemed to help lower the acute stress before ending the session.",
    openingMood: "high_distress",
    closingMood: "mild_stress",
    transcript: [
      { sender: "saathi", text: "Hi there. I've got your space ready. How are you feeling as we start today?", timestamp: "2026-03-15T18:00:00Z" },
      { sender: "user", text: "Honestly, really overwhelmed. The project at work is due on Friday and I feel like I'm drowning.", timestamp: "2026-03-15T18:01:20Z" },
      { sender: "saathi", text: "I hear that. It sounds like the pressure is building up fast. Before we try to untangle the project details, would you be open to just taking a 60-second breathing pause with me?", timestamp: "2026-03-15T18:01:45Z" },
      { sender: "user", text: "Yeah, okay. I could use that.", hasBreakAfter: true, timestamp: "2026-03-15T18:02:10Z" },
      { sender: "saathi", text: "Great. Breathe in... and out... just letting your shoulders drop a little. Let's start with just one thing that's on your plate right now.", timestamp: "2026-03-15T18:03:30Z" },
      { sender: "user", text: "The presentation slides are the biggest stressor.", timestamp: "2026-03-15T18:04:15Z" },
      { sender: "saathi", text: "Okay, the slides. What's the smallest step you can take on them tonight without burning out?", timestamp: "2026-03-15T18:14:00Z" }
    ]
  },
  {
    id: "session_102",
    date: "Saturday, March 12",
    monthGroup: "March 2026",
    title: "A better day than expected",
    summary: "A brief check-in where you noted feeling more balanced after spending time outdoors. We kept it short to let you enjoy the evening.",
    openingMood: "neutral",
    closingMood: "calm",
    transcript: [
      { sender: "saathi", text: "Welcome back. How has your weekend been so far?", timestamp: "2026-03-12T14:30:00Z" },
      { sender: "user", text: "Actually, pretty good. I went for a hike this morning and it really cleared my head.", timestamp: "2026-03-12T14:31:30Z" },
      { sender: "saathi", text: "That's wonderful to hear. Nature has such a gentle way of resetting our minds. Are you feeling ready for the rest of the evening?", timestamp: "2026-03-12T14:31:55Z" },
      { sender: "user", text: "Yes, I think I'll just relax with a book. No big plans.", timestamp: "2026-03-12T14:33:10Z" },
      { sender: "saathi", text: "Sounds perfect. Enjoy your reading, and I'll be here whenever you need.", timestamp: "2026-03-12T14:35:00Z" }
    ]
  },
  {
    id: "session_101",
    date: "Monday, February 28",
    monthGroup: "February 2026",
    title: "Morning anxiety and preparing for the week",
    summary: "You woke up with some chest tightness regarding the week ahead. We mapped out your main priorities, which helped turn the anxiety into a manageable checklist.",
    openingMood: "mild_stress",
    closingMood: "neutral",
    transcript: [
      { sender: "saathi", text: "Good morning. How are you feeling as you start your week?", timestamp: "2026-02-28T08:00:00Z" },
      { sender: "user", text: "Woke up with that familiar chest tightness. I just have so much to do.", timestamp: "2026-02-28T08:02:15Z" },
      { sender: "saathi", text: "I understand. That Sunday-night anxiety can definitely carry over into Monday. What if we just list out the top three things, and ignore the rest for now?", timestamp: "2026-02-28T08:03:00Z" },
      { sender: "user", text: "Okay. 1. Email the client. 2. Finish the report draft. 3. Call my mom.", timestamp: "2026-02-28T08:05:40Z" },
      { sender: "saathi", text: "That's a solid, manageable list. The rest can wait. How does the chest tightness feel looking at just those three?", timestamp: "2026-02-28T08:06:10Z" },
      { sender: "user", text: "A bit better. Like I can actually do this.", timestamp: "2026-02-28T08:18:00Z" }
    ]
  },
  {
    id: "session_100",
    date: "Wednesday, January 10",
    monthGroup: "January 2026",
    title: "First steps on the journey",
    summary: "Our very first session. You expressed a desire to find more moments of peace in your daily routine.",
    openingMood: "neutral",
    closingMood: "calm",
    transcript: [
      { sender: "saathi", text: "Hello. I'm Saathi. I'm so glad we're starting this journey together. What brought you here today?", timestamp: "2026-01-10T19:00:00Z" },
      { sender: "user", text: "I just need a place to vent sometimes. My thoughts get too loud.", timestamp: "2026-01-10T19:02:30Z" },
      { sender: "saathi", text: "This space is exactly for that. You can share as much or as little as you want. There's no pressure here.", timestamp: "2026-01-10T19:03:10Z" },
      { sender: "user", text: "Thanks. That's good to know.", timestamp: "2026-01-10T19:22:00Z" }
    ]
  }
];

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

