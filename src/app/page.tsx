import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import EventInfoSection from "@/components/EventInfoSection";
import RegistrationForm from "@/components/RegistrationForm";
import { EVENT_CONFIG } from "@/lib/config";
import { Calendar, Building2 } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col justify-between bg-[#17121C] text-[#FFFDF7]">
      {/* 1. DARK NAVBAR (#17121C) */}
      <Navbar />
      
      <div className="flex-1">
        {/* 2. DARK CINEMATIC HERO (#17121C) */}
        <HeroSection />

        {/* 3. DARK EVENT INFORMATION (#17121C) */}
        <EventInfoSection />

        {/* 4. DARK REGISTRATION & PAYMENT (#17121C) */}
        <RegistrationForm />
      </div>

      {/* 5. DARK FOOTER (#17121C) */}
      <footer className="w-full bg-[#17121C] py-16 text-[#FFFDF7] border-t border-[#2E223A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12 pb-12 border-b border-[#2E223A]">
            {/* Branding */}
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src="/logo.jpeg"
                  alt="Visionova Logo"
                  className="w-10 h-10 rounded-[3px] object-cover border border-[#362844] shadow-xs"
                />
                <div>
                  <span className="font-editorial text-2xl font-black tracking-tight text-[#FFFDF7] block leading-none">
                    VISIONOVA
                  </span>
                  <span className="text-[10px] font-mono tracking-[0.2em] text-[#C8F04A] uppercase block mt-1">
                    AI VIDEO MAKING EVENT
                  </span>
                </div>
              </div>
              <p className="text-xs font-mono text-[#B9A7C9] mt-3">
                "{EVENT_CONFIG.EVENT_TAGLINE}"
              </p>
            </div>

            {/* Institution & Department */}
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#C8F04A] mb-3 flex items-center space-x-1.5">
                <Building2 className="w-4 h-4 text-[#C8F04A]" />
                <span>INSTITUTION &amp; ORGANIZER</span>
              </h4>
              <p className="text-sm font-semibold text-[#FFFDF7] mb-1">
                Annamacharya Institute of Technology and Sciences, Tirupati
              </p>
              <p className="text-xs font-mono text-[#96869E]">
                Department of Artificial Intelligence and Data Science
              </p>
            </div>

            {/* Schedule & Venue */}
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#C8F04A] mb-3 flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-[#C8F04A]" />
                <span>SCHEDULE &amp; VENUE</span>
              </h4>
              <p className="text-sm text-[#FFFDF7] flex items-center space-x-2 mb-1.5">
                <span className="text-[#96869E] text-xs font-mono uppercase font-semibold">Date:</span>
                <span className="font-bold">28 September 2026</span>
              </p>
              <p className="text-sm text-[#FFFDF7] flex items-center space-x-2 mb-2">
                <span className="text-[#96869E] text-xs font-mono uppercase font-semibold">Venue:</span>
                <span className="font-bold">MBA Seminar Hall</span>
              </p>
              <p className="text-xs font-mono text-[#96869E]">
                Registration Fee: <strong className="text-[#C8F04A]">₹100</strong> per team (4 Members)
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#96869E]">
            <p>
              © 2026 VISIONOVA. Annamacharya Institute of Technology and Sciences, Tirupati.
            </p>
            <div className="flex items-center space-x-3">
              <span className="px-2.5 py-1 rounded-[2px] bg-[#241A2D] border border-[#362844] text-[#B9A7C9] text-[11px]">
                OFFICIAL REGISTRATION PORTAL
              </span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
