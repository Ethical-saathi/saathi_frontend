import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, Lock, User, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type AuthView = "signin" | "signup" | "forgot";

export default function Auth() {
  const navigate = useNavigate();
  const [view, setView] = useState<AuthView>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const clearForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setError("");
  };

  const switchView = (newView: AuthView) => {
    clearForm();
    setResetSent(false);
    setView(newView);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (view === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (signUpError) throw signUpError;
        navigate("/onboarding");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        navigate("/home");
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
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
  };

  return (
    <div className="min-h-screen flex w-full bg-[#F5F0E8]">
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
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative overflow-y-auto">
        <Link 
          to="/" 
          className="absolute top-6 left-6 sm:top-12 sm:left-12 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md my-auto"
        >
          <div className="clay-panel p-8 sm:p-10 w-full transition-all duration-300">
            
            {/* Header */}
            <div className="mb-8 text-center h-[72px]">
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

            {/* ─── FORGOT PASSWORD VIEW ─── */}
            <AnimatePresence mode="wait">
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
                      <p className="text-[12px] text-slate-400 mb-6">
                        Didn't receive it?{" "}
                        <button 
                          onClick={() => setResetSent(false)} 
                          className="text-[#5BA8A0] hover:underline font-medium"
                        >
                          Try again
                        </button>
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
                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        className="clay-button w-full py-3.5 mt-3 text-slate-800 font-semibold flex items-center justify-center gap-2 hover:bg-[#EDE9E0] transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                        whileTap={{ scale: 0.98 }}
                      >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Reset Link"}
                      </motion.button>
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
              {view !== "forgot" && (
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
                          className="space-y-1"
                        >
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
                            className="text-xs font-medium text-slate-500 hover:text-[#5BA8A0] hover:underline transition-all"
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
                          {view === "signup" ? "Sign Up" : "Sign In"}
                          <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-0.5 transition-transform duration-150" />
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
                      className="font-semibold text-[#5BA8A0] hover:text-[#4E938C] hover:underline transition-colors duration-150 bg-transparent border-none p-0 cursor-pointer"
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
