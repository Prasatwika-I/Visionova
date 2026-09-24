"use client";

import { useState, useRef } from "react";
import { QrCode, UploadCloud, FileImage, X, AlertCircle, Copy, Check, UserCheck, Smartphone } from "lucide-react";
import FormStepHeader from "./FormStepHeader";
import { EVENT_CONFIG } from "@/lib/config";

interface PaymentSectionProps {
  paymentFile: File | null;
  fileError: string;
  onFileSelect: (file: File | null) => void;
}

export default function PaymentSection({ paymentFile, fileError, onFileSelect }: PaymentSectionProps) {
  const [dragActive, setDragActive] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = (text: string, fieldName: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const validateAndSetFile = (file: File | null) => {
    if (!file) {
      onFileSelect(null);
      return;
    }

    const name = file.name.toLowerCase();
    const type = file.type.toLowerCase();
    const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp", ".pjp", ".pjpeg"];
    const hasValidExt = allowedExtensions.some((ext) => name.endsWith(ext));
    const hasValidMime = type.startsWith("image/");

    // Check valid image format
    if (!hasValidExt && !hasValidMime) {
      alert("Please upload a valid payment screenshot image (PNG, JPG, JPEG, or WEBP).");
      if (fileInputRef.current) fileInputRef.current.value = "";
      onFileSelect(null);
      return;
    }

    // Size limit check (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("The payment screenshot is too large. Please upload an image under 5MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      onFileSelect(null);
      return;
    }

    onFileSelect(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    validateAndSetFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0] || null;
    validateAndSetFile(file);
  };

  const removeFile = () => {
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="mb-6 sm:mb-8">
      <FormStepHeader
        step="03"
        title="ENTRY FEE & PAYMENT"
        subtitle="Complete the event fee payment using the official QR code and upload your screenshot"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">
        {/* Left Column: Official Payment QR in Dark Card */}
        <div className="lg:col-span-6 bg-[#191220] rounded-[4px] p-4 sm:p-7 border border-[#362844] flex flex-col items-center text-center shadow-xs w-full">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-[2px] bg-[#241A2D] border border-[#362844] text-[#C8F04A] text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider mb-2 sm:mb-3">
            <QrCode className="w-3.5 h-3.5 text-[#C8F04A]" />
            <span>SCAN &amp; PAY ₹100</span>
          </div>

          <div className="mb-1 sm:mb-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#96869E] block">Registration Fee</span>
            <div className="font-editorial text-2xl sm:text-4xl font-black text-[#FFFDF7] font-mono">
              {EVENT_CONFIG.REGISTRATION_FEE}
            </div>
          </div>

          {/* Receiver Name Box Above Scanner */}
          <div className="w-full max-w-[280px] my-2 py-2 px-3 rounded-[4px] bg-[#241A2D] border border-[#362844] flex items-center justify-center space-x-2 text-center">
            <UserCheck className="w-4 h-4 text-[#C8F04A] flex-shrink-0" />
            <div className="min-w-0 text-center">
              <span className="text-[10px] font-mono text-[#96869E] uppercase tracking-wider block">Receiver Name</span>
              <span className="text-xs sm:text-sm font-mono font-bold text-[#FFFDF7] block truncate">
                {EVENT_CONFIG.PAYMENT_RECEIVER_NAME}
              </span>
            </div>
          </div>

          {/* Official Payment QR inside clean container with laser scanline animation */}
          <div className="relative my-2 sm:my-3 p-2.5 sm:p-3 bg-white rounded-[4px] border-2 border-[#C8F04A]/70 w-[190px] h-[190px] sm:w-[240px] sm:h-[240px] flex items-center justify-center overflow-hidden shadow-lg animate-laser-pulse group">
            {/* Animated Laser Scanner Line */}
            <div className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#C8F04A] to-transparent shadow-[0_0_12px_#C8F04A] pointer-events-none z-10 animate-scanline" />
            
            <img
              src="/payment-qr.jpeg"
              alt="Official Event Payment QR Code"
              className="w-full h-full object-contain rounded-[2px] select-none transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Direct UPI / Mobile Number Details with Copy Buttons Below QR */}
          <div className="w-full max-w-[280px] space-y-2 mt-2">
            {/* UPI ID */}
            <div className="flex items-center justify-between px-3 py-2 rounded-[4px] bg-[#241A2D] border border-[#362844] text-left">
              <div className="min-w-0 flex-1 pr-2">
                <span className="text-[10px] font-mono text-[#96869E] uppercase tracking-wider block">UPI ID</span>
                <span className="text-xs font-mono font-bold text-[#C8F04A] block truncate select-all">
                  {EVENT_CONFIG.PAYMENT_UPI_ID}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(EVENT_CONFIG.PAYMENT_UPI_ID, "upi")}
                className="p-1.5 rounded-[2px] bg-[#191220] hover:bg-[#362844] text-[#B9A7C9] hover:text-[#FFFDF7] border border-[#362844] transition-all flex items-center justify-center min-w-[32px] min-h-[32px] touch-manipulation cursor-pointer flex-shrink-0"
                title="Copy UPI ID"
              >
                {copiedField === "upi" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Payment Number */}
            <div className="flex items-center justify-between px-3 py-2 rounded-[4px] bg-[#241A2D] border border-[#362844] text-left">
              <div className="min-w-0 flex-1 pr-2">
                <span className="text-[10px] font-mono text-[#96869E] uppercase tracking-wider block">Payment Number</span>
                <span className="text-xs font-mono font-bold text-[#FFFDF7] block truncate select-all">
                  {EVENT_CONFIG.PAYMENT_PHONE_NUMBER}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(EVENT_CONFIG.PAYMENT_PHONE_NUMBER, "phone")}
                className="p-1.5 rounded-[2px] bg-[#191220] hover:bg-[#362844] text-[#B9A7C9] hover:text-[#FFFDF7] border border-[#362844] transition-all flex items-center justify-center min-w-[32px] min-h-[32px] touch-manipulation cursor-pointer flex-shrink-0"
                title="Copy Payment Number"
              >
                {copiedField === "phone" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          <p className="text-[11px] sm:text-xs font-mono text-[#96869E] max-w-xs mt-3">
            Scan with GPay, PhonePe, Paytm or pay via UPI ID / Number.
          </p>
        </div>

        {/* Right Column: Screenshot Upload */}
        <div className="lg:col-span-6 flex flex-col h-full justify-between w-full">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <h3 className="text-xs sm:text-sm font-mono font-bold text-[#FFFDF7] uppercase tracking-wider flex items-center space-x-1.5">
                <span>PAYMENT SCREENSHOT</span>
                <span className="text-[#FF6B5E]">*</span>
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-[2px] bg-[#FF6B5E]/15 text-[#FF6B5E] border border-[#FF6B5E]/30">
                PNG / JPG / WEBP
              </span>
            </div>
            <p className="text-xs text-[#96869E] mb-3 sm:mb-4 font-sans">
              Upload the payment receipt screenshot after completing the ₹100 transaction.
            </p>

            {/* Custom Touch-Friendly Dropzone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => !paymentFile && fileInputRef.current?.click()}
              className={`relative rounded-[4px] border-2 border-dashed p-4 sm:p-7 flex flex-col items-center justify-center text-center transition-all cursor-pointer min-h-[140px] sm:min-h-[180px] ${
                dragActive
                  ? "border-[#C8F04A] bg-[#241A2D] scale-[1.01]"
                  : paymentFile
                  ? "border-emerald-500/80 bg-emerald-950/20"
                  : fileError
                  ? "border-rose-500/80 bg-rose-950/20 hover:border-rose-400"
                  : "border-[#362844] bg-[#191220] hover:border-[#C8F04A]/60 hover:bg-[#1F1726]"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/pjpeg,.png,.jpg,.jpeg,.webp,.pjp,.pjpeg"
                onChange={handleFileChange}
                className="hidden"
              />

              {!paymentFile ? (
                <>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[4px] bg-[#241A2D] border border-[#362844] flex items-center justify-center text-[#FF6B5E] mb-2 sm:mb-3 shadow-2xs">
                    <UploadCloud className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF6B5E]" />
                  </div>
                  <p className="text-xs sm:text-sm font-mono font-bold text-[#FFFDF7] mb-0.5 sm:mb-1">
                    Tap to upload screenshot
                  </p>
                  <p className="text-[11px] sm:text-xs font-mono text-[#96869E] mb-2 sm:mb-3">
                    PNG, JPG, WEBP (Max 5MB)
                  </p>
                  <span className="inline-flex items-center justify-center px-3.5 py-2 rounded-[3px] bg-[#241A2D] text-[#C8F04A] border border-[#362844] text-[11px] sm:text-xs font-mono font-bold min-h-[38px] sm:min-h-[42px]">
                    Select Screenshot
                  </span>
                </>
              ) : (
                <div className="w-full">
                  <div className="flex items-center space-x-2.5 sm:space-x-3 bg-[#191220] p-3 sm:p-4 rounded-[4px] border border-emerald-500/50 text-left">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[2px] bg-emerald-950/60 text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <FileImage className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-mono font-bold text-[#FFFDF7] truncate">
                        ✓ {paymentFile.name}
                      </p>
                      <p className="text-[10px] sm:text-xs font-mono text-[#96869E] mt-0.5">
                        {formatFileSize(paymentFile.size)} • <span className="text-emerald-400 font-semibold">Valid Screenshot</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile();
                      }}
                      className="p-1.5 sm:p-2 min-w-[32px] min-h-[32px] rounded-[2px] bg-rose-950/40 hover:bg-rose-950/70 text-rose-400 border border-rose-800/40 transition-colors flex items-center justify-center"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-[11px] sm:text-xs font-mono text-emerald-400 mt-2 text-center font-semibold">
                    ✓ Screenshot verified and ready.
                  </p>
                </div>
              )}
            </div>

            {fileError && (
              <div className="flex items-center space-x-1.5 text-xs text-rose-400 mt-2 font-mono">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{fileError}</span>
              </div>
            )}
          </div>

          <div className="mt-4 p-3 sm:p-4 rounded-[4px] bg-[#191220] border border-[#362844] text-[11px] sm:text-xs font-mono text-[#96869E]">
            <p className="font-bold text-[#FFFDF7] mb-0.5 uppercase">Verification Notice:</p>
            <p>
              Please verify that the transaction reference (UTR) is clearly legible on your uploaded receipt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
