"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Phone, Send, Mic, ShieldCheck, FileText, CheckCircle2, 
  HelpCircle, UserCheck, Plus, Landmark, Trash2, ChevronRight 
} from "lucide-react";
import FamilyTreeGraph from "../../components/FamilyTreeGraph";
import API_BASE from "../../lib/api";
import ParticleBackground from "../../components/ParticleBackground";

// Define message structure
interface Message {
  sender: "mitra" | "user";
  text: string;
  type?: "standard" | "action" | "widget";
  widgetName?: string;
  timestamp: string;
}

export default function VarasatMitraPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState<string>("language");
  const [language, setLanguage] = useState<string>("en");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");

  // Input states
  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    aadhaar: "",
    pan: ""
  });
  
  const [otpCode, setOtpCode] = useState("");
  const [ekycData, setEkycData] = useState<any>(null);
  
  const [deceasedData, setDeceasedData] = useState({
    name: "Ramesh Kumar Senior",
    deathDate: "2026-02-14",
    certificateId: "DEATH-2026-9081"
  });
  const [deathCertificate, setDeathCertificate] = useState<any>(null);

  // Heirs states
  const [familyMembers, setFamilyMembers] = useState<any[]>([
    { name: "Savitri Devi", relation: "Widow", isLiving: true },
    { name: "Ramesh Kumar Junior", relation: "Son", isLiving: true },
    { name: "Sunita Kumari", relation: "Daughter", isLiving: true }
  ]);
  const [newMember, setNewMember] = useState({ name: "", relation: "Son" });
  const [apportionment, setApportionment] = useState<any>(null);

  // Asset States
  const [assetData, setAssetData] = useState({
    type: "Bank Deposit",
    institution: "State Bank of India",
    amount: "650000",
    interestRate: "6.5",
    yearsDormant: "8",
    hasNominee: true,
    nomineeMatchesClaimant: true,
    hasFamilyDispute: false,
    unanimousConsent: true,
    missingHeirs: false
  });
  const [financialProjections, setFinancialProjections] = useState<any>(null);
  const [routingData, setRoutingData] = useState<any>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Helper: Get local greeting
  const getGreeting = (lang: string) => {
    switch (lang) {
      case "hi": return "नमस्ते! मैं विरासत मित्र हूँ। आपकी संपत्ति खोजने में आपकी मदद करूँगा।";
      case "kn": return "ನಮಸ್ತೆ! ನಾನು ವಾರಸಾತ್ ಮಿತ್ರ. ನಿಮ್ಮ ಆಸ್ತಿ ಮರಳಿ ಪಡೆಯಲು ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.";
      case "ta": return "வணக்கம்! நான் வராசத் மித்ரா. உங்கள் சொத்துக்களை மீட்டெடுக்க நான் உதவுவேன்.";
      case "te": return "నమస్తే! నేను వారాసత్ మిత్ర. మీ ఆస్తిని తిరిగి పొందడానికి సహాయం చేస్తాను.";
      default: return "Hello! I am Varasat Mitra. I will help you discover, verify, and mathematically apportion family assets.";
    }
  };

  const addMessage = (sender: "mitra" | "user", text: string, type: "standard" | "action" | "widget" = "standard", widgetName?: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { sender, text, type, widgetName, timestamp: time }]);
  };

  // On mount: Welcome user
  useEffect(() => {
    addMessage("mitra", "Choose your preferred language / अपनी पसंदीदा भाषा चुनें:");
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Step 1: Language selection
  const handleSelectLanguage = (lang: string) => {
    setLanguage(lang);
    addMessage("user", lang === "hi" ? "हिंदी" : lang === "kn" ? "ಕನ್ನಡ" : lang === "ta" ? "தமிழ்" : lang === "te" ? "తెలుగు" : "English");
    setTimeout(() => {
      addMessage("mitra", getGreeting(lang));
      addMessage("mitra", lang === "hi" ? "कृपया अपना पंजीकरण विवरण भरें:" : "Please enter your registration details to continue:");
      setCurrentStep("register");
    }, 800);
  };

  // Step 2: Register Claimant
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData.name || !userData.phone || !userData.email || !userData.password) return;

    addMessage("user", `My name is ${userData.name}. Email: ${userData.email}`);
    
    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userData.name,
          phone: userData.phone,
          email: userData.email,
          password: userData.password,
          aadhaar: userData.aadhaar || "123456789012",
          pan: userData.pan || "ABCDE1234F",
          language: language
        })
      });
      const data = await response.json();
      
      if (data.success) {
        setToken(data.token);
        localStorage.setItem("varasat_token", data.token);
        addMessage("mitra", `Registration successful, ${userData.name}!`);
        addMessage("mitra", "Step L1: Let's run your Aadhaar eKYC. Enter OTP '123456' sent to your phone.");
        setCurrentStep("ekyc");
      } else {
        addMessage("mitra", `Error: ${data.message || "Failed to register"}`);
      }
    } catch (err) {
      // Offline fallback registration
      addMessage("mitra", "Backend server offline. Setting up sandbox mock claimant.");
      setToken("mock_jwt_token");
      localStorage.setItem("varasat_token", "mock_jwt_token");
      addMessage("mitra", "Step L1: Let's run your Aadhaar eKYC. Enter OTP '123456' sent to your phone.");
      setCurrentStep("ekyc");
    }
  };

  // Step 3: Aadhaar eKYC
  const handleVerifyEkyc = async (e: React.FormEvent) => {
    e.preventDefault();
    addMessage("user", `Submitting eKYC verification OTP...`);

    try {
      const response = await fetch(`${API_BASE}/api/auth/ekyc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aadhaarNumber: userData.aadhaar || "123456789012", otp: otpCode })
      });
      const data = await response.json();
      if (data.success) {
        setEkycData(data.data);
        addMessage("mitra", "L1 Aadhaar KYC completed successfully! Verified Name: " + data.data.name);
        addMessage("mitra", "Step L2: Direct DigiLocker Fetch. Let's verify the Deceased member's death certificate. No manual uploads are allowed to prevent certificate forgery.");
        setCurrentStep("digilocker");
      } else {
        addMessage("mitra", `eKYC Failed: ${data.message}`);
      }
    } catch (err) {
      // fallback
      if (otpCode === "123456") {
        setEkycData({ name: userData.name, address: "H.No 44, Rampur Village, UP" });
        addMessage("mitra", "L1 Aadhaar KYC completed successfully! Verified claimant: " + userData.name);
        addMessage("mitra", "Step L2: Direct DigiLocker Fetch. Let's verify the Deceased member's death certificate. No manual uploads are allowed to prevent certificate forgery.");
        setCurrentStep("digilocker");
      } else {
        addMessage("mitra", "Incorrect OTP code. Enter 123456 to test.");
      }
    }
  };

  // Step 4: DigiLocker Certificate Fetch
  const handleFetchCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    addMessage("user", `Fetching certificate ${deceasedData.certificateId} from DigiLocker...`);

    try {
      const response = await fetch(`${API_BASE}/api/auth/digilocker`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certificateId: deceasedData.certificateId })
      });
      const data = await response.json();
      if (data.success) {
        setDeathCertificate(data.certificate);
        addMessage("mitra", `L2 death certificate retrieved! Deceased: ${data.certificate.deceasedName}, Registration: ${data.certificate.registrationNumber}`);
        addMessage("mitra", "Step 3: Define the family members to calculate the succession graph apportionment.");
        setCurrentStep("family");
        triggerApportionment();
      } else {
        addMessage("mitra", `Error: ${data.message}`);
      }
    } catch (err) {
      // fallback
      const mockCert = { deceasedName: deceasedData.name, registrationNumber: "REG-LH-99210-2026", dateOfDeath: deceasedData.deathDate };
      setDeathCertificate(mockCert);
      addMessage("mitra", `L2 death certificate retrieved! Deceased: ${mockCert.deceasedName}, Registration: ${mockCert.registrationNumber}`);
      addMessage("mitra", "Step 3: Define the family members to calculate the succession graph apportionment.");
      setCurrentStep("family");
      triggerApportionment();
    }
  };

  // Add Family Member
  const handleAddFamilyMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name) return;
    setFamilyMembers(prev => [...prev, { name: newMember.name, relation: newMember.relation, isLiving: true }]);
    setNewMember({ name: "", relation: "Son" });
  };

  // Remove Family Member
  const handleRemoveMember = (idx: number) => {
    setFamilyMembers(prev => prev.filter((_, i) => i !== idx));
  };

  // Calculate Apportionment
  const triggerApportionment = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/claims/apportion`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ familyMembers, deceasedName: deceasedData.name })
      });
      const data = await response.json();
      if (data.success) {
        setApportionment(data.apportionment);
      }
    } catch (err) {
      // fallback apportionment logic
      const total = familyMembers.length;
      const pct = total > 0 ? Number((100 / total).toFixed(2)) : 100;
      setApportionment({
        shares: familyMembers.map(fm => ({
          name: fm.name,
          relation: fm.relation,
          shareFraction: `1/${total}`,
          sharePercentage: pct
        })),
        graphEdges: familyMembers.map(fm => `"${deceasedData.name}" -> "${fm.name} (${fm.relation})"`),
        wolframCode: "(* Mock HSA Apportionment Code *)"
      });
    }
  };

  useEffect(() => {
    if (currentStep === "family" && token) {
      triggerApportionment();
    }
  }, [familyMembers, token]);

  const handleConfirmFamily = () => {
    addMessage("user", "Confirmed family members tree.");
    addMessage("mitra", "Step 4: Enter the details of the unclaimed financial asset.");
    setCurrentStep("assets");
  };

  // Calculate Asset projections & routing
  const handleCalculateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    addMessage("user", `Calculate projections for ${assetData.amount} INR at ${assetData.institution}`);

    try {
      // Fetch projections
      const resProj = await fetch(`${API_BASE}/api/assets/project`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          principal: assetData.amount,
          interestRate: assetData.interestRate,
          yearsDormant: assetData.yearsDormant,
          assetType: assetData.type
        })
      });
      const dataProj = await resProj.json();
      if (dataProj.success) {
        setFinancialProjections(dataProj.projections);
      }

      // Fetch routing and business track
      const resRoute = await fetch(`${API_BASE}/api/claims/route`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          assetAmount: assetData.amount,
          hasNominee: assetData.hasNominee,
          nomineeMatchesClaimant: assetData.nomineeMatchesClaimant,
          hasFamilyDispute: assetData.hasFamilyDispute,
          unanimousConsent: assetData.unanimousConsent,
          missingHeirs: assetData.missingHeirs
        })
      });
      const dataRoute = await resRoute.json();
      if (dataRoute.success) {
        setRoutingData(dataRoute);
        addMessage("mitra", `Wolfram calculation completed! Accrued interest: ₹${dataProj.projections.accruedInterest}. Circular routing: ${dataRoute.eligibility}. Assigned Track: ${dataRoute.track === 'Free' ? 'Track 1 (Free)' : 'Track 2 (Success Fee)'}.`);
        setCurrentStep("verify");
      }
    } catch (err) {
      // Fallback projections
      const p = parseFloat(assetData.amount);
      const interest = Math.round(p * 0.52); // Mock 8 years of compounding
      setFinancialProjections({
        principal: p,
        accruedInterest: interest,
        totalWealth: p + interest,
        inflationAdjustedValue: Math.round((p + interest) * 0.7)
      });
      const track = p >= 500000 ? "Success_Fee" : "Free";
      setRoutingData({
        eligibility: assetData.hasFamilyDispute ? "Civil Court Action Required" : "Fast-Track Eligible",
        reason: assetData.hasFamilyDispute ? "Disputed assets require court review" : "Direct payout approved",
        track,
        successFee: track === "Success_Fee" ? p * 0.005 : 0
      });
      addMessage("mitra", "Calculations ready. Confirm final claim submission.");
      setCurrentStep("verify");
    }
  };

  // Submit claim
  const handleRegisterClaim = async () => {
    addMessage("user", "Registering my claim officially...");
    
    try {
      const response = await fetch(`${API_BASE}/api/claims/create`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          deceasedName: deceasedData.name,
          deathDate: deceasedData.deathDate,
          certificateId: deceasedData.certificateId,
          assetType: assetData.type,
          institution: assetData.institution,
          amount: assetData.amount,
          familyMembers,
          routingData: {
            hasNominee: assetData.hasNominee,
            nomineeMatchesClaimant: assetData.nomineeMatchesClaimant,
            hasFamilyDispute: assetData.hasFamilyDispute,
            unanimousConsent: assetData.unanimousConsent,
            missingHeirs: assetData.missingHeirs
          }
        })
      });
      const data = await response.json();
      if (data.success) {
        addMessage("mitra", "Claim registered! Claim ID: " + data.claimId);
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    } catch (err) {
      addMessage("mitra", "Sandbox simulation claim created! Redirecting to dashboard...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }
  };

  // Simulation: Speech Input Bhashini
  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        // Simulate speech transcription based on step
        if (currentStep === "register") {
          setUserData(prev => ({
            ...prev,
            name: "Ramesh Kumar Junior",
            phone: "9876543210",
            email: "ramesh.jr@gmail.com",
            password: "password123",
            aadhaar: "123456789012",
            pan: "ABCDE1234F"
          }));
          addMessage("mitra", "[Bhashini speech transcribed (Hindi)]: 'मेरा नाम रमेश कुमार जूनियर है, फोन ९८७६५४३२१० है।'");
        } else if (currentStep === "digilocker") {
          setDeceasedData({
            name: "Ramesh Kumar Senior",
            deathDate: "2026-02-14",
            certificateId: "DEATH-2026-9081"
          });
          addMessage("mitra", "[Bhashini speech transcribed (Hindi)]: 'पिताजी रमेश कुमार सीनियर का निधन १४ फरवरी को हुआ था।'");
        }
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-[#0f2e4e] to-primary flex flex-col justify-between p-4 md:p-8 relative overflow-hidden">
      <ParticleBackground />
      <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row gap-6 items-stretch flex-1 z-10">
        
        {/* Chat Feed Panel */}
        <div className="flex-1 bg-[#ebe5de] rounded-3xl flex flex-col justify-between shadow-2xl overflow-hidden border-2 border-gold/30">
          
          {/* Top WhatsApp-style header */}
          <div className="bg-[#075E54] text-white px-6 py-4 flex items-center justify-between border-b border-black/10">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="relative">
                  <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center font-bold text-primary shadow-md z-10 relative">VM</div>
                  <span className="absolute inset-0 rounded-full border border-gold/50 animate-[ripple_2s_ease-out_infinite]" />
                  <span className="absolute inset-0 rounded-full border border-gold/30 animate-[ripple_2s_ease-out_infinite_0.6s]" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-white z-20"></span>
              </div>
              <div>
                <h2 className="font-bold text-sm md:text-base">Varasat Mitra (विरासत मित्र)</h2>
                <span className="text-xs text-emerald-300">Online Assistant • Bhashini Vernacular</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-white/10 px-3 py-1 rounded-full text-xs">
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span>eKYC Secured</span>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[500px]">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"} drift-in`} style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3.5 shadow-md msg-slide ${
                  m.sender === "user" 
                    ? "bg-[#dcf8c6] text-slate-800 rounded-tr-none" 
                    : "bg-white text-slate-800 rounded-tl-none border border-slate-100"
                }`}
                style={{ animationDelay: `${Math.min(idx * 0.04, 0.4)}s` }}>
                  <p className="text-sm leading-relaxed">{m.text}</p>
                  <span className="block text-[9px] text-slate-500 text-right mt-1.5 font-light">{m.timestamp}</span>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Conversational Controls (Dynamic forms based on step) */}
          <div className="bg-[#f0f0f0] p-4 border-t border-slate-200">
            {currentStep === "language" && (
              <div className="space-y-4">
                <p className="text-xs font-semibold text-slate-600 text-center uppercase tracking-wide">Select Vernacular Language</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <button onClick={() => handleSelectLanguage("en")} className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-xl shadow cursor-pointer transition text-xs">English</button>
                  <button onClick={() => handleSelectLanguage("hi")} className="bg-gold hover:bg-gold/90 text-primary font-bold py-3 px-4 rounded-xl shadow cursor-pointer transition text-xs">हिंदी (Hindi)</button>
                  <button onClick={() => handleSelectLanguage("kn")} className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-xl shadow cursor-pointer transition text-xs">ಕನ್ನಡ (Kannada)</button>
                  <button onClick={() => handleSelectLanguage("ta")} className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-3 px-4 rounded-xl shadow cursor-pointer transition text-xs">தமிழ் (Tamil)</button>
                  <button onClick={() => handleSelectLanguage("te")} className="bg-amber-700 hover:bg-amber-800 text-white font-bold py-3 px-4 rounded-xl shadow cursor-pointer transition text-xs">తెలుగు (Telugu)</button>
                </div>
              </div>
            )}

            {currentStep === "register" && (
              <form onSubmit={handleRegister} className="space-y-4 bg-white p-4 rounded-2xl border border-slate-200">
                <h3 className="text-xs font-bold text-slate-500 uppercase">Claimant Registration Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input 
                    type="text" 
                    placeholder="Full Name (as in Aadhaar)" 
                    value={userData.name}
                    onChange={e => setUserData({...userData, name: e.target.value})}
                    className="border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-primary focus:outline-none focus:ring-1 focus:ring-gold"
                    required
                  />
                  <input 
                    type="tel" 
                    placeholder="Mobile Phone Number" 
                    value={userData.phone}
                    onChange={e => setUserData({...userData, phone: e.target.value})}
                    className="border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-primary focus:outline-none focus:ring-1 focus:ring-gold"
                    required
                  />
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={userData.email}
                    onChange={e => setUserData({...userData, email: e.target.value})}
                    className="border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-primary focus:outline-none focus:ring-1 focus:ring-gold"
                    required
                  />
                  <input 
                    type="password" 
                    placeholder="Password" 
                    value={userData.password}
                    onChange={e => setUserData({...userData, password: e.target.value})}
                    className="border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-primary focus:outline-none focus:ring-1 focus:ring-gold"
                    required
                  />
                  <input 
                    type="text" 
                    placeholder="Aadhaar ID (12 Digits)" 
                    value={userData.aadhaar}
                    onChange={e => setUserData({...userData, aadhaar: e.target.value})}
                    className="border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-primary focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                  <input 
                    type="text" 
                    placeholder="PAN Card (10 Digits)" 
                    value={userData.pan}
                    onChange={e => setUserData({...userData, pan: e.target.value})}
                    className="border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-primary focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>
                <div className="flex space-x-3 pt-2">
                  <button type="button" onClick={toggleRecording} className={`flex items-center justify-center space-x-1 px-4 py-2.5 rounded-xl border-2 text-xs font-bold transition duration-200 cursor-pointer ${
                    isRecording 
                      ? "bg-red-500 border-red-500 text-white animate-pulse" 
                      : "border-primary text-primary hover:bg-primary/5"
                  }`}>
                    <Mic className="w-4 h-4" />
                    <span>{isRecording ? "Listening..." : "Voice Input (Hindi/Kannada)"}</span>
                  </button>
                  <button type="submit" className="flex-1 bg-[#075E54] hover:bg-[#128C7E] text-white py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow cursor-pointer">
                    <span>Submit details</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {currentStep === "ekyc" && (
              <form onSubmit={handleVerifyEkyc} className="space-y-4 bg-white p-4 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center space-x-1">
                    <UserCheck className="w-3.5 h-3.5 text-gold" />
                    <span>L1 Security: Aadhaar Biometric OTP</span>
                  </h3>
                  <span className="text-[10px] bg-gold/10 text-gold px-2 py-0.5 rounded font-semibold border border-gold/30">Sandbox</span>
                </div>
                <div className="flex space-x-3 items-center">
                  <input 
                    type="password" 
                    placeholder="Enter 6-digit OTP (test: 123456)" 
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value)}
                    className="border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-primary focus:outline-none focus:ring-1 focus:ring-gold flex-1"
                    maxLength={6}
                    required
                  />
                  <button type="submit" className="bg-[#075E54] hover:bg-[#128C7E] text-white py-2.5 px-6 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow cursor-pointer">
                    <span>Verify eKYC</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] text-slate-500">Secure cryptographic biometric consent requested under UIDAI regulation.</p>
              </form>
            )}

            {currentStep === "digilocker" && (
              <form onSubmit={handleFetchCertificate} className="space-y-4 bg-white p-4 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center space-x-1">
                    <FileText className="w-3.5 h-3.5 text-gold" />
                    <span>L2 Security: DigiLocker Certificate Retrieval</span>
                  </h3>
                  <span className="text-[10px] bg-success/20 text-success px-2 py-0.5 rounded font-semibold">Strict API Sync</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input 
                    type="text" 
                    placeholder="Deceased Full Name" 
                    value={deceasedData.name}
                    onChange={e => setDeceasedData({...deceasedData, name: e.target.value})}
                    className="border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-primary focus:outline-none focus:ring-1 focus:ring-gold"
                    required
                  />
                  <input 
                    type="date" 
                    value={deceasedData.deathDate}
                    onChange={e => setDeceasedData({...deceasedData, deathDate: e.target.value})}
                    className="border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-primary focus:outline-none"
                    required
                  />
                  <input 
                    type="text" 
                    placeholder="DigiLocker Certificate ID (test: DEATH-2026-9081)" 
                    value={deceasedData.certificateId}
                    onChange={e => setDeceasedData({...deceasedData, certificateId: e.target.value})}
                    className="border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-primary focus:outline-none focus:ring-1 focus:ring-gold"
                    required
                  />
                </div>
                <div className="flex space-x-3 pt-2">
                  <button type="button" onClick={toggleRecording} className={`flex items-center justify-center space-x-1 px-4 py-2.5 rounded-xl border-2 text-xs font-bold transition duration-200 cursor-pointer ${
                    isRecording 
                      ? "bg-red-500 border-red-500 text-white animate-pulse" 
                      : "border-primary text-primary hover:bg-primary/5"
                  }`}>
                    <Mic className="w-4 h-4" />
                    <span>{isRecording ? "Listening..." : "Voice Input"}</span>
                  </button>
                  <button type="submit" className="flex-1 bg-[#075E54] hover:bg-[#128C7E] text-white py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow cursor-pointer">
                    <span>Fetch Certified Death Record</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {currentStep === "family" && (
              <div className="space-y-4 bg-white p-4 rounded-2xl border border-slate-200">
                <h3 className="text-xs font-bold text-slate-500 uppercase">Step 3: Define Class I Heirs</h3>
                
                {/* Add new member form */}
                <form onSubmit={handleAddFamilyMember} className="flex gap-2 items-center">
                  <input 
                    type="text" 
                    placeholder="Heir Full Name" 
                    value={newMember.name}
                    onChange={e => setNewMember({...newMember, name: e.target.value})}
                    className="border border-slate-300 rounded-xl px-3 py-2 text-xs text-primary flex-1 focus:outline-none"
                  />
                  <select 
                    value={newMember.relation}
                    onChange={e => setNewMember({...newMember, relation: e.target.value})}
                    className="border border-slate-300 rounded-xl px-3 py-2 text-xs text-primary focus:outline-none bg-white"
                  >
                    <option value="Widow">Widow</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Mother">Mother</option>
                  </select>
                  <button type="submit" className="bg-[#075E54] text-white p-2 rounded-xl hover:bg-[#128C7E] transition shadow cursor-pointer">
                    <Plus className="w-4 h-4" />
                  </button>
                </form>

                {/* Listing added heirs */}
                <div className="flex flex-wrap gap-2 py-1 max-h-24 overflow-y-auto">
                  {familyMembers.map((fm, idx) => (
                    <div key={idx} className="bg-primary/5 text-primary border border-primary/20 px-2.5 py-1 rounded-xl flex items-center space-x-2 text-xs">
                      <span className="font-semibold">{fm.name} ({fm.relation})</span>
                      <button onClick={() => handleRemoveMember(idx)} className="text-red-500 hover:text-red-700 cursor-pointer">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <button onClick={handleConfirmFamily} className="w-full bg-[#075E54] hover:bg-[#128C7E] text-white py-2.5 rounded-xl text-xs font-bold shadow cursor-pointer">
                  Confirm Family Tree (परिवार सूची की पुष्टि करें)
                </button>
              </div>
            )}

            {currentStep === "assets" && (
              <form onSubmit={handleCalculateAsset} className="space-y-4 bg-white p-4 rounded-2xl border border-slate-200">
                <h3 className="text-xs font-bold text-slate-500 uppercase">Step 4: Dormant Asset & Nomination Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] text-slate-500">Asset Type</label>
                    <select 
                      value={assetData.type}
                      onChange={e => setAssetData({...assetData, type: e.target.value})}
                      className="border border-slate-300 rounded-xl px-3 py-2 text-xs text-primary focus:outline-none bg-white"
                    >
                      <option value="Bank Deposit">Bank Deposit</option>
                      <option value="LIC Policy">LIC Policy</option>
                      <option value="Mutual Fund">Mutual Fund</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] text-slate-500">Institution Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. State Bank of India"
                      value={assetData.institution}
                      onChange={e => setAssetData({...assetData, institution: e.target.value})}
                      className="border border-slate-300 rounded-xl px-3 py-2 text-xs text-primary focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] text-slate-500">Principal Amount (₹)</label>
                    <input 
                      type="number" 
                      value={assetData.amount}
                      onChange={e => setAssetData({...assetData, amount: e.target.value})}
                      className="border border-slate-300 rounded-xl px-3 py-2 text-xs text-primary focus:outline-none"
                      required
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] text-slate-500">Est. Interest Rate (%)</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      value={assetData.interestRate}
                      onChange={e => setAssetData({...assetData, interestRate: e.target.value})}
                      className="border border-slate-300 rounded-xl px-3 py-2 text-xs text-primary focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] text-slate-500">Dormant Duration (Years)</label>
                    <input 
                      type="number" 
                      value={assetData.yearsDormant}
                      onChange={e => setAssetData({...assetData, yearsDormant: e.target.value})}
                      className="border border-slate-300 rounded-xl px-3 py-2 text-xs text-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <label className="flex items-center space-x-2 text-[10px] text-slate-600 font-semibold cursor-pointer">
                    <input type="checkbox" checked={assetData.hasNominee} onChange={e => setAssetData({...assetData, hasNominee: e.target.checked})} />
                    <span>Has Nominee</span>
                  </label>
                  <label className="flex items-center space-x-2 text-[10px] text-slate-600 font-semibold cursor-pointer">
                    <input type="checkbox" checked={assetData.nomineeMatchesClaimant} onChange={e => setAssetData({...assetData, nomineeMatchesClaimant: e.target.checked})} />
                    <span>Nominee matches</span>
                  </label>
                  <label className="flex items-center space-x-2 text-[10px] text-slate-600 font-semibold cursor-pointer">
                    <input type="checkbox" checked={assetData.hasFamilyDispute} onChange={e => setAssetData({...assetData, hasFamilyDispute: e.target.checked})} />
                    <span className="text-red-500">Family dispute</span>
                  </label>
                </div>

                <button type="submit" className="w-full bg-[#075E54] hover:bg-[#128C7E] text-white py-2.5 rounded-xl text-xs font-bold shadow cursor-pointer">
                  Calculate Projections (गणना करें)
                </button>
              </form>
            )}

            {currentStep === "verify" && (
              <div className="space-y-4 bg-white p-4 rounded-2xl border border-slate-200">
                <h3 className="text-xs font-bold text-slate-500 uppercase">Step 5: Smart Route & Final Check</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="border border-slate-200 rounded-xl p-3 text-center bg-slate-50">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Eligibility</span>
                    <p className={`text-xs font-bold mt-1 ${routingData?.eligibility.includes('Fast-Track') ? 'text-emerald-600' : 'text-red-500'}`}>
                      {routingData?.eligibility || "Fast-Track Eligible"}
                    </p>
                  </div>
                  
                  <div className="border border-slate-200 rounded-xl p-3 text-center bg-slate-50">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Projections Summary</span>
                    <p className="text-xs font-extrabold text-primary mt-1">
                      ₹{financialProjections?.totalWealth.toLocaleString() || "6,50,000"} Total
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-3 text-center bg-slate-50">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Claim Routing Track</span>
                    <p className="text-xs font-bold text-emerald-600 mt-1">
                      {routingData?.track === 'Free' ? 'Track 1 (Free)' : `Track 2 (Success Fee: ₹${routingData?.successFee})`}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setCurrentStep("assets")} className="border border-primary text-primary font-bold py-2.5 px-4 rounded-xl text-xs flex-1 cursor-pointer">
                    Back
                  </button>
                  <button onClick={handleRegisterClaim} className="bg-[#075E54] hover:bg-[#128C7E] text-white py-2.5 px-4 rounded-xl text-xs font-bold flex-1 shadow cursor-pointer">
                    Submit Secure Claim (दावा दर्ज करें)
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Real-time Side Visualization Apportions Panel */}
        <div className="w-full md:w-[380px] flex flex-col gap-6 justify-between items-stretch">
          
          {/* Family Tree Graphic Display */}
          <div className="bg-primary/95 text-white rounded-3xl p-6 border border-gold/30 flex-1 shadow-2xl flex flex-col justify-between">
            <h4 className="text-xs font-bold text-gold uppercase tracking-widest mb-4 flex items-center space-x-1.5">
              <Landmark className="w-4 h-4" />
              <span>Real-Time Claim Routing</span>
            </h4>
            
            {apportionment ? (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <FamilyTreeGraph deceasedName={deceasedData.name} shares={apportionment.shares} />
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 mt-4">
                  <span className="text-[10px] font-bold uppercase text-gold block">Equivalent Wolfram Logic:</span>
                  <pre className="text-[8px] leading-relaxed text-slate-300 font-mono overflow-x-auto select-all p-2 bg-black/30 rounded-lg max-h-24">
                    {apportionment.wolframCode}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center text-center p-8">
                <HelpCircle className="w-12 h-12 text-gold mb-3" style={{ animation: "floatDot 4s ease-in-out infinite" }} />
                <p className="text-xs text-slate-300 leading-relaxed">
                  Start filling out the onboarding questions on the left. The succession tree path and inheritance 
                  shares will calculate mathematically here.
                </p>
              </div>
            )}
          </div>

          {/* Financial Accruals Breakdown Card */}
          {financialProjections && (
            <div className="bg-white text-primary border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4">
              <h4 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-slate-100 pb-2">Financial Accruals (Wolfram)</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-500">Principal Deposit</span>
                  <p className="text-base font-extrabold text-slate-800">₹{financialProjections.principal.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-emerald-600">Accrued Interest</span>
                  <p className="text-base font-extrabold text-emerald-600">+ ₹{financialProjections.accruedInterest.toLocaleString()}</p>
                </div>
                <div className="col-span-2 border-t border-slate-100 pt-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block uppercase">Total Present Value</span>
                      <span className="text-lg font-extrabold text-primary">₹{financialProjections.totalWealth.toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 block">Inflation Adjusted</span>
                      <span className="text-xs text-slate-500 font-semibold">₹{financialProjections.inflationAdjustedValue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
