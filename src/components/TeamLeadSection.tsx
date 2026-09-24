"use client";

import { Mail, User, Phone, Hash, Layers } from "lucide-react";
import FormStepHeader from "./FormStepHeader";
import { EVENT_CONFIG } from "@/lib/config";

interface TeamLeadSectionProps {
  formData: {
    teamLeadEmail: string;
    teamLeadName: string;
    year: string;
    section: string;
    teamLeadRollNumber: string;
    teamLeadPhone: string;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

export default function TeamLeadSection({ formData, errors, onChange }: TeamLeadSectionProps) {
  const selectedYearObj = EVENT_CONFIG.YEAR_SECTION_OPTIONS.find(
    (item) => item.year === formData.year
  );
  const availableSections = selectedYearObj ? selectedYearObj.sections : [];

  const handleYearChange = (newYear: string) => {
    onChange("year", newYear);
    const newYearObj = EVENT_CONFIG.YEAR_SECTION_OPTIONS.find((item) => item.year === newYear);
    if (newYearObj && newYearObj.sections.length > 0) {
      onChange("section", newYearObj.sections[0]);
    } else {
      onChange("section", "");
    }
  };

  return (
    <div className="mb-10">
      <FormStepHeader
        step="01"
        title="TEAM LEAD"
        subtitle="Primary contact person responsible for team correspondence and event notifications"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Team Lead Email */}
        <div className="md:col-span-2">
          <label className="block text-xs font-mono font-bold text-[#FFFDF7] uppercase tracking-wider mb-2">
            Team Lead Email <span className="text-[#FF6B5E]">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#96869E]">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              required
              value={formData.teamLeadEmail}
              onChange={(e) => onChange("teamLeadEmail", e.target.value)}
              placeholder="lead.student@university.edu"
              className={`dark-editorial-input w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm text-[#FFFDF7] placeholder-[#786882] ${
                errors.teamLeadEmail ? "!border-rose-500 ring-2 ring-rose-500/20" : ""
              }`}
            />
          </div>
          <p className="text-[11px] font-mono text-[#96869E] mt-1.5">
            Confirmation email &amp; Registration ID will be dispatched to this address.
          </p>
          {errors.teamLeadEmail && (
            <p className="text-xs text-rose-400 mt-1 font-mono">{errors.teamLeadEmail}</p>
          )}
        </div>

        {/* Team Lead Name */}
        <div>
          <label className="block text-xs font-mono font-bold text-[#FFFDF7] uppercase tracking-wider mb-2">
            Team Lead Name <span className="text-[#FF6B5E]">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#96869E]">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              value={formData.teamLeadName}
              onChange={(e) => onChange("teamLeadName", e.target.value)}
              placeholder="e.g. Alex Morgan"
              className={`dark-editorial-input w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm text-[#FFFDF7] placeholder-[#786882] ${
                errors.teamLeadName ? "!border-rose-500 ring-2 ring-rose-500/20" : ""
              }`}
            />
          </div>
          {errors.teamLeadName && (
            <p className="text-xs text-rose-400 mt-1 font-mono">{errors.teamLeadName}</p>
          )}
        </div>

        {/* Team Lead Roll Number */}
        <div>
          <label className="block text-xs font-mono font-bold text-[#FFFDF7] uppercase tracking-wider mb-2">
            Team Lead Roll Number <span className="text-[#FF6B5E]">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#96869E]">
              <Hash className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              value={formData.teamLeadRollNumber}
              onChange={(e) => onChange("teamLeadRollNumber", e.target.value.toUpperCase())}
              placeholder="e.g. 22CS0101"
              className={`dark-editorial-input w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm text-[#FFFDF7] placeholder-[#786882] uppercase ${
                errors.teamLeadRollNumber ? "!border-rose-500 ring-2 ring-rose-500/20" : ""
              }`}
            />
          </div>
          {errors.teamLeadRollNumber && (
            <p className="text-xs text-rose-400 mt-1 font-mono">{errors.teamLeadRollNumber}</p>
          )}
        </div>

        {/* Year */}
        <div>
          <label className="block text-xs font-mono font-bold text-[#FFFDF7] uppercase tracking-wider mb-2">
            Year <span className="text-[#FF6B5E]">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#96869E]">
              <Layers className="w-4 h-4" />
            </div>
            <select
              value={formData.year}
              onChange={(e) => handleYearChange(e.target.value)}
              className={`dark-editorial-input w-full pl-10 pr-8 py-2.5 sm:py-3 text-sm text-[#FFFDF7] appearance-none cursor-pointer bg-[#191220] ${
                errors.year ? "!border-rose-500 ring-2 ring-rose-500/20" : ""
              }`}
            >
              <option value="" disabled className="text-[#786882] bg-[#191220]">
                Select Year
              </option>
              {EVENT_CONFIG.YEAR_SECTION_OPTIONS.map((item) => (
                <option key={item.year} value={item.year} className="text-[#FFFDF7] bg-[#191220]">
                  {item.year}
                </option>
              ))}
            </select>
          </div>
          {errors.year && <p className="text-xs text-rose-400 mt-1 font-mono">{errors.year}</p>}
        </div>

        {/* Section */}
        <div>
          <label className="block text-xs font-mono font-bold text-[#FFFDF7] uppercase tracking-wider mb-2">
            Section <span className="text-[#FF6B5E]">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#96869E]">
              <Layers className="w-4 h-4" />
            </div>
            <select
              value={formData.section}
              onChange={(e) => onChange("section", e.target.value)}
              disabled={!formData.year}
              className={`dark-editorial-input w-full pl-10 pr-8 py-2.5 sm:py-3 text-sm text-[#FFFDF7] appearance-none cursor-pointer bg-[#191220] ${
                !formData.year ? "opacity-50 cursor-not-allowed" : ""
              } ${errors.section ? "!border-rose-500 ring-2 ring-rose-500/20" : ""}`}
            >
              <option value="" disabled className="text-[#786882] bg-[#191220]">
                {formData.year ? "Select Section" : "Choose Year First"}
              </option>
              {availableSections.map((sec) => (
                <option key={sec} value={sec} className="text-[#FFFDF7] bg-[#191220]">
                  {sec}
                </option>
              ))}
            </select>
          </div>
          {errors.section && <p className="text-xs text-rose-400 mt-1 font-mono">{errors.section}</p>}
        </div>

        {/* Team Lead Phone */}
        <div className="md:col-span-2">
          <label className="block text-xs font-mono font-bold text-[#FFFDF7] uppercase tracking-wider mb-2">
            Team Lead Phone Number <span className="text-[#FF6B5E]">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#96869E]">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="tel"
              required
              value={formData.teamLeadPhone}
              onChange={(e) => onChange("teamLeadPhone", e.target.value)}
              placeholder="e.g. 9876543210"
              className={`dark-editorial-input w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm text-[#FFFDF7] placeholder-[#786882] ${
                errors.teamLeadPhone ? "!border-rose-500 ring-2 ring-rose-500/20" : ""
              }`}
            />
          </div>
          {errors.teamLeadPhone && (
            <p className="text-xs text-rose-400 mt-1 font-mono">{errors.teamLeadPhone}</p>
          )}
        </div>
      </div>
    </div>
  );
}
