"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Eye,
  LogOut,
  Download,
  RefreshCw,
  Sparkles,
  Database,
  Info,
  Loader2,
} from "lucide-react";
import { RegistrationData } from "@/lib/types";
import { EVENT_CONFIG } from "@/lib/config";
import StatusBadge from "./StatusBadge";
import DetailModal from "./DetailModal";

interface AdminDashboardProps {
  initialRegistrations?: RegistrationData[];
  isConfiguredWithGoogle?: boolean;
}

export default function AdminDashboard({
  initialRegistrations = [],
  isConfiguredWithGoogle = true,
}: AdminDashboardProps) {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<RegistrationData[]>(initialRegistrations);
  const [loading, setLoading] = useState(initialRegistrations.length === 0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [selectedSection, setSelectedSection] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const [selectedReg, setSelectedReg] = useState<RegistrationData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchLatestRegistrations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/registrations");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setRegistrations(data.data);
      }
    } catch (e) {
      console.error("Failed to refresh registrations:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestRegistrations();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  // Stats calculation
  const stats = useMemo(() => {
    const total = registrations.length;
    const pending = registrations.filter((r) => r.paymentStatus === "Pending").length;
    const verified = registrations.filter((r) => r.paymentStatus === "Verified").length;
    const rejected = registrations.filter((r) => r.paymentStatus === "Rejected").length;
    return { total, pending, verified, rejected };
  }, [registrations]);

  // Filtered & Searched Registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const query = (searchQuery || "").toLowerCase().trim();
      const id = String(reg.id || "").toLowerCase();
      const leadName = String(reg.teamLeadName || "").toLowerCase();
      const email = String(reg.teamLeadEmail || "").toLowerCase();
      const roll = String(reg.teamLeadRollNumber || "").toLowerCase();
      const m1Name = String(reg.member1Name || "").toLowerCase();
      const m1Roll = String(reg.member1Roll || "").toLowerCase();
      const m2Name = String(reg.member2Name || "").toLowerCase();
      const m2Roll = String(reg.member2Roll || "").toLowerCase();
      const m3Name = String(reg.member3Name || "").toLowerCase();
      const m3Roll = String(reg.member3Roll || "").toLowerCase();

      const matchSearch =
        !query ||
        id.includes(query) ||
        leadName.includes(query) ||
        email.includes(query) ||
        roll.includes(query) ||
        m1Name.includes(query) ||
        m1Roll.includes(query) ||
        m2Name.includes(query) ||
        m2Roll.includes(query) ||
        m3Name.includes(query) ||
        m3Roll.includes(query);

      // Year filter
      const matchYear = selectedYear === "ALL" || String(reg.year || "") === selectedYear;

      // Section filter
      const matchSection = selectedSection === "ALL" || String(reg.section || "") === selectedSection;

      // Status filter
      const matchStatus = selectedStatus === "ALL" || (reg.paymentStatus || "Pending") === selectedStatus;

      return matchSearch && matchYear && matchSection && matchStatus;
    });
  }, [registrations, searchQuery, selectedYear, selectedSection, selectedStatus]);

  const handleOpenDetail = (reg: RegistrationData) => {
    setSelectedReg(reg);
    setIsDetailOpen(true);
  };

  const handleStatusUpdated = (id: string, newStatus: "Pending" | "Verified" | "Rejected") => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, paymentStatus: newStatus } : r))
    );
    if (selectedReg && selectedReg.id === id) {
      setSelectedReg((prev) => (prev ? { ...prev, paymentStatus: newStatus } : null));
    }
  };

  const handleExportCSV = () => {
    if (registrations.length === 0) {
      alert("No registration records to export.");
      return;
    }

    const headers = [
      "Registration ID",
      "Timestamp",
      "Team Lead Name",
      "Team Lead Email",
      "Year",
      "Section",
      "Team Lead Roll No",
      "Team Lead Phone",
      "Member 1 Name",
      "Member 1 Roll",
      "Member 2 Name",
      "Member 2 Roll",
      "Member 3 Name",
      "Member 3 Roll",
      "Payment Screenshot URL",
      "Payment Status",
    ];

    const rows = registrations.map((r) => [
      `"${r.id}"`,
      `"${r.timestamp}"`,
      `"${r.teamLeadName}"`,
      `"${r.teamLeadEmail}"`,
      `"${r.year}"`,
      `"${r.section}"`,
      `"${r.teamLeadRollNumber}"`,
      `"${r.teamLeadPhone}"`,
      `"${r.member1Name}"`,
      `"${r.member1Roll}"`,
      `"${r.member2Name}"`,
      `"${r.member2Roll}"`,
      `"${r.member3Name}"`,
      `"${r.member3Roll}"`,
      `"${r.paymentScreenshotUrl}"`,
      `"${r.paymentStatus}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `aivm_registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#17121C] text-[#FFFDF7] pb-24">
      {/* Top Navbar */}
      <nav className="w-full border-b border-[#362844] bg-[#191220]/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            <div className="w-8 h-8 rounded-[3px] bg-[#241A2D] border border-[#362844] flex items-center justify-center flex-shrink-0 text-[#C8F04A]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="font-editorial text-sm sm:text-base font-bold text-[#FFFDF7] truncate block">
                {EVENT_CONFIG.EVENT_NAME}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-[2px] bg-[#241A2D] text-[#C8F04A] border border-[#362844] tracking-wider uppercase inline-block">
                ADMIN CONSOLE
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-3 flex-shrink-0">
            <button
              onClick={fetchLatestRegistrations}
              disabled={loading}
              className="p-2 sm:px-3 sm:py-1.5 rounded-[4px] bg-[#241A2D] text-[#FFFDF7] hover:text-[#C8F04A] border border-[#362844] transition-all flex items-center space-x-1.5 text-xs min-h-[40px] touch-manipulation cursor-pointer"
              title="Refresh Registrations"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline font-mono">Refresh</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-2.5 sm:px-3 py-1.5 rounded-[4px] bg-[#241A2D] hover:bg-[#362844] text-[#C8F04A] border border-[#362844] transition-all flex items-center space-x-1.5 text-xs font-mono font-semibold min-h-[40px] touch-manipulation cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Export CSV</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-2.5 sm:px-3 py-1.5 rounded-[4px] bg-rose-950/40 hover:bg-rose-950/70 text-rose-300 border border-rose-800/40 transition-all flex items-center space-x-1.5 text-xs font-mono min-h-[40px] touch-manipulation cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 pt-6 sm:pt-8">
        {/* Backend sync indicator banner */}
        {!isConfiguredWithGoogle ? (
          <div className="mb-6 p-4 rounded-[4px] bg-[#1F1726] border border-[#362844] flex items-start space-x-3 text-xs text-[#B9A7C9]">
            <Info className="w-4 h-4 text-[#C8F04A] mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-[#FFFDF7]">Running in Zero-Config Resilient Local Mode</p>
              <p className="text-[#96869E] mt-0.5 font-mono text-[11px]">
                Registrations and uploaded screenshots are currently persisting locally.
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-3 rounded-[4px] bg-[#1F1726] border border-emerald-500/30 flex items-center space-x-2 text-xs text-emerald-300 font-mono">
            <Database className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Connected to Private Google Sheets &amp; Google Drive backend</span>
          </div>
        )}

        {/* Dashboard Title */}
        <div className="mb-6 sm:mb-8">
          <h1 className="font-editorial text-2xl sm:text-3xl font-black text-[#FFFDF7] tracking-tight uppercase">
            REGISTRATION DASHBOARD
          </h1>
          <p className="text-xs sm:text-sm text-[#C8F04A] font-mono">VISIONOVA 2026</p>
        </div>

        {/* Dashboard Cards (Responsive Grid) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {/* Card 1: TOTAL REGISTRATIONS */}
          <div className="bg-[#1F1726] rounded-[4px] p-4 sm:p-5 border border-[#362844] relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider font-mono font-semibold text-[#96869E]">
                TOTAL SQUADS
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-[2px] bg-[#241A2D] text-[#C8F04A] flex items-center justify-center">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#FFFDF7] font-mono">{stats.total}</div>
            <span className="text-[10px] sm:text-[11px] font-mono text-[#96869E] mt-1 block">Registered</span>
          </div>

          {/* Card 2: PENDING PAYMENTS */}
          <div className="bg-[#1F1726] rounded-[4px] p-4 sm:p-5 border border-[#362844] relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider font-mono font-semibold text-amber-400">
                PENDING
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-[2px] bg-amber-950/40 text-amber-400 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">{stats.pending}</div>
            <span className="text-[10px] sm:text-[11px] font-mono text-[#96869E] mt-1 block">Awaiting review</span>
          </div>

          {/* Card 3: VERIFIED PAYMENTS */}
          <div className="bg-[#1F1726] rounded-[4px] p-4 sm:p-5 border border-[#362844] relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider font-mono font-semibold text-emerald-400">
                VERIFIED
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-[2px] bg-emerald-950/40 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">{stats.verified}</div>
            <span className="text-[10px] sm:text-[11px] font-mono text-[#96869E] mt-1 block">Confirmed</span>
          </div>

          {/* Card 4: REJECTED PAYMENTS */}
          <div className="bg-[#1F1726] rounded-[4px] p-4 sm:p-5 border border-[#362844] relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider font-mono font-semibold text-rose-400">
                REJECTED
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-[2px] bg-rose-950/40 text-rose-400 flex items-center justify-center">
                <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">{stats.rejected}</div>
            <span className="text-[10px] sm:text-[11px] font-mono text-[#96869E] mt-1 block">Invalid</span>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-[#1F1726] rounded-[4px] p-4 sm:p-5 border border-[#362844] mb-6 space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="lg:col-span-5 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#96869E]">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID, Name, Roll Number..."
                className="dark-editorial-input w-full pl-10 pr-4 py-2.5 min-h-[44px] text-base sm:text-xs text-[#FFFDF7] placeholder-[#786882]"
              />
            </div>

            {/* Year Filter */}
            <div className="lg:col-span-2">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="dark-editorial-input w-full px-3 py-2.5 min-h-[44px] text-xs font-mono text-[#FFFDF7] bg-[#191220]"
              >
                <option value="ALL">All Years</option>
                <option value="II Year">II Year</option>
                <option value="III Year">III Year</option>
              </select>
            </div>

            {/* Section Filter */}
            <div className="lg:col-span-2">
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="dark-editorial-input w-full px-3 py-2.5 min-h-[44px] text-xs font-mono text-[#FFFDF7] bg-[#191220]"
              >
                <option value="ALL">All Sections</option>
                <option value="Section 1">Section 1</option>
                <option value="Section 2">Section 2</option>
                <option value="Section 3">Section 3</option>
                <option value="Section 4">Section 4</option>
              </select>
            </div>

            {/* Payment Status Filter */}
            <div className="lg:col-span-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="dark-editorial-input w-full px-3 py-2.5 min-h-[44px] text-xs font-mono text-[#FFFDF7] bg-[#191220]"
              >
                <option value="ALL">All Payment Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Verified">Verified</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="p-12 text-center text-[#C8F04A] bg-[#1F1726] rounded-[4px] border border-[#362844]">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-mono">Loading registrations...</span>
            </div>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="p-12 text-center text-[#96869E] bg-[#1F1726] rounded-[4px] border border-[#362844] font-mono text-sm">
            No registrations match your search criteria.
          </div>
        ) : (
          <>
            {/* 1. Mobile Cards View (Visible on < 768px screens) */}
            <div className="md:hidden space-y-4">
              {filteredRegistrations.map((reg) => (
                <div
                  key={reg.id}
                  className="bg-[#1F1726] rounded-[4px] p-4 border border-[#362844] space-y-3"
                >
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#362844]">
                    <span className="font-mono font-bold text-base text-[#C8F04A]">
                      {reg.id}
                    </span>
                    <StatusBadge status={reg.paymentStatus} size="sm" />
                  </div>

                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[#96869E]">Lead:</span>
                      <span className="font-bold text-[#FFFDF7] text-right">{reg.teamLeadName}</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-[#96869E]">Roll No:</span>
                      <span className="text-[#FFFDF7]">{reg.teamLeadRollNumber}</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-[#96869E]">Year &amp; Sec:</span>
                      <span className="text-[#FFFDF7]">{reg.year} • {reg.section}</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-[#96869E]">Phone:</span>
                      <span className="text-[#FFFDF7]">{reg.teamLeadPhone}</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-[#96869E]">Email:</span>
                      <span className="text-[#B9A7C9] truncate max-w-[200px]">{reg.teamLeadEmail}</span>
                    </div>
                    <div className="flex items-baseline justify-between text-[11px]">
                      <span className="text-[#786882]">Date:</span>
                      <span className="text-[#786882]">{reg.timestamp}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenDetail(reg)}
                    className="btn-acid-lime w-full py-2.5 min-h-[44px] text-xs font-bold font-mono tracking-wider uppercase flex items-center justify-center space-x-1.5 mt-2 touch-manipulation"
                  >
                    <Eye className="w-4 h-4 text-[#17121C]" />
                    <span>VIEW DETAILS &amp; PROOF</span>
                  </button>
                </div>
              ))}
            </div>

            {/* 2. Desktop Table View (Visible on >= 768px screens) */}
            <div className="hidden md:block bg-[#1F1726] rounded-[4px] border border-[#362844] overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#191220] border-b border-[#362844] text-[#96869E] uppercase tracking-wider text-[11px] font-mono">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">Registration ID</th>
                      <th className="py-3.5 px-4 font-semibold">Team Lead</th>
                      <th className="py-3.5 px-4 font-semibold">Year</th>
                      <th className="py-3.5 px-4 font-semibold">Section</th>
                      <th className="py-3.5 px-4 font-semibold">Phone</th>
                      <th className="py-3.5 px-4 font-semibold">Email</th>
                      <th className="py-3.5 px-4 font-semibold">Payment Status</th>
                      <th className="py-3.5 px-4 font-semibold">Date</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#362844] text-[#FFFDF7]">
                    {filteredRegistrations.map((reg) => (
                      <tr
                        key={reg.id}
                        className="hover:bg-[#241A2D]/50 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-[#C8F04A] whitespace-nowrap">
                          {reg.id}
                        </td>
                        <td className="py-3.5 px-4 font-medium whitespace-nowrap">
                          {reg.teamLeadName}
                          <span className="block text-[11px] text-[#96869E] font-mono">{reg.teamLeadRollNumber}</span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-mono">{reg.year}</td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-mono">{reg.section}</td>
                        <td className="py-3.5 px-4 font-mono whitespace-nowrap">{reg.teamLeadPhone}</td>
                        <td className="py-3.5 px-4 font-mono text-[#B9A7C9] truncate max-w-[160px]">
                          {reg.teamLeadEmail}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <StatusBadge status={reg.paymentStatus} size="sm" />
                        </td>
                        <td className="py-3.5 px-4 text-[#96869E] text-xs font-mono whitespace-nowrap">
                          {reg.timestamp}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleOpenDetail(reg)}
                            className="px-3 py-1.5 rounded-[2px] bg-[#241A2D] hover:bg-[#362844] text-[#C8F04A] border border-[#362844] text-xs font-mono font-semibold cursor-pointer transition-all inline-flex items-center space-x-1 touch-manipulation min-h-[36px]"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>VIEW</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Admin Details Modal */}
      <DetailModal
        registration={selectedReg}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onStatusUpdated={handleStatusUpdated}
      />
    </div>
  );
}
