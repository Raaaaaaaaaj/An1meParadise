import { useState } from "react";
import { Link, Navigate, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import {
  Contact,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShieldCheck,
  ShoppingBag,
  Tags,
  TicketPercent,
  Users,
  X,
  Layers3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearAdminSession, getAdminSession } from "@/admin/routes/adminAuth";
import DashboardPage from "@/admin/pages/DashboardPage";
import AdminProfilePage from "@/admin/pages/AdminProfilePage";
import UsersPage from "@/admin/pages/UsersPage";
import CategoriesAdminPage from "@/admin/pages/CategoriesAdminPage";
import ProductsAdminPage from "@/admin/pages/ProductsAdminPage";
import TagsAdminPage from "@/admin/pages/TagsAdminPage";
import CouponsAdminPage from "@/admin/pages/CouponsAdminPage";
import OrdersAdminPage from "@/admin/pages/OrdersAdminPage";
import ContactsAdminPage from "@/admin/pages/ContactsAdminPage";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/profile", label: "Admin Profile", icon: ShieldCheck },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/categories", label: "Categories", icon: Layers3 },
  { to: "/admin/products", label: "Products", icon: Package },
  // { to: "/admin/tags", label: "Tags", icon: Tags },
  // { to: "/admin/coupons", label: "Coupons", icon: TicketPercent },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/contacts", label: "Contacts", icon: Contact },
];

const AdminShell = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const session = getAdminSession();

  const logout = () => {
    clearAdminSession();
    navigate("/admin/login", { replace: true });
  };

  const Sidebar = () => (
    <aside className="flex h-full flex-col border-r border-border bg-background">
      <div className="flex h-20 items-center justify-between border-b border-border px-5">
        <Link to="/admin/dashboard" className="flex items-center gap-3">
          <img src="/logo2.png" alt="AN1ME PARADISE" className="h-12 w-auto object-contain" />
          <div>
            <p className="font-display text-sm font-bold tracking-wider text-foreground">AN1ME</p>
            <p className="font-heading text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Admin</p>
          </div>
        </Link>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="lg:hidden"
          onClick={() => setSidebarOpen(false)}
          title="Close menu"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-3 font-heading text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <div className="mb-3 rounded-lg border border-border bg-card p-3">
          <p className="truncate text-sm font-semibold text-foreground">{session?.owner.name}</p>
          <p className="truncate text-xs text-muted-foreground">{session?.owner.mail}</p>
        </div>
        <Button type="button" variant="outline" className="w-full justify-start" onClick={logout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );

  return (
    <div className="admin-crm min-h-screen bg-background text-foreground">
      <div className="fixed inset-y-0 left-0 z-40 hidden w-72 lg:block">
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="h-full w-[min(20rem,86vw)]" onClick={(event) => event.stopPropagation()}>
            <Sidebar />
          </div>
        </div>
      )}

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-xl lg:ml-72 lg:px-8">
        <Button type="button" variant="outline" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="ml-auto flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">{session?.owner.role}</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card font-display text-sm font-bold">
            AP
          </div>
        </div>
      </header>

      <main className="lg:ml-72">
        <div className="mx-auto max-w-[1600px] px-4 py-6 lg:px-8">
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="categories" element={<CategoriesAdminPage />} />
            <Route path="products" element={<ProductsAdminPage />} />
            <Route path="tags" element={<TagsAdminPage />} />
            <Route path="coupons" element={<CouponsAdminPage />} />
            <Route path="orders" element={<OrdersAdminPage />} />
            <Route path="contacts" element={<ContactsAdminPage />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminShell;
