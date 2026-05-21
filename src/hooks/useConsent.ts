import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/auth/AuthProvider";

// ─── Matches actual DB schema in consent_records table ───
export interface ConsentRecord {
  user_id: string;
  core_consent: boolean;
  ai_training_consent: boolean;
  is_minor: boolean;
  guardian_consent: boolean;
  timestamp: string | null;
  consent_version: string | null;
  ip_address: string | null;
}

export const useConsent = () => {
  const { user } = useAuth();
  const [consent, setConsent] = useState<ConsentRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchConsent = async () => {
      const { data } = await supabase
        .from("consent_records")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        setConsent(data as ConsentRecord);
      }
      setIsLoading(false);
    };

    fetchConsent();
  }, [user]);

  // Layer 1 = core_consent (required)
  const hasCompletedConsent = consent?.core_consent === true;

  // Save Layer 1 consent (core_consent = true, mandatory)
  const saveLayer1 = useCallback(async () => {
    if (!user) return;

    const now = new Date().toISOString();
    const record = {
      user_id: user.id,
      core_consent: true,
      ai_training_consent: false,
      is_minor: false,
      guardian_consent: false,
      timestamp: now,
      consent_version: "v1.0",
      ip_address: null,
    };

    const { data, error } = await supabase
      .from("consent_records")
      .upsert(record, { onConflict: "user_id" })
      .select()
      .single();

    if (data) {
      setConsent(data as ConsentRecord);
    }
    if (error) {
      console.error("Error saving Layer 1 consent:", error);
      throw error;
    }
  }, [user]);

  // Save Layer 2 consent (ai_training_consent, optional)
  const saveLayer2 = useCallback(async (agreed: boolean) => {
    if (!user) return;

    const { data, error } = await supabase
      .from("consent_records")
      .update({ ai_training_consent: agreed })
      .eq("user_id", user.id)
      .select()
      .single();

    if (data) {
      setConsent(data as ConsentRecord);
    }
    if (error) {
      console.error("Error saving Layer 2 consent:", error);
      throw error;
    }
  }, [user]);

  const toggleLayer2 = useCallback(async () => {
    if (!consent) return;
    await saveLayer2(!consent.ai_training_consent);
  }, [consent, saveLayer2]);

  return {
    consent,
    isLoading,
    hasCompletedConsent,
    saveLayer1,
    saveLayer2,
    toggleLayer2,
  };
};
