import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Brain, History, Shield, Lock, Heart } from "lucide-react";

const sections = [
  {
    icon: Brain,
    title: "Opening Philosophy",
    description: "AI Saathi is designed as a reflective companion, not a clinical authority. We believe in providing a safe, non-judgmental space where you can explore your thoughts and emotions freely. We are here to listen, support, and help you find your own inner clarity.",
    bg: "from-purple-100 to-purple-50",
    color: "text-purple-600",
  },
  {
    icon: History,
    title: "Conversational Continuity",
    description: "Healing doesn't happen in isolated moments. AI Saathi features longitudinal memory, meaning it remembers what you've shared in past sessions. You never have to start over or re-explain your trauma. We carry the context forward, just like a real companion would.",
    bg: "from-blue-100 to-blue-50",
    color: "text-blue-600",
  },
  {
    icon: Shield,
    title: "Safety Architecture",
    description: "Your safety is our absolute priority. We employ advanced emotional detection systems that monitor for signs of distress or crisis. If our system determines you need urgent help, it gracefully transitions you to human support, grounding you in the process.",
    bg: "from-rose-100 to-rose-50",
    color: "text-rose-600",
  },
  {
    icon: Lock,
    title: "Privacy & Trust",
    description: "Your conversations are deeply personal, and their security is non-negotiable. All data is protected with state-of-the-art encryption, ensuring that what you share remains strictly between you and AI Saathi. We never compromise on your privacy.",
    bg: "from-amber-100 to-amber-50",
    color: "text-amber-600",
  },
  {
    icon: Heart,
    title: "Human-Centered Experience",
    description: "We designed the interaction pacing to feel natural, warm, and distinctly human. There are no robotic responses or aggressive interventions—only gentle, paced, and deeply empathetic dialogue that respects where you are in your journey.",
    bg: "from-emerald-100 to-emerald-50",
    color: "text-emerald-600",
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-[#F5F0E8] relative overflow-x-hidden">
      {/* Back Link */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-6 left-6 z-50"
      >
        <Link
          to="/"
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors duration-200 bg-white/70 backdrop-blur-md rounded-full px-4 py-2 shadow-sm border border-white/60"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-[14px] font-medium">Back</span>
        </Link>
      </motion.div>

      {/* Hero Header */}
      <section className="pt-28 pb-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto text-center"
        >
          <p
            className="text-[14px] font-semibold tracking-widest uppercase text-slate-400 mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Behind the Scenes
          </p>
          <h1
            className="text-[clamp(36px,5vw,64px)] font-semibold tracking-[-3px] text-slate-900 leading-[1.1]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            How AI Saathi{" "}
            <span
              className="italic bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              understands you
            </span>
          </h1>
          <p
            className="mt-6 text-[17px] text-slate-600 max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            We've built a system that combines the latest in empathetic AI with the foundational principles of human-centered care. Here is how we make it work.
          </p>
        </motion.div>
      </section>

      {/* Sections */}
      <section className="pb-24 px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto flex flex-col gap-8"
        >
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
              className={`rounded-3xl bg-gradient-to-br ${section.bg} p-8 md:p-10 flex flex-col md:flex-row items-start gap-6 border border-white/60 shadow-[6px_6px_12px_rgba(163,177,198,0.15),-6px_-6px_12px_rgba(255,255,255,0.7),inset_2px_2px_4px_rgba(255,255,255,0.8)] transition-shadow duration-300`}
            >
              <div className={`w-16 h-16 shrink-0 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center border border-white/60 shadow-[inset_0_2px_8px_rgba(255,255,255,0.8)]`}>
                <section.icon className={`w-8 h-8 ${section.color}`} />
              </div>
              <div>
                <h3
                  className="text-[22px] font-bold text-slate-900 mb-3"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {section.title}
                </h3>
                <p
                  className="text-[16px] text-slate-600 leading-relaxed"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {section.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
      
      {/* CTA */}
      <section className="pb-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl mx-auto text-center"
        >
          <Link
            to="/onboarding"
            className="inline-flex items-center justify-center px-8 py-4 text-[16px] font-semibold text-white bg-slate-900 rounded-full hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Experience it yourself
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default HowItWorks;
