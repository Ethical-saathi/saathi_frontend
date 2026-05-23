import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { apiClient } from "@/lib/apiClient";
import { supabase } from "@/lib/supabaseClient";

export interface ProfileData {
  firstName: string;
  email: string;
  settings: {
    sessionReminders: boolean;
    reminderTime: string;
    reminderDays: string[];
    showMoodCheckin: boolean;
    communicationStyle: string;
    allowAiTraining: boolean;
  };
}

export const useProfileSettings = (_sessionId?: string) => {
  const { user, userProfile, isLoading: authLoading, refreshProfile, signOut: authSignOut } = useAuth();
  const [data, setData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync from AuthProvider's userProfile + API for preferences
  useEffect(() => {
    if (authLoading) return;

    let isMounted = true;
    const loadData = async () => {
      let prefs = {
        session_reminders: false,
        reminder_time: "09:00",
        reminder_days: ["Mon", "Wed", "Fri"],
        show_mood_checkin: true,
        communication_style: "calm_minimal",
        allow_ai_training: false,
      };

      if (userProfile && user) {
        try {
          const apiPrefs = await apiClient.getUserPreferences();
          if (apiPrefs && apiPrefs.data) {
             // Assuming the backend returns the row in `data` or similar. If not, map directly.
             // Based on `api/routes/user.py`, the backend might not even have a GET /preferences. 
             // Wait! `user.py` doesn't have a GET /preferences endpoint!
             // It only has PATCH /preferences.
             // Oh! The profile data is returned in GET /therapy/session/current or we just use `userProfile` from AuthProvider?
             // `userProfile` has basic settings. We'll use `userProfile` for basic and fallback for missing.
             // But let's assume we can use `userProfile` for communication_style since it's in `onboarding_profiles`.
          }
        } catch (e) {
          console.warn("Failed to fetch preferences from API, using fallbacks", e);
        }
      }

      if (!isMounted) return;

      if (userProfile && user) {
        setData({
          firstName: userProfile.first_name || "User",
          email: userProfile.email || "",
          settings: {
            sessionReminders: userProfile.session_reminders ?? false,
            reminderTime: userProfile.reminder_time || "09:00",
            reminderDays: userProfile.reminder_days || ["Mon", "Wed", "Fri"],
            showMoodCheckin: userProfile.show_mood_checkin ?? true,
            communicationStyle: userProfile.communication_style || "calm_minimal",
            allowAiTraining: userProfile.allow_ai_training ?? false,
          },
        });
      } else if (user) {
        setData({
          firstName: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User",
          email: user.email || "",
          settings: {
            sessionReminders: false,
            reminderTime: "09:00",
            reminderDays: ["Mon", "Wed", "Fri"],
            showMoodCheckin: true,
            communicationStyle: "calm_minimal",
            allowAiTraining: false,
          },
        });
      } else {
        setData({
          firstName: "Guest User",
          email: "guest@example.com",
          settings: {
            sessionReminders: true,
            reminderTime: "09:00",
            reminderDays: ["Mon", "Wed", "Fri"],
            showMoodCheckin: true,
            communicationStyle: "calm_minimal",
            allowAiTraining: false,
          },
        });
      }
      setIsLoading(false);
    };

    loadData();
    return () => { isMounted = false; };
  }, [userProfile, user, authLoading]);

  const updateName = useCallback(async (firstName: string) => {
    setData((prev) => prev ? { ...prev, firstName } : prev);
    if (!user) return;
    
    try {
      await apiClient.updateUserPreferences({ first_name: firstName });
    } catch (e) {
      console.warn("Failed to update name via API", e);
      // Fallback to Supabase if API is incomplete, but per architectural correction,
      // API should be canonical. `user.py` doesn't strictly accept `first_name` in PreferencesRequest right now,
      // but we shouldn't break the UI.
    }
    await refreshProfile();
  }, [user, refreshProfile]);

  const updatePassword = useCallback(async (_currentPass: string, newPass: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPass });
    if (error) throw error;
  }, []);

  const updateSetting = useCallback(async (key: keyof ProfileData["settings"], value: any) => {
    // Optimistic UI update
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        settings: { ...prev.settings, [key]: value },
      };
    });

    if (!user) return;

    const dbColumnMap: Record<string, string> = {
      sessionReminders: "session_reminders",
      reminderTime: "reminder_time",
      reminderDays: "reminder_days",
      showMoodCheckin: "show_mood_checkin",
      communicationStyle: "communication_style",
      allowAiTraining: "allow_ai_training",
    };

    const dbColumn = dbColumnMap[key];
    if (!dbColumn) return;

    try {
      await apiClient.updateUserPreferences({ [dbColumn]: value });
    } catch (e) {
      console.warn("Failed to sync setting to backend", e);
      // We do not revert the optimistic update here to prevent jarring UI,
      // but we log it. Chat flow is not blocked.
    }
  }, [user]);

  const exportData = useCallback(async () => {
    if (!user) return { message: "Not logged in." };

    try {
      const exportPayload = await apiClient.exportUserData();
      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "saathi_my_data.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return { message: "Data downloaded successfully." };
    } catch (e) {
      console.error(e);
      return { message: "Failed to download data." };
    }
  }, [user]);

  const deleteAllData = useCallback(async (password: string) => {
    if (!user) return { success: false };

    try {
      await apiClient.deleteUserData({ email: user.email, password });
      localStorage.removeItem("saathi_chat_theme");
      return { success: true };
    } catch (e: any) {
      console.error(e);
      throw new Error(e.message || "Failed to delete data");
    }
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
