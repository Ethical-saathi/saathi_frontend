import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/auth/AuthProvider";

// ─── Matches actual DB schema in onboarding_profiles table ───
export interface OnboardingProfile {
  user_id: string;
  timestamp: string | null;
  depression_score: number | null;
  anxiety_score: number | null;
  escalation_flag: boolean;
  escalation_reason: string | null;
  crisis_flag: boolean;
  raw_answers_json: any[] | null;
  path_b_scores_json: any[] | null;
  severity_tier: string | null;
  vad_v: number | null;
  vad_a: number | null;
  vad_d: number | null;
  tone_instruction: string | null;
  // Frontend-only fields (stored in DB for flow tracking)
  display_name: string | null;
  initial_mood: string | null;
  onboarding_completed: boolean;
}

export type OnboardingMood = "struggling" | "anxious" | "okay" | "alright" | "good";

export const useOnboarding = () => {
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState<OnboardingProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      const { data } = await supabase
        .from("onboarding_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        setProfile(data as OnboardingProfile);
      }
      setIsLoading(false);
    };

    fetchProfile();
  }, [user]);

  // Onboarding is complete when the record exists AND onboarding_completed = true
  const hasCompletedOnboarding = profile?.onboarding_completed === true;

  // Save display name (Step 1) — creates the onboarding_profiles row
  const saveName = useCallback(async (name: string) => {
    if (!user) return;

    const record = {
      user_id: user.id,
      display_name: name.trim(),
      onboarding_completed: false,
      // Initialize required backend columns with defaults
      depression_score: null,
      anxiety_score: null,
      escalation_flag: false,
      escalation_reason: null,
      crisis_flag: false,
      raw_answers_json: [],
      path_b_scores_json: [],
      severity_tier: null,
      vad_v: null,
      vad_a: null,
      vad_d: null,
      tone_instruction: null,
      initial_mood: null,
      timestamp: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("onboarding_profiles")
      .upsert(record, { onConflict: "user_id" })
      .select()
      .single();

    if (data) setProfile(data as OnboardingProfile);
    if (error) console.error("Error saving name:", error);

    // Also update user_profiles display name
    await supabase
      .from("user_profiles")
      .update({ first_name: name.trim(), updated_at: new Date().toISOString() })
      .eq("user_id", user.id);

    return data;
  }, [user]);

  // Save mood (Step 2)
  const saveMood = useCallback(async (mood: OnboardingMood) => {
    if (!user) return;

    const { data, error } = await supabase
      .from("onboarding_profiles")
      .update({ initial_mood: mood })
      .eq("user_id", user.id)
      .select()
      .single();

    if (data) setProfile(data as OnboardingProfile);
    if (error) console.error("Error saving mood:", error);
  }, [user]);

  // Save open question response (Steps 3-5)
  const saveResponse = useCallback(async (questionIndex: number, response: string) => {
    if (!user || !profile) return;

    const responses = [...(profile.raw_answers_json || [])];
    responses[questionIndex] = { question: questionIndex, answer: response };

    const { data, error } = await supabase
      .from("onboarding_profiles")
      .update({ raw_answers_json: responses })
      .eq("user_id", user.id)
      .select()
      .single();

    if (data) setProfile(data as OnboardingProfile);
    if (error) console.error("Error saving response:", error);
  }, [user, profile]);

  // Save safety contact (Step 6)
  const saveSafetyContact = useCallback(async (
    name: string | null,
    relationship: string | null,
    phone: string | null
  ) => {
    if (!user) return;

    // Store safety contact inside raw_answers_json as a special entry
    const existing = [...(profile?.raw_answers_json || [])];
    const safetyEntry = { safety_contact: { name, relationship, phone } };
    const updatedAnswers = existing.filter((e: any) => !e.safety_contact);
    updatedAnswers.push(safetyEntry);

    const { data, error } = await supabase
      .from("onboarding_profiles")
      .update({ raw_answers_json: updatedAnswers })
      .eq("user_id", user.id)
      .select()
      .single();

    if (data) setProfile(data as OnboardingProfile);
    if (error) console.error("Error saving safety contact:", error);
  }, [user, profile]);

  // Complete onboarding — marks flow as done
  const completeOnboarding = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("onboarding_profiles")
      .update({ onboarding_completed: true })
      .eq("user_id", user.id)
      .select()
      .single();

    if (data) setProfile(data as OnboardingProfile);
    if (error) console.error("Error completing onboarding:", error);

    await refreshProfile();
  }, [user, refreshProfile]);

  return {
    profile,
    isLoading,
    hasCompletedOnboarding,
    saveName,
    saveMood,
    saveResponse,
    saveSafetyContact,
    completeOnboarding,
  };
};
