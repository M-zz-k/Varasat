"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BarChart3, Calendar, FileText, ArrowDownToLine, Check, 
  HelpCircle, ArrowLeft, Landmark, ShieldCheck, Wallet, RefreshCw 
} from "lucide-react";
import FamilyTreeGraph from "../../components/FamilyTreeGraph";

export default function ClaimantDashboard() {
  const [claims, setClaims] = useState<any[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  // Fetch registered claims from Express API
  const fetchClaims = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/claims/list");
      const data = await response.json();
      if (data.success && data.claims.length > 0) {
        setClaims(data.claims);
        // Load details for first claim
        fetchClaimDetails(data.claims[0].id);
      } else {
        setupMockClaims();
      }
    } catch (err) {
      console.warn("Backend server offline. Setting up mock claimant dashboard.");
      setupMockClaims();
    }
  };

  const fetchClaimDetails = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/claims/details/${id}`);
      const data = await response.json();
      if (data.success) {
        setSelectedClaim(data.claim);
      }
    } catch (err) {
      // Mock update
      const mockC = claims.find(c => c.id === id);
      if (mockC) setSelectedClaim(mockC);
    } finally {
      setIsLoading(false);
    }
  };

  const setupMockClaims = () => {
    const mockClaims = [
      {
        id: "claim-uuid-9921",
        status: "eKYC_Completed",
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
          name: "Ramesh Kumar Junior"
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
          { id: "doc-1", type: "Aadhaar_eKYC", verification_status: "Verified" },
          { id: "doc-2", type: "Death_Certificate", verification_status: "Verified" },
          { id: "doc-3", type: "Indemnity_Bond", verification_status: "Pending" }
        ]
      }
    ];
    setClaims(mockClaims);
    setSelectedClaim(mockClaims[0]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  // PDF Download Trigger connecting to Express PDFKit generator
  const downloadDocument = async (docType: 'affidavit' | 'indemnity_bond') => {
    if (!selectedClaim) return;
    setIsGenerating(docType);

    try {
      const payload = {
        claimId: selectedClaim.id,
        docType: docType,
        claimantName: selectedClaim.claimant?.name || "Ramesh Kumar Junior",
        relation: "Son",
        deceasedName: "Ramesh Kumar Senior",
        assetType: selectedClaim.asset?.type || "Savings Deposit",
        institution: selectedClaim.asset?.institution || "State Bank of India",
        amount: selectedClaim.asset?.amount || 650000,
        language: "Hindi"
      };

      const response = await fetch("http://localhost:5000/api/docs/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Varasat_L3_${docType}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        
        // Refresh details to update document lists
        fetchClaims();
      } else {
        alert("Failed to compile PDF document on server.");
      }
    } catch (err) {
      console.error(err);
      alert("Error generating document. Verify backend is running on Port 5000.");
    } finally {
      setIsGenerating(null);
    }
  };

  const getStepStatusClass = (stepIndex: number, currentStatus: string) => {
    const steps = ["Submitted", "eKYC_Completed", "Approved", "Payout_Processed"];
    const currentIdx = steps.indexOf(currentStatus);
    
    if (currentIdx >= stepIndex) {
      return "bg-emerald-500 border-emerald-500 text-white";
    }
    return "bg-slate-100 border-slate-300 text-slate-400";
  };

  const getLineStatusClass = (stepIndex: number, currentStatus: string) => {
    const steps = ["Submitted", "eKYC_Completed", "Approved", "Payout_Processed"];
    const currentIdx = steps.indexOf(currentStatus);
    
    if (currentIdx > stepIndex) {
      return "bg-emerald-500";
    }
    return "bg-slate-200";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-white flex flex-col justify-center items-center">
        <RefreshCw className="w-10 h-10 text-gold animate-spin mb-3" />
        <span className="text-sm font-semibold text-primary">Loading claimant portfolio data...</span>
      </div>
    );
  }

  const principal = selectedClaim?.financialProjections?.principal || selectedClaim?.asset?.amount || 0;
  const interest = selectedClaim?.financialProjections?.accruedInterest || (principal * 0.52);
  const totalWealth = principal + interest;
  const inflationPower = selectedClaim?.financialProjections?.inflationAdjustedValue || (totalWealth * 0.7);

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
              <p className="text-[9px] tracking-wider text-gold font-medium -mt-1">CLAIMANT ANALYTICS DASHBOARD</p>
            </div>
          </div>
          <button onClick={fetchClaims} className="bg-white/10 hover:bg-white/20 p-2 rounded-xl text-white transition flex items-center space-x-2 text-xs">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Assets</span>
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Claims List and Routing Tracks */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-xl font-bold text-primary flex items-center space-x-2">
            <Wallet className="w-5 h-5 text-gold" />
            <span>Claim Portfolios</span>
          </h2>
          
          <div className="space-y-4">
            {claims.map((claim) => (
              <div 
                key={claim.id} 
                onClick={() => fetchClaimDetails(claim.id)}
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
                  <span className="text-[10px] font-semibold text-slate-400">
                    {new Date(claim.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="font-extrabold text-base mt-3">{claim.asset?.institution}</h3>
                
                <div className="flex justify-between items-center mt-4 border-t border-slate-100/10 pt-3">
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Deposit Value</span>
                    <span className="font-bold text-sm">₹{claim.asset?.amount?.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 block uppercase">Status</span>
                    <span className="text-xs font-bold text-emerald-400">{claim.status.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Business Track Detail block */}
          {selectedClaim && (
            <div className="bg-primary/5 border border-gold/20 rounded-2xl p-6 space-y-3">
              <span className="text-[9px] font-bold text-gold uppercase tracking-wider block">Varasat Routing Model</span>
              <h4 className="text-sm font-extrabold text-primary">
                {selectedClaim.track === "Success_Fee" 
                  ? "Track 2: Post-Payout Success Fee" 
                  : "Track 1: Social Impact Free Model"}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedClaim.track === "Success_Fee" 
                  ? "Since the total asset value is ₹5 Lakh or above, a 0.5% success fee logic is triggered. This fee is due only after the bank releases the assets." 
                  : "Assets under ₹5 Lakh are routed completely free of cost as part of Varasat's B2C Social Impact scheme."}
              </p>
              {selectedClaim.track === "Success_Fee" && (
                <div className="bg-gold/15 border border-gold/30 rounded-xl p-3 flex justify-between items-center text-xs">
                  <span className="font-bold text-primary">Estimated Success Fee (0.5%):</span>
                  <span className="font-extrabold text-primary">₹{(selectedClaim.asset?.amount * 0.005).toLocaleString()}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Projections, Apportionment and L3 Bonds */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Recovery Wealth Metrics Block */}
          {selectedClaim && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-primary flex items-center space-x-1.5">
                  <BarChart3 className="w-5 h-5 text-gold" />
                  <span>Financial Accruals & Real Value Timeline</span>
                </h3>
                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200 uppercase font-semibold">
                  Compounded quarterly (Bank)
                </span>
              </div>

              {/* Graphical Principal vs Accrued Interest splits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-slate-50 rounded-2xl p-4 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wide block">Principal Amount</span>
                  <p className="text-xl font-extrabold text-primary mt-1">₹{principal.toLocaleString()}</p>
                </div>

                <div className="bg-emerald-50 rounded-2xl p-4 text-center">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wide block">Accrued Interest (Compounded)</span>
                  <p className="text-xl font-extrabold text-emerald-600 mt-1">+ ₹{interest.toLocaleString()}</p>
                </div>

                <div className="bg-gold/10 rounded-2xl p-4 text-center border border-gold/20">
                  <span className="text-[10px] uppercase font-bold text-primary tracking-wide block">Total Recovered Wealth</span>
                  <p className="text-xl font-extrabold text-primary mt-1">₹{totalWealth.toLocaleString()}</p>
                </div>

              </div>

              {/* Visual Horizontal Progress Bars */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-600">Principal Deposit (Base)</span>
                    <span className="text-primary">{(principal / totalWealth * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: `${(principal / totalWealth * 100)}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-emerald-600">Interest Accrued Over Dormancy</span>
                    <span className="text-emerald-600">{(interest / totalWealth * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(interest / totalWealth * 100)}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Purchasing Power adjusted text */}
              <div className="bg-primary/5 rounded-2xl p-4 flex items-center justify-between text-xs">
                <span className="text-slate-600">Present Day Inflation-Adjusted Purchasing Power Value:</span>
                <span className="font-extrabold text-primary">₹{inflationPower.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Recovery Timeline Status Tracker */}
          {selectedClaim && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md">
              <h3 className="text-base font-extrabold text-primary border-b border-slate-100 pb-3 mb-6">
                Claim Progress Timeline
              </h3>

              <div className="relative flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0 md:space-x-4">
                
                {/* Horizontal timeline line for large screens */}
                <div className="absolute top-5 left-[12%] right-[12%] h-1 bg-slate-200 hidden md:block -z-10">
                  <div className="h-full bg-emerald-500 transition-all duration-300" style={{
                    width: selectedClaim.status === "Submitted" ? "0%" : selectedClaim.status === "eKYC_Completed" ? "33%" : selectedClaim.status === "Approved" ? "66%" : "100%"
                  }}></div>
                </div>

                {/* Step 1 */}
                <div className="flex flex-col items-center text-center max-w-[150px]">
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-xs ${getStepStatusClass(0, selectedClaim.status)}`}>
                    <Check className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold mt-2.5 text-primary">1. Claim Submitted</h4>
                  <p className="text-[10px] text-slate-500 mt-1">Claim initiated on Varasat Mitra</p>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center max-w-[150px]">
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-xs ${getStepStatusClass(1, selectedClaim.status)}`}>
                    <Check className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold mt-2.5 text-primary">2. L1 & L2 Verified</h4>
                  <p className="text-[10px] text-slate-500 mt-1">Aadhaar eKYC & DigiLocker matched</p>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center max-w-[150px]">
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-xs ${getStepStatusClass(2, selectedClaim.status)}`}>
                    {selectedClaim.status === "Approved" || selectedClaim.status === "Payout_Processed" ? <Check className="w-4 h-4" /> : "3"}
                  </div>
                  <h4 className="text-xs font-bold mt-2.5 text-primary">3. Bank Audited</h4>
                  <p className="text-[10px] text-slate-500 mt-1">Partner bank reviews indemnity bond</p>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col items-center text-center max-w-[150px]">
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-xs ${getStepStatusClass(3, selectedClaim.status)}`}>
                    {selectedClaim.status === "Payout_Processed" ? <Check className="w-4 h-4" /> : "4"}
                  </div>
                  <h4 className="text-xs font-bold mt-2.5 text-primary">4. Payout Processed</h4>
                  <p className="text-[10px] text-slate-500 mt-1">Transfer of wealth completed</p>
                </div>

              </div>
            </div>
          )}

          {/* Heir Apportionment Path & Documents Area */}
          {selectedClaim && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Succession tree viewer */}
              <div className="bg-primary text-white rounded-3xl p-6 shadow-md border border-gold/30">
                <FamilyTreeGraph 
                  deceasedName="Ramesh Kumar Senior" 
                  shares={selectedClaim.familyMembers || []} 
                />
              </div>

              {/* L3 Document downloads panel */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-primary border-b border-slate-100 pb-2.5 mb-4 flex items-center space-x-1.5">
                    <FileText className="w-5 h-5 text-gold" />
                    <span>L3 Secured Documents</span>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    Download legally binding affidavits and indemnity bonds generated dynamically. Signatures 
                    are secured cryptographically via eKYC OTP markers.
                  </p>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => downloadDocument('affidavit')}
                    disabled={isGenerating !== null}
                    className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow cursor-pointer disabled:opacity-50"
                  >
                    {isGenerating === 'affidavit' ? (
                      <span>Generating Affidavit...</span>
                    ) : (
                      <>
                        <ArrowDownToLine className="w-4 h-4 text-gold" />
                        <span className="text-gold">Download Bilingual Affidavit</span>
                      </>
                    )}
                  </button>

                  <button 
                    onClick={() => downloadDocument('indemnity_bond')}
                    disabled={isGenerating !== null}
                    className="w-full bg-white hover:bg-slate-50 text-primary border-2 border-primary font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow cursor-pointer disabled:opacity-50"
                  >
                    {isGenerating === 'indemnity_bond' ? (
                      <span>Generating Indemnity Bond...</span>
                    ) : (
                      <>
                        <ArrowDownToLine className="w-4 h-4" />
                        <span>Download Bank Indemnity Bond</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 px-6 py-4 text-center text-xs text-slate-500 mt-10">
        <p>© 2026 Varasat. Authenticated with National e-Governance Services.</p>
      </footer>
    </div>
  );
}
