import { ShieldCheck } from "lucide-react";
import AdminPageHeader from "@/admin/components/AdminPageHeader";
import { Input } from "@/components/ui/input";
import { adminOwner } from "@/admin/data/adminMockData";

const AdminProfilePage = () => {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Owner Account"
        title="Admin Profile"
        description="Read-only owner profile details for the CRM workspace."
      />

      <section className="rounded-lg border border-border bg-card p-5">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-background text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="font-heading text-sm font-semibold text-foreground">{adminOwner.owner_name}</p>
            <p className="text-xs text-muted-foreground">{adminOwner.role}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm text-muted-foreground">Owner Name</span>
            <Input value={adminOwner.owner_name} readOnly className="border-border bg-background text-foreground" />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-muted-foreground">Owner Mail</span>
            <Input value={adminOwner.owner_mail} readOnly className="border-border bg-background text-foreground" />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-muted-foreground">Owner Number</span>
            <Input value={adminOwner.owner_mobile} readOnly className="border-border bg-background text-foreground" />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-muted-foreground">Created At</span>
            <Input value={adminOwner.joined_at} readOnly className="border-border bg-background text-foreground" />
          </label>
        </div>
      </section>
    </div>
  );
};

export default AdminProfilePage;
