import { MessageSquare, Package, ShoppingBag, Users } from "lucide-react";
import AdminPageHeader from "@/admin/components/AdminPageHeader";
import AdminStatCard from "@/admin/components/AdminStatCard";
import AdminStatusBadge from "@/admin/components/AdminStatusBadge";
import {
  adminCategories,
  adminContacts,
  adminOrders,
  adminOwner,
  adminProducts,
  adminUsers,
} from "@/admin/data/adminMockData";

const DashboardPage = () => {
  const activeUsers = adminUsers.filter((user) => user.status === "Active").length;
  const paidOrders = adminOrders.filter((order) => order.payment_status === "Paid").length;
  const totalRevenue = adminOrders.reduce((sum, order) => sum + order.final_amount, 0);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="CRM Overview"
        title="Dashboard"
        description="Owner summary, catalog health, user count, and latest order activity."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard title="Active Users" value={activeUsers} detail={`${adminUsers.length} total users`} icon={Users} />
        <AdminStatCard title="Products" value={adminProducts.length} detail={`${adminCategories.length} categories`} icon={Package} />
        <AdminStatCard title="Paid Orders" value={paidOrders} detail={`Revenue Rs. ${totalRevenue.toLocaleString("en-IN")}`} icon={ShoppingBag} />
        <AdminStatCard title="Contacts" value={adminContacts.length} detail="Open customer messages" icon={MessageSquare} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Owner
          </p>
          <div className="mt-5 space-y-4">
            {[
              ["Name", adminOwner.owner_name],
              ["Mail", adminOwner.owner_mail],
              ["Number", adminOwner.owner_mobile],
              ["Role", adminOwner.role],
            ].map(([label, value]) => (
              <div key={label} className="grid gap-1 border-b border-border/70 pb-3 last:border-0 last:pb-0 sm:grid-cols-[8rem_1fr]">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="text-sm font-medium text-foreground">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Recent Orders
          </p>
          <div className="mt-4 divide-y divide-border/70">
            {adminOrders.slice(0, 4).map((order) => (
              <div key={order.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-heading text-sm font-semibold text-foreground">Order #{order.id}</p>
                  <p className="text-xs text-muted-foreground">
                    User #{order.user_id} . {order.created_at}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">Rs. {order.final_amount.toLocaleString("en-IN")}</span>
                  <AdminStatusBadge value={order.order_status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
