"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, Mail, Shield, ArrowLeft, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { EVENT_CONFIG } from "@/lib/config";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please provide both email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        window.location.href = "/admin";
      } else {
        setError(data.error || "Invalid email or password");
      }
    } catch {
      setError("An unexpected error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#17121C]">
      {/* Subtle film grid texture */}
      <div className="absolute inset-0 film-grid-dark opacity-50 pointer-events-none" />

      {/* Atmospheric light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C8F04A]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-[calc(100%-32px)] sm:w-full max-w-md mx-auto relative z-10 py-6">
        {/* Back to event registration */}
        <div className="mb-5 sm:mb-6">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-xs font-mono font-semibold text-[#B9A7C9] hover:text-[#C8F04A] transition-colors py-2 touch-manipulation"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Event Registration</span>
          </Link>
        </div>

        {/* Card: Dark Elevated Surface */}
        <div className="bg-[#1F1726] rounded-[4px] p-6 sm:p-8 border border-[#362844] shadow-2xl">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-[3px] bg-[#241A2D] text-[#C8F04A] border border-[#362844] mb-3 sm:mb-4 shadow-xs">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight uppercase text-[#FFFDF7]">
              ADMIN ACCESS
            </h1>
            <p className="text-xs font-mono text-[#96869E] mt-1">
              {EVENT_CONFIG.EVENT_NAME} Portal
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-[3px] bg-rose-950/40 border border-rose-500/50 flex items-center space-x-2.5 text-rose-300 text-xs font-mono">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
            {/* Email Field */}
            <div>
              <label className="block text-xs font-mono font-bold text-[#FFFDF7] uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#96869E]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@yourdomain.com"
                  className="dark-editorial-input w-full pl-10 pr-4 py-3 min-h-[48px] text-base sm:text-sm text-[#FFFDF7] placeholder-[#786882]"
                />
              </div>
            </div>

            {/* Password Field with Show/Hide toggle */}
            <div>
              <label className="block text-xs font-mono font-bold text-[#FFFDF7] uppercase tracking-wider mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#96869E]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="dark-editorial-input w-full pl-10 pr-12 py-3 min-h-[48px] text-base sm:text-sm text-[#FFFDF7] placeholder-[#786882]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#96869E] hover:text-[#C8F04A] transition-colors cursor-pointer min-w-[44px] min-h-[44px] justify-center touch-manipulation"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Login CTA */}
            <button
              type="submit"
              disabled={loading}
              className="btn-acid-lime w-full py-3.5 min-h-[50px] text-sm font-extrabold tracking-wider uppercase flex items-center justify-center space-x-2 cursor-pointer shadow-md mt-4 touch-manipulation"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#17121C]" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 text-[#17121C]" />
                  <span>LOGIN</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#362844] text-center">
            <span className="text-[11px] font-mono text-[#96869E]">
              Authorized administrative access only
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
