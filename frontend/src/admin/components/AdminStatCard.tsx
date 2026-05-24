import type { LucideIcon } from "lucide-react";

interface AdminStatCardProps {
  title: string;
  value: string | number;
  detail?: string;
  icon: LucideIcon;
}

const AdminStatCard = ({ title, value, detail, icon: Icon }: AdminStatCardProps) => {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-heading text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {title}
          </p>
          <p className="mt-3 font-display text-2xl font-bold text-foreground">{value}</p>
          {/* <p className="mt-1 text-xs text-muted-foreground">{detail}</p> */}
        </div>
        <div className="rounded-lg border border-border bg-background p-2 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default AdminStatCard;
