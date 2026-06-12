import React, { useState, useEffect } from 'react';
import { ArrowUpRight, TrendingUp, ShieldCheck, Landmark } from 'lucide-react';

function useCountUp(target, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const steps = 60;
    const increment = target / steps;
    const interval = duration / steps;
    const t = setInterval(() => {
      start += increment;
      if (start >= target) { setVal(target); clearInterval(t); return; }
      setVal(Math.round(start));
    }, interval);
    return () => clearInterval(t);
  }, [target]);
  return val;
}

export default function DashboardAnalytics({ claimSummary }) {
  // Safe fallbacks for the prop parameters
  const {
    totalRecoverable = 988000,
    principal = 650000,
    accruedInterest = 338000,
    track = "Success Fee",
    status = "Active Audited"
  } = claimSummary || {};

  const animatedTotalRecoverable = useCountUp(totalRecoverable);
  const animatedPrincipal = useCountUp(principal);
  const animatedAccruedInterest = useCountUp(accruedInterest);

  const principalPct = totalRecoverable > 0 ? Math.round((principal / totalRecoverable) * 100) : 65;
  const interestPct = totalRecoverable > 0 ? Math.round((accruedInterest / totalRecoverable) * 100) : 35;

  return (
    <div className="bg-[#F8F9FA] text-[#0A2540] p-8 rounded-[32px] border border-[#D4AF37]/20 shadow-2xl space-y-8 font-sans max-w-4xl mx-auto hover-lift transition-all">
      
      {/* Visual Identity Banner */}
      <div className="bg-[#0A2540] text-[#F8F9FA] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between border-b-4 border-[#D4AF37] shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl group-hover:bg-[#D4AF37]/20 transition-all duration-500"></div>
        <div className="space-y-1.5 z-10 text-center md:text-left">
          <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold bg-white/10 px-3 py-1 rounded-full border border-white/10">
            Varasat Analytics Hub
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">Active Portfolio Architecture</h2>
          <p className="text-xs text-slate-300 font-light">Verified claimant audit trace & legal compounding reports.</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0 z-10 bg-white/10 px-4 py-2 rounded-xl border border-white/10">
          <ShieldCheck className="w-5 h-5 text-[#D4AF37] float" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#F8F9FA]">L3 Bond Protected</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric Card 1: Total Value Discovered */}
        <div 
          className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-[#D4AF37]/40 hover-lift transition-all duration-300 group slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wide">Total Value Discovered</span>
            <div className="bg-emerald-50 text-emerald-700 p-1.5 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <span className="text-3xl font-extrabold tracking-tight text-[#0A2540]">₹{animatedTotalRecoverable.toLocaleString()}</span>
            <div className="flex items-center text-xs text-emerald-600 font-semibold space-x-1">
              <span>Verified Accruals Included</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Card 2: Wealth Architecture (compounding vs principal) */}
        <div 
          className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm col-span-1 md:col-span-2 flex flex-col justify-between hover:border-[#D4AF37]/40 hover-lift transition-all duration-300 slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-4">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wide">Wealth Architecture</span>
            <span className="text-[9px] text-[#D4AF37] font-bold bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20">
              Compounding Split
            </span>
          </div>

          <div className="space-y-4">
            {/* Principal Row */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500">Base Principal Deposit</span>
                <span className="text-[#0A2540]">₹{animatedPrincipal.toLocaleString()} ({principalPct}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-[#0A2540] h-full rounded-full" style={{ width: `${principalPct}%` }}></div>
              </div>
            </div>

            {/* Interest Row */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-emerald-600">Accrued Compound Interest</span>
                <span className="text-emerald-600">+ ₹{animatedAccruedInterest.toLocaleString()} ({interestPct}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${interestPct}%` }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Card 3: Compliance Route Status */}
      <div 
        className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 hover:border-[#D4AF37]/40 hover-lift transition-all duration-300 slide-up"
        style={{ animationDelay: "0.3s" }}
      >
        <div className="flex items-center space-x-3.5">
          <div className="bg-[#D4AF37]/10 p-3 rounded-xl border border-[#D4AF37]/20">
            <Landmark className="w-6 h-6 text-[#0A2540] float" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#0A2540] uppercase tracking-wide">Compliance Routing Scheme</h4>
            <p className="text-xs text-slate-500">Fast-track claim verified against current RBI DBR circular rules.</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <span className="text-[9px] text-slate-400 uppercase font-bold block">Assigned Track</span>
            <span className="text-xs font-extrabold text-[#D4AF37]">{track}</span>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <div className="text-right">
            <span className="text-[9px] text-slate-400 uppercase font-bold block">Claim Status</span>
            <span className="text-xs font-bold text-emerald-600">{status}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
