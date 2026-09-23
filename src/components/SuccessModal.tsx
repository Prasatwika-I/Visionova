"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, Copy, Check, Mail } from "lucide-react";
import { EVENT_CONFIG } from "@/lib/config";

interface SuccessModalProps {
  isOpen: boolean;
  registrationId: string;
  teamLeadEmail: string;
  onClose: () => void;
}

export default function SuccessModal({
  isOpen,
  registrationId,
  teamLeadEmail,
  onClose,
}: SuccessModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 80,
          spread: 65,
          origin: { y: 0.6 },
          colors: ["#C8F04A", "#FF6B5E", "#B9A7C9", "#FFFDF7", "#241A2D"],
        });
      } catch (e) {
        console.log("Confetti triggered");
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(registrationId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-[calc(100%-32px)] max-w-lg max-h-[90vh] overflow-y-auto bg-[#1F1726] rounded-[4px] p-5 sm:p-8 text-center border border-[#362844] shadow-2xl">
        {/* Animated Icon */}
        <div className="relative mb-4 sm:mb-5 flex justify-center items-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[3px] bg-[#241A2D] text-[#C8F04A] border border-[#362844] flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
        </div>

        {/* Heading: YOU'RE IN. */}
        <h2 className="font-editorial text-2xl sm:text-4xl font-black tracking-tight uppercase mb-1 text-[#FFFDF7]">
          YOU'RE IN.
        </h2>

        {/* Subheading */}
        <p className="text-xs font-mono font-bold tracking-widest text-[#B9A7C9] uppercase mb-3 sm:mb-4">
          Registration successful.
        </p>

        {/* Message */}
        <p className="text-xs sm:text-sm text-[#96869E] mb-5 sm:mb-6 leading-relaxed font-sans">
          Your registration has been successfully submitted for{" "}
          <strong className="text-[#FFFDF7] font-bold">{EVENT_CONFIG.EVENT_NAME}</strong>.
        </p>

        {/* Registration ID Card with Acid Lime Accent */}
        <div className="p-3.5 sm:p-4 rounded-[4px] bg-[#191220] border border-[#362844] mb-5 sm:mb-6">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#B9A7C9] block mb-1 font-bold font-mono">
            REGISTRATION ID
          </span>
          <div className="flex items-center justify-center space-x-2 sm:space-x-3">
            <span className="text-xl sm:text-3xl font-mono font-extrabold text-[#C8F04A] tracking-wider">
              {registrationId || "AIVM-001"}
            </span>
            <button
              onClick={handleCopyId}
              className="p-2 sm:p-2.5 min-w-[40px] min-h-[40px] rounded-[2px] bg-[#241A2D] hover:bg-[#362844] text-[#FFFDF7] border border-[#362844] transition-colors flex items-center justify-center shadow-2xs touch-manipulation"
              title="Copy Registration ID"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirmation Email Notice */}
        <div className="flex items-center justify-center space-x-2 text-[11px] sm:text-xs font-mono text-[#96869E] bg-[#191220] py-2.5 sm:py-3 px-3 sm:px-4 rounded-[3px] border border-[#362844] mb-5 sm:mb-6 text-left sm:text-center">
          <Mail className="w-4 h-4 text-[#FF6B5E] flex-shrink-0" />
          <span className="truncate">
            Confirmation sent to:{" "}
            <span className="text-[#FFFDF7] font-bold">{teamLeadEmail}</span>
          </span>
        </div>

        {/* Done Button */}
        <button
          onClick={onClose}
          className="btn-acid-lime w-full py-3.5 min-h-[48px] text-sm font-bold tracking-wider uppercase cursor-pointer shadow-sm touch-manipulation"
        >
          DONE
        </button>
      </div>
    </div>
  );
}
