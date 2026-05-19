import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, MapPin, Heart, Sparkles, Star } from "lucide-react";

const teamMembers = [
  {
    name: "Jaya Prakash Narayan Mishra",
    role: "Founder (4th Year Undergraduate)",
    email: "contact@saathi.app",
    location: "Odisha, India",
    image: "",
    bio: "Building AI Saathi to bridge the gap between technology and compassionate mental health support. Driven by a belief that everyone deserves a safe space to be heard.",
    accent: "from-rose-400 to-pink-500",
    accentLight: "from-rose-100 to-pink-50",
    iconColor: "text-rose-500",
  }
];

const values = [
  {
    icon: Heart,
    title: "Empathy First",
    description: "Every feature we build starts with understanding the human experience.",
    bg: "from-rose-100 to-rose-50",
    color: "text-rose-500",
  },
  {
    icon: Sparkles,
    title: "Innovation",
    description: "Pushing the boundaries of AI to deliver deeply personalized care.",
    bg: "from-amber-100 to-amber-50",
    color: "text-amber-500",
  },
  {
    icon: Star,
    title: "Excellence",
    description: "Holding ourselves to the highest clinical and technical standards.",
    bg: "from-rose-100 to-rose-50",
    color: "text-rose-500",
  },
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
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const About = () => {
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
            About Us
          </p>
          <h1
            className="text-[clamp(36px,5vw,64px)] font-semibold tracking-[-3px] text-slate-900 leading-[1.1]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            The people behind{" "}
            <span
              className="italic bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-pink-400 to-violet-500"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              your peace of mind
            </span>
          </h1>
          <p
            className="mt-6 text-[17px] text-slate-600 max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            We're a team of therapists, engineers, and designers united by one mission — making compassionate, effective mental health support available to everyone, everywhere.
          </p>
        </motion.div>
      </section>

      {/* Team Section */}
      <section className="pb-16 px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {teamMembers.map((member) => (
            <motion.div
              key={member.name}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`rounded-3xl bg-gradient-to-br ${member.accentLight} p-8 flex flex-col items-center text-center gap-5 border border-white/60 shadow-[6px_6px_12px_rgba(163,177,198,0.15),-6px_-6px_12px_rgba(255,255,255,0.7),inset_2px_2px_4px_rgba(255,255,255,0.8)] transition-shadow duration-300 hover:shadow-[8px_8px_20px_rgba(163,177,198,0.25),-8px_-8px_20px_rgba(255,255,255,0.9),inset_2px_2px_4px_rgba(255,255,255,0.8)]`}
            >
              {/* Avatar */}
              <div className="relative">
                <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${member.accent} p-[3px] shadow-lg`}>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover border-[3px] border-white"
                    loading="lazy"
                  />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center`}
                >
                  <Sparkles className={`w-4 h-4 ${member.iconColor}`} />
                </motion.div>
              </div>

              {/* Name & Role */}
              <div>
                <h3
                  className="text-[20px] font-bold text-slate-900"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {member.name}
                </h3>
                <p
                  className={`text-[14px] font-semibold mt-1 bg-clip-text text-transparent bg-gradient-to-r ${member.accent}`}
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {member.role}
                </p>
              </div>

              {/* Bio */}
              <p
                className="text-[14px] text-slate-600 leading-relaxed"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {member.bio}
              </p>

              {/* Email */}
              <a
                href={`mailto:${member.email}`}
                className="flex items-center gap-2 text-[13px] text-slate-500 hover:text-slate-800 transition-colors duration-200 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/60"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <Mail className="w-3.5 h-3.5" />
                {member.email}
              </a>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Our Values */}
      <section className="pb-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto text-center mb-10"
        >
          <h2
            className="text-[clamp(28px,4vw,42px)] font-semibold tracking-[-2px] text-slate-900"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Our{" "}
            <span className="italic" style={{ fontFamily: "var(--font-serif)" }}>
              values
            </span>
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {values.map((value) => (
            <motion.div
              key={value.title}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className={`rounded-2xl bg-gradient-to-br ${value.bg} p-7 flex flex-col gap-4 border border-white/60 shadow-[4px_4px_10px_rgba(163,177,198,0.15),-4px_-4px_10px_rgba(255,255,255,0.6),inset_1px_1px_3px_rgba(255,255,255,0.8)] transition-shadow duration-300`}
            >
              <div className="w-12 h-12 rounded-xl bg-white/60 backdrop-blur-sm flex items-center justify-center border border-white/60 shadow-[inset_0_2px_8px_rgba(255,255,255,0.8)]">
                <value.icon className={`w-6 h-6 ${value.color}`} />
              </div>
              <h3
                className="text-[17px] font-bold text-slate-900"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {value.title}
              </h3>
              <p
                className="text-[14px] text-slate-600 leading-relaxed"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {value.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Mission Statement */}
      <section className="pb-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto text-center bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-md rounded-[2rem] p-12 border border-white/60 shadow-[6px_6px_14px_rgba(163,177,198,0.15),-6px_-6px_14px_rgba(255,255,255,0.7),inset_2px_2px_4px_rgba(255,255,255,0.8)]"
        >
          <p
            className="text-[14px] font-semibold tracking-widest uppercase text-slate-400 mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Our Mission
          </p>
          <h2
            className="text-[clamp(22px,3vw,32px)] font-semibold tracking-[-1px] text-slate-900 leading-snug"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            "To bridge the gap between traditional therapy and modern technology, creating a world where{" "}
            <span
              className="italic bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-violet-500"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              everyone has access to compassionate mental health support
            </span>
            ."
          </h2>
          <div className="flex items-center justify-center gap-2 mt-6">
            <MapPin className="w-4 h-4 text-slate-400" />
            <p
              className="text-[14px] text-slate-500"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              San Francisco, CA — Serving the world
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
