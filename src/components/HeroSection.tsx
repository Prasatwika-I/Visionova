"use client";

import { ArrowRight } from "lucide-react";
import { EVENT_CONFIG } from "@/lib/config";

export default function HeroSection() {
  const scrollToForm = () => {
    const formElement = document.getElementById("registration-section");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 md:pt-24 md:pb-28 overflow-hidden bg-[#17121C] text-[#FFFDF7] border-b border-[#241A2D]">
      {/* Subtle film grid texture */}
      <div className="absolute inset-0 film-grid-dark opacity-40 pointer-events-none" />

      {/* Subtle Atmospheric Accents (Contained) */}
      <div className="absolute top-12 right-1/4 w-60 sm:w-80 h-60 sm:h-80 bg-[#FF6B5E]/6 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-12 left-1/4 w-52 sm:w-72 h-52 sm:h-72 bg-[#C8F04A]/6 rounded-full blur-[70px] pointer-events-none" />

      {/* Film Viewfinder Crop Marks (Hidden on tiny screens to avoid distraction) */}
      <div className="absolute top-6 left-6 w-4 h-4 border-t border-l border-[#B9A7C9]/30 pointer-events-none hidden sm:block" />
      <div className="absolute top-6 right-6 w-4 h-4 border-t border-r border-[#B9A7C9]/30 pointer-events-none hidden sm:block" />
      <div className="absolute bottom-6 left-6 w-4 h-4 border-b border-l border-[#B9A7C9]/30 pointer-events-none hidden sm:block" />
      <div className="absolute bottom-6 right-6 w-4 h-4 border-b border-r border-[#B9A7C9]/30 pointer-events-none hidden sm:block" />

      {/* Editorial Frame & Technical Metadata */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Top Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-y-1.5 gap-x-3 text-[10px] sm:text-[11px] font-mono text-[#B9A7C9]/80 border-b border-[#241A2D] pb-3 sm:pb-4 mb-6 sm:mb-10">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <span className="text-[#C8F04A] font-bold">FRAME 01</span>
            <span>/</span>
            <span>AI VIDEO MAKING</span>
            <span>/</span>
            <span>28.09.26</span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <span className="hidden xs:inline">AITS TIRUPATI</span>
            <span className="hidden xs:inline">•</span>
            <span className="text-[#FF6B5E]">REC [●]</span>
          </div>
        </div>

        {/* Center Content */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Eyebrow with Acid Lime accent */}
          <div className="inline-flex items-center justify-center space-x-2 sm:space-x-2.5 mb-4 sm:mb-6 max-w-full">
            <div className="h-[2px] w-4 sm:w-6 bg-[#C8F04A] flex-shrink-0" />
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.18em] sm:tracking-[0.25em] text-[#C8F04A] uppercase text-center leading-tight">
              AI VIDEO CREATION CHALLENGE
            </span>
            <div className="h-[2px] w-4 sm:w-6 bg-[#C8F04A] flex-shrink-0" />
          </div>

          {/* Main Title: VISIONOVA with clamp() */}
          <div className="relative mb-2 sm:mb-3">
            <h1 className="hero-title font-black tracking-tight text-[#FFFDF7] select-none break-words">
              VISIONOVA
            </h1>
          </div>

          {/* Subtitle in Dusty Lilac */}
          <div className="mb-4 sm:mb-6">
            <span className="hero-subtitle font-extrabold uppercase text-[#B9A7C9] block">
              AI VIDEO MAKING EVENT
            </span>
          </div>

          {/* Supporting Line */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-6 text-[11px] sm:text-sm font-mono font-semibold tracking-[0.2em] sm:tracking-[0.3em] text-[#FFFDF7]/90 mb-6 sm:mb-10 uppercase">
            <span>CREATE.</span>
            <span className="text-[#FF6B5E]">•</span>
            <span>IMAGINE.</span>
            <span className="text-[#C8F04A]">•</span>
            <span>ANIMATE.</span>
            <span className="text-[#B9A7C9]">•</span>
            <span>INSPIRE.</span>
          </div>

          {/* Event Information Strip (Responsive wrap on mobile) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-y-2 gap-x-5 text-xs sm:text-sm font-mono text-[#B9A7C9] mb-8 sm:mb-10 py-3 sm:py-3.5 px-4 sm:px-6 rounded-[4px] border border-[#241A2D] bg-[#241A2D]/50 backdrop-blur-xs max-w-2xl mx-auto shadow-sm">
            <div className="flex items-center space-x-2">
              <span className="text-[#FFFDF7] font-bold uppercase">28 SEPTEMBER 2026</span>
              <span className="text-[#DDD3C8]/30 hidden sm:inline">|</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[#FFFDF7] uppercase">{EVENT_CONFIG.EVENT_VENUE}</span>
              <span className="text-[#DDD3C8]/30 hidden sm:inline">|</span>
            </div>
            <div>
              <span>REGISTRATION FEE: <strong className="text-[#C8F04A] font-bold">₹100</strong></span>
            </div>
          </div>

          {/* College & Department Attribution */}
          <div className="text-center mb-8 max-w-lg mx-auto">
            <p className="text-xs sm:text-sm font-medium text-[#FFFDF7] mb-1">
              {EVENT_CONFIG.COLLEGE_NAME}
            </p>
            <p className="text-[11px] sm:text-xs font-mono text-[#B9A7C9]">
              Organized by: {EVENT_CONFIG.ORGANIZER_NAME}
            </p>
          </div>

          {/* Primary CTA: Full-width on mobile (w-full sm:w-auto), 52px height */}
          <div className="w-full sm:w-auto inline-block">
            <button
              onClick={scrollToForm}
              className="btn-acid-lime w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 min-h-[52px] text-sm sm:text-base font-extrabold cursor-pointer tracking-wider uppercase shadow-md hover:shadow-lg touch-manipulation"
            >
              <span>REGISTER NOW</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>

        {/* Bottom Technical Strip */}
        <div className="mt-10 sm:mt-14 pt-4 sm:pt-6 border-t border-[#241A2D] flex flex-wrap items-center justify-between text-[10px] sm:text-[11px] font-mono text-[#695A6B] gap-2">
          <div className="flex items-center space-x-3">
            <span>ASPECT 16:9</span>
            <span>•</span>
            <span>GENERATIVE AI CINEMA</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-[1px] bg-[#C8F04A]" />
            <span>4 MEMBERS / TEAM</span>
          </div>
        </div>
      </div>
    </section>
  );
}
