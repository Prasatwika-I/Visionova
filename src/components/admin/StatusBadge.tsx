interface StatusBadgeProps {
  status: "Pending" | "Verified" | "Rejected";
  size?: "sm" | "md";
}

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const isSm = size === "sm";

  if (status === "Verified") {
    return (
      <span
        className={`inline-flex items-center font-medium rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 ${
          isSm ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5" />
        Verified
      </span>
    );
  }

  if (status === "Rejected") {
    return (
      <span
        className={`inline-flex items-center font-medium rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-400 ${
          isSm ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-pink-400 mr-1.5" />
        Rejected
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 ${
        isSm ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5 animate-pulse" />
      Pending
    </span>
  );
}
