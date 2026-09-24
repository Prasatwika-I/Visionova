"use client";

import { useState } from "react";
import { X, ExternalLink, Check, User, Mail, Phone, Hash, Layers, Shield, Image as ImageIcon, Loader2 } from "lucide-react";
import { RegistrationData } from "@/lib/types";
import StatusBadge from "./StatusBadge";

interface DetailModalProps {
  registration: RegistrationData | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdated: (id: string, newStatus: "Pending" | "Verified" | "Rejected") => void;
}

export default function DetailModal({
  registration,
  isOpen,
  onClose,
  onStatusUpdated,
}: DetailModalProps) {
  const [updating, setUpdating] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!isOpen || !registration) return null;

  const handleStatusChange = async (newStatus: "Pending" | "Verified" | "Rejected") => {
    if (newStatus === registration.paymentStatus) return;

    setUpdating(true);
    try {
      const res = await fetch("/api/admin/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: registration.id, status: newStatus }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onStatusUpdated(registration.id, newStatus);
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to connect to server to update status.");
    } finally {
      setUpdating(false);
    }
  };

  const getDirectImageUrl = (url: string) => {
    if (!url) return "";
    const driveMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1]) {
      return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w1000`;
    }
    return url;
  };

  const directImgUrl = getDirectImageUrl(registration.paymentScreenshotUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-[calc(100%-32px)] max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1F1726] rounded-[4px] p-5 sm:p-8 border border-[#362844] shadow-2xl text-[#FFFDF7]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#362844] mb-5 sm:mb-6">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <span className="font-mono text-xl sm:text-2xl font-black text-[#C8F04A]">
              {registration.id}
            </span>
            <StatusBadge status={registration.paymentStatus} />
          </div>
          <button
            onClick={onClose}
            className="p-2 min-w-[40px] min-h-[40px] rounded-[2px] bg-[#241A2D] text-[#96869E] hover:text-[#FFFDF7] border border-[#362844] transition-colors flex items-center justify-center touch-manipulation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 sm:space-y-6 text-sm font-sans">
          {/* TEAM LEAD SECTION */}
          <div className="p-4 rounded-[4px] bg-[#191220] border border-[#362844]">
            <h4 className="text-xs uppercase tracking-wider text-[#C8F04A] font-mono font-bold mb-3 flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>TEAM LEAD</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <span className="text-[#96869E] block text-[11px]">Name</span>
                <span className="font-bold text-[#FFFDF7] text-sm">{registration.teamLeadName}</span>
              </div>
              <div>
                <span className="text-[#96869E] block text-[11px]">Email</span>
                <span className="text-[#B9A7C9] break-all">{registration.teamLeadEmail}</span>
              </div>
              <div>
                <span className="text-[#96869E] block text-[11px]">Year &amp; Section</span>
                <span className="text-[#FFFDF7]">
                  {registration.year} — {registration.section}
                </span>
              </div>
              <div>
                <span className="text-[#96869E] block text-[11px]">Roll Number</span>
                <span className="font-bold text-[#FFFDF7]">{registration.teamLeadRollNumber}</span>
              </div>
              <div>
                <span className="text-[#96869E] block text-[11px]">Phone Number</span>
                <span className="text-[#FFFDF7]">{registration.teamLeadPhone}</span>
              </div>
              <div>
                <span className="text-[#96869E] block text-[11px]">Registered On</span>
                <span className="text-[#786882]">{registration.timestamp}</span>
              </div>
            </div>
          </div>

          {/* TEAM MEMBERS SECTION */}
          <div className="p-4 rounded-[4px] bg-[#191220] border border-[#362844]">
            <h4 className="text-xs uppercase tracking-wider text-[#B9A7C9] font-mono font-bold mb-3 flex items-center space-x-2">
              <Shield className="w-4 h-4 text-[#B9A7C9]" />
              <span>TEAM MEMBERS (3)</span>
            </h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-[2px] bg-[#241A2D] border border-[#362844] gap-1">
                <span className="text-[#FFFDF7] font-medium">1. {registration.member1Name}</span>
                <span className="text-[#B9A7C9]">{registration.member1Roll}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-[2px] bg-[#241A2D] border border-[#362844] gap-1">
                <span className="text-[#FFFDF7] font-medium">2. {registration.member2Name}</span>
                <span className="text-[#B9A7C9]">{registration.member2Roll}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-[2px] bg-[#241A2D] border border-[#362844] gap-1">
                <span className="text-[#FFFDF7] font-medium">3. {registration.member3Name}</span>
                <span className="text-[#B9A7C9]">{registration.member3Roll}</span>
              </div>
            </div>
          </div>

          {/* PAYMENT SECTION & PROOF */}
          <div className="p-4 rounded-[4px] bg-[#191220] border border-[#362844]">
            <h4 className="text-xs uppercase tracking-wider text-[#FF6B5E] font-mono font-bold mb-3 flex items-center space-x-2">
              <ImageIcon className="w-4 h-4" />
              <span>PAYMENT &amp; VERIFICATION</span>
            </h4>

            <div className="flex flex-col gap-4 mb-4">
              <div>
                <span className="text-[11px] font-mono text-[#96869E] block mb-2">Update Payment Status</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    disabled={updating}
                    onClick={() => handleStatusChange("Pending")}
                    className={`py-2.5 px-3 min-h-[44px] rounded-[2px] text-xs font-mono font-bold cursor-pointer transition-all touch-manipulation flex items-center justify-center ${
                      registration.paymentStatus === "Pending"
                        ? "bg-amber-500 text-[#17121C] shadow-md"
                        : "bg-[#241A2D] text-[#96869E] hover:text-[#FFFDF7] border border-[#362844]"
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    disabled={updating}
                    onClick={() => handleStatusChange("Verified")}
                    className={`py-2.5 px-3 min-h-[44px] rounded-[2px] text-xs font-mono font-bold cursor-pointer transition-all touch-manipulation flex items-center justify-center ${
                      registration.paymentStatus === "Verified"
                        ? "bg-emerald-400 text-[#17121C] shadow-md shadow-emerald-500/20"
                        : "bg-[#241A2D] text-[#96869E] hover:text-[#FFFDF7] border border-[#362844]"
                    }`}
                  >
                    Verified
                  </button>
                  <button
                    disabled={updating}
                    onClick={() => handleStatusChange("Rejected")}
                    className={`py-2.5 px-3 min-h-[44px] rounded-[2px] text-xs font-mono font-bold cursor-pointer transition-all touch-manipulation flex items-center justify-center ${
                      registration.paymentStatus === "Rejected"
                        ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                        : "bg-[#241A2D] text-[#96869E] hover:text-[#FFFDF7] border border-[#362844]"
                    }`}
                  >
                    Rejected
                  </button>
                </div>
                {updating && (
                  <div className="flex items-center space-x-2 text-xs font-mono text-[#C8F04A] mt-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Updating status in database...</span>
                  </div>
                )}
              </div>

              {/* View Screenshot Action */}
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setShowImagePreview(!showImagePreview);
                    setImageError(false);
                  }}
                  className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 min-h-[44px] rounded-[2px] bg-[#241A2D] hover:bg-[#362844] border border-[#362844] text-[#C8F04A] text-xs font-mono font-bold transition-all cursor-pointer touch-manipulation"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>{showImagePreview ? "HIDE SCREENSHOT" : "VIEW PAYMENT SCREENSHOT"}</span>
                </button>
              </div>
            </div>

            {/* Screenshot Preview */}
            {showImagePreview && (
              <div className="mt-4 p-3 sm:p-4 rounded-[4px] bg-[#140F1A] border border-[#362844] flex flex-col items-center">
                <div className="max-h-72 sm:max-h-96 w-full overflow-hidden rounded-[2px] border border-[#362844] mb-3 bg-black flex items-center justify-center p-2">
                  {!imageError ? (
                    <img
                      src={directImgUrl}
                      alt={`Payment proof for ${registration.id}`}
                      onError={() => setImageError(true)}
                      className="max-h-64 sm:max-h-80 w-auto max-w-full object-contain rounded-[2px]"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <p className="text-xs font-mono text-amber-300 mb-1">
                        Screenshot was stored in an ephemeral session or is external.
                      </p>
                      <p className="text-[11px] font-mono text-[#96869E]">
                        New uploads are permanently backed up to high-speed cloud CDN.
                      </p>
                    </div>
                  )}
                </div>
                <a
                  href={registration.paymentScreenshotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs font-mono text-[#C8F04A] hover:underline min-h-[36px] py-1 touch-manipulation"
                >
                  <span>Open Full Screenshot in New Tab</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
