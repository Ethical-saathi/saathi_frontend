import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/auth/AuthProvider";

export interface ConsentRecord {
  user_id: string;
  layer1_agreed: boolean;
  layer1_timestamp: string | null;
  layer2_agreed: boolean;
  layer2_timestamp: string | null;
  layer2_withdrawn_at: string | null;
}

export const useConsent = () => {
  const { user } = useAuth();
  const [consent, setConsent] = useState<ConsentRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch existing consent record
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchConsent = async () => {
      const { data, error } = await supabase
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

  const hasCompletedConsent = consent?.layer1_agreed === true;

  // Save Layer 1 consent
  const saveLayer1 = useCallback(async () => {
    if (!user) return;

    const now = new Date().toISOString();
    const record = {
      user_id: user.id,
      layer1_agreed: true,
      layer1_timestamp: now,
      layer2_agreed: false,
      layer2_timestamp: null,
      layer2_withdrawn_at: null,
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

  // Save Layer 2 consent (optional AI training)
  const saveLayer2 = useCallback(async (agreed: boolean) => {
    if (!user) return;

    const now = new Date().toISOString();
    const update: Partial<ConsentRecord> = {
      layer2_agreed: agreed,
      layer2_timestamp: agreed ? now : null,
      layer2_withdrawn_at: !agreed && consent?.layer2_agreed ? now : null,
    };

    const { data, error } = await supabase
      .from("consent_records")
      .update(update)
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
  }, [user, consent]);

  // Toggle Layer 2 consent (for Settings page)
  const toggleLayer2 = useCallback(async () => {
    if (!consent) return;
    await saveLayer2(!consent.layer2_agreed);
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
