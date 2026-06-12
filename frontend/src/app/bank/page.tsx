"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Landmark, ShieldCheck, FileText, CheckCircle2, XCircle, 
  ArrowLeft, RefreshCw, Users 
} from "lucide-react";
import FamilyTreeGraph from "../../components/FamilyTreeGraph";
import WolframAuditViewer from "../../components/WolframAuditViewer";
import API_BASE from "../../lib/api";
import ParticleBackground from "../../components/ParticleBackground";

export default function BankEnterprisePortal() {
  const [claims, setClaims] = useState<any[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isActioning, setIsActioning] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  // Authenticate bank officer on mount
  useEffect(() => {
    const authenticateBankOfficer = async () => {
      try {
        // Try to log in
        let response = await fetch(`${API_BASE}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: "9999999999", password: "password123" })
        });
        let data = await response.json();
        if (!data.success) {
          // If login fails, register the bank officer
          response = await fetch(`${API_BASE}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: "SBI Bank Officer",
              phone: "9999999999",
              email: "officer@sbi.co.in",
              password: "password123",
              aadhaar: "000000000000",
              pan: "OFFIC1234E",
              role: "bank_officer"
            })
          });
          data = await response.json();
        }
        if (data.success) {
          setToken(data.token);
        }
      } catch (err) {
        console.error("Failed to authenticate bank officer:", err);
      }
    };
    authenticateBankOfficer();
  }, []);

  const fetchClaims = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/claims/list`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success && data.claims.length > 0) {
        setClaims(data.claims);
        setSelectedClaim(data.claims[0]);
      } else {
        setupMockClaims();
      }
    } catch (err) {
      console.warn("Backend server offline. Using mock claims queue.");
      setupMockClaims();
    } finally {
      setIsLoading(false);
    }
  };

  const setupMockClaims = () => {
    const mockC = [
      {
        id: "claim-uuid-9921",
        status: "Submitted",
        eligibility: "Fast-Track Eligible",
        track: "Success_Fee",
        created_at: new Date().toISOString(),
        asset: {
          type: "Bank Deposit",
          institution: "State Bank of India",
          amount: 650000,
          status: "Verified"
        },
        claimant: {
          name: "Ramesh Kumar Junior",
          phone: "9876543210",
          email: "ramesh.jr@gmail.com",
          aadhaar: "XXXX-XXXX-9012"
        },
        familyMembers: [
          { name: "Savitri Devi", relation: "Widow", sharePercentage: 33.33, shareFraction: "1/3" },
          { name: "Ramesh Kumar Junior", relation: "Son", sharePercentage: 33.33, shareFraction: "1/3" },
          { name: "Sunita Kumari", relation: "Daughter", sharePercentage: 33.33, shareFraction: "1/3" }
        ],
        financialProjections: {
          principal: 650000,
          accruedInterest: 338000,
          totalWealth: 988000,
          inflationAdjustedValue: 691600
        },
        documents: [
          { id: "doc-1", type: "Aadhaar_eKYC", file_url: "/docs/ekyc.pdf", verification_status: "Verified" },
          { id: "doc-2", type: "Death_Certificate", file_url: "/docs/death.pdf", verification_status: "Verified" },
          { id: "doc-3", type: "Indemnity_Bond", file_url: "/docs/bond.pdf", verification_status: "Pending" }
        ]
      }
    ];
    setClaims(mockC);
    setSelectedClaim(mockC[0]);
  };

  useEffect(() => {
    if (token) {
      fetchClaims();
    }
  }, [token]);

  const handleUpdateClaimStatus = async (status: 'Approved' | 'Rejected') => {
    if (!selectedClaim || !token) return;
    setIsActioning(true);

    try {
      // Find the pending Indemnity Bond document
      const bondDoc = selectedClaim.documents?.find((d: any) => d.type === 'Indemnity_Bond' || d.type === 'indemnity_bond');
      const docId = bondDoc ? bondDoc.id : "doc-3";

      const response = await fetch(`${API_BASE}/api/claims/verify-doc`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          docId,
          status: status === 'Approved' ? 'Verified' : 'Rejected'
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(`Claim has been successfully marked as ${status}!`);
        fetchClaims();
      }
    } catch (err) {
      // Fallback update in state
      alert(`Claim marked as ${status} (Local Sandbox Mode)`);
      const updatedClaims = claims.map(c => {
        if (c.id === selectedClaim.id) {
          return {
            ...c,
            status: status === 'Approved' ? 'Approved' : 'Rejected',
            documents: c.documents.map((d: any) => d.type === 'Indemnity_Bond' || d.type === 'indemnity_bond' ? { ...d, verification_status: status === 'Approved' ? 'Verified' : 'Rejected' } : d)
          };
        }
        return c;
      });
      setClaims(updatedClaims);
      setSelectedClaim(updatedClaims.find(c => c.id === selectedClaim.id));
    } finally {
      setIsActioning(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center items-center">
        <RefreshCw className="w-10 h-10 text-gold animate-spin mb-3" />
        <span className="text-sm font-semibold text-primary/85">Loading partner portal queues...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col justify-between selection:bg-gold selection:text-primary relative overflow-hidden">
      
      {/* Header */}
      <header className="border-b border-gold/20 bg-primary/95 text-white sticky top-0 z-50 px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="hover:text-gold transition">
              <ArrowLeft className="w-5 h-5 mr-1" />
            </Link>
            <div>
              <span className="text-lg font-bold tracking-widest text-white">V A R A S A T</span>
              <p className="text-[9px] tracking-wider text-gold font-medium -mt-1">PARTNER ENTERPRISE PORTAL (B2G)</p>
            </div>
          </div>
          <div className="bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/25 flex items-center space-x-1.5 text-xs text-emerald-400">
            <Landmark className="w-3.5 h-3.5" />
            <span>State Bank of India Node</span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8 drift-in relative z-10">
        
        {/* Left Side: Claims Queue */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-xl font-bold text-[#0A2540] flex items-center space-x-2">
            <Landmark className="w-5 h-5 text-gold float" />
            <span>Active Claims Queue</span>
          </h2>

          <div className="space-y-4">
            {claims.map((claim) => (
              <div 
                key={claim.id} 
                onClick={() => setSelectedClaim(claim)}
                className={`border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover-lift ${
                  selectedClaim?.id === claim.id 
                    ? "glass-card-dark text-white border-gold shadow-[0_15px_30px_rgba(212,175,55,0.15)]" 
                    : "glass-card-dark text-white/80 border-gold/30 hover:border-gold/60"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] bg-gold/20 text-gold px-2 py-0.5 rounded border border-gold/30 font-bold uppercase">
                    {claim.asset?.type}
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                    claim.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gold/20 text-gold'
                  }`}>
                    {claim.status}
                  </span>
                </div>
                
                <h3 className="font-extrabold text-base mt-3">{claim.claimant?.name}</h3>
                <p className={`text-xs mt-1 ${selectedClaim?.id === claim.id ? 'text-slate-300' : 'text-slate-400'}`}>Deceased: {claim.asset?.deceased?.deceasedName || "Ramesh Kumar Senior"}</p>
                
                <div className={`flex justify-between items-center mt-4 border-t pt-3 ${selectedClaim?.id === claim.id ? 'border-white/20' : 'border-white/10'}`}>
                  <div>
                    <span className={`text-[9px] block uppercase ${selectedClaim?.id === claim.id ? 'text-slate-300' : 'text-slate-400'}`}>Total Balance</span>
                    <span className="font-bold text-sm">₹{claim.asset?.amount?.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-[9px] block uppercase ${selectedClaim?.id === claim.id ? 'text-slate-300' : 'text-slate-400'}`}>Routing Track</span>
                    <span className="text-xs font-bold text-gold">{claim.track ? claim.track.replace('_', ' ') : ''}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Claims Auditor Details */}
        {selectedClaim && (() => {
          const hasAffidavit = selectedClaim.documents?.some((d: any) => d.type?.toLowerCase() === 'affidavit');
          return (
            <div className="lg:col-span-2 space-y-8">
              
              {/* L1/L2/L3 Audit Dashboard */}
              <div className="glass-card-dark rounded-3xl p-6 shadow-2xl space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <h3 className="text-base font-extrabold text-white flex items-center space-x-1.5">
                    <ShieldCheck className="w-5 h-5 text-gold float" />
                    <span>3-Layer Security Audit Checklist</span>
                  </h3>
                  <span className="text-xs font-bold text-slate-400">
                    Ref: {selectedClaim.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>

                <div className="space-y-4">
                  
                  {selectedClaim.documents && (
                    <div className="bg-[#0A2540]/60 border border-gold/20 rounded-2xl p-4 space-y-3 text-xs">
                      {selectedClaim.documents.map((d: any) => (
                        <div key={d.id} className="flex justify-between items-center py-1 border-b border-white/5 last:border-b-0">
                          <span className="font-semibold text-slate-300">{d.type.replace('_', ' ')}:</span>
                          <span className={`font-bold px-2 py-0.5 rounded ${
                            d.verificationStatus === 'Verified' || d.verification_status === 'Verified' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gold/20 text-gold'
                          }`}>
                            {d.verificationStatus || d.verification_status}
                          </span>
                        </div>
                      ))}
                      {!hasAffidavit && (
                        <div className="flex justify-between items-center py-1 border-b border-white/5 last:border-b-0">
                          <span className="font-semibold text-slate-300">Affidavit:</span>
                          <span className="font-bold px-2.5 py-0.5 rounded bg-red-500/20 text-red-400 animate-pulse uppercase text-[10px] tracking-wide">
                            Awaiting Generation
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>

              {/* Apportionment Visual and Wolfram Code auditor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* SVG Tree */}
                <div className="glass-card-dark text-white rounded-3xl p-6 shadow-2xl">
                  <FamilyTreeGraph 
                    deceasedName={selectedClaim.asset?.deceased?.deceasedName || "Ramesh Kumar Senior"} 
                    shares={selectedClaim.familyMembers || []} 
                  />
                </div>

                {/* Mathematical logs */}
                <div className="glass-card-dark text-white rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-white border-b border-white/10 pb-2 mb-4 flex items-center space-x-1.5">
                      <Users className="w-4 h-4 text-gold" />
                      <span>Wolfram Succession Audit Trace</span>
                    </h3>
                    <WolframAuditViewer
                      wolframCode={`(* HSA Succession Audit Logs *)\nDeceased = "${selectedClaim.asset?.deceased?.deceasedName || "Ramesh Kumar Senior"}";\nHeirs = {"Savitri Devi", "Ramesh Kumar Jr", "Sunita Kumari"};\nShareCount = Length[Heirs]; (* 3 *)\nBasePercentage = 1.0 / ShareCount * 100;\nApportionment = Table[{Heirs[[i]], BasePercentage}, {i, 1, ShareCount}];\nPrint[Apportionment];\n(* Output: Each heir receives 33.33% under HSA Class I *)`}
                      eligibility={selectedClaim.eligibility}
                      shares={selectedClaim.familyMembers || []}
                    />
                  </div>

                  {/* Approve/Reject Controls */}
                  <div className="flex gap-3 pt-4 border-t border-white/10 mt-4">
                    {selectedClaim.status === 'Approved' ? (
                      <div className="w-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold p-3.5 rounded-xl text-xs text-center flex items-center justify-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Claim Approved & Fund Release Authorized</span>
                      </div>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleUpdateClaimStatus('Rejected')}
                          disabled={isActioning}
                          className="border border-red-500/50 text-red-400 hover:bg-red-500/10 font-bold py-3 px-4 rounded-xl text-xs flex-1 cursor-pointer flex items-center justify-center space-x-1.5 transition-all duration-200"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject Claim</span>
                        </button>
                        <button 
                          onClick={() => handleUpdateClaimStatus('Approved')}
                          disabled={isActioning || !hasAffidavit}
                          className={`font-bold py-3 px-4 rounded-xl text-xs flex-1 shadow flex items-center justify-center space-x-1.5 transition-all duration-200 ${
                            hasAffidavit 
                              ? "bg-[#075E54] hover:bg-[#128C7E] text-white cursor-pointer" 
                              : "bg-slate-300 text-slate-500 cursor-not-allowed border border-slate-200"
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{hasAffidavit ? "Approve & Release" : "Awaiting Affidavit"}</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </div>

            </div>
          );
        })()}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 px-6 py-6 text-center text-xs text-slate-500 mt-10">
        <p>© 2026 Varasat Partner Enterprise Portal. Integrated with RBI DBR systems.</p>
      </footer>
    </div>
  );
}
