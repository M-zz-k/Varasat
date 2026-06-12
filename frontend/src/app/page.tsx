"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Shield, Sparkles, MessageSquare, BarChart3, Landmark, ArrowRight, HelpCircle } from "lucide-react";

const t = {
  en: {
    tagline: "RBI Unclaimed Deposits Circular Compliant",
    sub: "An AI-powered recovery agent designed for Indian families. Seamlessly locate, verify, and mathematically distribute deceased members' assets across Banks, LIC policies, and Mutual Funds.",
    mitra: "Varasat Mitra", mitraSub: "Start Claim (दावा शुरू करें)",
    dashboard: "Claimant Dashboard", dashBtn: "Open Analytics Dashboard",
    bank: "Bank Partner Portal", bankBtn: "Enter Bank Portal",
    secLabel: "Language Supported:",
  },
  hi: {
    tagline: "RBI अदावा जमा परिपत्र अनुपालित",
    sub: "भारतीय परिवारों के लिए AI-संचालित रिकवरी एजेंट। बैंक, LIC पॉलिसी और म्यूचुअल फंड में दिवंगत सदस्यों की संपत्ति खोजें, सत्यापित करें और वितरित करें।",
    mitra: "विरासत मित्र", mitraSub: "दावा शुरू करें",
    dashboard: "दावेदार डैशबोर्ड", dashBtn: "एनालिटिक्स डैशबोर्ड खोलें",
    bank: "बैंक पार्टनर पोर्टल", bankBtn: "बैंक पोर्टल में प्रवेश करें",
    secLabel: "भाषा समर्थित:",
  },
  kn: {
    tagline: "RBI ಅನ್ಕ್ಲೇಮ್ಡ್ ಡೆಪಾಸಿಟ್ ಸರ್ಕ್ಯುಲರ್ ಅನುಸರಣೆ",
    sub: "ಭಾರತೀಯ ಕುಟುಂಬಗಳಿಗಾಗಿ AI-ಚಾಲಿತ ರಿಕವರಿ ಏಜೆಂಟ್. ಬ್ಯಾಂಕ್, LIC ಮತ್ತು ಮ್ಯೂಚ್ಯುಅಲ್ ಫಂಡ್ಗಳಲ್ಲಿ ಆಸ್ತಿ ಪತ್ತೆ, ಪರಿಶೀಲನೆ ಮತ್ತು ವಿತರಣೆ ಮಾಡಿ.",
    mitra: "ವಾರಸಾತ್ ಮಿತ್ರ", mitraSub: "ದಾವೆ ಪ್ರಾರಂಭಿಸಿ",
    dashboard: "ದಾವೆದಾರ ಡ್ಯಾಶ್ಬೋರ್ಡ್", dashBtn: "ಅನಾಲಿಟಿಕ್ಸ್ ಡ್ಯಾಶ್ಬೋರ್ಡ್ ತೆರೆಯಿರಿ",
    bank: "ಬ್ಯಾಂಕ್ ಪಾರ್ಟನರ್ ಪೋರ್ಟಲ್", bankBtn: "ಬ್ಯಾಂಕ್ ಪೋರ್ಟಲ್ ಪ್ರವೇಶಿಸಿ",
    secLabel: "ಭಾಷೆ ಬೆಂಬಲಿತ:",
  },
} as const;

export default function LandingPage() {
  const [lang, setLang] = useState<"en" | "hi" | "kn">("en");
  
  // Count-up state for recovered amount
  const [recovered, setRecovered] = useState(0);
  useEffect(() => {
    const target = 248; // represents ₹24.8 Lakhs in units of 0.1L
    let start = 0;
    const step = () => {
      start += 4;
      if (start >= target) { setRecovered(target); return; }
      setRecovered(start);
      requestAnimationFrame(step);
    };
    const timer = setTimeout(() => requestAnimationFrame(step), 600);
    return () => clearTimeout(timer);
  }, []);

  // IntersectionObserver scroll reveal for badges
  const badgesRef = useRef<HTMLElement>(null);
  const [badgesVisible, setBadgesVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting) setBadgesVisible(true); }, { threshold: 0.2 });
    if (badgesRef.current) obs.observe(badgesRef.current);
    return () => obs.disconnect();
  }, []);

  const getHeroHeadline = () => {
    if (lang === "hi") {
      return (
        <>
          {"अपने परिवार की".split(" ").map((word, i) => (
            <span key={i} className="inline-block word-reveal mr-[0.25em]" style={{ animationDelay: `${i * 0.1}s` }}>{word}</span>
          ))}
          {" "}<span className="gold-shimmer">सुप्त संपत्ति वापस पाएं</span>
        </>
      );
    }
    if (lang === "kn") {
      return (
        <>
          {"ನಿಮ್ಮ ಆಸ್ತಿಯನ್ನು".split(" ").map((word, i) => (
            <span key={i} className="inline-block word-reveal mr-[0.25em]" style={{ animationDelay: `${i * 0.1}s` }}>{word}</span>
          ))}
          {" "}<span className="gold-shimmer">ಮರಳಿ ಪಡೆಯಿರಿ</span>
        </>
      );
    }
    return (
      <>
        {"Recover Your Family's".split(" ").map((word, i) => (
          <span key={i} className="inline-block word-reveal mr-[0.25em]" style={{ animationDelay: `${i * 0.1}s` }}>{word}</span>
        ))}
        {" "}<span className="gold-shimmer">Dormant Wealth</span>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-between selection:bg-gold selection:text-primary relative overflow-hidden">
      
      {/* ── Anti-gravity background layer ── */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
        {/* Morphing blob — top left navy */}
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-[#0A2540]/7 blur-[80px]"
          style={{ animation: "blobMorph 20s ease-in-out infinite, bgDrift 25s ease-in-out infinite" }} />
        {/* Morphing blob — bottom right gold */}
        <div className="absolute -bottom-48 -right-32 w-[520px] h-[520px] bg-[#D4AF37]/8 blur-[90px]"
          style={{ animation: "blobMorph 25s ease-in-out infinite reverse, bgDrift 30s ease-in-out infinite reverse" }} />
        {/* Subtle ledger grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="varasat-grid" width="56" height="56" patternUnits="userSpaceOnUse">
              <path d="M 56 0 L 0 0 0 56" fill="none" stroke="#0A2540" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#varasat-grid)" />
        </svg>
        {/* Floating gold particles */}
        {[
          {s:5, t:"10%", l:"7%",  d:"0s",   dr:"9s" },
          {s:3, t:"28%", l:"93%", d:"1.8s", dr:"11s"},
          {s:7, t:"65%", l:"4%",  d:"3.2s", dr:"8s" },
          {s:4, t:"82%", l:"78%", d:"0.6s", dr:"13s"},
          {s:3, t:"18%", l:"52%", d:"2.4s", dr:"10s"},
          {s:5, t:"50%", l:"38%", d:"4.5s", dr:"12s"},
          {s:3, t:"73%", l:"60%", d:"1.2s", dr:"15s"},
        ].map((p,i) => (
          <div key={i} className="absolute rounded-full bg-[#D4AF37]"
            style={{ width:p.s, height:p.s, top:p.t, left:p.l,
              animation:`floatDot ${p.dr} ease-in-out infinite`, animationDelay:p.d, opacity:0.4 }} />
        ))}
      </div>
      {/* ── end background layer ── */}
      
      {/* Sleek Premium Header */}
      <header className="border-b border-gold/20 bg-primary/95 text-white backdrop-blur-md sticky top-0 px-6 py-4 shadow-lg transition-all duration-300 relative z-10">
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent"
          style={{ animation: "headerBeam 4s ease-in-out infinite" }} />
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gold p-2 rounded-lg flex items-center justify-center shadow-md shadow-gold/20 float">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-widest text-white">V A R A S A T</span>
              <p className="text-[9px] tracking-wider text-gold font-medium -mt-1">INHERITANCE RECOVERY</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping mr-1"></span>
              Live: ₹{(recovered / 10).toFixed(1)} Lakhs Recovered Today
            </span>
            <div className="text-xs text-slate-300 flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5 text-gold" />
              <span>Aadhaar & DigiLocker Integrated</span>
            </div>

            {/* Language toggle pill */}
            <div className="flex items-center bg-white/10 rounded-full p-0.5 border border-white/20 text-[11px] font-bold">
              {(["en","hi","kn"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1 rounded-full transition-all duration-200 cursor-pointer ${
                    lang === l
                      ? "bg-gold text-primary shadow"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {l === "en" ? "EN" : l === "hi" ? "हिं" : "ಕನ್"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 flex flex-col justify-center space-y-12 relative z-10">
        
        {/* Hero Banner Section */}
        <section className="text-center space-y-6 max-w-3xl mx-auto py-6 slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="inline-flex items-center space-x-2 bg-gold/10 border border-gold/30 text-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            <Landmark className="w-3.5 h-3.5 text-gold" />
            <span>{t[lang].tagline}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary leading-tight">
            {getHeroHeadline()}
          </h1>
          <p className="text-lg text-slate-700 leading-relaxed font-light">
            {t[lang].sub}
          </p>
        </section>

        {/* Triple Action Portal Blocks */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 slide-up" style={{ animationDelay: '0.4s' }}>
          
          {/* Track 1/2: Conversational Mitra (WhatsApp Style) */}
          <div className="glass-card-dark text-white border border-gold/30 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(212,175,55,0.15)] transition-all duration-500">
            <div className="absolute top-0 right-0 bg-gold/10 w-32 h-32 rounded-full blur-3xl group-hover:bg-gold/20 transition-all"></div>
            <div className="space-y-6">
              <div className="bg-gold text-primary p-3 w-fit rounded-2xl shadow-lg glow-gold">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <h2 className="text-2xl font-bold">{t[lang].mitra}</h2>
                  <span className="text-[10px] bg-success/20 text-success border border-success/30 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Voice</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Start your recovery claim using our conversational voice assistant. Tailored for rural users 
                  with Hindi, Kannada, Tamil, & Telugu speech inputs. Zero typing required.
                </p>
              </div>
            </div>
            <div className="pt-8 space-y-4">
              <div className="text-[11px] text-gold border-t border-white/10 pt-4 flex justify-between">
                <span>{t[lang].secLabel}</span>
                <span className="font-semibold">हिंदी • ಕನ್ನಡ • தமிழ் • తెలుగు</span>
              </div>
              <Link href="/mitra">
                <button className="w-full bg-gold hover:bg-gold/90 text-primary font-bold py-3.5 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-gold/20 cursor-pointer">
                  <span>{t[lang].mitraSub}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>

          {/* Track 2: Advanced Analytics Dashboard */}
          <div className="glass-card text-primary rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(212,175,55,0.15)] transition-all duration-500">
            <div className="absolute top-0 right-0 bg-primary/5 w-32 h-32 rounded-full blur-3xl group-hover:bg-primary/10 transition-all"></div>
            <div className="space-y-6">
              <div className="bg-primary text-white p-3 w-fit rounded-2xl shadow-lg glow-gold">
                <BarChart3 className="w-6 h-6 text-gold" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-primary">{t[lang].dashboard}</h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Track the progress of registered claims in real-time. View mathematically generated 
                  heir apportionments (HSA Class I), compounding accrued interest vs principal, and download indemnity documents.
                </p>
              </div>
            </div>
            <div className="pt-8 space-y-4">
              <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-4 flex justify-between">
                <span>Routing Track:</span>
                <span className="font-semibold text-primary">Free B2C &lt; ₹5L / Success Fee &gt; ₹5L</span>
              </div>
              <Link href="/dashboard">
                <button className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3.5 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg cursor-pointer">
                  <span className="text-gold font-bold">{t[lang].dashBtn}</span>
                  <ArrowRight className="w-4 h-4 text-gold" />
                </button>
              </Link>
            </div>
          </div>

          {/* Track 3: B2G SaaS Enterprise Portal */}
          <div className="glass-card text-primary border border-gold/30 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(212,175,55,0.15)] transition-all duration-500">
            <div className="absolute top-0 right-0 bg-gold/5 w-32 h-32 rounded-full blur-3xl group-hover:bg-gold/10 transition-all"></div>
            <div className="space-y-6">
              <div className="bg-gold/10 border border-gold/45 text-primary p-3 w-fit rounded-2xl shadow-md glow-gold">
                <Landmark className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-primary">{t[lang].bank}</h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Enterprise verification SaaS dashboard for banks and insurance providers. Review digital eKYC logs, 
                  audit DigiLocker-linked records, and verify automated indemnity bonds for fast-track processing.
                </p>
              </div>
            </div>
            <div className="pt-8 space-y-4">
              <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-4 flex justify-between">
                <span>Security Standards:</span>
                <span className="font-semibold text-primary">L1 eKYC • L2 DigiLocker • L3 Bond</span>
              </div>
              <Link href="/bank">
                <button className="w-full bg-white hover:bg-slate-50 text-primary border-2 border-primary font-bold py-3 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-md cursor-pointer">
                  <span>{t[lang].bankBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>

        </section>

        {/* Security & Validation badges */}
        <section ref={badgesRef} className={`bg-primary/5 border border-gold/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-around space-y-4 md:space-y-0 text-center md:text-left transition-all duration-700 ${badgesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-gold flex-shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-primary">L1: Aadhaar Biometric eKYC</h4>
              <p className="text-xs text-slate-600">Secure digital identity matching instantly via OTP tokens.</p>
            </div>
          </div>
          <div className="h-px w-12 bg-gold/25 hidden md:block"></div>
          <div className="flex items-center space-x-3">
            <Landmark className="w-8 h-8 text-primary flex-shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-primary">L2: DigiLocker Certificate Vault</h4>
              <p className="text-xs text-slate-600">Automatic retrieval of death certificates to eradicate fraud.</p>
            </div>
          </div>
          <div className="h-px w-12 bg-gold/25 hidden md:block"></div>
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-emerald-600 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-primary">L3: Bank Indemnity Lock</h4>
              <p className="text-xs text-slate-600">Auto-generated indemnity documents minimizing civil litigation liability.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Corporate Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 px-6 py-6 text-center text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <p>© 2026 Varasat Systems Private Limited. Secured under Digital India Framework.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-primary flex items-center space-x-1">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>How it works</span>
            </a>
            <span>•</span>
            <a href="#" className="hover:text-primary">FAQ</a>
            <span>•</span>
            <a href="#" className="hover:text-primary">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
