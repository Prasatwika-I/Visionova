"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { EVENT_CONFIG } from "@/lib/config";

export default function HeroSection() {
  const scrollToForm = () => {
    const formElement = document.getElementById("registration-section");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative pt-8 pb-14 sm:pt-16 sm:pb-20 md:pt-24 md:pb-28 overflow-hidden bg-[#17121C] text-[#FFFDF7] border-b border-[#241A2D]">
      {/* Subtle film grid texture */}
      <div className="absolute inset-0 film-grid-dark opacity-40 pointer-events-none" />

      {/* Subtle Atmospheric Accents */}
      <div className="absolute top-12 right-1/4 w-48 sm:w-80 h-48 sm:h-80 bg-[#FF6B5E]/8 rounded-full blur-[70px] pointer-events-none" />
      <div className="absolute bottom-12 left-1/4 w-44 sm:w-72 h-44 sm:h-72 bg-[#C8F04A]/8 rounded-full blur-[60px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Top Technical Metadata Bar */}
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-[#B9A7C9]/80 border-b border-[#241A2D] pb-2.5 sm:pb-3 mb-6 sm:mb-10">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <span className="text-[#C8F04A] font-bold">FRAME 01</span>
            <span>/</span>
            <span>AI CINEMA</span>
            <span>/</span>
            <span>28.09.26</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B5E] animate-pulse" />
            <span className="text-[#FF6B5E] font-bold">REC [●]</span>
          </div>
        </div>

        {/* Center Content */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center justify-center space-x-2 mb-3 sm:mb-5">
            <div className="h-[2px] w-3 sm:w-5 bg-[#C8F04A]" />
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.2em] sm:tracking-[0.25em] text-[#C8F04A] uppercase text-center leading-tight">
              AI VIDEO CREATION CHALLENGE
            </span>
            <div className="h-[2px] w-3 sm:w-5 bg-[#C8F04A]" />
          </div>

          {/* Main Title: VISIONOVA */}
          <div className="relative mb-2 sm:mb-3">
            <h1 className="hero-title font-black tracking-tight text-[#FFFDF7] select-none">
              VISIONOVA
            </h1>
          </div>

          {/* Subtitle in Dusty Lilac */}
          <div className="mb-4 sm:mb-6">
            <span className="hero-subtitle font-extrabold uppercase text-[#B9A7C9] block">
              AI VIDEO MAKING EVENT
            </span>
          </div>

          {/* Structured Responsive Tagline */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[10px] sm:text-xs md:text-sm font-mono font-semibold tracking-[0.18em] sm:tracking-[0.25em] text-[#FFFDF7]/90 mb-6 sm:mb-8 uppercase max-w-xl mx-auto">
            <span>CREATE</span>
            <span className="text-[#FF6B5E]">•</span>
            <span>IMAGINE</span>
            <span className="text-[#C8F04A]">•</span>
            <span>ANIMATE</span>
            <span className="text-[#B9A7C9]">•</span>
            <span>INSPIRE</span>
          </div>

          {/* Event Information Pill (Clean horizontal wrap) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm font-mono text-[#B9A7C9] mb-6 sm:mb-8 p-3 sm:p-4 rounded-[4px] border border-[#2E223A] bg-[#1F1726]/80 backdrop-blur-xs max-w-2xl mx-auto shadow-sm">
            <div className="flex sm:flex-col items-center justify-between sm:justify-center p-2 rounded-[2px] bg-[#241A2D]/60 sm:bg-transparent">
              <span className="text-[10px] uppercase text-[#786882] sm:mb-0.5">Date</span>
              <span className="text-[#FFFDF7] font-bold">28 SEPT 2026</span>
            </div>
            <div className="flex sm:flex-col items-center justify-between sm:justify-center p-2 rounded-[2px] bg-[#241A2D]/60 sm:bg-transparent">
              <span className="text-[10px] uppercase text-[#786882] sm:mb-0.5">Venue</span>
              <span className="text-[#FFFDF7] font-bold uppercase truncate max-w-[180px]">{EVENT_CONFIG.EVENT_VENUE}</span>
            </div>
            <div className="flex sm:flex-col items-center justify-between sm:justify-center p-2 rounded-[2px] bg-[#241A2D]/60 sm:bg-transparent">
              <span className="text-[10px] uppercase text-[#786882] sm:mb-0.5">Entry Fee</span>
              <span className="text-[#C8F04A] font-black">{EVENT_CONFIG.REGISTRATION_FEE} / Team</span>
            </div>
          </div>

          {/* College & Department */}
          <div className="text-center mb-6 sm:mb-8 max-w-md mx-auto px-2">
            <p className="text-xs sm:text-sm font-medium text-[#FFFDF7] mb-0.5 leading-snug">
              {EVENT_CONFIG.COLLEGE_NAME}
            </p>
            <p className="text-[10px] sm:text-xs font-mono text-[#96869E]">
              {EVENT_CONFIG.ORGANIZER_NAME}
            </p>
          </div>

          {/* Primary CTA */}
          <div className="w-full sm:w-auto inline-block">
            <button
              onClick={scrollToForm}
              className="btn-acid-lime w-full sm:w-auto px-7 sm:px-10 py-3.5 sm:py-4 min-h-[50px] sm:min-h-[54px] text-sm sm:text-base font-extrabold cursor-pointer tracking-wider uppercase shadow-md hover:shadow-lg touch-manipulation"
            >
              <span>REGISTER YOUR TEAM</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>

        {/* Bottom Technical Strip */}
        <div className="mt-8 sm:mt-12 pt-3 sm:pt-4 border-t border-[#241A2D] flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-[#695A6B]">
          <span>GEN-AI FILM FESTIVAL</span>
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-[1px] bg-[#C8F04A]" />
            <span>4 MEMBERS / SQUAD</span>
          </div>
        </div>
      </div>
    </section>
  );
}
