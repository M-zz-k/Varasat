"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Code2, CheckCircle2 } from "lucide-react";

interface WolframAuditProps {
  wolframCode: string;
  eligibility?: string;
  shares?: { name: string; relation: string; sharePercentage: number; shareFraction: string }[];
}

export default function WolframAuditViewer({ wolframCode, eligibility, shares }: WolframAuditProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#0f172a] border border-[#D4AF37]/20 rounded-2xl overflow-hidden font-mono text-xs shadow-2xl">
      {/* Header bar */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-[#0f172a] hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5"
      >
        <div className="flex items-center space-x-2.5">
          <div className="flex space-x-1.5">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
            <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></span>
            <span className="w-2.5 h-2.5 bg-green-400 rounded-full"></span>
          </div>
          <Code2 className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-[#D4AF37] font-bold text-[10px] uppercase tracking-widest">
            Wolfram Language — Succession Audit Kernel
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-[9px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
            ✓ Execution Complete
          </span>
          {expanded
            ? <ChevronUp className="w-4 h-4 text-slate-400" />
            : <ChevronDown className="w-4 h-4 text-slate-400" />
          }
        </div>
      </button>

      {/* Code block */}
      {expanded && (
        <div className="p-5 overflow-x-auto max-h-72 overflow-y-auto">
          <pre className="text-slate-300 leading-relaxed whitespace-pre-wrap text-[10px]">
            {wolframCode || `(* No Wolfram trace available for this session *)`}
          </pre>
        </div>
      )}

      {/* Share output strip */}
      {shares && shares.length > 0 && (
        <div className="border-t border-white/5 px-5 py-4 space-y-2">
          <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-2">Output: Class I Apportionment Results</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {shares.filter(s => s.sharePercentage > 0).map((s, i) => (
              <div key={i} className="bg-white/5 rounded-xl px-3 py-2.5 border border-white/5 flex flex-col items-center text-center">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 mb-1" />
                <span className="text-[9px] text-slate-400 uppercase">{s.relation}</span>
                <span className="font-bold text-white text-xs truncate max-w-full">{s.name}</span>
                <span className="text-emerald-400 text-sm font-extrabold mt-1">{s.sharePercentage}%</span>
                <span className="text-[8px] text-slate-500">{s.shareFraction}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer eligibility badge */}
      {eligibility && (
        <div className={`px-5 py-3 text-[10px] font-bold uppercase tracking-widest flex items-center space-x-2 border-t border-white/5 ${
          eligibility.includes("Fast-Track") ? "text-emerald-400 bg-emerald-400/5" : "text-amber-400 bg-amber-400/5"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${eligibility.includes("Fast-Track") ? "bg-emerald-400" : "bg-amber-400"}`}></span>
          <span>Routing Result: {eligibility}</span>
        </div>
      )}
    </div>
  );
}
