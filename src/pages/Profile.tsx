import { useState } from "react";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import { Toggle } from "@/components/ui/Toggle";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SaathiAvatar } from "@/components/chat/SaathiAvatar";
import { useTheme, setTheme, CHAT_THEMES } from "@/hooks/useTheme";

const avatarColors: Record<string, string> = {
  A: '#A8D5BA', B: '#F5C4A1', C: '#A8C8E8', D: '#D5A8D5',
  E: '#F5E0A1', F: '#A8D5D5', G: '#F5A8B8', H: '#C8D5A8',
  I: '#E8D5A8', J: '#A8E8D5', K: '#D5E8A8', L: '#E8A8D5',
  M: '#A8E8A8', N: '#E8C4A8', O: '#A8C4E8', P: '#D5A8C4',
  Q: '#C4E8A8', R: '#E8A8A8', S: '#A8E8C4', T: '#C4A8E8',
  U: '#E8E8A8', V: '#A8A8E8', W: '#E8A8E8', X: '#A8E8E8',
  Y: '#E8E8C4', Z: '#C4E8E8', default: '#C8C8C8'
};

const getAvatarColor = (name: string) => {
  const initial = name.charAt(0).toUpperCase();
  return avatarColors[initial] || avatarColors.default;
};

export const Profile = () => {
  const navigate = useNavigate();
  const { 
    data, 
    isLoading, 
    updateName, 
    updatePassword, 
    updateSetting, 
    exportData, 
    deleteAllData, 
    signOut 
  } = useProfileSettings("session_123");

  const currentTheme = useTheme();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");
  const [exportMessage, setExportMessage] = useState("");
  const [deleteStep, setDeleteStep] = useState(1);
  const [deleteError, setDeleteError] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");
  const [shakeField, setShakeField] = useState<string | null>(null);

  const triggerShake = (field: string) => {
    setShakeField(field);
    setTimeout(() => setShakeField(null), 500);
  };

  const handleEdit = (field: string, initialValue: string = "") => {
    setEditingField(field);
    if (field === "name") setTempName(initialValue);

    if (field === "password") {
      setCurrentPass("");
      setNewPass("");
      setConfirmNewPass("");
      setPwdMsg("");
    }
    if (field === "delete") {
      setDeleteStep(1);
      setDeleteError("");
    }
  };

  const cancelEdit = () => setEditingField(null);

  const handleSaveName = async () => {
    await updateName(tempName);
    cancelEdit();
  };

  const handleSavePassword = async () => {
    if (newPass !== confirmNewPass) {
      triggerShake("pwd-confirm");
      return;
    }
    try {
      await updatePassword(currentPass, newPass);
      setPwdMsg("Password updated.");
      setTimeout(() => {
        cancelEdit();
        setPwdMsg("");
      }, 2000);
    } catch {
      triggerShake("pwd-current");
    }
  };

  const handleExport = async () => {
    const res = await exportData();
    setExportMessage(res.message);
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllData();
      await signOut();
      navigate("/");
    } catch {
      setDeleteError("Something went wrong. Please try again.");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  if (isLoading || !data) {
    return (
      <div className="flex-1 overflow-y-auto px-[24px] md:px-[48px] py-16 animate-pulse z-10 relative">
         <div className="w-14 h-14 bg-white/40 rounded-full mb-6" />
         <div className="h-6 w-48 bg-white/40 rounded mb-16" />
      </div>
    );
  }

  const avatarColor = getAvatarColor(data.firstName);

  // Grouped Row Container for Glassmorphism
  const PanelGroup = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <p className="text-[12px] font-medium text-slate-500 tracking-widest uppercase mb-4 pl-2">{title}</p>
      <div className="clay-panel bg-white/40 backdrop-blur-md border border-white/60 rounded-[20px] p-2 flex flex-col gap-1 shadow-sm shadow-[#F4845F]/5">
        {children}
      </div>
    </motion.div>
  );

  const Row = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div className="flex justify-between items-start p-4 hover:bg-white/30 rounded-[12px] transition-colors duration-200">
      <span className="text-[14px] text-slate-600 font-medium shrink-0 pt-0.5">{label}</span>
      <div className="flex flex-col items-end gap-1 text-right flex-1 max-w-[70%]">
        {children}
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto w-full pb-20 relative z-10 no-scrollbar">
      <div className="max-w-2xl mx-auto px-6 md:px-12 py-10 md:py-16">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2.5 mb-[40px]"
          >
            <SaathiAvatar size={32} />
            <h1 className="text-[36px] font-normal text-slate-800 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>Settings</h1>
          </motion.div>
          
          {/* Avatar Profile Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="clay-panel bg-white/60 backdrop-blur-md border border-white/60 p-6 md:p-8 rounded-[24px] mb-[40px] shadow-sm shadow-[#F4845F]/5 flex justify-between items-center"
          >
            <div className="flex items-center gap-5">
              <div 
                className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-[28px] font-medium shadow-md shadow-black/5"
                style={{ backgroundColor: avatarColor, color: "rgba(0,0,0,0.6)" }}
              >
                {data.firstName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-[22px] font-medium text-slate-800 mb-1" style={{ fontFamily: "var(--font-heading)" }}>{data.firstName}</h2>
                <p className="text-[14px] text-slate-500 tracking-wide">{data.email}</p>
              </div>
            </div>
            <button 
              onClick={() => handleEdit("name", data.firstName)}
              className="blob-btn breathing-slow text-white text-[13px] font-medium px-5 py-2.5"
            >
              Edit Name
            </button>
          </motion.div>

          {/* If Editing Name inline */}
          <AnimatePresence>
            {editingField === "name" && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-8 w-full overflow-hidden"
              >
                <div className="clay-panel bg-white/90 border border-[#F4845F]/30 p-6 rounded-[20px] shadow-lg flex flex-col gap-3">
                  <h3 className="text-[14px] text-slate-600 font-medium">Update Display Name</h3>
                  <input 
                    type="text" 
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="clay-input text-[15px] p-3 text-slate-800 w-full mb-2 bg-white/50"
                    autoFocus
                  />
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={cancelEdit} className="text-[13px] text-slate-400 hover:text-slate-600 font-medium px-4 py-2">Cancel</button>
                    <button onClick={handleSaveName} className="bg-[#F4845F] text-white text-[13px] font-medium px-5 py-2 rounded-xl hover:bg-[#E06B4D] transition-colors shadow-sm">Save Changes</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <PanelGroup title="Appearance & Preferences">
            <Row label="Chat Theme">
              <div className="flex flex-wrap gap-3 justify-end mt-1">
                {CHAT_THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.color)}
                    title={t.name}
                    className={cn(
                      "w-8 h-8 rounded-full border-[3px] transition-all duration-300",
                      currentTheme === t.color 
                        ? "border-white scale-110 shadow-md ring-2 ring-[#F4845F]/40" 
                        : "border-transparent hover:scale-105 shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                    )}
                    style={{ backgroundColor: t.color }}
                  />
                ))}
              </div>
            </Row>

            <Row label="Mood check-in on home">
              <Toggle 
                checked={data.settings.showMoodCheckin} 
                onChange={(v) => updateSetting("showMoodCheckin", v)} 
              />
            </Row>

            <Row label="Session reminders">
              <div className="flex flex-col items-end w-full">
                <Toggle 
                  checked={data.settings.sessionReminders} 
                  onChange={(v) => updateSetting("sessionReminders", v)} 
                />
                <AnimatePresence>
                  {data.settings.sessionReminders && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-full flex flex-col items-end gap-3 mt-4 overflow-hidden"
                    >
                      <div className="flex items-center gap-2 text-[13px] text-slate-600 bg-white/40 px-3 py-1.5 rounded-lg border border-white/60 shadow-sm">
                        <span>Remind me at</span>
                        <input 
                          type="time" 
                          value={data.settings.reminderTime}
                          onChange={(e) => updateSetting("reminderTime", e.target.value)}
                          className="bg-transparent text-rose-900 font-medium focus:outline-none px-1"
                        />
                        <span>on</span>
                      </div>
                      <div className="flex gap-1.5 mt-1">
                        {DAYS.map(day => {
                          const isSelected = data.settings.reminderDays.includes(day);
                          return (
                            <button
                              key={day}
                              onClick={() => {
                                const newDays = isSelected 
                                  ? data.settings.reminderDays.filter(d => d !== day)
                                  : [...data.settings.reminderDays, day];
                                updateSetting("reminderDays", newDays);
                              }}
                              className={cn(
                                "text-[11px] px-2.5 py-1.5 rounded-full border transition-all duration-200 font-medium",
                                isSelected 
                                  ? "bg-[#F4845F] text-white border-[#F4845F] shadow-sm" 
                                  : "bg-white/50 text-slate-500 border-white/60 hover:bg-white"
                              )}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Row>
          </PanelGroup>

          <PanelGroup title="Privacy & Data">
            <Row label="Download my data">
              {exportMessage ? (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[13px] text-rose-800 italic font-medium" style={{ fontFamily: 'var(--font-serif)' }}>
                  {exportMessage}
                </motion.span>
              ) : (
                <button onClick={handleExport} className="text-[13px] text-slate-500 hover:text-rose-800 hover:underline hover:underline-offset-2 transition-colors duration-150">
                  Request download
                </button>
              )}
            </Row>

            <Row label="Delete all my data">
              {editingField === "delete" ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="w-full mt-2 overflow-hidden"
                >
                  <div className="clay-panel !bg-[#FFFAF7]/50 border-[#C0625A]/20 p-5 mt-2 text-left rounded-[16px]">
                    <p className="text-[14px] text-slate-700 leading-relaxed mb-5">
                      This will permanently delete all your sessions, conversations, and account data. This cannot be undone.
                    </p>
                    <div className="flex items-center justify-end gap-4">
                      <button onClick={cancelEdit} className="text-[13px] font-medium text-slate-500 hover:text-slate-700">Cancel</button>
                      <button 
                        onClick={handleDeleteAll}
                        className="bg-[#C0625A] text-white text-[13px] font-medium px-4 py-2 rounded-xl hover:bg-[#A9554E] hover:shadow-lg transition-all"
                      >
                        Yes, delete everything
                      </button>
                    </div>
                    {deleteError && <p className="text-[12px] text-slate-500 mt-3">{deleteError}</p>}
                  </div>
                </motion.div>
              ) : (
                <button 
                  onClick={() => handleEdit("delete")}
                  className="text-[13px] text-[#C0625A] hover:underline hover:underline-offset-2"
                >
                  Delete account
                </button>
              )}
            </Row>
          </PanelGroup>

          <PanelGroup title="Account Security">
            <Row label="Change password">
              <AnimatePresence mode="wait" initial={false}>
                {editingField === "password" ? (
                  <motion.div 
                    key="edit"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="flex flex-col items-end w-full overflow-hidden gap-3 py-2"
                  >
                    <motion.input 
                      type="password" 
                      placeholder="Current password"
                      value={currentPass}
                      onChange={(e) => setCurrentPass(e.target.value)}
                      animate={shakeField === "pwd-current" ? { x: [-5, 5, -5, 5, 0] } : {}}
                      transition={{ duration: 0.4 }}
                      className="clay-input bg-white/50 w-full max-w-[280px] text-left md:text-right text-[14px] text-slate-800"
                    />
                    <input 
                      type="password" 
                      placeholder="New password"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      className="clay-input bg-white/50 w-full max-w-[280px] text-left md:text-right text-[14px] text-slate-800"
                    />
                    <motion.input 
                      type="password" 
                      placeholder="Confirm new"
                      value={confirmNewPass}
                      onChange={(e) => setConfirmNewPass(e.target.value)}
                      animate={shakeField === "pwd-confirm" ? { x: [-5, 5, -5, 5, 0] } : {}}
                      transition={{ duration: 0.4 }}
                      className="clay-input bg-white/50 w-full max-w-[280px] text-left md:text-right text-[14px] text-slate-800"
                    />
                    
                    <div className="flex items-center justify-end gap-3 mt-3 w-full">
                      <button onClick={cancelEdit} className="text-[13px] text-slate-400 hover:text-slate-600 font-medium px-2 py-1.5">Cancel</button>
                      <button onClick={handleSavePassword} className="bg-[#F4845F] text-white text-[13px] font-medium px-4 py-2 rounded-xl hover:bg-[#E06B4D] shadow-sm transition-all">Update password</button>
                    </div>
                    {pwdMsg && <span className="text-[12px] text-rose-600 mt-1">{pwdMsg}</span>}
                  </motion.div>
                ) : (
                  <button onClick={() => handleEdit("password")} className="text-[13px] text-slate-500 hover:text-rose-800 hover:underline hover:underline-offset-2 transition-colors duration-150">Change password</button>
                )}
              </AnimatePresence>
            </Row>
            
            <Row label="Sign out session">
              <button onClick={handleSignOut} className="text-[13px] text-slate-500 hover:text-slate-800 hover:underline hover:underline-offset-2">Sign out</button>
            </Row>
          </PanelGroup>

          {/* CRISIS BOX PERMANENT BOTTOM ELEMENT */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-16 clay-panel bg-[#FFFAF7]/50 border-[#F4845F]/20 p-6 text-[14px] leading-[1.6] text-slate-500 rounded-[20px] text-center"
          >
            If you are in crisis or need immediate help, <br className="hidden md:block" />
            please call your emergency responder or iCall at <a href="tel:9152987821" className="text-[#E06B45] font-medium hover:underline hover:underline-offset-2 transition-all">9152987821</a>.
          </motion.div>

      </div>
    </div>
  );
};

export default Profile;
