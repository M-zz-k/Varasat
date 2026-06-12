"use client";

import Link from "next/link";
import { Shield, Sparkles, MessageSquare, BarChart3, Landmark, ArrowRight, HelpCircle } from "lucide-react";
import ParticleBackground from "../components/ParticleBackground";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-warm-white flex flex-col justify-between selection:bg-gold selection:text-primary relative overflow-hidden">
      <ParticleBackground />
      
      {/* Sleek Premium Header */}
      <header className="border-b border-gold/20 bg-primary/95 text-white backdrop-blur-md sticky top-0 z-50 px-6 py-4 shadow-lg transition-all duration-300">
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
              Live: ₹24.8 Lakhs Recovered Today
            </span>
            <div className="text-xs text-slate-300 flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5 text-gold" />
              <span>Aadhaar & DigiLocker Integrated</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 flex flex-col justify-center space-y-12">
        
        {/* Hero Banner Section */}
        <section className="text-center space-y-6 max-w-3xl mx-auto py-6 drift-in" style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex items-center space-x-2 bg-gold/10 border border-gold/30 text-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            <Landmark className="w-3.5 h-3.5 text-gold" />
            <span>RBI Unclaimed Deposits Circular Compliant</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary leading-tight">
            Recover Your Family's <span className="text-gold underline decoration-gold/40">Dormant Wealth</span>
          </h1>
          <p className="text-lg text-slate-700 leading-relaxed font-light">
            An AI-powered recovery agent designed for Indian families. Seamlessly locate, verify, 
            and mathematically distribute deceased members' assets across Banks, LIC policies, and Mutual Funds.
          </p>
        </section>

        {/* Triple Action Portal Blocks */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          
          {/* Track 1/2: Conversational Mitra (WhatsApp Style) */}
          <div className="bg-primary text-white border border-gold/30 rounded-3xl p-8 flex flex-col justify-between shadow-2xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group drift-in" style={{ animationDelay: '0.2s' }}>
            <div className="absolute top-0 right-0 bg-gold/10 w-32 h-32 rounded-full blur-3xl group-hover:bg-gold/20 transition-all"></div>
            <div className="space-y-6">
              <div className="bg-gold text-primary p-3 w-fit rounded-2xl shadow-lg glow-gold">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <h2 className="text-2xl font-bold">Varasat Mitra</h2>
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
                <span>Language Supported:</span>
                <span className="font-semibold">हिंदी • कन्नड़ • தமிழ் • తెలుగు</span>
              </div>
              <Link href="/mitra">
                <button className="w-full bg-gold hover:bg-gold/90 text-primary font-bold py-3.5 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-gold/20 cursor-pointer">
                  <span>Start Claim (दावा शुरू करें)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>

          {/* Track 2: Advanced Analytics Dashboard */}
          <div className="bg-white text-primary border border-slate-200 rounded-3xl p-8 flex flex-col justify-between shadow-2xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group drift-in" style={{ animationDelay: '0.3s' }}>
            <div className="absolute top-0 right-0 bg-primary/5 w-32 h-32 rounded-full blur-3xl group-hover:bg-primary/10 transition-all"></div>
            <div className="space-y-6">
              <div className="bg-primary text-white p-3 w-fit rounded-2xl shadow-lg glow-gold">
                <BarChart3 className="w-6 h-6 text-gold" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-primary">Claimant Dashboard</h2>
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
                  <span className="text-gold font-bold">Open Analytics Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-gold" />
                </button>
              </Link>
            </div>
          </div>

          {/* Track 3: B2G SaaS Enterprise Portal */}
          <div className="bg-white text-primary border border-gold/30 rounded-3xl p-8 flex flex-col justify-between shadow-2xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group drift-in" style={{ animationDelay: '0.4s' }}>
            <div className="absolute top-0 right-0 bg-gold/5 w-32 h-32 rounded-full blur-3xl group-hover:bg-gold/10 transition-all"></div>
            <div className="space-y-6">
              <div className="bg-gold/10 border border-gold/45 text-primary p-3 w-fit rounded-2xl shadow-md glow-gold">
                <Landmark className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-primary">Bank Partner Portal</h2>
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
                  <span>Enter Bank Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>

        </section>

        {/* Security & Validation badges */}
        <section className="bg-primary/5 border border-gold/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-around space-y-4 md:space-y-0 text-center md:text-left drift-in" style={{ animationDelay: '0.5s' }}>
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
      <footer className="border-t border-slate-200 bg-slate-50 px-6 py-6 text-center text-xs text-slate-500">
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
