import Link from "next/link";
import { Shield } from "lucide-react";
import { EVENT_CONFIG } from "@/lib/config";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-[#2E223A] bg-[#17121C]/95 backdrop-blur-md sticky top-0 z-40 text-[#FFFDF7]">
      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 py-2.5 sm:py-3 min-h-16 flex items-center justify-between gap-3">
        {/* Left: Brand with Logo, Title & Full College Name */}
        <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3.5 group min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[3px] overflow-hidden border border-[#362844] p-0.5 bg-[#1F1726] flex-shrink-0 group-hover:border-[#C8F04A]/60 transition-colors">
            <img
              src="/logo.jpeg"
              alt="Visionova Official Logo"
              className="w-full h-full object-cover rounded-[2px]"
            />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="font-editorial text-lg sm:text-2xl font-black tracking-tight text-[#FFFDF7] group-hover:text-[#C8F04A] transition-colors leading-none">
                {EVENT_CONFIG.EVENT_TITLE.toUpperCase()}
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-[2px] bg-[#241A2D] text-[#C8F04A] font-semibold border border-[#362844] tracking-wider uppercase flex-shrink-0">
                {EVENT_CONFIG.EVENT_SUBTITLE}
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-mono text-[#B9A7C9] leading-tight mt-1 truncate sm:whitespace-normal">
              {EVENT_CONFIG.COLLEGE_NAME}
            </span>
          </div>
        </Link>

        {/* Right: Distinct Dark Admin Access Button */}
        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          <Link
            href="/admin"
            className="inline-flex items-center justify-center space-x-1.5 text-xs font-mono text-[#C8F04A] bg-[#241A2D] hover:bg-[#362844] hover:border-[#C8F04A]/60 px-3 sm:px-4 py-2 min-h-[44px] rounded-[4px] border border-[#362844] transition-all font-bold touch-manipulation shadow-xs"
          >
            <Shield className="w-3.5 h-3.5 flex-shrink-0 text-[#C8F04A]" />
            <span>Admin Access</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
