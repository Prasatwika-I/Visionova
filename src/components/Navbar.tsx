import Link from "next/link";
import { Shield } from "lucide-react";
import { EVENT_CONFIG } from "@/lib/config";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-[#2E223A] bg-[#17121C]/95 backdrop-blur-md sticky top-0 z-40 text-[#FFFDF7]">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 min-h-[60px] sm:min-h-16 flex items-center justify-between gap-2.5 sm:gap-4">
        {/* Left: Brand with Logo, Title & College Name */}
        <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group min-w-0 flex-1">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-[3px] overflow-hidden border border-[#362844] p-0.5 bg-[#1F1726] flex-shrink-0 group-hover:border-[#C8F04A]/60 transition-colors">
            <img
              src="/logo.jpeg"
              alt="Visionova Official Logo"
              className="w-full h-full object-cover rounded-[2px]"
            />
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="font-editorial text-base sm:text-xl md:text-2xl font-black tracking-tight text-[#FFFDF7] group-hover:text-[#C8F04A] transition-colors leading-none">
                {EVENT_CONFIG.EVENT_TITLE.toUpperCase()}
              </span>
              <span className="hidden xs:inline-block text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded-[2px] bg-[#241A2D] text-[#C8F04A] font-semibold border border-[#362844] tracking-wider uppercase flex-shrink-0">
                AI EVENT
              </span>
            </div>
            <span className="text-[9px] sm:text-[11px] font-mono text-[#B9A7C9] leading-tight mt-0.5 sm:mt-1 truncate">
              {EVENT_CONFIG.COLLEGE_NAME}
            </span>
          </div>
        </Link>

        {/* Right: Compact Touch-Friendly Admin Access Button */}
        <div className="flex items-center flex-shrink-0">
          <Link
            href="/admin"
            className="inline-flex items-center justify-center space-x-1 sm:space-x-1.5 text-[11px] sm:text-xs font-mono text-[#C8F04A] bg-[#241A2D] hover:bg-[#362844] hover:border-[#C8F04A]/60 px-2.5 sm:px-3.5 py-2 min-h-[38px] sm:min-h-[42px] rounded-[3px] border border-[#362844] transition-all font-bold touch-manipulation shadow-xs whitespace-nowrap"
          >
            <Shield className="w-3.5 h-3.5 flex-shrink-0 text-[#C8F04A]" />
            <span className="hidden xxs:inline">Admin</span>
            <span className="xxs:hidden sm:inline">Access</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
