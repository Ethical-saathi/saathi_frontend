import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, Lock, User, CheckCircle2, Loader2, Calendar, Shield, FileText } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/auth/AuthProvider";

type AuthView = "signin" | "signup" | "forgot" | "consent";

export default function Auth() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [view, setView] = useState<AuthView>("signin");
  
  // Registration data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [guardianConsent, setGuardianConsent] = useState(false);
  
  // Consent data logic
  const [layer1Agreed, setLayer1Agreed] = useState(false);
  const [layer2Agreed, setLayer2Agreed] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  // When user becomes populated via AuthProvider, navigate away
  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const clearForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setDob("");
    setGuardianConsent(false);
    setError("");
  };

  const switchView = (newView: AuthView) => {
    clearForm();
    setResetSent(false);
    setView(newView);
  };

  const isUnder18 = useMemo(() => {
    if (!dob) return false;
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970) < 18;
  }, [dob]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (view === "signup") {
      if (isUnder18 && !guardianConsent) {
        setError("Parental or guardian consent is required for users under 18.");
        return;
      }
      // Instead of committing, move to the Legal Gateway
      setView("consent");
    } else {
      setIsLoading(true);
      try {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      } catch (err: any) {
        setError(err?.message || "Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const submitConsentAndRegister = async () => {
    setError("");
    setIsLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { 
          data: { 
            full_name: name,
            dob: dob,
            is_under_18: isUnder18,
            guardian_consent: isUnder18 ? guardianConsent : null,
            core_therapy_consent: true, // Layer 1
            ai_training_consent: layer2Agreed, // Layer 2
          } 
        },
      });
      if (signUpError) throw signUpError;
      
      if (!data.session) {
        setError("Account created! Please check your email to verify your account.");
        setView("signin");
        return;
      }
      navigate("/onboarding");
    } catch (err: any) {
      setError(err?.message || "Registration failed. Please try again.");
      setView("signup");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError("");
    setIsLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?view=reset`,
      });
      if (resetError) throw resetError;
      setResetSent(true);
    } catch (err: any) {
      setError(err?.message || "Could not send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "facebook") => {
    setError("");
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/home` },
      });
      if (oauthError) throw oauthError;
    } catch (err: any) {
      setError(err?.message || `${provider} sign-in failed.`);
    }
  };

  const viewConfig = {
    signin: { title: "Welcome Back", subtitle: "Sign in to continue your journey" },
    signup: { title: "Create an Account", subtitle: "Start your healing journey today" },
    forgot: { title: "Reset Password", subtitle: "We'll send you a link to reset it" },
    consent: { title: "Data & Privacy", subtitle: "Governed by DPDPA 2023 & MHCA 2017" },
  };

  return (
    <div className="min-h-[100dvh] flex w-full bg-[#F5F0E8]">
      {/* Left Panel */}
      <div className="hidden md:flex w-1/2 relative bg-neutral-200 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-blue-900/40 mix-blend-overlay z-10" />
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop"
          alt="Calm serene landscape"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[20s] hover:scale-105"
        />
        <div className="relative z-20 text-white p-12 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="max-w-md"
          >
            <h2 className="text-4xl font-heading mb-4 leading-tight">
              Your Journey to Peace <span className="font-serif italic font-normal">Starts Here</span>
            </h2>
            <p className="text-lg text-white/90 font-light">
              Take a deep breath. You are in a safe space designed to support your mental well-being and personal growth.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-4 sm:p-12 relative overflow-y-auto">
        <Link 
          to="/" 
          className="absolute top-6 left-6 sm:top-12 sm:left-12 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors z-20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={`w-full ${view === "consent" ? "max-w-lg" : "max-w-md"} my-auto pt-16 pb-8`}
        >
          <div className="clay-panel p-6 sm:p-10 w-full transition-all duration-300">
            
            {/* Header */}
            <div className="mb-6 text-center h-[72px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={view}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="text-3xl font-heading text-slate-800 mb-2">
                    {viewConfig[view].title}
                  </h1>
                  <p className="text-slate-500 text-sm">
                    {viewConfig[view].subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mb-4 overflow-hidden"
                >
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-[13px] text-red-700">
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ─── DPDPA CONSENT GATEWAY (PRE-REGISTRATION) ─── */}
            <AnimatePresence mode="wait">
               {view === "consent" && (
                 <motion.div
                  key="consent"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col"
                 >
                    <div className="w-14 h-14 rounded-2xl bg-white/50 backdrop-blur-sm shadow-[inset_0_2px_10px_rgba(255,255,255,0.8)] border border-white/60 flex items-center justify-center mx-auto mb-3 shrink-0">
                      <Shield className="w-7 h-7 text-rose-600 drop-shadow-sm" strokeWidth={1.5} />
                    </div>

                    {/* Scrollable Legal Summary */}
                    <div className="flex-1 overflow-y-auto max-h-[300px] w-full bg-white/40 border border-white/60 rounded-xl p-4 mb-5 text-[13px] text-slate-600 leading-relaxed shadow-inner">
                      <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-rose-600" />
                        The Legal Gateway
                      </h4>
                      <p className="mb-3">
                        What you share here stays strictly private. We do not sell your data. Under the <strong>Digital Personal Data Protection Act, 2023</strong>, we require your explicit permission to process your sensitive emotional data before your account is generated.
                      </p>
                      <h4 className="font-semibold text-slate-800 mt-4 mb-1">1. Therapeutic Processing (Required)</h4>
                      <p className="mb-3">
                        We securely process your chat logs to provide real-time AI assistance, maintain session history, and monitor safety thresholds. Your data is AES-256 encrypted.
                      </p>
                      <h4 className="font-semibold text-slate-800 mt-4 mb-1">2. AI Model Training (Optional)</h4>
                      <p className="mb-3">
                        You may optionally permit us to <strong>anonymize</strong> your data safely via differential privacy to help refine our broader models. You can decline this without losing access.
                      </p>
                    </div>

                    {/* Layer 1 - Mandatory */}
                    <label className="flex items-start gap-3 cursor-pointer group mb-3 w-full transition-opacity hover:opacity-80 shrink-0 bg-white/60 p-3 rounded-xl border border-white/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                      <div className="relative flex items-center justify-center mt-0.5">
                        <input
                          id="consent-layer1"
                          type="checkbox"
                          className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-[6px] checked:bg-[#F4845F] checked:border-[#F4845F] transition-colors cursor-pointer"
                          checked={layer1Agreed}
                          onChange={(e) => setLayer1Agreed(e.target.checked)}
                        />
                        <CheckCircle2 className="w-3 h-3 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] text-slate-800 font-semibold select-none leading-tight">
                          I agree to Therapeutic Processing
                        </span>
                        <span className="text-[12px] text-slate-500 mt-0.5">Mandatory to build your profile.</span>
                      </div>
                    </label>

                    {/* Layer 2 - Optional */}
                    <label className="flex items-start gap-3 cursor-pointer group mb-6 w-full transition-opacity hover:opacity-80 shrink-0 bg-white/60 p-3 rounded-xl border border-white/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                      <div className="relative flex items-center justify-center mt-0.5">
                        <input
                          id="consent-layer2"
                          type="checkbox"
                          className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-[6px] checked:bg-[#F4845F] checked:border-[#F4845F] transition-colors cursor-pointer"
                          checked={layer2Agreed}
                          onChange={(e) => setLayer2Agreed(e.target.checked)}
                        />
                        <CheckCircle2 className="w-3 h-3 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] text-slate-800 font-semibold select-none leading-tight">
                          I agree to AI Model Training
                        </span>
                        <span className="text-[12px] text-slate-500 mt-0.5">Optional. Uses anonymized data locally.</span>
                      </div>
                    </label>

                    <div className="flex items-center gap-3 w-full shrink-0">
                      <button
                        type="button"
                        onClick={() => setView("signup")}
                        className="py-3.5 px-6 rounded-full font-medium text-slate-600 border border-slate-200 hover:bg-white w-1/3 transition-all"
                      >
                        Back
                      </button>
                      <button
                        onClick={submitConsentAndRegister}
                        disabled={!layer1Agreed || isLoading}
                        className="clay-button w-2/3 bg-gradient-to-r from-rose-400 to-orange-400 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                      >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Accept & Continue"}
                      </button>
                    </div>
                 </motion.div>
               )}

            {/* ─── FORGOT PASSWORD VIEW ─── */}
              {view === "forgot" && (
                <motion.div
                  key="forgot"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  {resetSent ? (
                    <div className="flex flex-col items-center text-center py-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-5 border border-emerald-100">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-[18px] font-medium text-slate-800 mb-2">
                        Check your email
                      </h3>
                      <p className="text-[14px] text-slate-500 leading-relaxed mb-6 max-w-[300px]">
                        We've sent a password reset link to <span className="font-medium text-slate-700">{email}</span>. 
                        It may take a minute to arrive.
                      </p>
                      <button
                        onClick={() => switchView("signin")}
                        className="clay-button w-full py-3.5 text-slate-800 font-semibold flex items-center justify-center gap-2 hover:bg-[#EDE9E0] transition-colors duration-150"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Sign In
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                      <p className="text-[14px] text-slate-500 leading-relaxed mb-2">
                        Enter the email address you used to sign up and we'll send you a link to reset your password.
                      </p>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 block ml-1" htmlFor="reset-email">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Mail className="w-4 h-4" />
                          </div>
                          <input
                            id="reset-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            autoFocus
                            className="w-full pl-10 pr-4 py-3 bg-white/60 border border-white/40 focus:bg-white focus:border-slate-300 focus:ring-2 focus:ring-slate-200 outline-none rounded-xl transition-all shadow-sm"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="clay-button w-full py-3.5 mt-3 text-slate-800 font-semibold flex items-center justify-center gap-2 hover:bg-[#EDE9E0] transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Reset Link"}
                      </button>
                      <button
                        type="button"
                        onClick={() => switchView("signin")}
                        className="w-full text-center text-sm text-slate-500 hover:text-slate-800 font-medium mt-2 transition-colors"
                      >
                        ← Back to Sign In
                      </button>
                    </form>
                  )}
                </motion.div>
              )}

              {/* ─── SIGN IN / SIGN UP VIEW ─── */}
              {(view === "signin" || view === "signup") && (
                <motion.div
                  key="auth-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <AnimatePresence initial={false}>
                      {view === "signup" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="flex flex-col gap-4"
                        >
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 block ml-1" htmlFor="name">
                              Full Name
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <User className="w-4 h-4" />
                              </div>
                              <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                required={view === "signup"}
                                className="w-full pl-10 pr-4 py-3 bg-white/60 border border-white/40 focus:bg-white focus:border-slate-300 focus:ring-2 focus:ring-slate-200 outline-none rounded-xl transition-all shadow-sm"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 block ml-1" htmlFor="dob">
                              Date of Birth
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Calendar className="w-4 h-4" />
                              </div>
                              <input
                                id="dob"
                                type="date"
                                max={new Date().toISOString().split("T")[0]}
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                required={view === "signup"}
                                className="w-full pl-10 pr-4 py-3 bg-white/60 border border-white/40 focus:bg-white focus:border-slate-300 focus:ring-2 focus:ring-slate-200 outline-none rounded-xl transition-all shadow-sm text-slate-700"
                              />
                            </div>
                          </div>
                          
                          <AnimatePresence>
                            {isUnder18 && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-orange-50/50 border border-orange-200/50 rounded-xl p-3"
                              >
                                <label className="flex items-start gap-2.5 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    className="mt-1 w-4 h-4 rounded border-orange-300 text-orange-500 focus:ring-orange-500"
                                    checked={guardianConsent}
                                    onChange={(e) => setGuardianConsent(e.target.checked)}
                                    required={isUnder18}
                                  />
                                  <span className="text-[13px] text-orange-800 leading-tight">
                                    I am a parent or legal guardian providing consent for this minor to use AI Saathi.
                                  </span>
                                </label>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700 block ml-1" htmlFor="email">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          required
                          className="w-full pl-10 pr-4 py-3 bg-white/60 border border-white/40 focus:bg-white focus:border-slate-300 focus:ring-2 focus:ring-slate-200 outline-none rounded-xl transition-all shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between ml-1 h-5">
                        <label className="text-sm font-medium text-slate-700" htmlFor="password">
                          Password
                        </label>
                        {view === "signin" && (
                          <button 
                            type="button"
                            onClick={() => switchView("forgot")}
                            className="text-xs font-medium text-slate-500 hover:text-[#F4845F] hover:underline transition-all"
                          >
                            Forgot password?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full pl-10 pr-4 py-3 bg-white/60 border border-white/40 focus:bg-white focus:border-slate-300 focus:ring-2 focus:ring-slate-200 outline-none rounded-xl transition-all shadow-sm"
                        />
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className="clay-button w-full py-3.5 mt-5 text-slate-800 font-semibold flex items-center justify-center gap-2 group hover:bg-[#EDE9E0] transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                      whileTap={{ scale: 0.98 }}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          {view === "signup" ? "Continue to Privacy Gateway" : "Sign In"}
                          {view === "signup" ? null : <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-0.5 transition-transform duration-150" />}
                        </>
                      )}
                    </motion.button>
                  </form>

                  <div className="mt-8 mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200/60"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-[#F5F0E8] px-4 text-slate-400">or continue with</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full">
                    <button 
                      type="button" 
                      onClick={() => handleOAuth("google")}
                      className="clay-button w-full py-2.5 flex items-center justify-center gap-2 hover:bg-white transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      <span className="text-sm font-medium text-slate-600">Continue with Google</span>
                    </button>
                  </div>
                  
                  <p className="mt-8 text-center text-sm text-slate-500 font-medium">
                    {view === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button 
                      onClick={() => switchView(view === "signup" ? "signin" : "signup")}
                      className="font-semibold text-[#F4845F] hover:text-[#E06B4D] hover:underline transition-colors duration-150 bg-transparent border-none p-0 cursor-pointer"
                    >
                      {view === "signup" ? "Sign In" : "Sign Up"}
                    </button>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
