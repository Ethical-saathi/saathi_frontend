import { useState } from "react";
import { Sidebar } from "@/components/chat/Sidebar";
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
  
  // States spanning the various inline edits
  const [tempName, setTempName] = useState("");
  

  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");

  const [exportMessage, setExportMessage] = useState("");
  const [deleteStep, setDeleteStep] = useState(1);
  const [deleteError, setDeleteError] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");

  // Shake animation triggers
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

  const cancelEdit = () => {
    setEditingField(null);
  };

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
      <div className="flex-1 overflow-y-auto px-[24px] md:px-[48px] py-16 animate-pulse">
         <div className="w-14 h-14 bg-black/5 rounded-full mb-6" />
         <div className="h-6 w-48 bg-black/5 rounded mb-16" />
      </div>
    );
  }

  const avatarColor = getAvatarColor(data.firstName);

  // Reusable Row Component
  const Row = ({ label, children, divider = true }: { label: string, children: React.ReactNode, divider?: boolean }) => (
    <>
      <div className="flex justify-between items-start py-[16px]">
        <span className="text-[13px] text-slate-500 font-normal shrink-0">{label}</span>
        <div className="flex flex-col items-end gap-1 text-right flex-1 max-w-[70%]">
          {children}
        </div>
      </div>
      {divider && <div className="w-full h-px bg-black/[0.06]" />}
    </>
  );

  return (
    <div className="flex-1 overflow-y-auto w-full pb-20">
      <div className="max-w-2xl mx-auto px-[24px] md:px-[48px] py-[48px]">
          
          {/* PROFILE SECTION */}
          
          {/* Avatar Block */}
          <div className="flex items-center gap-4 mb-[24px]">
            <div 
              className="w-[56px] h-[56px] rounded-full flex items-center justify-center text-[22px] font-medium shadow-[0_0_0_3px_rgba(0,0,0,0.04)]"
              style={{ backgroundColor: avatarColor, color: "rgba(0,0,0,0.6)" }}
            >
              {data.firstName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center">
                <span className="text-[18px] font-medium text-slate-800">{data.firstName}</span>
                <button 
                  onClick={() => handleEdit("name", data.firstName)}
                  className="text-[12px] text-slate-500 ml-2 hover:text-slate-800 hover:underline focus:outline-none transition-colors duration-150"
                >
                  Edit name
                </button>
              </div>
              <p className="text-[13px] text-slate-500">{data.email}</p>
            </div>
          </div>
          <div className="w-full h-px bg-black/[0.06] mb-[24px]" />

          {/* Editable Field Rows */}
          
          {/* Displays Name */}
          <Row label="Display name">
            <AnimatePresence mode="wait" initial={false}>
              {editingField === "name" ? (
                <motion.div 
                  key="edit"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="flex flex-col items-end w-full overflow-hidden"
                >
                  <input 
                    type="text" 
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="clay-input text-left md:text-right text-[14px] text-slate-800 mb-3"
                    autoFocus
                  />
                  <div className="flex items-center gap-3">
                    <button onClick={cancelEdit} className="text-[12px] text-slate-400 hover:text-slate-600">Cancel</button>
                    <button onClick={handleSaveName} className="bg-[#5BA8A0] text-white text-[12px] px-3 py-1.5 rounded-md hover:bg-[#4E938C]">Save</button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="view"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-[14px] text-slate-800">{data.firstName}</span>
                  <button onClick={() => handleEdit("name", data.firstName)} className="text-[12px] text-slate-500 hover:text-slate-800 hover:underline transition-colors duration-150">Edit</button>
                </motion.div>
              )}
            </AnimatePresence>
          </Row>

          {/* Email */}
          <Row label="Email" divider={false}>
            <div className="flex items-center gap-2">
              <span className="text-[14px] text-slate-800">{data.email}</span>
            </div>
          </Row>


          {/* SETTINGS SECTION */}
          <div className="flex items-center gap-2.5 mt-[40px] mb-[20px]">
            <SaathiAvatar size={24} />
            <h2 className="text-[18px] font-medium text-slate-800">Settings</h2>
          </div>

          {/* Privacy & Data */}
          <p className="text-[11px] font-medium text-slate-500 tracking-[0.06em] uppercase mb-[12px]">Privacy & Data</p>
          
          <Row label="Download my data">
            {exportMessage ? (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[12px] text-slate-500">
                {exportMessage}
              </motion.span>
            ) : (
              <button onClick={handleExport} className="text-[13px] text-slate-500 hover:text-slate-800 hover:underline transition-colors duration-150">
                Request download
              </button>
            )}
          </Row>

          <Row label="Delete all my data" divider={false}>
            {editingField === "delete" ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="w-full mt-2 overflow-hidden"
              >
                <div className="clay-card !bg-[#FBF3F3] p-[16px] mt-2 text-left">
                  <p className="text-[14px] text-slate-700 leading-relaxed mb-4">
                    This will permanently delete all your sessions, conversations, and account data. This cannot be undone.
                  </p>
                  <div className="flex items-center gap-4">
                    <button onClick={cancelEdit} className="text-[13px] text-slate-500 hover:text-slate-700">Cancel</button>
                    <button 
                      onClick={handleDeleteAll}
                      className="bg-[#C0625A] text-white text-[13px] font-medium px-4 py-2 rounded-lg hover:bg-[#A9554E]"
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
                className="text-[13px] text-[#C0625A] hover:underline"
              >
                Delete
              </button>
            )}
          </Row>
          <div className="w-full h-px bg-black/[0.06]" />


          {/* Session Preferences */}
          <p id="session-preferences" className="text-[11px] font-medium text-slate-500 tracking-[0.06em] uppercase mt-[32px] mb-[12px]">Session preferences</p>

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
                    <div className="flex items-center gap-2 text-[13px] text-slate-600">
                      <span>Remind me at</span>
                      <input 
                        type="time" 
                        value={data.settings.reminderTime}
                        onChange={(e) => updateSetting("reminderTime", e.target.value)}
                        className="bg-transparent border-b border-black/10 focus:border-[#5BA8A0] outline-none px-1"
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
                              "text-[11px] px-2 py-1 rounded-full border transition-colors",
                              isSelected 
                                ? "bg-[#5BA8A0] text-white border-[#5BA8A0]" 
                                : "bg-transparent text-slate-500 border-black/10 hover:border-black/20"
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

          <Row label="Mood check-in on home" divider={false}>
            <Toggle 
              checked={data.settings.showMoodCheckin} 
              onChange={(v) => updateSetting("showMoodCheckin", v)} 
            />
          </Row>
          <div className="w-full h-px bg-black/[0.06]" />

          {/* Appearance / Theme */}
          <p className="text-[11px] font-medium text-slate-500 tracking-[0.06em] uppercase mt-[32px] mb-[12px]">Appearance</p>
          <Row label="Chat Theme" divider={false}>
            <div className="flex flex-wrap gap-3 justify-end mt-1">
              {CHAT_THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.color)}
                  title={t.name}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-transform duration-200",
                    currentTheme === t.color 
                      ? "border-[#5BA8A0] scale-110 shadow-sm" 
                      : "border-transparent border-black/5 hover:scale-105 shadow-[0_2px_4px_rgba(0,0,0,0.05)]"
                  )}
                  style={{ backgroundColor: t.color }}
                />
              ))}
            </div>
          </Row>
          <div className="w-full h-px bg-black/[0.06]" />


          {/* Account */}
          <p className="text-[11px] font-medium text-slate-500 tracking-[0.06em] uppercase mt-[32px] mb-[12px]">Account</p>

          <Row label="Change password">
            <AnimatePresence mode="wait" initial={false}>
              {editingField === "password" ? (
                <motion.div 
                  key="edit"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="flex flex-col items-end w-full overflow-hidden gap-3"
                >
                  <motion.input 
                    type="password" 
                    placeholder="Current password"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    animate={shakeField === "pwd-current" ? { x: [-5, 5, -5, 5, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className="clay-input w-full max-w-[280px] text-left md:text-right text-[14px] text-slate-800"
                  />
                  <input 
                    type="password" 
                    placeholder="New password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="clay-input w-full max-w-[280px] text-left md:text-right text-[14px] text-slate-800"
                  />
                  <motion.input 
                    type="password" 
                    placeholder="Confirm new"
                    value={confirmNewPass}
                    onChange={(e) => setConfirmNewPass(e.target.value)}
                    animate={shakeField === "pwd-confirm" ? { x: [-5, 5, -5, 5, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className="clay-input w-full max-w-[280px] text-left md:text-right text-[14px] text-slate-800"
                  />
                  
                  <div className="flex items-center gap-3 mt-2">
                    <button onClick={cancelEdit} className="text-[12px] text-slate-400 hover:text-slate-600">Cancel</button>
                    <button onClick={handleSavePassword} className="bg-[#5BA8A0] text-white text-[12px] px-3 py-1.5 rounded-md hover:bg-[#4E938C]">Update password</button>
                  </div>
                  {pwdMsg && <span className="text-[12px] text-slate-500 mt-1">{pwdMsg}</span>}
                </motion.div>
              ) : (
                <motion.div 
                  key="view"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <button onClick={() => handleEdit("password")} className="text-[13px] text-slate-500 hover:text-slate-800 hover:underline transition-colors duration-150">Change</button>
                </motion.div>
              )}
            </AnimatePresence>
          </Row>

          <Row label="Sign out" divider={false}>
            <button onClick={handleSignOut} className="text-[13px] text-slate-500 hover:underline">Sign out</button>
          </Row>

          {/* CRISIS BOX PERMANENT BOTTOM ELEMENT */}
          <div className="mt-[48px] clay-card p-[16px_20px] text-[13px] leading-[1.6] text-slate-500">
            If you are in crisis or need immediate help, <br/>
            please call iCall at <a href="tel:9152987821" className="text-[#5BA8A0] font-medium hover:underline transition-all">9152987821</a>.
          </div>

        </div>
      </div>
  );
};

export default Profile;
