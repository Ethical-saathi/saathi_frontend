import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/auth/AuthProvider";

export type OnboardingMood = "struggling" | "anxious" | "okay" | "alright" | "good";

export interface OnboardingProfile {
  user_id: string;
  display_name: string;
  initial_mood: OnboardingMood | null;
  open_q_responses: string[];
  tone_preference: string | null;
  language: string;
  safety_contact_name: string | null;
  safety_contact_relationship: string | null;
  safety_contact_phone: string | null;
  onboarding_completed: boolean;
  created_at: string;
}

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

  const hasCompletedOnboarding = profile?.onboarding_completed === true;

  // Save name (Step 1)
  const saveName = useCallback(async (name: string) => {
    if (!user) return;

    const record = {
      user_id: user.id,
      display_name: name.trim(),
      initial_mood: null,
      open_q_responses: [] as string[],
      tone_preference: null,
      language: "English",
      safety_contact_name: null,
      safety_contact_relationship: null,
      safety_contact_phone: null,
      onboarding_completed: false,
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

    const responses = [...(profile.open_q_responses || [])];
    responses[questionIndex] = response;

    const { data, error } = await supabase
      .from("onboarding_profiles")
      .update({ open_q_responses: responses })
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

    const { data, error } = await supabase
      .from("onboarding_profiles")
      .update({
        safety_contact_name: name || null,
        safety_contact_relationship: relationship || null,
        safety_contact_phone: phone || null,
      })
      .eq("user_id", user.id)
      .select()
      .single();

    if (data) setProfile(data as OnboardingProfile);
    if (error) console.error("Error saving safety contact:", error);
  }, [user]);

  // Complete onboarding
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

    // Refresh auth profile to pick up new name
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
