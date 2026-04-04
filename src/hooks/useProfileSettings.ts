import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/auth/AuthProvider";

export interface ProfileData {
  firstName: string;
  email: string;
  settings: {
    sessionReminders: boolean;
    reminderTime: string;
    reminderDays: string[];
    showMoodCheckin: boolean;
  };
}

export const useProfileSettings = (_sessionId?: string) => {
  const { user, userProfile, isLoading: authLoading, refreshProfile, signOut: authSignOut } = useAuth();
  const [data, setData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync from AuthProvider's userProfile
  useEffect(() => {
    if (authLoading) return; // wait for auth to finish loading

    if (userProfile) {
      setData({
        firstName: userProfile.first_name || "User",
        email: userProfile.email || "",
        settings: {
          sessionReminders: userProfile.session_reminders ?? false,
          reminderTime: userProfile.reminder_time || "09:00",
          reminderDays: userProfile.reminder_days || ["Mon", "Wed", "Fri"],
          showMoodCheckin: userProfile.show_mood_checkin ?? true,
        },
      });
      setIsLoading(false);
    } else if (user) {
      // Profile hasn't loaded from DB yet, build fallback from auth user metadata
      setData({
        firstName: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User",
        email: user.email || "",
        settings: {
          sessionReminders: false,
          reminderTime: "09:00",
          reminderDays: ["Mon", "Wed", "Fri"],
          showMoodCheckin: true,
        },
      });
      setIsLoading(false);
    } else {
      // Not logged in
      setData(null);
      setIsLoading(false);
    }
  }, [userProfile, user, authLoading]);

  const updateName = useCallback(async (firstName: string) => {
    if (!user) return;
    const { error } = await supabase
      .from("user_profiles")
      .update({ first_name: firstName, updated_at: new Date().toISOString() })
      .eq("user_id", user.id);

    if (error) throw error;

    setData((prev) => prev ? { ...prev, firstName } : prev);
    await refreshProfile();
  }, [user, refreshProfile]);

  const updatePassword = useCallback(async (_currentPass: string, newPass: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPass });
    if (error) throw error;
  }, []);

  const updateSetting = useCallback(async (key: keyof ProfileData["settings"], value: any) => {
    if (!user) return;

    const dbColumnMap: Record<string, string> = {
      sessionReminders: "session_reminders",
      reminderTime: "reminder_time",
      reminderDays: "reminder_days",
      showMoodCheckin: "show_mood_checkin",
    };

    const dbColumn = dbColumnMap[key];
    if (!dbColumn) return;

    const { error } = await supabase
      .from("user_profiles")
      .update({ [dbColumn]: value, updated_at: new Date().toISOString() })
      .eq("user_id", user.id);

    if (error) throw error;

    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        settings: { ...prev.settings, [key]: value },
      };
    });
  }, [user]);

  const exportData = useCallback(async () => {
    if (!user) return { message: "Not logged in." };

    const { data: profileData } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    const exportPayload = {
      profile: profileData,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mindease_my_data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return { message: "Data downloaded successfully." };
  }, [user]);

  const deleteAllData = useCallback(async () => {
    if (!user) return { success: false };

    const { error } = await supabase
      .from("user_profiles")
      .delete()
      .eq("user_id", user.id);

    if (error) throw error;
    localStorage.removeItem("mindease_chat_theme");
    return { success: true };
  }, [user]);

  const signOut = useCallback(async () => {
    await authSignOut();
  }, [authSignOut]);

  return {
    data,
    isLoading,
    updateName,
    updatePassword,
    updateSetting,
    exportData,
    deleteAllData,
    signOut,
  };
};
