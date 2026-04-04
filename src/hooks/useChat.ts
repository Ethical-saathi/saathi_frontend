import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export type SenderType = "saathi" | "user";
export type EmotionalState = "calm" | "mild_stress" | "high_distress" | "neutral";

export interface ChatMessage {
  id: string;
  sender: SenderType;
  text: string;
  timestamp: Date;
}

export interface SessionHistoryItem {
  id: string;
  date: string;
  summary: string;
  isActive: boolean;
}

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [emotionalState, setEmotionalState] = useState<EmotionalState>("neutral");
  
  const [showSummaryOverlay, setShowSummaryOverlay] = useState(false);
  const [showPauseNotification, setShowPauseNotification] = useState(false);
  const [showGuestSave, setShowGuestSave] = useState(false);
  
  // Hardcoded mock session history for now
  const [sessionHistory] = useState<SessionHistoryItem[]>([
    { id: "active", date: "Today", summary: "Current session", isActive: true },
    { id: "2", date: "Mar 16", summary: "Feeling stuck at work", isActive: false },
    { id: "3", date: "Mar 12", summary: "Anxiety about the presentation", isActive: false },
    { id: "4", date: "Feb 28", summary: "Reflecting on boundaries", isActive: false }
  ]);

  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Restart 8-minute idle timer automatically whenever messages arrive or user types
  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    setShowPauseNotification(false);
    
    // 8 minutes = 480000ms
    idleTimerRef.current = setTimeout(() => {
      setShowPauseNotification(true);
    }, 480000);
  }, []);
  
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as any;

  // Initialization: Fetch opening message
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // MOCK: GET /api/session/opening-message
    setIsTyping(true);
    const initTimer = setTimeout(() => {
      setIsTyping(false);
      const userName = state?.userName || "Friend";
      const mood = state?.mood || "okay";
      const isEscalationReturn = state?.escalationReturn || false;
      const isReturningUser = state?.isReturningUser || false;
      const contextLine = state?.contextLine || "";

      let firstMessageText = `Hi ${userName}. I've got your space ready. I noticed you're feeling ${mood.toLowerCase()} right now. How would you like to begin?`;
      if (isEscalationReturn) {
        firstMessageText = "I'm here for you. Take all the time you need.";
      } else if (isReturningUser) {
        firstMessageText = `Welcome back, ${userName}. Last time we talked, ${contextLine.toLowerCase() || 'we explored some of your thoughts'}. How are things feeling today?`;
      }

      setMessages([
        {
          id: crypto.randomUUID(),
          sender: "saathi",
          text: firstMessageText,
          timestamp: new Date()
        }
      ]);
      setEmotionalState("calm");
      resetIdleTimer();
    }, 1200);

    return () => {
      clearTimeout(initTimer);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleTimer]);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    // 1. Add user message immediately
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text: text.trim(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    resetIdleTimer();

    // 2. Start exact 1500ms delay before showing typing indicator
    setTimeout(() => {
      setIsTyping(true);
      
      // 3. Fire mock POST /api/chat/message (takes ~1-2 seconds after typing starts)
      setTimeout(() => {
        setIsTyping(false);
        
        // Mock response branching based on keywords for demonstration
        let replyStr = "I hear you. Tell me a bit more about what that feels like right now.";
        let nextState: EmotionalState = "calm";
        let escalate = false;

        const crisisKeywords = ["self harm", "suicide", "hopeless", "end it all", "kill myself", "worthless", "die", "hurt myself", "panic", "cant breathe"];
        const lowerText = text.toLowerCase();
        if (crisisKeywords.some(kw => lowerText.includes(kw))) {
          replyStr = "That sounds incredibly overwhelming. I'm right here with you.";
          nextState = "high_distress";
          escalate = true;
        } else if (lowerText.includes("nervous") || lowerText.includes("stress")) {
          replyStr = "It makes complete sense that you're feeling tense about this.";
          nextState = "mild_stress";
        } else if (lowerText.includes("good") || lowerText.includes("better")) {
          replyStr = "I'm really glad to hear there's some lightness today.";
          nextState = "calm";
        }

        const saathiMsg: ChatMessage = {
          id: crypto.randomUUID(),
          sender: "saathi",
          text: replyStr,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, saathiMsg]);
        setEmotionalState(nextState);
        
        // Show "Save & Continue" for guests at 10 messages
        const currentUserMsgCount = messages.filter(m => m.sender === "user").length;
        if (!state?.isReturningUser && currentUserMsgCount + 1 === 10) {
          setShowGuestSave(true);
        }

        if (escalate) {
          escalateToSupport();
        }

      }, 1500 + Math.random() * 1000); // Server processing time
    }, 1500); // Strict 1500ms before typing indicator appears

  }, [resetIdleTimer]);

  const endSession = useCallback(() => {
    // Mock Session End API
    setShowSummaryOverlay(true);
  }, []);

  const escalateToSupport = useCallback(() => {
    const sessionId = state?.sessionId || crypto.randomUUID();
    const userName = state?.userName || "Friend";
    const mood = state?.mood || null;
    navigate("/escalation", { 
      state: { entryPoint: "escalation", sessionId, userName, mood } 
    });
  }, [navigate, state]);

  return {
    messages,
    isTyping,
    inputValue,
    setInputValue,
    emotionalState,
    sessionHistory,
    sendMessage,
    endSession,
    showSummaryOverlay,
    setShowSummaryOverlay,
    showPauseNotification,
    setShowPauseNotification,
    showGuestSave,
    setShowGuestSave,
    escalateToSupport,
    resetIdleTimer,
    userName: state?.userName || "Friend",
    isReturningUser: !!state?.isReturningUser
  };
};
