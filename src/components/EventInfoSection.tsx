"use client";

import { Calendar, MapPin, Users, Ticket } from "lucide-react";
import { EVENT_CONFIG } from "@/lib/config";

export default function EventInfoSection() {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-[#17121C] text-[#FFFDF7] border-b border-[#2E223A] relative overflow-hidden">
      {/* Subtle dark film grid texture */}
      <div className="absolute inset-0 film-grid-dark opacity-40 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Editorial Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 pb-4 sm:pb-6 border-b border-[#2E223A]">
          <div>
            <div className="inline-flex items-center space-x-2 text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-[#C8F04A] uppercase mb-1.5 sm:mb-2">
              <span className="w-1.5 h-1.5 bg-[#C8F04A] rounded-[1px]" />
              <span>OVERVIEW &amp; SCHEDULE</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#FFFDF7]">
              EVENT DETAILS
            </h2>
          </div>
          <div className="mt-2 sm:mt-0 font-mono text-[11px] sm:text-xs text-[#96869E]">
            <span>VISIONOVA 2026</span>
            <span className="mx-1.5">•</span>
            <span>TIRUPATI</span>
          </div>
        </div>

        {/* Asymmetric Dark Editorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-5">
          {/* Card 1: DATE (Span 7) */}
          <div className="md:col-span-7 bg-[#1F1726] p-4 sm:p-6 md:p-7 rounded-[4px] border border-[#362844] flex flex-col justify-between shadow-xs interactive-card cursor-default">
            <div className="flex items-start justify-between mb-3 sm:mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] sm:text-xs font-mono font-bold px-2 py-0.5 rounded-[2px] bg-[#C8F04A] text-[#17121C]">
                  01
                </span>
                <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-[#B9A7C9] font-semibold">
                  EVENT DATE
                </span>
              </div>
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#C8F04A]" />
            </div>

            <div>
              <div className="font-editorial text-2xl sm:text-3xl md:text-4xl font-bold text-[#FFFDF7] mb-1 sm:mb-2">
                {EVENT_CONFIG.EVENT_DATE}
              </div>
              <p className="text-[11px] sm:text-xs font-mono text-[#96869E]">
                Full-day live creative AI video screening &amp; jury evaluation showcase.
              </p>
            </div>
          </div>

          {/* Card 2: VENUE (Span 5) */}
          <div className="md:col-span-5 bg-[#1F1726] p-4 sm:p-6 md:p-7 rounded-[4px] border border-[#362844] flex flex-col justify-between shadow-xs interactive-card cursor-default">
            <div className="flex items-start justify-between mb-3 sm:mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] sm:text-xs font-mono font-bold px-2 py-0.5 rounded-[2px] bg-[#C8F04A] text-[#17121C]">
                  02
                </span>
                <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-[#B9A7C9] font-semibold">
                  LOCATION
                </span>
              </div>
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#C8F04A]" />
            </div>

            <div>
              <div className="font-editorial text-xl sm:text-2xl md:text-3xl font-bold text-[#FFFDF7] mb-1 sm:mb-2">
                {EVENT_CONFIG.EVENT_VENUE}
              </div>
              <p className="text-[11px] sm:text-xs font-mono text-[#96869E]">
                {EVENT_CONFIG.COLLEGE_NAME}
              </p>
            </div>
          </div>

          {/* Card 3: TEAM SIZE (Span 5) */}
          <div className="md:col-span-5 bg-[#1F1726] p-4 sm:p-6 md:p-7 rounded-[4px] border border-[#362844] flex flex-col justify-between shadow-xs interactive-card cursor-default">
            <div className="flex items-start justify-between mb-3 sm:mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] sm:text-xs font-mono font-bold px-2 py-0.5 rounded-[2px] bg-[#C8F04A] text-[#17121C]">
                  03
                </span>
                <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-[#B9A7C9] font-semibold">
                  TEAM FORMAT
                </span>
              </div>
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#C8F04A]" />
            </div>

            <div>
              <div className="font-editorial text-2xl sm:text-3xl md:text-4xl font-bold text-[#FFFDF7] mb-1 sm:mb-2">
                4 Members
              </div>
              <p className="text-[11px] sm:text-xs font-mono text-[#96869E]">
                1 Team Lead + 3 Collaborating Team Members.
              </p>
            </div>
          </div>

          {/* Card 4: REGISTRATION (Span 7) */}
          <div className="md:col-span-7 bg-[#1F1726] p-4 sm:p-6 md:p-7 rounded-[4px] border border-[#362844] flex flex-col justify-between shadow-xs interactive-card cursor-default">
            <div className="flex items-start justify-between mb-3 sm:mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] sm:text-xs font-mono font-bold px-2 py-0.5 rounded-[2px] bg-[#C8F04A] text-[#17121C]">
                  04
                </span>
                <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-[#B9A7C9] font-semibold">
                  REGISTRATION FEE
                </span>
              </div>
              <Ticket className="w-4 h-4 sm:w-5 sm:h-5 text-[#C8F04A]" />
            </div>

            <div>
              <div className="font-editorial text-2xl sm:text-3xl md:text-4xl font-bold text-[#FFFDF7] mb-1 sm:mb-2 font-mono">
                {EVENT_CONFIG.REGISTRATION_FEE}
              </div>
              <p className="text-[11px] sm:text-xs font-mono text-[#96869E]">
                Single ₹100 registration fee covers the complete 4-member team registration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
