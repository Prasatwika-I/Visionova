"use client";

import { useState } from "react";
import { Loader2, AlertCircle, Sparkles, Film } from "lucide-react";
import TeamLeadSection from "./TeamLeadSection";
import TeamMembersSection from "./TeamMembersSection";
import PaymentSection from "./PaymentSection";
import SuccessModal from "./SuccessModal";
import { EVENT_CONFIG } from "@/lib/config";

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    teamLeadEmail: "",
    teamLeadName: "",
    year: "",
    section: "",
    teamLeadRollNumber: "",
    teamLeadPhone: "",
    member1Name: "",
    member1Roll: "",
    member2Name: "",
    member2Roll: "",
    member3Name: "",
    member3Roll: "",
  });

  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileError, setFileError] = useState<string>("");
  const [globalError, setGlobalError] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{
    isOpen: boolean;
    registrationId: string;
    email: string;
  }>({
    isOpen: false,
    registrationId: "",
    email: "",
  });

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (globalError) setGlobalError("");
  };

  const handleFileSelect = (file: File | null) => {
    setPaymentFile(file);
    if (file) {
      setFileError("");
    }
    if (globalError) setGlobalError("");
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Validate Team Lead Email
    if (!formData.teamLeadEmail.trim()) {
      newErrors.teamLeadEmail = "This field is required.";
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.teamLeadEmail.trim())) {
        newErrors.teamLeadEmail = "Please enter a valid email address.";
        isValid = false;
      }
    }

    // Validate Team Lead Name
    if (!formData.teamLeadName.trim()) {
      newErrors.teamLeadName = "This field is required.";
      isValid = false;
    }

    // Validate Year & Section
    if (!formData.year) {
      newErrors.year = "This field is required.";
      isValid = false;
    }
    if (!formData.section) {
      newErrors.section = "This field is required.";
      isValid = false;
    }

    // Validate Team Lead Roll Number
    if (!formData.teamLeadRollNumber.trim()) {
      newErrors.teamLeadRollNumber = "This field is required.";
      isValid = false;
    }

    // Validate Team Lead Phone
    if (!formData.teamLeadPhone.trim()) {
      newErrors.teamLeadPhone = "This field is required.";
      isValid = false;
    } else {
      const phoneDigits = formData.teamLeadPhone.replace(/\D/g, "");
      if (phoneDigits.length < 10) {
        newErrors.teamLeadPhone = "Please enter a valid phone number.";
        isValid = false;
      }
    }

    // Validate Member 1
    if (!formData.member1Name.trim()) {
      newErrors.member1Name = "This field is required.";
      isValid = false;
    }
    if (!formData.member1Roll.trim()) {
      newErrors.member1Roll = "This field is required.";
      isValid = false;
    }

    // Validate Member 2
    if (!formData.member2Name.trim()) {
      newErrors.member2Name = "This field is required.";
      isValid = false;
    }
    if (!formData.member2Roll.trim()) {
      newErrors.member2Roll = "This field is required.";
      isValid = false;
    }

    // Validate Member 3
    if (!formData.member3Name.trim()) {
      newErrors.member3Name = "This field is required.";
      isValid = false;
    }
    if (!formData.member3Roll.trim()) {
      newErrors.member3Roll = "This field is required.";
      isValid = false;
    }

    // Validate Payment File (PNG, JPG, WEBP, etc.)
    if (!paymentFile) {
      setFileError("Please upload a payment screenshot (PNG, JPG, or WEBP).");
      isValid = false;
    } else {
      const fileName = paymentFile.name.toLowerCase();
      const mimeType = paymentFile.type.toLowerCase();
      const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp", ".pjp", ".pjpeg"];
      const hasValidExt = allowedExtensions.some((ext) => fileName.endsWith(ext));
      const hasValidMime = mimeType.startsWith("image/");

      if (!hasValidExt && !hasValidMime) {
        setFileError("Please upload a valid payment screenshot (PNG, JPG, or WEBP).");
        isValid = false;
      } else if (paymentFile.size > 5 * 1024 * 1024) {
        setFileError("The payment screenshot is too large. Please upload an image under 5MB.");
        isValid = false;
      } else {
        setFileError("");
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError("");

    if (!validateForm()) {
      setGlobalError("Please resolve all required fields and upload your payment screenshot.");
      const elem = document.getElementById("registration-section");
      if (elem) elem.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (!paymentFile) return;

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append("teamLeadEmail", formData.teamLeadEmail);
      submitData.append("teamLeadName", formData.teamLeadName);
      submitData.append("year", formData.year);
      submitData.append("section", formData.section);
      submitData.append("teamLeadRollNumber", formData.teamLeadRollNumber);
      submitData.append("teamLeadPhone", formData.teamLeadPhone);

      submitData.append("member1Name", formData.member1Name);
      submitData.append("member1Roll", formData.member1Roll);
      submitData.append("member2Name", formData.member2Name);
      submitData.append("member2Roll", formData.member2Roll);
      submitData.append("member3Name", formData.member3Name);
      submitData.append("member3Roll", formData.member3Roll);

      submitData.append("paymentScreenshot", paymentFile);

      const res = await fetch("/api/register", {
        method: "POST",
        body: submitData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setGlobalError(
          data.error || "Something went wrong while submitting your registration. Please try again."
        );
        setIsSubmitting(false);
        return;
      }

      // Registration Successful
      setSuccessData({
        isOpen: true,
        registrationId: data.registrationId || "AIVM-001",
        email: formData.teamLeadEmail,
      });

      // Reset form
      setFormData({
        teamLeadEmail: "",
        teamLeadName: "",
        year: "",
        section: "",
        teamLeadRollNumber: "",
        teamLeadPhone: "",
        member1Name: "",
        member1Roll: "",
        member2Name: "",
        member2Roll: "",
        member3Name: "",
        member3Roll: "",
      });
      setPaymentFile(null);
      setErrors({});
      setFileError("");
      setGlobalError("");
    } catch (err) {
      console.error("Submission error:", err);
      setGlobalError("Something went wrong while submitting your registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    setSuccessData({ isOpen: false, registrationId: "", email: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Registration Section: Dark Obsidian Plum Background */}
      <section id="registration-section" className="py-12 sm:py-16 md:py-24 bg-[#17121C] text-[#FFFDF7] relative border-b border-[#2E223A]">
        <div className="absolute inset-0 film-grid-dark opacity-40 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-3 sm:px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center space-x-1.5 sm:space-x-2 px-2.5 py-1 rounded-[2px] bg-[#241A2D] border border-[#362844] text-[#C8F04A] text-[11px] sm:text-xs font-mono font-bold uppercase tracking-widest mb-2 sm:mb-3">
              <Film className="w-3.5 h-3.5 text-[#C8F04A]" />
              <span>OFFICIAL REGISTRATION</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#FFFDF7] mb-2">
              BUILD YOUR SQUAD
            </h2>
            <p className="text-xs sm:text-sm font-mono text-[#B9A7C9] max-w-lg mx-auto">
              Register your team of 4 for the AI Video Challenge.
            </p>
          </div>

          {/* Global Error Banner */}
          {globalError && (
            <div className="mb-6 sm:mb-8 p-3.5 sm:p-4 rounded-[4px] bg-rose-950/80 border border-rose-500/60 flex items-start space-x-2.5 sm:space-x-3 text-rose-200 animate-in fade-in">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 text-rose-400" />
              <div className="text-xs sm:text-sm font-mono">
                <span className="font-bold block">Registration Incomplete</span>
                <span>{globalError}</span>
              </div>
            </div>
          )}

          {/* Main Dark Form Container */}
          <div className="bg-[#1F1726] text-[#FFFDF7] rounded-[4px] p-3.5 sm:p-7 md:p-10 border border-[#362844] shadow-2xl mb-8 sm:mb-12">
            {/* TEAM LEAD */}
            <TeamLeadSection
              formData={formData}
              errors={errors}
              onChange={handleFieldChange}
            />

            <hr className="my-6 sm:my-8 border-[#362844]" />

            {/* TEAM MEMBERS */}
            <TeamMembersSection
              formData={formData}
              errors={errors}
              onChange={handleFieldChange}
            />

            <hr className="my-6 sm:my-8 border-[#362844]" />

            {/* PAYMENT */}
            <PaymentSection
              paymentFile={paymentFile}
              fileError={fileError}
              onFileSelect={handleFileSelect}
            />

            {/* Final Submission Block with Acid Lime CTA */}
            <div className="pt-5 sm:pt-6 border-t border-[#362844]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-5 rounded-[4px] bg-[#191220] border border-[#362844] mb-4 sm:mb-6">
                <div className="flex items-center space-x-2.5 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[2px] bg-[#241A2D] text-[#C8F04A] border border-[#362844] flex items-center justify-center flex-shrink-0 font-mono font-bold text-xs sm:text-sm">
                    ✓
                  </div>
                  <div className="text-left">
                    <p className="text-xs sm:text-sm font-mono font-bold text-[#FFFDF7]">4 Team Members + Payment Receipt</p>
                    <p className="text-[10px] sm:text-xs font-mono text-[#96869E]">Instant confirmation email sent to Team Lead</p>
                  </div>
                </div>

                <div className="text-left sm:text-right w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#362844] flex sm:block items-center justify-between">
                  <span className="text-[10px] sm:text-[11px] font-mono text-[#96869E] block">Total Amount:</span>
                  <span className="font-editorial text-xl sm:text-3xl font-black text-[#C8F04A] font-mono sm:mt-0.5 block">
                    {EVENT_CONFIG.REGISTRATION_FEE}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-acid-lime w-full py-3.5 sm:py-4 min-h-[50px] sm:min-h-[54px] text-xs sm:text-sm font-extrabold tracking-wider uppercase flex items-center justify-center space-x-2 cursor-pointer shadow-md hover:shadow-lg touch-manipulation"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-[#17121C]" />
                    <span>SUBMITTING REGISTRATION...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#17121C]" />
                    <span>COMPLETE REGISTRATION (₹100) →</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Success Modal */}
      <SuccessModal
        isOpen={successData.isOpen}
        registrationId={successData.registrationId}
        teamLeadEmail={successData.email}
        onClose={handleCloseSuccess}
      />
    </form>
  );
}
