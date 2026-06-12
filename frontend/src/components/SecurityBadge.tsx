import React from "react";
import { ShieldCheck, ShieldAlert, Fingerprint, FileText, Lock } from "lucide-react";

type LayerStatus = "Verified" | "Pending" | "Failed" | "Skipped";

interface SecurityBadgeProps {
  l1Status?: LayerStatus;
  l2Status?: LayerStatus;
  l3Status?: LayerStatus;
  compact?: boolean;
}

const statusConfig = {
  Verified: {
    border: "border-emerald-500/40",
    bg: "bg-emerald-500/10",
    icon: "text-emerald-400",
    label: "text-emerald-400",
    dot: "bg-emerald-400",
    text: "VERIFIED"
  },
  Pending: {
    border: "border-amber-400/40",
    bg: "bg-amber-400/10",
    icon: "text-amber-400",
    label: "text-amber-400",
    dot: "bg-amber-400",
    text: "PENDING"
  },
  Failed: {
    border: "border-red-500/40",
    bg: "bg-red-500/10",
    icon: "text-red-400",
    label: "text-red-400",
    dot: "bg-red-400",
    text: "FAILED"
  },
  Skipped: {
    border: "border-slate-600/40",
    bg: "bg-slate-600/10",
    icon: "text-slate-500",
    label: "text-slate-500",
    dot: "bg-slate-500",
    text: "SKIPPED"
  }
};

interface LayerProps {
  label: string;
  sublabel: string;
  status: LayerStatus;
  Icon: React.ElementType;
  compact: boolean;
}

function Layer({ label, sublabel, status, Icon, compact }: LayerProps) {
  const s = statusConfig[status];
  const iconContainer = (
    <div className={`${compact ? "p-1" : "p-2.5"} rounded-lg bg-[#0f172a]`}>
      <Icon className={`${compact ? "w-3.5 h-3.5" : "w-5 h-5"} ${s.icon}`} />
    </div>
  );

  return (
    <div className={`flex ${compact ? "items-center space-x-2 px-2 py-1.5" : "flex-col items-center text-center space-y-2 p-4"} border ${s.border} ${s.bg} rounded-xl`}>
      {status === "Verified" ? (
        <div className="relative">
          {iconContainer}
          <span className="absolute inset-0 rounded-lg border border-emerald-400/40 animate-[ripple_2.5s_ease-out_infinite]" />
        </div>
      ) : (
        iconContainer
      )}
      <div className={compact ? "flex-1" : ""}>
        <p className={`font-extrabold ${compact ? "text-[10px]" : "text-xs"} text-white`}>{label}</p>
        {!compact && <p className="text-[9px] text-slate-400 mt-0.5">{sublabel}</p>}
      </div>
      <div className="flex items-center space-x-1">
        <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${status === "Pending" ? "animate-pulse" : ""}`}></span>
        <span className={`text-[9px] font-bold ${s.label}`}>{s.text}</span>
      </div>
    </div>
  );
}

export default function SecurityBadge({ l1Status = "Verified", l2Status = "Verified", l3Status = "Pending", compact = false }: SecurityBadgeProps) {
  return (
    <div className={`${compact ? "flex items-center space-x-2" : "grid grid-cols-1 md:grid-cols-3 gap-3"}`}>
      <Layer label="L1 Aadhaar eKYC" sublabel="Biometric OTP challenge" status={l1Status} Icon={Fingerprint} compact={compact} />
      <Layer label="L2 DigiLocker" sublabel="Death certificate vault" status={l2Status} Icon={FileText} compact={compact} />
      <Layer label="L3 Indemnity Bond" sublabel="Auto-generated legal protection" status={l3Status} Icon={Lock} compact={compact} />
    </div>
  );
}
