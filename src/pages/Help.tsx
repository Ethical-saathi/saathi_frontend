import { useState, useEffect } from "react";
import { ChevronDown, Heart } from "lucide-react";
import { Sidebar } from "@/components/chat/Sidebar";
import { cn } from "@/lib/utils";

const faqItems = [
  {
    question: "Is my conversation with Saathi private?",
    answer: "Yes, absolutely. Your conversations are encrypted and private. We do not sell your data to any third parties, and your personal thoughts are kept strictly confidential."
  },
  {
    question: "Is Saathi a real therapist?",
    answer: "Saathi is an empathetic AI companion designed to help you process your thoughts and feelings. While Saathi uses established psychological frameworks, it is not a licensed human therapist and cannot provide medical diagnosis or treatment."
  },
  {
    question: "What happens if I'm in crisis?",
    answer: "If Saathi notices you are going through a particularly difficult time or in immediate distress, it will gently pause the conversation to offer you direct contact information for real human support and crisis helplines."
  },
  {
    question: "Can I delete my data?",
    answer: "Yes, you have full control over your data. You can permanently delete all your sessions, conversations, and account data at any time by going to your Profile > Settings > Delete all my data."
  },
  {
    question: "How does Saathi remember me?",
    answer: "Saathi securely stores a high-level summary of your past sessions to understand your ongoing journey. This helps Saathi bring up relevant context and avoid asking you to repeat yourself, making your experience feel continuous and personal."
  },
];

export const Help = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);

  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formState, setFormState] = useState<'idle'|'submitting'|'success'|'error'>('idle');
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 560);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleFaqClick = (index: number) => {
    setOpenFaqIndex(prev => prev === index ? null : index);
  };

  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleContactSubmit = async () => {
    setAttemptedSubmit(true);
    const { name, email, message } = contactForm;
    
    // Validation
    if (!name.trim() || !email.trim() || !message.trim() || !isEmailValid(email)) {
      return;
    }

    setFormState('submitting');
    
    // Mock POST /api/support/contact
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setFormState('success');
      // Do not clear the form visually yet, just show the success block which replaces it
      setAttemptedSubmit(false);
    } catch {
      setFormState('error');
    }
  };

  const getBorderColor = (field: 'name' | 'email' | 'message') => {
    if (!attemptedSubmit) return "border-black/10 focus:border-[#5BA8A0]";
    
    const value = contactForm[field].trim();
    if (field === 'email' && (!value || !isEmailValid(value))) {
      return "border-[#E8B84B]/60"; // rgba(232, 184, 75, 0.6) Amber
    }
    if (!value) {
      return "border-[#E8B84B]/60";
    }
    return "border-black/10 focus:border-[#5BA8A0]";
  };

  return (
    <div className="flex-1 overflow-y-auto px-[24px] md:px-[48px] py-16 w-full relative">
      <div className="max-w-3xl mx-auto pb-[64px]">

          {/* SECTION 1 - CRISIS RESOURCES CARD */}
          <div className="clay-card !bg-[#FEF9EE]/80 border-l-[2px] border-l-[#FCD34D] p-[24px] mb-[48px]">
            <div className="flex items-center gap-[8px] mb-[16px]">
              <Heart size={18} strokeWidth={1.5} className="text-[#B45309]" />
              <h2 className="text-[15px] font-medium text-[#B45309]">
                If you need immediate support
              </h2>
            </div>

            <div className="flex flex-col">
              {/* Row 1 */}
              <div className="flex justify-between items-start py-[12px]">
                <div className="flex flex-col">
                  <span className="text-[14px] font-medium text-slate-800">iCall</span>
                  <span className="text-[12px] text-slate-500 mt-1">Free, confidential counseling</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">Monday to Saturday, 8am to 10pm</span>
                </div>
                {isMobile ? (
                  <a href="tel:9152987821" className="bg-[#5BA8A0] text-white text-[13px] font-medium px-4 py-1.5 rounded-lg mt-1">Call</a>
                ) : (
                  <span className="text-[15px] font-medium text-slate-800">9152987821</span>
                )}
              </div>
              <div className="w-full h-px bg-black/[0.06]" />

              {/* Row 2 */}
              <div className="flex justify-between items-start py-[12px]">
                <div className="flex flex-col">
                  <span className="text-[14px] font-medium text-slate-800">Vandrevala Foundation</span>
                  <span className="text-[12px] text-slate-500 mt-1">Free mental health helpline</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">Available 24/7</span>
                </div>
                {isMobile ? (
                  <a href="tel:18602662345" className="bg-[#5BA8A0] text-white text-[13px] font-medium px-4 py-1.5 rounded-lg mt-1">Call</a>
                ) : (
                  <span className="text-[15px] font-medium text-slate-800">1860-2662-345</span>
                )}
              </div>
              <div className="w-full h-px bg-black/[0.06]" />

              {/* Row 3 */}
              <div className="flex justify-between items-start py-[12px]">
                <div className="flex flex-col">
                  <span className="text-[14px] font-medium text-slate-800">Emergency</span>
                  <span className="text-[12px] text-slate-500 mt-1">For immediate physical danger</span>
                </div>
                {isMobile ? (
                  <a href="tel:112" className="bg-[#5BA8A0] text-white text-[13px] font-medium px-4 py-1.5 rounded-lg mt-1">Call</a>
                ) : (
                  <span className="text-[15px] font-medium text-slate-800">112</span>
                )}
              </div>
            </div>
          </div>


          {/* SECTION 2 - FAQ ACCORDION */}
          <div className="mb-[48px]">
            <h2 className="text-[18px] font-medium text-slate-800 mb-[20px]">
              Common questions
            </h2>
            
            <div className="w-full h-px bg-black/[0.06]" />
            
            {faqItems.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="flex flex-col w-full">
                  <div 
                    onClick={() => handleFaqClick(idx)}
                    className="flex justify-between items-center py-[18px] cursor-pointer group"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                  >
                    <span className="text-[15px] font-medium text-slate-800 transition-colors group-hover:text-slate-600">
                      {item.question}
                    </span>
                    <span className={cn(
                      "shrink-0 ml-4 transition-transform duration-150 ease-in-out",
                      isOpen ? "text-slate-800 rotate-180" : "text-slate-500 rotate-0 group-hover:text-slate-800"
                    )}>
                      <ChevronDown size={16} strokeWidth={1.5} />
                    </span>
                  </div>
                  
                  <div 
                    id={`faq-answer-${idx}`}
                    className={cn(
                      "overflow-hidden transition-all duration-250 ease-in-out",
                      isOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <p className="text-[14px] font-normal text-slate-500 leading-[1.7] pb-[18px]">
                      {item.answer}
                    </p>
                  </div>
                  
                  <div className="w-full h-px bg-black/[0.06]" />
                </div>
              );
            })}
          </div>


          {/* SECTION 3 - CONTACT FORM */}
          <div>
            <h2 className="text-[18px] font-medium text-slate-800 mb-[6px]">
              Still need help?
            </h2>
            <p className="text-[14px] text-slate-500 mb-[24px]">
              Write to us and we'll get back to you.
            </p>

            {formState === "success" ? (
              <div className="text-left text-[14px] font-medium text-slate-600 clay-card p-[16px]">
                We've received your message. We'll reply to {contactForm.email} within 24 hours.
              </div>
            ) : (
              <div className="w-full">
                
                {!isContactFormOpen && (
                  <button 
                    onClick={() => setIsContactFormOpen(true)}
                    className="clay-button px-[24px] py-[12px] text-[14px]"
                  >
                    Write to us
                  </button>
                )}

                <div 
                  className={cn(
                    "overflow-hidden transition-all duration-250 ease-in-out max-w-xl",
                    isContactFormOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="flex flex-col gap-[16px] py-[4px]">
                    {/* Name Field */}
                    <div className="flex flex-col">
                      <label className="text-[12px] font-medium text-slate-500 mb-[6px]">
                        Your name
                      </label>
                      <input 
                        type="text"
                        value={contactForm.name}
                        onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Your name"
                        className={cn(
                          "clay-input text-[14px]",
                          getBorderColor('name')
                        )}
                      />
                    </div>

                    {/* Email Field */}
                    <div className="flex flex-col">
                      <label className="text-[12px] font-medium text-slate-500 mb-[6px]">
                        Your email
                      </label>
                      <input 
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="you@email.com"
                        className={cn(
                          "clay-input text-[14px]",
                          getBorderColor('email')
                        )}
                      />
                    </div>

                    {/* Message Field */}
                    <div className="flex flex-col">
                      <label className="text-[12px] font-medium text-slate-500 mb-[6px]">
                        Your message
                      </label>
                      <textarea 
                        value={contactForm.message}
                        onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="What do you need help with?"
                        className={cn(
                          "clay-input text-[14px] min-h-[80px] resize-y font-inherit",
                          getBorderColor('message')
                        )}
                      />
                    </div>

                    {/* Error Message */}
                    {formState === 'error' && (
                      <p className="text-[12px] text-slate-500 mt-1">
                        Something went wrong. Please try again.
                      </p>
                    )}

                    {/* Submit Button */}
                    <div className="mt-2 text-left">
                      <button
                        onClick={handleContactSubmit}
                        disabled={
                          formState === 'submitting' ||
                          !contactForm.name.trim() || 
                          !contactForm.email.trim() || 
                          !contactForm.message.trim()
                        }
                        className={cn(
                          "bg-[#5BA8A0] text-white rounded-[12px] px-[24px] py-[14px] text-[14px] font-medium hover:bg-[#4a8e87] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 ease-out hover:scale-[1.04]",
                          isMobile ? "w-full" : "w-auto"
                        )}
                      >
                        {formState === 'submitting' ? "Sending..." : "Send message"}
                      </button>
                    </div>

                    {/* Privacy Note */}
                    <p className="text-[12px] text-slate-400 mt-[8px]">
                      We'll only use your email to reply to this message.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
      </div>
    </div>
  );
};

export default Help;
