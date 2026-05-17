import { useState } from "react";
import { ChevronDown, Phone, Shield, Mail } from "lucide-react";

const CRISIS_RESOURCES = [
  { name: "iCall", number: "9152987821", description: "Mon–Sat, 8am–10pm" },
  { name: "Vandrevala Foundation", number: "18602662345", description: "24/7, all languages" },
  { name: "National Emergency", number: "112", description: "Police / Ambulance / Fire" },
];

const FAQ_ITEMS = [
  {
    q: "Is my conversation with Saathi private?",
    a: "Yes, absolutely. Your conversations are encrypted and private. We do not sell your data to any third parties, and your personal thoughts are kept strictly confidential."
  },
  {
    q: "Is Saathi a real therapist?",
    a: "Saathi is an empathetic AI companion designed to help you process your thoughts and feelings. While Saathi uses established psychological frameworks, it is not a licensed human therapist and cannot provide medical diagnosis or treatment."
  },
  {
    q: "What happens if I'm in crisis?",
    a: "If Saathi notices you are going through a particularly difficult time, it will gently pause the conversation to offer you direct contact information for real human support and crisis helplines."
  },
  {
    q: "Can I delete my data?",
    a: "Yes, you have full control over your data. You can permanently delete all your sessions, conversations, and account data at any time by going to Settings > Privacy & Data > Delete all my data."
  },
  {
    q: "How does Saathi remember me?",
    a: "Saathi securely stores a high-level summary of your past sessions to understand your ongoing journey. This helps Saathi bring up relevant context and avoid asking you to repeat yourself."
  },
];

const PRIVACY_RIGHTS = [
  "Access a summary of what we know",
  "Correct any inaccurate data",
  "Erase your data (right to be forgotten)",
  "Withdraw consent for optional data processing",
  "Nominate another person to exercise your rights",
];

const Help = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [openPrivacy, setOpenPrivacy] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [formState, setFormState] = useState<"idle" | "submitting" | "success">("idle");
  const [showContactForm, setShowContactForm] = useState(false);

  const handleSubmitContact = async () => {
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) return;
    setFormState("submitting");
    await new Promise((r) => setTimeout(r, 1000));
    setFormState("success");
    setTimeout(() => {
      setShowContactForm(false);
      setFormState("idle");
      setContactForm({ name: "", email: "", message: "" });
    }, 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto w-full pb-20">
      <div className="max-w-2xl mx-auto px-6 md:px-12 py-10 md:py-16">
        <h1 className="text-[28px] font-medium mb-3" style={{ color: "var(--saathi-text-dark)" }}>
          Help & Support
        </h1>
        <p className="text-[14px] mb-10" style={{ color: "var(--saathi-text-soft)" }}>
          You're never alone. Here's how to get help.
        </p>

        {/* Crisis Card */}
        <div
          className="rounded-2xl p-6 mb-10"
          style={{
            background: "rgba(226,75,74,0.06)",
            border: "1px solid rgba(226,75,74,0.15)",
          }}
        >
          <div className="flex items-center gap-2.5 mb-4">
            <Phone size={18} style={{ color: "var(--saathi-crisis)" }} strokeWidth={2} />
            <h2 className="text-[16px] font-medium" style={{ color: "var(--saathi-text-dark)" }}>
              Crisis Helplines
            </h2>
          </div>
          <p className="text-[13px] mb-5" style={{ color: "var(--saathi-text-mid)" }}>
            If you're in immediate danger or distress, please reach out.
          </p>

          <div className="flex flex-col gap-3">
            {CRISIS_RESOURCES.map((r) => (
              <a
                key={r.number}
                href={`tel:${r.number}`}
                className="flex items-center justify-between px-5 py-4 rounded-xl transition-all hover:shadow-sm group"
                style={{
                  background: "var(--saathi-bg-card)",
                  border: "1px solid var(--saathi-border)",
                }}
              >
                <div>
                  <p className="text-[15px] font-medium" style={{ color: "var(--saathi-text-dark)" }}>
                    {r.name}
                  </p>
                  <p className="text-[12px]" style={{ color: "var(--saathi-text-soft)" }}>
                    {r.description}
                  </p>
                </div>
                <span
                  className="text-[15px] font-medium transition-colors group-hover:underline"
                  style={{ color: "var(--saathi-coral)" }}
                >
                  {r.number}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-10">
          <p className="text-[12px] font-medium tracking-[0.1em] uppercase mb-4 px-1"
            style={{ color: "var(--saathi-text-soft)" }}>
            Frequently Asked Questions
          </p>
          <div className="saathi-card overflow-hidden">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50/50"
                  style={{ borderBottom: "1px solid var(--saathi-border)" }}
                >
                  <span className="text-[14px] font-medium pr-4" style={{ color: "var(--saathi-text-dark)" }}>
                    {item.q}
                  </span>
                  <ChevronDown
                    size={16}
                    className="shrink-0 transition-transform duration-200"
                    style={{
                      color: "var(--saathi-text-soft)",
                      transform: openFaqIndex === i ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>
                {openFaqIndex === i && (
                  <div className="px-5 py-4" style={{ background: "rgba(245,237,216,0.2)" }}>
                    <p className="text-[14px] leading-[1.7]" style={{ color: "var(--saathi-text-mid)" }}>
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Rights Accordion */}
        <div className="mb-10">
          <p className="text-[12px] font-medium tracking-[0.1em] uppercase mb-4 px-1"
            style={{ color: "var(--saathi-text-soft)" }}>
            Your Rights
          </p>
          <div className="saathi-card overflow-hidden">
            <button
              onClick={() => setOpenPrivacy(!openPrivacy)}
              className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50/50"
            >
              <div className="flex items-center gap-2.5">
                <Shield size={16} style={{ color: "var(--saathi-coral)" }} />
                <span className="text-[14px] font-medium" style={{ color: "var(--saathi-text-dark)" }}>
                  Your privacy rights under DPDPA 2023
                </span>
              </div>
              <ChevronDown
                size={16}
                className="shrink-0 transition-transform duration-200"
                style={{
                  color: "var(--saathi-text-soft)",
                  transform: openPrivacy ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>
            {openPrivacy && (
              <div className="px-5 py-4" style={{ background: "rgba(245,237,216,0.2)" }}>
                <p className="text-[14px] mb-3" style={{ color: "var(--saathi-text-mid)" }}>
                  As a data principal under the DPDPA 2023, you have the right to:
                </p>
                <ul className="flex flex-col gap-2">
                  {PRIVACY_RIGHTS.map((right, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-[14px] mt-0.5" style={{ color: "var(--saathi-coral)" }}>•</span>
                      <span className="text-[14px] leading-relaxed" style={{ color: "var(--saathi-text-mid)" }}>
                        {right}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="text-[13px] mt-4" style={{ color: "var(--saathi-text-soft)" }}>
                  To exercise any of these rights, visit Settings → Privacy & Data or email{" "}
                  <a href="mailto:privacy@saathi.in" style={{ color: "var(--saathi-coral)" }}>
                    privacy@saathi.in
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Support */}
        <div>
          <p className="text-[12px] font-medium tracking-[0.1em] uppercase mb-4 px-1"
            style={{ color: "var(--saathi-text-soft)" }}>
            Contact Support
          </p>
          {!showContactForm ? (
            <button
              onClick={() => setShowContactForm(true)}
              className="saathi-card w-full p-5 flex items-center gap-3 text-left transition-colors hover:bg-gray-50/50"
            >
              <Mail size={18} style={{ color: "var(--saathi-coral)" }} />
              <div>
                <p className="text-[14px] font-medium" style={{ color: "var(--saathi-text-dark)" }}>
                  Send us a message
                </p>
                <p className="text-[12px]" style={{ color: "var(--saathi-text-soft)" }}>
                  We usually respond within 24 hours
                </p>
              </div>
            </button>
          ) : (
            <div className="saathi-card p-6">
              {formState === "success" ? (
                <p className="text-[15px] text-center py-4" style={{ color: "var(--saathi-calm)" }}>
                  ✓ Message sent! We'll get back to you soon.
                </p>
              ) : (
                <>
                  <input
                    type="text" placeholder="Your name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="saathi-input mb-3"
                  />
                  <input
                    type="email" placeholder="Your email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="saathi-input mb-3"
                  />
                  <textarea
                    placeholder="How can we help?"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="saathi-textarea mb-4"
                  />
                  <div className="flex gap-3 justify-end">
                    <button onClick={() => setShowContactForm(false)}
                      className="text-[13px]" style={{ color: "var(--saathi-text-soft)" }}>
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitContact}
                      disabled={formState === "submitting"}
                      className="saathi-btn-coral text-[13px] px-5 py-2 h-auto"
                    >
                      {formState === "submitting" ? "Sending…" : "Send"}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Help;
