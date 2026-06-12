import React, { useState, useEffect } from 'react';
import { User, Heart, Star, Sparkles } from 'lucide-react';

interface Heir {
  name: string;
  relation: string;
  shareFraction: string;
  sharePercentage: number;
  isLiving?: boolean;
}

interface FamilyTreeProps {
  deceasedName: string;
  shares: Heir[];
}

export default function FamilyTreeGraph({ deceasedName, shares }: FamilyTreeProps) {
  // Simple automatic layout nodes
  // Deceased node is at the top center
  // Heirs nodes are arranged in a grid/flex row underneath
  const [drawn, setDrawn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setDrawn(true), 300); return () => clearTimeout(t); }, []);

  return (
    <div className="bg-primary/95 border-2 border-gold/40 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-full blur-2xl"></div>
      
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-gold animate-spin" />
          <h3 className="text-sm font-bold tracking-wider text-gold uppercase">Wolfram Graph Tree Apportionment</h3>
        </div>
        <span className="text-[10px] bg-gold/20 text-gold px-2 py-0.5 rounded border border-gold/30">
          Hindu Succession Act Class I
        </span>
      </div>

      <div className="flex flex-col items-center space-y-8 py-4 relative">
        {/* SVG connection lines overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Draw lines from center top (Deceased) to lower children (Heirs) */}
            {shares.length > 0 && shares.map((_, idx) => {
              const startX = "50%";
              const startY = "40"; // level of Deceased node
              const endX = `${((idx + 0.5) / shares.length) * 100}%`;
              const endY = "120"; // level of heirs nodes
              return (
                <g key={idx}>
                  <line 
                    x1={startX} 
                    y1={startY} 
                    x2={endX} 
                    y2={endY} 
                    stroke="#D4AF37" 
                    strokeWidth="1.5" 
                    opacity="0.6"
                    style={{
                      strokeDasharray: 200,
                      strokeDashoffset: drawn ? 0 : 200,
                      transition: `stroke-dashoffset 0.8s ease ${idx * 0.15}s`
                    }}
                  />
                  <circle cx={endX} cy={endY} r="3" fill="#D4AF37" />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Deceased Node */}
        <div className="z-10 bg-gradient-to-r from-red-800 to-red-950 border-2 border-red-500 px-6 py-3 rounded-2xl flex flex-col items-center shadow-lg relative min-w-[140px] text-center">
          <div className="bg-red-500/25 p-1 rounded-full mb-1">
            <Heart className="w-4 h-4 text-red-300 fill-current" />
          </div>
          <span className="text-[10px] text-red-300 font-bold uppercase tracking-wider">Deceased</span>
          <span className="font-extrabold text-sm">{deceasedName}</span>
        </div>

        {/* Heirs Level */}
        <div className="z-10 w-full flex justify-around items-start flex-wrap gap-4 pt-4">
          {shares.length === 0 ? (
            <div className="text-xs text-slate-400 italic py-4">No heirs added to tree yet.</div>
          ) : (
            shares.map((heir, idx) => {
              const hasShare = heir.sharePercentage > 0;
              return (
                <div 
                  key={idx}
                  className={`bg-primary/95 border ${hasShare ? 'border-gold shadow-gold/10' : 'border-slate-700 opacity-60'} px-4 py-3.5 rounded-2xl flex flex-col items-center text-center shadow-lg min-w-[110px] max-w-[130px] transition-all duration-300 hover:-translate-y-2 hover:shadow-gold/30 hover:shadow-lg`}
                  style={{ animation: `slideUp 0.5s cubic-bezier(.22,1,.36,1) ${idx * 0.12}s both` }}
                >
                  <div className={`p-1.5 rounded-full mb-1.5 ${hasShare ? 'bg-gold/20 text-gold' : 'bg-slate-800 text-slate-400'}`}>
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-300 font-semibold">{heir.relation}</span>
                  <span className="font-bold text-xs truncate max-w-full">{heir.name}</span>
                  
                  {hasShare ? (
                    <div className="mt-2 pt-1 border-t border-white/10 w-full flex flex-col items-center">
                      <span className="text-emerald-400 text-sm font-extrabold">{heir.sharePercentage}%</span>
                      <span className="text-[9px] text-slate-400">Share: {heir.shareFraction}</span>
                    </div>
                  ) : (
                    <div className="mt-2 pt-1 border-t border-slate-800 w-full">
                      <span className="text-red-400 text-[9px] font-bold">Passed to descendants</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
