"use client";

import { Sparkles, Film, Video, Award, Users, Zap } from "lucide-react";

export default function MarqueeTicker() {
  const items = [
    { icon: Sparkles, text: "VISIONOVA 2026" },
    { icon: Film, text: "AI VIDEO CREATION" },
    { icon: Award, text: "AWARDS" },
    { icon: Users, text: "4-MEMBER SQUADS" },
    { icon: Video, text: "GEN-AI CINEMA" },
    { icon: Zap, text: "DEPT OF AI & DS • AITS TIRUPATI" },
    { icon: Sparkles, text: "28 SEPTEMBER 2026" },
  ];

  return (
    <div className="w-full bg-[#191220] border-y border-[#362844] py-2.5 overflow-hidden relative select-none">
      {/* Left/Right Gradient Fades */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-[#191220] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-[#191220] to-transparent z-10 pointer-events-none" />

      <div className="animate-marquee flex items-center space-x-8">
        {/* First Loop */}
        <div className="flex items-center space-x-8">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={`a-${idx}`}
                className="inline-flex items-center space-x-2 text-xs sm:text-sm font-mono tracking-wider text-[#B9A7C9] whitespace-nowrap"
              >
                <Icon className="w-3.5 h-3.5 text-[#C8F04A]" />
                <span className="font-semibold text-[#FFFDF7]">{item.text}</span>
                <span className="text-[#FF6B5E] mx-2">•</span>
              </div>
            );
          })}
        </div>

        {/* Duplicate Loop for seamless infinite scroll */}
        <div className="flex items-center space-x-8">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={`b-${idx}`}
                className="inline-flex items-center space-x-2 text-xs sm:text-sm font-mono tracking-wider text-[#B9A7C9] whitespace-nowrap"
              >
                <Icon className="w-3.5 h-3.5 text-[#C8F04A]" />
                <span className="font-semibold text-[#FFFDF7]">{item.text}</span>
                <span className="text-[#FF6B5E] mx-2">•</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
