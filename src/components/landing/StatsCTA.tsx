import { motion } from 'framer-motion';
import { ScrambleNumber } from './Effects';
import { useIsMobile } from '../../hooks/useIsMobile';
import Logo from './Logo';
import { useNavigate } from 'react-router-dom';

export default function StatsCTA() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isTablet = !isMobile && typeof window !== 'undefined' && window.innerWidth < 900;

  const stats = [
    { value: '2.18M+', suffix: '', label: 'Clinical data rows trained on' },
    { value: '22', suffix: '', label: 'Psychological conditions mapped' },
    { value: '<65', suffix: 'ms', label: 'Response latency (instantaneous perception)' },
    { value: '100', suffix: '%', label: 'Human escalation on crisis detection' },
  ];

  return (
    <>
      <section id="stats" data-chapter="chapter seven · the numbers" style={{
        padding: isMobile ? '100px 24px' : '200px 48px',
        position: 'relative',
        background: '#FFFAF7',
        borderTop: '1px solid rgba(244,132,95,0.05)',
        overflow: 'hidden',
      }}>
        
        <span className="chapter-label" style={{
          display: 'block', textAlign: 'center', marginBottom: isMobile ? 48 : 80,
        }}>chapter seven · the numbers</span>

        {/* Stats Grid — proper flex column with gap for no overlap */}
        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : (isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'),
          gap: isMobile ? '56px' : (isTablet ? '56px 32px' : '40px 32px'),
          alignItems: 'start',
        }}>
          {stats.map((stat, i) => (
            <div key={i} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              padding: '0 8px',
            }}>
              {/* Number container with fixed min-height */}
              <div style={{
                minHeight: isMobile ? 60 : 80,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}>
                <ScrambleNumber
                  value={stat.value}
                  suffix={stat.suffix}
                  label=""
                  style={{
                    fontSize: isMobile ? '52px' : 'clamp(40px, 5vw, 72px)',
                    textAlign: 'center',
                    transform: i % 2 === 0 ? 'rotate(-2deg)' : 'rotate(2deg)',
                    alignItems: 'center',
                  }}
                />
              </div>
              {/* Label — normal flow, centered, fixed max-width */}
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: isMobile ? '13px' : 'clamp(12px, 1.2vw, 14px)',
                color: '#7A665A',
                lineHeight: 1.5,
                textAlign: 'center',
                maxWidth: 180,
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="cta" data-chapter="chapter eight · join us" style={{ padding: isMobile ? '120px 24px 80px' : '240px 24px 160px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        
        {/* Peak background saturation: Intensive overlapping blobs underneath the button */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', zIndex: -1 }}>
          <div className="breathing-slow" style={{ width: '80vw', height: '80vw', background: '#F4845F', filter: 'blur(200px)', opacity: 0.15, borderRadius: '50%' }} />
          <div className="breathing" style={{ width: '60vw', height: '60vw', background: '#F9C784', filter: 'blur(160px)', opacity: 0.2, position: 'absolute', top: '-20%', left: '-20%' }} />
          <div className="breathing-fast" style={{ width: '50vw', height: '50vw', background: '#C9A0DC', filter: 'blur(160px)', opacity: 0.2, position: 'absolute', bottom: '-20%', right: '-20%' }} />
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
          <span className="chapter-label" style={{ display: 'block', marginBottom: 24, color: '#E06B45' }}>chapter eight · join us</span>
          <h2 className="headline-display" style={{ fontSize: 'clamp(48px, 6vw, 84px)', marginBottom: 32 }}>
            "Your Mental Health<br/>Journey Deserves<br/>to Be Remembered."
          </h2>
          <p className="body-airy" style={{ fontSize: 20, marginBottom: 64 }}>
            Join our early access waitlist.<br/>
            Be among the first to experience an AI<br/>that truly knows you.
          </p>

          <a onClick={(e) => { e.preventDefault(); navigate('/onboarding'); }} data-hover className="journey-btn journey-btn--cta breathing-slow" style={{
            display: 'inline-flex', padding: isMobile ? '20px 38px' : '26px 58px', fontSize: isMobile ? 18 : 22, fontWeight: 700,
            textDecoration: 'none', letterSpacing: 0.6, cursor: 'pointer'
          }}>
            Walk This Journey Together →
          </a>
          
          <div style={{ marginTop: 32, fontSize: 13, color: '#7A665A', letterSpacing: 1, textTransform: 'uppercase', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16 }}>
            <span>No credit card required</span><span>·</span>
            <span>Your privacy is sacred</span><span>·</span>
            <span>Cancel anytime</span>
          </div>
        </motion.div>
      </section>

      <footer style={{ padding: '80px 24px 60px', background: '#FFF4EE', borderTop: '1px solid rgba(244,132,95,0.05)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Logo size={40} />
          
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: '#7A665A', fontStyle: 'italic', marginTop: 32, marginBottom: 80 }}>
            "Built with care, for the people who need it most."
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 32, margin: '0 0 32px' }}>
            <span style={{ fontSize: 14, color: '#2D1B0E', fontWeight: 600 }}>AI Saathi © 2025</span>
            {['Privacy Policy', 'Terms', 'Contact us'].map(l => (
              <a key={l} href="#" data-hover style={{ fontSize: 14, color: '#7A665A', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='#F4845F'} onMouseOut={e=>e.currentTarget.style.color='#7A665A'}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
