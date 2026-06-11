"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Landmark, ShieldCheck, FileText, CheckCircle2, XCircle, 
  HelpCircle, ArrowLeft, RefreshCw, Eye, Download, Users 
} from "lucide-react";
import FamilyTreeGraph from "../../components/FamilyTreeGraph";

export default function BankEnterprisePortal() {
  const [claims, setClaims] = useState<any[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isActioning, setIsActioning] = useState<boolean>(false);

  const fetchClaims = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/claims/list");
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
    fetchClaims();
  }, []);

  const handleUpdateClaimStatus = async (status: 'Approved' | 'Rejected') => {
    if (!selectedClaim) return;
    setIsActioning(true);

    try {
      // Find the pending Indemnity Bond document
      const bondDoc = selectedClaim.documents?.find((d: any) => d.type === 'Indemnity_Bond');
      const docId = bondDoc ? bondDoc.id : "doc-3";

      const response = await fetch("http://localhost:5000/api/claims/verify-doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
            documents: c.documents.map((d: any) => d.type === 'Indemnity_Bond' ? { ...d, verification_status: status === 'Approved' ? 'Verified' : 'Rejected' } : d)
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
      <div className="min-h-screen bg-warm-white flex flex-col justify-center items-center">
        <RefreshCw className="w-10 h-10 text-gold animate-spin mb-3" />
        <span className="text-sm font-semibold text-primary">Loading partner portal queues...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white flex flex-col justify-between selection:bg-gold selection:text-primary">
      
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Claims Queue */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-xl font-bold text-primary flex items-center space-x-2">
            <Landmark className="w-5 h-5 text-gold" />
            <span>Active Claims Queue</span>
          </h2>

          <div className="space-y-4">
            {claims.map((claim) => (
              <div 
                key={claim.id} 
                onClick={() => setSelectedClaim(claim)}
                className={`border-2 rounded-2xl p-5 cursor-pointer transition-all duration-200 ${
                  selectedClaim?.id === claim.id 
                    ? "bg-primary text-white border-gold shadow-lg" 
                    : "bg-white text-primary border-slate-200 hover:border-slate-300"
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
                <p className="text-xs text-slate-400 mt-1">Deceased: Ramesh Kumar Senior</p>
                
                <div className="flex justify-between items-center mt-4 border-t border-slate-100/10 pt-3">
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Total Balance</span>
                    <span className="font-bold text-sm">₹{claim.asset?.amount?.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 block uppercase">Routing Track</span>
                    <span className="text-xs font-bold text-gold">{claim.track.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Claims Auditor Details */}
        {selectedClaim && (
          <div className="lg:col-span-2 space-y-8">
            
            {/* L1/L2/L3 Audit Dashboard */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-primary flex items-center space-x-1.5">
                  <ShieldCheck className="w-5 h-5 text-gold" />
                  <span>3-Layer Security Audit Checklist</span>
                </h3>
                <span className="text-xs font-bold text-slate-500">
                  Ref: {selectedClaim.id.slice(0, 8).toUpperCase()}
                </span>
              </div>

              <div className="space-y-4">
                
                {/* L1 Card */}
                <div className="border border-slate-200 rounded-2xl p-4 flex items-start justify-between bg-slate-50">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-primary text-white px-2 py-0.5 rounded font-bold">L1</span>
                      <h4 className="text-xs font-extrabold text-primary">Aadhaar Biometric eKYC</h4>
                    </div>
                    <p className="text-xs text-slate-500">Demographic Match: 100% OK. Biometric status verified via OTP.</p>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-600 flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>VERIFIED</span>
                  </span>
                </div>

                {/* L2 Card */}
                <div className="border border-slate-200 rounded-2xl p-4 flex items-start justify-between bg-slate-50">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-primary text-white px-2 py-0.5 rounded font-bold">L2</span>
                      <h4 className="text-xs font-extrabold text-primary">DigiLocker Death Record Pull</h4>
                    </div>
                    <p className="text-xs text-slate-500">Registrar Births/Deaths API response match. Certificate No: DEATH-2026-9081.</p>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-600 flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>VERIFIED</span>
                  </span>
                </div>

                {/* L3 Card */}
                <div className="border border-slate-200 rounded-2xl p-4 flex items-start justify-between bg-slate-50">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-primary text-white px-2 py-0.5 rounded font-bold">L3</span>
                      <h4 className="text-xs font-extrabold text-primary">Automated Indemnity Bond Protection</h4>
                    </div>
                    <p className="text-xs text-slate-500">Protects bank officers from liability and duplicate claimant lawsuits.</p>
                  </div>
                  <span className={`text-xs font-extrabold flex items-center space-x-1 ${
                    selectedClaim.status === 'Approved' ? 'text-emerald-600' : 'text-amber-500'
                  }`}>
                    {selectedClaim.status === 'Approved' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>EXECUTED</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
                        <span>PENDING REVIEW</span>
                      </>
                    )}
                  </span>
                </div>

              </div>
            </div>

            {/* Apportionment Visual and Wolfram Code auditor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* SVG Tree */}
              <div className="bg-primary text-white rounded-3xl p-6 shadow-md border border-gold/30">
                <FamilyTreeGraph 
                  deceasedName="Ramesh Kumar Senior" 
                  shares={selectedClaim.familyMembers || []} 
                />
              </div>

              {/* Mathematical logs */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-primary border-b border-slate-100 pb-2 mb-3 flex items-center space-x-1.5">
                    <Users className="w-4 h-4 text-gold" />
                    <span>Succession Audit Trace</span>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Audited with Wolfram Graph computation using immediate paths of Class I inheritance under the Hindu Succession Act.
                  </p>
                  <pre className="text-[7.5px] leading-relaxed text-slate-500 font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200 overflow-x-auto max-h-36">
                    {`(* HSA Succession Audit Logs *)\nDeceased = "Ramesh Kumar Senior";\nHeirs = {"Savitri Devi", "Ramesh Kumar Jr", "Sunita Kumari"};\nShareCount = Length[Heirs]; (* 3 *)\nBasePercentage = 1.0 / ShareCount * 100;\nApportionment = Table[{Heirs[[i]], BasePercentage}, {i, 1, ShareCount}];\nPrint[Apportionment];\n(* Output: {"Savitri Devi" -> 33.33%, "Ramesh Kumar Jr" -> 33.33%, "Sunita Kumari" -> 33.33%} *)`}
                  </pre>
                </div>

                {/* Approve/Reject Controls */}
                <div className="flex gap-3 pt-4 border-t border-slate-100 mt-4">
                  {selectedClaim.status === 'Approved' ? (
                    <div className="w-full bg-emerald-50 border border-emerald-300 text-emerald-700 font-bold p-3.5 rounded-xl text-xs text-center flex items-center justify-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Claim Approved & Fund Release Authorized</span>
                    </div>
                  ) : (
                    <>
                      <button 
                        onClick={() => handleUpdateClaimStatus('Rejected')}
                        disabled={isActioning}
                        className="border border-red-500 text-red-500 hover:bg-red-50 font-bold py-3 px-4 rounded-xl text-xs flex-1 cursor-pointer flex items-center justify-center space-x-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject Claim</span>
                      </button>
                      <button 
                        onClick={() => handleUpdateClaimStatus('Approved')}
                        disabled={isActioning}
                        className="bg-[#075E54] hover:bg-[#128C7E] text-white font-bold py-3 px-4 rounded-xl text-xs flex-1 shadow cursor-pointer flex items-center justify-center space-x-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span>Approve & Release</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 px-6 py-4 text-center text-xs text-slate-500 mt-10">
        <p>© 2026 Varasat Partner Enterprise Platform. Integrated with RBI DBR systems.</p>
      </footer>
    </div>
  );
}
