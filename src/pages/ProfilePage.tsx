import { useAuth } from "@/components/auth/AuthProvider";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useState } from "react";
import { Shield, Calendar, MessageCircle, User, Edit2, X, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { apiClient } from "@/lib/apiClient";

const ProfilePage = () => {
  const { user, userProfile } = useAuth();
  const { profile: onboardingProfile } = useOnboarding();

  const [editingSafety, setEditingSafety] = useState(false);
  const [safetyName, setSafetyName] = useState(onboardingProfile?.safety_contact_name || "");
  const [safetyRel, setSafetyRel] = useState(onboardingProfile?.safety_contact_relationship || "");
  const [safetyPhone, setSafetyPhone] = useState(onboardingProfile?.safety_contact_phone || "");

  const [totalSessions, setTotalSessions] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (user) {
      apiClient.getUserStats()
        .then(data => {
          if (isMounted && data) {
            setTotalSessions(data.total_sessions);
          }
        })
        .catch(err => {
          console.error("Failed to load user stats", err);
          if (isMounted) setTotalSessions(0);
        });
    }
    return () => { isMounted = false; };
  }, [user]);

  const displayName = userProfile?.first_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const email = user?.email || "";
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "—";

  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex-1 overflow-y-auto w-full pb-20">
      <div className="max-w-2xl mx-auto px-6 md:px-12 py-10 md:py-16">
        {/* Avatar & Name */}
        <div className="flex flex-col items-center mb-10">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-[32px] font-semibold text-white mb-4"
            style={{ background: "var(--saathi-coral)" }}
          >
            {initial}
          </div>
          <h1 className="text-[24px] font-medium" style={{ color: "var(--saathi-text-dark)" }}>
            {displayName}
          </h1>
          <p className="text-[14px] mt-1" style={{ color: "var(--saathi-text-soft)" }}>
            {email}
          </p>
        </div>

        {/* Stats Row */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="saathi-card p-5 text-center flex-1">
            <Calendar size={20} className="mx-auto mb-2" style={{ color: "var(--saathi-coral)" }} />
            <p className="text-[12px] uppercase tracking-wider mb-1" style={{ color: "var(--saathi-text-soft)" }}>
              Member since
            </p>
            <p className="text-[16px] font-medium" style={{ color: "var(--saathi-text-dark)" }}>
              {memberSince}
            </p>
          </div>
          <div className="saathi-card p-5 text-center flex-1">
            <MessageCircle size={20} className="mx-auto mb-2" style={{ color: "var(--saathi-coral)" }} />
            <p className="text-[12px] uppercase tracking-wider mb-1" style={{ color: "var(--saathi-text-soft)" }}>
              Total sessions
            </p>
            <p className="text-[16px] font-medium" style={{ color: "var(--saathi-text-dark)" }}>
              {totalSessions === null ? (
                <span className="inline-block w-4 h-4 border-2 border-[var(--saathi-coral)] border-t-transparent rounded-full animate-spin"></span>
              ) : (
                totalSessions
              )}
            </p>
          </div>
        </div>

        {/* Safety Contact */}
        <div className="mb-10">
          <p
            className="text-[12px] font-medium tracking-[0.1em] uppercase mb-4 px-1"
            style={{ color: "var(--saathi-text-soft)" }}
          >
            Emergency Safety Contact
          </p>
          <div className="saathi-card p-6">
            {!editingSafety ? (
              <>
                {onboardingProfile?.safety_contact_name ? (
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[16px] font-medium" style={{ color: "var(--saathi-text-dark)" }}>
                        {onboardingProfile.safety_contact_name}
                      </p>
                      {onboardingProfile.safety_contact_relationship && (
                        <p className="text-[13px] mt-0.5" style={{ color: "var(--saathi-text-mid)" }}>
                          {onboardingProfile.safety_contact_relationship}
                        </p>
                      )}
                      {onboardingProfile.safety_contact_phone && (
                        <a
                          href={`tel:${onboardingProfile.safety_contact_phone}`}
                          className="text-[14px] mt-1 inline-block"
                          style={{ color: "var(--saathi-coral)" }}
                        >
                          {onboardingProfile.safety_contact_phone}
                        </a>
                      )}
                    </div>
                    <button
                      onClick={() => setEditingSafety(true)}
                      className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                      style={{ color: "var(--saathi-text-soft)" }}
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-3">
                    <Shield size={24} className="mb-3" style={{ color: "var(--saathi-coral-light)" }} />
                    <p className="text-[14px] mb-3 text-center" style={{ color: "var(--saathi-text-mid)" }}>
                      Adding an emergency contact is optional, but it helps us keep you safe.
                    </p>
                    <button
                      onClick={() => setEditingSafety(true)}
                      className="saathi-btn-outline text-[13px] px-4 py-2 h-auto"
                    >
                      Add safety contact
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  value={safetyName}
                  onChange={(e) => setSafetyName(e.target.value)}
                  placeholder="Contact name"
                  className="saathi-input"
                />
                <input
                  type="text"
                  value={safetyRel}
                  onChange={(e) => setSafetyRel(e.target.value)}
                  placeholder="Relationship"
                  className="saathi-input"
                />
                <input
                  type="tel"
                  value={safetyPhone}
                  onChange={(e) => setSafetyPhone(e.target.value)}
                  placeholder="Phone number"
                  className="saathi-input"
                />
                <div className="flex gap-3 justify-end mt-2">
                  <button
                    onClick={() => setEditingSafety(false)}
                    className="text-[13px]"
                    style={{ color: "var(--saathi-text-soft)" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setEditingSafety(false)}
                    className="saathi-btn-coral text-[13px] px-4 py-2 h-auto"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Insights & Support */}
        <div className="mb-10">
          <p
            className="text-[12px] font-medium tracking-[0.1em] uppercase mb-4 px-1"
            style={{ color: "var(--saathi-text-soft)" }}
          >
            Insights & Support
          </p>
          <div className="saathi-card flex flex-col overflow-hidden">
            <Link
              to="/history/trends"
              className="px-6 py-4 flex items-center justify-between border-b transition-colors hover:bg-gray-50"
              style={{ borderColor: "var(--saathi-border)" }}
            >
              <span className="text-[15px] font-medium" style={{ color: "var(--saathi-text-dark)" }}>Trends & Insights</span>
              <span className="text-[18px]" style={{ color: "var(--saathi-text-soft)" }}>→</span>
            </Link>
            <Link
              to="/help"
              className="px-6 py-4 flex items-center justify-between transition-colors hover:bg-gray-50"
            >
              <span className="text-[15px] font-medium" style={{ color: "var(--saathi-text-dark)" }}>Help & Support</span>
              <span className="text-[18px]" style={{ color: "var(--saathi-text-soft)" }}>→</span>
            </Link>
          </div>
        </div>

        {/* Link to Settings */}
        <Link
          to="/settings"
          className="saathi-btn-outline w-full block text-center"
        >
          Go to Settings
        </Link>
      </div>
    </div>
  );
};

export default ProfilePage;
