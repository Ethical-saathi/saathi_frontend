import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

export function LandingNavbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 2.5, duration: 1.2, type: 'spring', stiffness: 100 }}
        style={{
          position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 9991,
          width: '90%', maxWidth: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 24px',
          borderRadius: 40,
          background: scrolled ? 'rgba(255,244,238,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
          border: scrolled ? '1px solid rgba(244,132,95,0.08)' : '1px solid transparent',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <a href="#hero" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <Logo size={28} />
          <span style={{
            fontFamily: "'Playfair Display', serif", fontWeight: 700,
            fontSize: 22, color: '#2D1B0E', letterSpacing: '-0.02em'
          }}>AI Saathi</span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: 36 }}>
          {['Home', 'How It Works', 'For Therapists', 'About'].map(link => (
            <a key={link} 
              href={link === 'About' ? undefined : `#${link.toLowerCase().replace(/ /g, '-')}`} 
              onClick={(e) => { if (link === 'About') { e.preventDefault(); navigate('/about'); } }}
              className="nav-link" data-hover
              style={{ fontSize: 14, fontWeight: 400, color: '#2D1B0E', cursor: link === 'About' ? 'pointer' : undefined }}
            >
              {link}
            </a>
          ))}
          <a onClick={(e) => { e.preventDefault(); navigate('/auth'); }} data-hover className="blob-btn" style={{
            padding: '12px 28px', fontSize: 14, fontWeight: 500, fontFamily: 'var(--font-body)', textDecoration: 'none', cursor: 'pointer'
          }}>
            Begin Your Journey →
          </a>
        </div>
      </motion.nav>

      {/* Mobile Floating Trigger */}
      <div className="md:hidden" style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 9992 }}>
        <button onClick={() => setMobileMenuOpen(true)} className="blob-btn breathing" style={{
          width: 64, height: 64, border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <line x1="4" y1="6" x2="20" y2="6"></line>
            <line x1="4" y1="18" x2="20" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Mobile Drawerful */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9993,
              background: 'rgba(255,244,238,0.95)', backdropFilter: 'blur(32px)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32
            }}
          >
            <button onClick={() => setMobileMenuOpen(false)} style={{
              position: 'absolute', top: 40, right: 40, background: 'none', border: 'none', color: '#2D1B0E'
            }}>
               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            {['Home', 'How It Works', 'For Therapists', 'About'].map(link => (
              <a key={link} 
                href={link === 'About' ? undefined : `#${link.toLowerCase().replace(/ /g, '-')}`} 
                onClick={(e) => { setMobileMenuOpen(false); if (link === 'About') { e.preventDefault(); navigate('/about'); } }} 
                style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: '#2D1B0E', textDecoration: 'none', cursor: link === 'About' ? 'pointer' : undefined }}
              >
                {link}
              </a>
            ))}
            <a onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigate('/auth'); }} className="blob-btn" style={{
              padding: '20px 48px', fontSize: 18, fontWeight: 500, fontFamily: 'var(--font-body)', textDecoration: 'none', marginTop: 32, cursor: 'pointer'
            }}>
              Begin Your Journey →
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
