import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, Lock, User, CheckCircle2, Loader2, Calendar, Shield, FileText, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/auth/AuthProvider";
import HeroSection from "@/components/auth/HeroSection";

type AuthView = "signin" | "signup" | "forgot" | "consent";

const INPUT_CLASS =
  "w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-transparent bg-white/60 focus:bg-white focus:border-[#F4845F] outline-none transition-all duration-200 text-[#3D2B1F] placeholder-[#5C4033]/35 text-sm shadow-sm focus:shadow-[0_0_0_4px_rgba(244,132,95,0.1)]";

export default function Auth() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [view, setView] = useState<AuthView>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [dob, setDob] = useState("");
  const [guardianConsent, setGuardianConsent] = useState(false);
  const [layer1Agreed, setLayer1Agreed] = useState(false);
  const [layer2Agreed, setLayer2Agreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => { if (user) navigate("/home"); }, [user, navigate]);

  const clearForm = () => { setName(""); setEmail(""); setPassword(""); setDob(""); setGuardianConsent(false); setError(""); };
  const switchView = (v: AuthView) => { clearForm(); setResetSent(false); setView(v); };

  const isUnder18 = useMemo(() => {
    if (!dob) return false;
    const age = new Date(Date.now() - new Date(dob).getTime());
    return Math.abs(age.getUTCFullYear() - 1970) < 18;
  }, [dob]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (view === "signup") {
      if (isUnder18 && !guardianConsent) { setError("Parental or guardian consent is required for users under 18."); return; }
      setView("consent");
    } else {
      setIsLoading(true);
      try {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      } catch (err: any) {
        setError(err?.message || "Something went wrong. Please try again.");
      } finally { setIsLoading(false); }
    }
  };

  const submitConsentAndRegister = async () => {
    setError(""); setIsLoading(true);
    try {
      const { data, error: err } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name, dob, is_under_18: isUnder18, guardian_consent: isUnder18 ? guardianConsent : null, core_therapy_consent: true, ai_training_consent: layer2Agreed } },
      });
      if (err) throw err;
      if (!data.session) { setError("Account created! Please check your email to verify."); setView("signin"); return; }
      navigate("/onboarding");
    } catch (err: any) { setError(err?.message || "Registration failed."); setView("signup"); }
    finally { setIsLoading(false); }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault(); if (!email.trim()) return;
    setError(""); setIsLoading(true);
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth?view=reset` });
      if (err) throw err; setResetSent(true);
    } catch (err: any) { setError(err?.message || "Could not send reset link."); }
    finally { setIsLoading(false); }
  };

  const handleOAuth = async () => {
    setError("");
    try {
      const { error: err } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/home` } });
      if (err) throw err;
    } catch (err: any) { setError(err?.message || "Google sign-in failed."); }
  };

  const heroProps = view === "signup" || view === "consent"
    ? { headline: "Begin Your", subheadline: "Journey", tagline: "Join thousands finding peace and clarity through AI-powered mental wellness support." }
    : view === "forgot"
    ? { headline: "Reset Your", subheadline: "Password", tagline: "We'll send you a secure link so you can get back to your healing journey." }
    : { headline: "Your Journey to", subheadline: "Peace", tagline: "Take a deep breath. You are in a safe space designed to support your mental well-being and personal growth." };

  return (
    <div className="min-h-[100dvh] flex w-full" style={{ background: "linear-gradient(135deg,#FFF4EE 0%,#FEF0F5 50%,#F5EFFF 100%)" }}>

      {/* LEFT — Hero */}
      <HeroSection {...heroProps} />

      {/* RIGHT — Form panel */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative overflow-y-auto">

        {/* Back to home */}
        <Link to="/" className="absolute top-6 left-6 sm:top-10 sm:left-10 flex items-center gap-1.5 text-[#5C4033]/50 hover:text-[#5C4033] transition-colors z-20 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {/* Mobile gradient (hidden on md+) */}
        <div className="md:hidden w-full mb-8 text-center pt-14">
          <h1 className="text-3xl font-bold text-[#5C4033]" style={{ fontFamily: "'Playfair Display',serif" }}>
            {heroProps.headline} <span className="italic font-normal">{heroProps.subheadline}</span>
          </h1>
        </div>

        <motion.div
          key={view}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={`w-full ${view === "consent" ? "max-w-lg" : "max-w-md"} my-auto pt-4 pb-8`}
        >
          {/* Glass card */}
          <div
            className="w-full rounded-3xl p-8 sm:p-10"
            style={{
              background: "rgba(255,255,255,0.72)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(244,132,95,0.18)",
              boxShadow: "0 24px 64px rgba(92,64,51,0.08), 0 4px 16px rgba(92,64,51,0.04), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
          >
            {/* Header */}
            <div className="mb-7">
              <AnimatePresence mode="wait">
                <motion.div key={view} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#3D2B1F] mb-1.5" style={{ fontFamily: "'Playfair Display',serif" }}>
                    {{ signin: "Welcome Back", signup: "Create Account", forgot: "Reset Password", consent: "Data & Privacy" }[view]}
                  </h2>
                  <p className="text-sm text-[#5C4033]/55">
                    {{ signin: "Sign in to continue your journey", signup: "Start your healing journey today", forgot: "We'll send a reset link to your email", consent: "Governed by DPDPA 2023 & MHCA 2017" }[view]}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Error banner */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-4 overflow-hidden">
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-700">{error}</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── CONSENT VIEW ── */}
            {view === "consent" && (
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-1" style={{ background: "rgba(244,132,95,0.1)" }}>
                  <Shield className="w-6 h-6 text-[#F4845F]" strokeWidth={1.5} />
                </div>
                <div className="overflow-y-auto max-h-[240px] rounded-2xl p-4 text-xs text-[#5C4033]/70 leading-relaxed" style={{ background: "rgba(255,244,238,0.6)", border: "1px solid rgba(244,132,95,0.15)" }}>
                  <h4 className="font-semibold text-[#3D2B1F] mb-2 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-[#F4845F]" /> The Legal Gateway</h4>
                  <p className="mb-3">What you share stays strictly private. We do not sell your data. Under the <strong>Digital Personal Data Protection Act, 2023</strong>, we require your explicit permission to process your sensitive emotional data before your account is created.</p>
                  <h4 className="font-semibold text-[#3D2B1F] mt-3 mb-1">1. Therapeutic Processing (Required)</h4>
                  <p className="mb-3">We securely process your chat logs to provide real-time AI assistance, maintain session history, and monitor safety thresholds. Your data is AES-256 encrypted.</p>
                  <h4 className="font-semibold text-[#3D2B1F] mt-3 mb-1">2. AI Model Training (Optional)</h4>
                  <p>You may optionally permit us to anonymize your data via differential privacy to help refine our models. You can decline without losing access.</p>
                </div>
                {[
                  { id: "l1", label: "I agree to Therapeutic Processing", sub: "Mandatory to build your profile.", checked: layer1Agreed, onChange: setLayer1Agreed },
                  { id: "l2", label: "I agree to AI Model Training", sub: "Optional. Uses anonymized data.", checked: layer2Agreed, onChange: setLayer2Agreed },
                ].map(({ id, label, sub, checked, onChange }) => (
                  <label key={id} className="flex items-start gap-3 cursor-pointer p-3.5 rounded-2xl transition-colors" style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(244,132,95,0.12)" }}>
                    <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                      <input id={id} type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-[#D4B5A5] rounded-md checked:bg-[#F4845F] checked:border-[#F4845F] transition-colors cursor-pointer" checked={checked} onChange={(e) => onChange(e.target.checked)} />
                      <CheckCircle2 className="w-3 h-3 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-[#3D2B1F]">{label}</span>
                      <span className="block text-xs text-[#5C4033]/50 mt-0.5">{sub}</span>
                    </div>
                  </label>
                ))}
                <div className="flex gap-3 mt-2">
                  <button onClick={() => setView("signup")} className="py-3 px-5 rounded-full text-sm font-medium text-[#5C4033]/60 border border-[#5C4033]/15 hover:border-[#5C4033]/30 transition-all w-1/3">Back</button>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={submitConsentAndRegister}
                    disabled={!layer1Agreed || isLoading}
                    className="w-2/3 py-3.5 rounded-full text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: "linear-gradient(135deg,#F4845F 0%,#F9C784 100%)", boxShadow: "0 8px 24px rgba(244,132,95,0.3)" }}
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Accept & Create Account"}
                  </motion.button>
                </div>
              </div>
            )}

            {/* ── FORGOT PASSWORD VIEW ── */}
            {view === "forgot" && (
              resetSent ? (
                <div className="flex flex-col items-center text-center py-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ background: "rgba(99,198,100,0.1)" }}>
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-semibold text-[#3D2B1F] mb-2">Check your email</h3>
                  <p className="text-sm text-[#5C4033]/55 mb-6 max-w-xs leading-relaxed">We've sent a reset link to <span className="font-medium text-[#3D2B1F]">{email}</span>. It may take a minute to arrive.</p>
                  <button onClick={() => switchView("signin")} className="text-sm text-[#F4845F] font-semibold hover:underline flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <p className="text-sm text-[#5C4033]/55 mb-4 leading-relaxed">Enter the email you used to sign up and we'll send you a reset link.</p>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C4033]/35" />
                    <input id="reset-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required autoFocus className={INPUT_CLASS} />
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isLoading}
                    className="w-full py-3.5 rounded-full font-semibold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg,#F4845F,#F9C784)", boxShadow: "0 8px 24px rgba(244,132,95,0.25)" }}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Reset Link"}
                  </motion.button>
                  <button type="button" onClick={() => switchView("signin")} className="w-full text-center text-sm text-[#5C4033]/50 hover:text-[#5C4033] transition-colors mt-1">← Back to Sign In</button>
                </form>
              )
            )}

            {/* ── SIGN IN / SIGN UP VIEW ── */}
            {(view === "signin" || view === "signup") && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence initial={false}>
                  {view === "signup" && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="space-y-4 overflow-hidden">
                      {/* Full Name */}
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C4033]/35" />
                        <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" required={view === "signup"} className={INPUT_CLASS} />
                      </div>
                      {/* Date of Birth */}
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C4033]/35" />
                        <input id="dob" type="date" max={new Date().toISOString().split("T")[0]} value={dob} onChange={e => setDob(e.target.value)} required={view === "signup"} className={`${INPUT_CLASS} text-[#3D2B1F]`} />
                      </div>
                      <AnimatePresence>
                        {isUnder18 && (
                          <motion.label initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex items-start gap-2.5 cursor-pointer p-3 rounded-xl" style={{ background: "rgba(249,199,132,0.15)", border: "1px solid rgba(249,199,132,0.4)" }}>
                            <input type="checkbox" className="mt-0.5 w-4 h-4 rounded" checked={guardianConsent} onChange={e => setGuardianConsent(e.target.checked)} required={isUnder18} />
                            <span className="text-xs text-[#7A5200] leading-tight">I am a parent or legal guardian providing consent for this minor to use AI Saathi.</span>
                          </motion.label>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email */}
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C4033]/35" />
                  <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className={INPUT_CLASS} />
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    {view === "signin" && (
                      <button type="button" onClick={() => switchView("forgot")} className="text-xs text-[#C9A0DC] hover:text-[#A87BC0] hover:underline transition-colors ml-auto">Forgot password?</button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C4033]/35" />
                    <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className={`${INPUT_CLASS} pr-11`} />
                    <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5C4033]/35 hover:text-[#5C4033]/60 transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="submit" disabled={isLoading}
                  className="w-full mt-2 py-3.5 rounded-full font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg,#F4845F 0%,#F9C784 100%)", boxShadow: "0 8px 24px rgba(244,132,95,0.28)" }}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : view === "signup" ? "Continue to Privacy Gateway" : "Sign In →"}
                </motion.button>

                {/* Divider */}
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#5C4033]/10" /></div>
                  <div className="relative flex justify-center"><span className="px-4 text-xs text-[#5C4033]/40" style={{ background: "rgba(255,255,255,0.0)" }}>or continue with</span></div>
                </div>

                {/* Google */}
                <motion.button
                  whileHover={{ scale: 1.02, borderColor: "#F4845F" }} whileTap={{ scale: 0.98 }}
                  type="button" onClick={handleOAuth}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-full border-2 text-sm font-medium text-[#3D2B1F] transition-all"
                  style={{ background: "rgba(255,255,255,0.8)", borderColor: "rgba(92,64,51,0.12)" }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </motion.button>

                {/* Switch view link */}
                <p className="text-center text-sm text-[#5C4033]/50 mt-6">
                  {view === "signup" ? "Already have an account? " : "Don't have an account? "}
                  <button type="button" onClick={() => switchView(view === "signup" ? "signin" : "signup")} className="font-semibold text-[#F4845F] hover:text-[#D4632E] hover:underline transition-colors">
                    {view === "signup" ? "Sign In" : "Sign Up"}
                  </button>
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
