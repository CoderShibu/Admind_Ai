import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";

const useCountUp = (end: number, duration = 1500) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return count;
};

const phrases = [
  "AI-Powered Marketing Intelligence",
  "Turn Data Into Revenue",
  "Smart Campaign Optimization",
  "Built for D2C Brands",
];

export default function LandingPage() {
  const navigate = useNavigate();

  // Animations & States
  const secCount = useCountUp(20, 1200);
  const agentCount = useCountUp(6, 1000);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const [mousePos, setMousePos] = useState({x:0, y:0});
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const phrase = phrases[phraseIndex];
    if (typing) {
      if (displayed.length < phrase.length) {
        const t = setTimeout(() => 
          setDisplayed(phrase.slice(0, displayed.length + 1))
        , 60);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), 2000);
        return () => clearTimeout(t);
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => 
          setDisplayed(displayed.slice(0, -1))
        , 30);
        return () => clearTimeout(t);
      } else {
        setPhraseIndex((i) => (i + 1) % phrases.length);
        setTyping(true);
      }
    }
  }, [displayed, typing, phraseIndex]);

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white relative overflow-hidden font-sans">
      {/* SECTION 1 — ANIMATED BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute rounded-full w-[400px] h-[400px]"
          style={{ 
            background: 'rgba(0,212,255,0.12)', 
            top: '10%', left: '10%', 
            filter: 'blur(80px)', pointerEvents: 'none',
            animation: 'orb-float-1 20s ease-in-out infinite' 
          }} 
        />
        <div 
          className="absolute rounded-full w-[400px] h-[400px]"
          style={{ 
            background: 'rgba(0,232,122,0.08)', 
            bottom: '10%', right: '10%', 
            filter: 'blur(80px)', pointerEvents: 'none',
            animation: 'orb-float-2 25s ease-in-out infinite' 
          }} 
        />
        <div 
          className="absolute rounded-full w-[400px] h-[400px]"
          style={{ 
            background: 'rgba(139,92,246,0.08)', 
            top: '40%', right: '20%', 
            filter: 'blur(80px)', pointerEvents: 'none',
            animation: 'pulse-glow 6s ease-in-out infinite' 
          }} 
        />
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            pointerEvents: 'none'
          }}
        />
        {/* Particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 2 + 2}px`,
              height: `${Math.random() * 2 + 2}px`,
              background: Math.random() > 0.5 ? '#fff' : '#00D4FF',
              opacity: Math.random() * 0.3 + 0.3,
              left: `${Math.random() * 100}%`,
              bottom: '-10px',
              animation: `particle-rise ${8 + Math.random() * 12}s linear infinite`,
              animationDelay: `-${Math.random() * 20}s`,
            }}
          />
        ))}
      </div>

      {/* SECTION 2 — NAVBAR */}
      <nav 
        className="fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-between"
        style={{
          background: scrolled ? 'rgba(10, 15, 30, 0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0, 212, 255, 0.15)' : '1px solid transparent',
          transition: 'all 0.3s ease'
        }}
      >
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight" style={{ color: '#00D4FF' }}>
          <Zap className="h-5 w-5 fill-current" /> Admind AI
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#00D4FF]/10"
            style={{ border: '1px solid #00D4FF', color: '#00D4FF' }}
          >
            Sign In
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105"
            style={{ background: '#00D4FF', color: '#0A0F1E' }}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* SECTION 3 — HERO SECTION */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] pt-20 px-4">
        
        {/* Floating Cards (Section 4) injected here so they share positioning context */}
        <div 
          className="absolute hidden lg:block"
          style={{ 
            left: '5%', top: '25%', 
            animation: 'float-card-1 6s ease-in-out infinite',
            transform: `translateX(${mousePos.x * 0.3}px) translateY(${mousePos.y * 0.3}px)`,
            transition: 'transform 0.1s ease'
          }}
        >
          <div 
            style={{
              background: 'rgba(15,25,50,0.9)',
              border: '1px solid rgba(0,212,255,0.2)',
              borderRadius: '16px', padding: '16px 20px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
            }}
          >
            <div style={{ color: '#9CA3AF', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>ROAS</div>
            <div style={{ color: '#00E87A', fontSize: '28px', fontWeight: 'bold', lineHeight: '1' }}>4.3x</div>
            <div style={{ color: '#00E87A', fontSize: '11px', marginTop: '6px' }}>↑ 23% vs last month</div>
            <div className="mt-3 flex items-end gap-1 h-6">
              <div className="w-1.5 h-3 bg-[#00E87A]/40 rounded-t" />
              <div className="w-1.5 h-4 bg-[#00E87A]/70 rounded-t" />
              <div className="w-1.5 h-6 bg-[#00E87A] rounded-t" />
            </div>
          </div>
        </div>

        <div 
          className="absolute hidden lg:block"
          style={{ 
            right: '5%', top: '20%', 
            animation: 'float-card-2 7s ease-in-out infinite 1s',
            transform: `translateX(${mousePos.x * -0.2}px) translateY(${mousePos.y * -0.2}px)`,
            transition: 'transform 0.1s ease'
          }}
        >
          <div 
            style={{
              background: 'rgba(15,25,50,0.9)', border: '1px solid rgba(0,212,255,0.2)',
              borderRadius: '16px', padding: '16px 20px', backdropFilter: 'blur(10px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
            }}
          >
            <div style={{ color: '#9CA3AF', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>AI INSIGHTS</div>
            <div style={{ color: '#00D4FF', fontSize: '28px', fontWeight: 'bold', lineHeight: '1' }}>8</div>
            <div style={{ color: '#9CA3AF', fontSize: '11px', marginTop: '6px' }}>Generated in 18 sec</div>
            <div className="mt-2 text-[#00D4FF]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
            </div>
          </div>
        </div>

        <div 
          className="absolute hidden lg:block"
          style={{ 
            left: '8%', bottom: '15%', 
            animation: 'float-card-3 8s ease-in-out infinite 0.5s',
            transform: `translateX(${mousePos.x * 0.4}px) translateY(${mousePos.y * 0.2}px)`,
            transition: 'transform 0.1s ease'
          }}
        >
          <div 
            style={{
              background: 'rgba(15,25,50,0.9)', border: '1px solid rgba(0,212,255,0.2)',
              borderRadius: '16px', padding: '16px 20px', backdropFilter: 'blur(10px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
            }}
          >
            <div style={{ color: '#9CA3AF', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>AD SPEND</div>
            <div style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold', lineHeight: '1' }}>₹4.28L</div>
            <div style={{ color: '#9CA3AF', fontSize: '11px', marginTop: '6px' }}>Across 10 campaigns</div>
            <div className="flex items-center gap-2 mt-3">
              <span className="flex items-center gap-1 text-[10px] bg-white/5 px-2 py-0.5 rounded-full"><div className="w-1.5 h-1.5 rounded-full bg-[#1877F2]"></div> Meta</span>
              <span className="flex items-center gap-1 text-[10px] bg-white/5 px-2 py-0.5 rounded-full"><div className="w-1.5 h-1.5 rounded-full bg-[#EA4335]"></div> Google</span>
            </div>
          </div>
        </div>

        <div 
          className="absolute hidden lg:block"
          style={{ 
            right: '7%', bottom: '20%', 
            animation: 'float-card-4 6.5s ease-in-out infinite 2s',
            transform: `translateX(${mousePos.x * -0.3}px) translateY(${mousePos.y * -0.3}px)`,
            transition: 'transform 0.1s ease'
          }}
        >
          <div 
            style={{
              background: 'rgba(15,25,50,0.9)', border: '1px solid rgba(0,212,255,0.2)',
              borderRadius: '16px', padding: '16px 20px', backdropFilter: 'blur(10px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
            }}
          >
            <div style={{ color: '#9CA3AF', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>TOP CAMPAIGN</div>
            <div style={{ color: '#00E87A', fontSize: '28px', fontWeight: 'bold', lineHeight: '1' }}>7.2x</div>
            <div style={{ color: '#fff', fontSize: '12px', marginTop: '6px' }}>Retargeting Cart</div>
            <div className="mt-3 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: 'rgba(0,232,122,0.2)', color: '#00E87A', border: '1px solid rgba(0,232,122,0.3)' }}>
              🚀 Scaling
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="flex flex-col items-center text-center max-w-4xl relative z-20">
          <div className="animate-fade-up" style={{ animationDelay: '0ms' }}>
            <div 
              style={{
                background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)',
                padding: '6px 16px', borderRadius: '999px', color: '#00D4FF', fontSize: '13px',
                marginBottom: '24px', display: 'inline-block'
              }}
            >
              ✦ {displayed}<span className="inline-block animate-blink">|</span>
            </div>
          </div>

          <h1 className="animate-fade-up md:text-[72px] text-[40px] font-extrabold leading-[1.1] text-white tracking-tight mb-6" style={{ animationDelay: '150ms' }}>
            Turn Campaign Data<br/>
            <span 
              style={{
                background: 'linear-gradient(135deg, #00D4FF, #00E87A)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}
            >
              Into Revenue
            </span>
          </h1>

          <p className="animate-fade-up text-lg text-[#9CA3AF] max-w-[520px] mx-auto text-center mb-10 leading-relaxed" style={{ animationDelay: '300ms' }}>
            Upload your campaign CSV and get AI-powered insights, budget recommendations, and ad copy suggestions in under 20 seconds.
          </p>

          <div className="animate-fade-up flex flex-col items-center w-full mb-16" style={{ animationDelay: '450ms' }}>
            <button 
              onClick={() => navigate('/login')}
              className="hover:scale-105 hover:brightness-110 transition-all text-center"
              style={{
                background: 'linear-gradient(135deg, #00D4FF, #0099BB)', color: '#0A0F1E',
                fontWeight: 700, padding: '16px 48px', borderRadius: '10px', fontSize: '16px',
                minWidth: '220px',
                boxShadow: '0 0 20px rgba(0,212,255,0.4)', animation: 'pulse-glow 2s ease-in-out infinite'
              }}
            >
              🚀 Start For Free
            </button>
          </div>

          <div className="animate-fade-up flex flex-wrap justify-center gap-8 md:gap-16 border-y border-white/10 py-6 px-8 rounded-2xl bg-white/5 backdrop-blur-sm" style={{ animationDelay: '600ms' }}>
            <div className="text-center">
              <div className="text-white font-bold text-2xl">{secCount} sec</div>
              <div className="text-[#6B7280] text-xs">Average analysis time</div>
            </div>
            <div className="w-[1px] bg-white/10 hidden md:block" />
            <div className="text-center">
              <div className="text-white font-bold text-2xl">{agentCount} AI Agents</div>
              <div className="text-[#6B7280] text-xs">Working simultaneously</div>
            </div>
            <div className="w-[1px] bg-white/10 hidden md:block" />
            <div className="text-center">
              <div className="text-white font-bold text-2xl">Free</div>
              <div className="text-[#6B7280] text-xs">No credit card required</div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5 — FEATURES ROW */}
      <div className="relative z-10 w-full" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '64px 0' }}>
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10">
          <div className="flex flex-col items-center text-center px-4 py-4 lg:py-0">
            <div className="text-[40px] mb-4 bg-cyan-500/20 w-16 h-16 rounded-full flex items-center justify-center border border-cyan-500/30">📊</div>
            <h3 className="text-white font-bold text-[15px] mb-2">Instant Analytics</h3>
            <p className="text-[#9CA3AF] text-[13px] leading-relaxed">ROAS, CTR, CAC computed in seconds across campaigns</p>
          </div>
          <div className="flex flex-col items-center text-center px-4 py-4 lg:py-0">
            <div className="text-[40px] mb-4 bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center border border-purple-500/30">🧠</div>
            <h3 className="text-white font-bold text-[15px] mb-2">AI Insights</h3>
            <p className="text-[#9CA3AF] text-[13px] leading-relaxed">Groq-powered analysis of every single campaign line</p>
          </div>
          <div className="flex flex-col items-center text-center px-4 py-4 lg:py-0">
            <div className="text-[40px] mb-4 bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center border border-blue-500/30">💬</div>
            <h3 className="text-white font-bold text-[15px] mb-2">Chat Interface</h3>
            <p className="text-[#9CA3AF] text-[13px] leading-relaxed">Ask questions about your data using natural language</p>
          </div>
          <div className="flex flex-col items-center text-center px-4 py-4 lg:py-0">
            <div className="text-[40px] mb-4 bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center border border-green-500/30">📄</div>
            <h3 className="text-white font-bold text-[15px] mb-2">PDF Reports</h3>
            <p className="text-[#9CA3AF] text-[13px] leading-relaxed">Branded presentation reports ready to share instantly</p>
          </div>
        </div>
      </div>

      {/* SECTION 6 — BOTTOM CTA */}
      <div className="relative z-10 py-32 flex flex-col items-center text-center px-4">
        <h2 className="text-[42px] font-extrabold text-white mb-4 leading-tight">Ready to 10x your marketing ROI?</h2>
        <p className="text-[#9CA3AF] mb-10 max-w-md mx-auto text-lg">Join D2C brands using AI to make smarter marketing decisions every day.</p>
        
        <button 
          onClick={() => navigate('/login')}
          className="hover:scale-105 hover:brightness-110 transition-all font-bold group flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #00D4FF, #0099BB)', color: '#0A0F1E',
            padding: '16px 48px', borderRadius: '10px', fontSize: '18px', minWidth: '220px',
            boxShadow: '0 0 20px rgba(0,212,255,0.4)', animation: 'pulse-glow 2s ease-in-out infinite'
          }}
        >
          Get Started Free <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>

        <div style={{ marginTop: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ color: '#6B7280', fontSize: '13px', marginBottom: '12px' }}>
            Connect with the Developer
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {/* LINKEDIN BUTTON */}
            <a 
              href="https://www.linkedin.com/in/shibasishbanerjee"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'rgba(10, 102, 194, 0.15)',
                border: '1px solid rgba(10, 102, 194, 0.4)',
                color: '#4A9FE0',
                borderRadius: '10px',
                padding: '10px 24px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(10, 102, 194, 0.25)';
                e.currentTarget.style.borderColor = 'rgba(10, 102, 194, 0.7)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(10, 102, 194, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(10, 102, 194, 0.4)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#4A9FE0">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
              LinkedIn
            </a>

            {/* GMAIL BUTTON */}
            <a 
              href="mailto:shibasish2005@gmail.com"
              style={{
                background: 'rgba(234, 67, 53, 0.12)',
                border: '1px solid rgba(234, 67, 53, 0.35)',
                color: '#F28B82',
                borderRadius: '10px',
                padding: '10px 24px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(234, 67, 53, 0.22)';
                e.currentTarget.style.borderColor = 'rgba(234, 67, 53, 0.6)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(234, 67, 53, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(234, 67, 53, 0.35)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F28B82" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Gmail
            </a>
          </div>
        </div>

        <div style={{ color: '#4B5563', fontSize: '12px', marginTop: '60px' }}>
          © 2026 Admind AI · Built with Marketing Knowledge and Fun · Shibasish Banerjee 🚀
        </div>
      </div>
    </div>
  );
}
