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
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.9, duration: 1.1, type: 'spring', stiffness: 120 }}
        className="nav-shell"
        data-scrolled={scrolled ? 'true' : 'false'}
        style={{
          zIndex: 9991,
        }}
      >
        <a href="#hero" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <Logo size={36} />
          <span style={{
            fontFamily: "'Playfair Display', serif", fontWeight: 700,
            fontSize: 22, color: '#2D1B0E', letterSpacing: '-0.02em'
          }}>AI Saathi</span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: 36 }}>
          {['Home', 'How It Works', 'About'].map(link => (
            <a key={link} 
              href={link === 'Home' ? '#hero' : undefined} 
              onClick={(e) => { 
                if (link === 'About') { e.preventDefault(); navigate('/about'); }
                if (link === 'How It Works') { e.preventDefault(); navigate('/how-it-works'); }
              }}
              className="nav-link" data-hover
              style={{ fontSize: 14, fontWeight: 400, color: '#2D1B0E', cursor: (link === 'About' || link === 'How It Works') ? 'pointer' : undefined }}
            >
              {link}
            </a>
          ))}
          <a onClick={(e) => { e.preventDefault(); navigate('/onboarding'); }} data-hover className="journey-btn" style={{
            padding: '12px 26px', fontSize: 13, fontWeight: 600, textDecoration: 'none', cursor: 'pointer'
          }}>
            Walk This Journey Together →
          </a>
        </div>
        
        {/* Mobile Trigger (in nav) */}
        <div className="md:hidden flex items-center ml-auto">
          <button onClick={() => setMobileMenuOpen(true)} style={{ background: 'none', border: 'none', color: '#2D1B0E', padding: 8 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawerful */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9993,
              background: 'rgba(255,244,238,0.98)', backdropFilter: 'blur(32px)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32
            }}
          >
            <button onClick={() => setMobileMenuOpen(false)} style={{
              position: 'absolute', top: 40, right: 40, background: 'none', border: 'none', color: '#2D1B0E', padding: 8
            }}>
               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            {['Home', 'How It Works', 'About'].map(link => (
              <a key={link} 
                href={link === 'Home' ? '#hero' : undefined} 
                onClick={(e) => { 
                  setMobileMenuOpen(false); 
                  if (link === 'About') { e.preventDefault(); navigate('/about'); } 
                  if (link === 'How It Works') { e.preventDefault(); navigate('/how-it-works'); }
                }} 
                style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: '#2D1B0E', textDecoration: 'none', cursor: (link === 'About' || link === 'How It Works') ? 'pointer' : undefined }}
              >
                {link}
              </a>
            ))}
            <a onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigate('/onboarding'); }} className="journey-btn" style={{
              padding: '20px 44px', fontSize: 18, fontWeight: 600, textDecoration: 'none', marginTop: 32, cursor: 'pointer'
            }}>
              Walk This Journey Together →
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
