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

import { useEffect, useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;


const DashboardPage = () => {
  // const activeUsers = adminUsers.filter((user) => user.status === "Active").length;
  // const paidOrders = adminOrders.filter((order) => order.payment_status === "Paid").length;
  // const totalRevenue = adminOrders.reduce((sum, order) => sum + order.final_amount, 0);

   console.log("API_URL:", API_URL);

  const [usersCount, setUsersCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [contactCount, setContactCount] = useState(0);

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingContacts, setLoadingContacts] = useState(true);


  // users
useEffect(() => {
  const fetchUsersCount = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/count`);

      console.log("Users API Response:", res.data);

      setUsersCount(res.data.totalUsers || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  fetchUsersCount();
}, []);

  // categories
  useEffect(() => {
    const fetchCategoryCount = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/categories/categoryCountForCRM`
        );

        console.log("Category API:", res.data);

        // const count = res.data.count || res.data.total || 0;
        setCategoryCount(res.data.totalCategories || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategoryCount();
  }, []);

  // contacts
  useEffect(() => {
    const fetchContactCount = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/contact`);

        console.log("Contact API:", res.data);

        const data = res.data.data || res.data.messages || res.data || [];
        setContactCount(data.length);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingContacts(false);
      }
    };

    fetchContactCount();
  }, []);



  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="CRM Overview"
        title="Dashboard"
        description="Owner summary, catalog health, user count, and latest order activity."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          title="Active Users"
          value={loadingUsers ? "..." : usersCount}
          detail="Registered users"
          icon={Users}
        />

        <AdminStatCard
          title="Active Product Categories"
          value={loadingCategories ? "..." : categoryCount}
          detail="Product categories"
          icon={Package}
        />

        <AdminStatCard
          title="Contacts"
          value={loadingContacts ? "..." : contactCount}
          detail="Open customer messages"
          icon={MessageSquare}
        />
        {/* <AdminStatCard title="Paid Orders" value={paidOrders} detail={`Revenue Rs. ${totalRevenue.toLocaleString("en-IN")}`} icon={ShoppingBag} /> */}
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
