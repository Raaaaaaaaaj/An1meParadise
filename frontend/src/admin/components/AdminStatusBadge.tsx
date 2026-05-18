import { cn } from "@/lib/utils";

interface AdminStatusBadgeProps {
  value: string | number;
}

const AdminStatusBadge = ({ value }: AdminStatusBadgeProps) => {
  const label = String(value);
  const normalized = label.toLowerCase();
  const tone =
    normalized.includes("inactive") ||
    normalized.includes("blocked") ||
    normalized.includes("failed") ||
    normalized.includes("cancelled") ||
    normalized === "0"
      ? "border-red-400/30 bg-red-500/10 text-red-300"
      : normalized.includes("pending") || normalized.includes("processing") || normalized.includes("review")
        ? "border-amber-400/30 bg-amber-500/10 text-amber-300"
        : normalized.includes("active") ||
            normalized.includes("paid") ||
            normalized.includes("delivered") ||
            normalized === "1"
          ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300"
          : "border-border bg-secondary text-muted-foreground";

  return (
    <span
      className={cn(
        "inline-flex min-w-20 items-center justify-center rounded-md border px-2.5 py-1 text-xs font-semibold",
        tone,
      )}
    >
      {label === "1" ? "Active" : label === "0" ? "Inactive" : label}
    </span>
  );
};

export default AdminStatusBadge;
