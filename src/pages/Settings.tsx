import { useState } from "react";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import { useConsent } from "@/hooks/useConsent";
import { Toggle } from "@/components/ui/Toggle";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme, setTheme, CHAT_THEMES } from "@/hooks/useTheme";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TONE_OPTIONS = ["Warm & gentle", "Direct & practical", "Calm & minimal"];

export const Settings = () => {
  const navigate = useNavigate();
  const {
    data,
    isLoading,
    updateName,
    updatePassword,
    updateSetting,
    exportData,
    deleteAllData,
    signOut,
  } = useProfileSettings();
  const { consent, toggleLayer2 } = useConsent();
  const currentTheme = useTheme();

  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");
  const [exportMessage, setExportMessage] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");
  const [selectedTone, setSelectedTone] = useState("Warm & gentle");

  const handleEdit = (field: string, initialValue = "") => {
    setEditingField(field);
    if (field === "name") setTempName(initialValue);
    if (field === "password") {
      setCurrentPass(""); setNewPass(""); setConfirmNewPass(""); setPwdMsg("");
    }
    if (field === "delete") { setDeleteConfirm(""); setDeleteError(""); }
  };

  const cancelEdit = () => setEditingField(null);

  const handleSaveName = async () => { await updateName(tempName); cancelEdit(); };
  const handleSavePassword = async () => {
    if (newPass !== confirmNewPass) return;
    try { await updatePassword(currentPass, newPass); setPwdMsg("Password updated."); setTimeout(cancelEdit, 2000); }
    catch { setPwdMsg("Error updating password."); }
  };
  const handleExport = async () => { const res = await exportData(); setExportMessage(res.message); };
  const handleDeleteAll = async () => {
    if (deleteConfirm !== "DELETE") { setDeleteError("Please type DELETE to confirm."); return; }
    try { await deleteAllData(); await signOut(); navigate("/"); }
    catch { setDeleteError("Something went wrong."); }
  };

  if (isLoading || !data) {
    return (
      <div className="flex-1 overflow-y-auto px-6 md:px-12 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="saathi-skeleton h-8 w-48 mb-8" />
          <div className="saathi-skeleton h-24 w-full mb-6" />
          <div className="saathi-skeleton h-32 w-full mb-6" />
        </div>
      </div>
    );
  }

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-8">
      <p className="text-[12px] font-medium tracking-[0.1em] uppercase mb-4 px-1"
        style={{ color: "var(--saathi-text-soft)" }}>{title}</p>
      <div className="saathi-card p-1 flex flex-col">
        {children}
      </div>
    </div>
  );

  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex justify-between items-start p-4 hover:bg-gray-50/50 rounded-2xl transition-colors">
      <span className="text-[14px] font-medium shrink-0 pt-0.5" style={{ color: "var(--saathi-text-mid)" }}>{label}</span>
      <div className="flex flex-col items-end gap-1 text-right flex-1 max-w-[65%]">{children}</div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto w-full pb-20">
      <div className="max-w-2xl mx-auto px-6 md:px-12 py-10 md:py-16">
        <h1 className="text-[28px] font-medium mb-10" style={{ color: "var(--saathi-text-dark)" }}>
          Settings
        </h1>

        {/* Profile Card */}
        <div className="saathi-card p-6 mb-10 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-[20px] font-medium text-white"
              style={{ background: "var(--saathi-coral)" }}>
              {data.firstName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-[18px] font-medium" style={{ color: "var(--saathi-text-dark)" }}>{data.firstName}</h2>
              <p className="text-[13px]" style={{ color: "var(--saathi-text-soft)" }}>{data.email}</p>
            </div>
          </div>
          <button onClick={() => handleEdit("name", data.firstName)} className="saathi-btn-outline text-[13px] px-4 py-2 h-auto">Edit Name</button>
        </div>

        {editingField === "name" && (
          <div className="saathi-card p-5 mb-8">
            <input type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} className="saathi-input mb-3" autoFocus />
            <div className="flex justify-end gap-3">
              <button onClick={cancelEdit} className="text-[13px]" style={{ color: "var(--saathi-text-soft)" }}>Cancel</button>
              <button onClick={handleSaveName} className="saathi-btn-coral text-[13px] px-4 py-2 h-auto">Save</button>
            </div>
          </div>
        )}

        <Section title="Appearance & Preferences">
          <Row label="Chat Theme">
            <div className="flex flex-wrap gap-2.5 justify-end">
              {CHAT_THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.color)}
                  title={t.name}
                  className="w-7 h-7 rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: t.color,
                    border: currentTheme === t.color ? "2px solid var(--saathi-coral)" : "2px solid transparent",
                    transform: currentTheme === t.color ? "scale(1.15)" : "scale(1)",
                  }}
                />
              ))}
            </div>
          </Row>
          <Row label="Mood check-in on home">
            <Toggle checked={data.settings.showMoodCheckin} onChange={(v) => updateSetting("showMoodCheckin", v)} />
          </Row>
          <Row label="Session reminders">
            <div className="flex flex-col items-end w-full">
              <Toggle checked={data.settings.sessionReminders} onChange={(v) => updateSetting("sessionReminders", v)} />
              {data.settings.sessionReminders && (
                <div className="w-full flex flex-col items-end gap-2 mt-3">
                  <div className="flex items-center gap-2 text-[13px]" style={{ color: "var(--saathi-text-mid)" }}>
                    <span>at</span>
                    <input type="time" value={data.settings.reminderTime}
                      onChange={(e) => updateSetting("reminderTime", e.target.value)}
                      className="bg-transparent font-medium focus:outline-none" style={{ color: "var(--saathi-coral)" }} />
                  </div>
                  <div className="flex gap-1.5">
                    {DAYS.map(day => (
                      <button key={day}
                        onClick={() => {
                          const newDays = data.settings.reminderDays.includes(day)
                            ? data.settings.reminderDays.filter(d => d !== day)
                            : [...data.settings.reminderDays, day];
                          updateSetting("reminderDays", newDays);
                        }}
                        className="text-[11px] px-2.5 py-1.5 rounded-full transition-all duration-200 font-medium"
                        style={{
                          background: data.settings.reminderDays.includes(day) ? "var(--saathi-coral)" : "transparent",
                          color: data.settings.reminderDays.includes(day) ? "#fff" : "var(--saathi-text-soft)",
                          border: `1px solid ${data.settings.reminderDays.includes(day) ? "var(--saathi-coral)" : "var(--saathi-border)"}`,
                        }}
                      >{day}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Row>
        </Section>

        <Section title="Communication Style">
          <div className="p-4">
            <p className="text-[13px] mb-4" style={{ color: "var(--saathi-text-mid)" }}>How should Saathi talk with you?</p>
            <div className="flex flex-wrap gap-2">
              {TONE_OPTIONS.map(tone => (
                <button key={tone}
                  onClick={() => setSelectedTone(tone)}
                  className="text-[13px] font-medium px-4 py-2 rounded-full transition-all duration-200"
                  style={{
                    background: selectedTone === tone ? "var(--saathi-coral)" : "transparent",
                    color: selectedTone === tone ? "#fff" : "var(--saathi-text-mid)",
                    border: `1.5px solid ${selectedTone === tone ? "var(--saathi-coral)" : "var(--saathi-border)"}`,
                  }}
                >{tone}</button>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Privacy & Data">
          <Row label="AI training consent">
            <Toggle checked={consent?.layer2_agreed ?? false} onChange={() => toggleLayer2()} />
          </Row>
          <Row label="Download my data">
            {exportMessage ? (
              <span className="text-[13px] italic" style={{ color: "var(--saathi-coral)" }}>{exportMessage}</span>
            ) : (
              <button onClick={handleExport} className="text-[13px]" style={{ color: "var(--saathi-text-mid)" }}>Request download</button>
            )}
          </Row>
          <Row label="Delete all my data">
            {editingField === "delete" ? (
              <div className="w-full mt-2">
                <p className="text-[13px] mb-3 text-left" style={{ color: "var(--saathi-text-mid)" }}>
                  Type <strong>DELETE</strong> to permanently delete all your data.
                </p>
                <input type="text" value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)}
                  placeholder="Type DELETE" className="saathi-input mb-3 text-[14px]" />
                <div className="flex justify-end gap-3">
                  <button onClick={cancelEdit} className="text-[13px]" style={{ color: "var(--saathi-text-soft)" }}>Cancel</button>
                  <button onClick={handleDeleteAll}
                    className="text-[13px] font-medium px-4 py-2 rounded-xl text-white"
                    style={{ background: "var(--saathi-crisis)" }}>Delete everything</button>
                </div>
                {deleteError && <p className="text-[12px] mt-2" style={{ color: "var(--saathi-crisis)" }}>{deleteError}</p>}
              </div>
            ) : (
              <button onClick={() => handleEdit("delete")} className="text-[13px]" style={{ color: "var(--saathi-crisis)" }}>Delete account</button>
            )}
          </Row>
        </Section>

        <Section title="Account Security">
          <Row label="Change password">
            {editingField === "password" ? (
              <div className="flex flex-col items-end w-full gap-2 py-1">
                <input type="password" placeholder="Current password" value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)} className="saathi-input text-[14px] max-w-[260px]" />
                <input type="password" placeholder="New password" value={newPass}
                  onChange={(e) => setNewPass(e.target.value)} className="saathi-input text-[14px] max-w-[260px]" />
                <input type="password" placeholder="Confirm new" value={confirmNewPass}
                  onChange={(e) => setConfirmNewPass(e.target.value)} className="saathi-input text-[14px] max-w-[260px]" />
                <div className="flex gap-3 mt-2">
                  <button onClick={cancelEdit} className="text-[13px]" style={{ color: "var(--saathi-text-soft)" }}>Cancel</button>
                  <button onClick={handleSavePassword} className="saathi-btn-coral text-[13px] px-4 py-2 h-auto">Update</button>
                </div>
                {pwdMsg && <span className="text-[12px]" style={{ color: "var(--saathi-coral)" }}>{pwdMsg}</span>}
              </div>
            ) : (
              <button onClick={() => handleEdit("password")} className="text-[13px]" style={{ color: "var(--saathi-text-mid)" }}>Change password</button>
            )}
          </Row>
          <Row label="Sign out">
            <button onClick={async () => { await signOut(); navigate("/"); }} className="text-[13px]" style={{ color: "var(--saathi-text-mid)" }}>Sign out</button>
          </Row>
        </Section>

        <Section title="Language">
          <Row label="Language">
            <select className="bg-transparent text-[14px] font-medium focus:outline-none" style={{ color: "var(--saathi-text-dark)" }} disabled>
              <option>English</option>
            </select>
          </Row>
          <div className="px-4 pb-3">
            <p className="text-[12px]" style={{ color: "var(--saathi-text-soft)" }}>More languages coming soon</p>
          </div>
        </Section>
      </div>
    </div>
  );
};

export default Settings;
