import { useEffect, useState } from "react";
import AdminEditableTable, { type AdminTableColumn } from "@/admin/components/AdminEditableTable";
import AdminPageHeader from "@/admin/components/AdminPageHeader";
import AdminStatusBadge from "@/admin/components/AdminStatusBadge";
import type { AdminOrder } from "@/admin/types";

const API_URL = import.meta.env.VITE_API_URL || "";

const money = (value: number) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

const orderStatusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
];

const orderColumns: Array<AdminTableColumn<AdminOrder>> = [
  { key: "id", header: "Order ID", className: "w-24" },
  { key: "user_id", header: "User ID" },
  { key: "userName", header: "Customer", render: (row) => row.userName || "-" },
  {
    key: "order_status",
    header: "Order Status",
    editable: true,
    inputType: "select",
    options: orderStatusOptions,
    render: (row) => <AdminStatusBadge value={row.order_status} />,
  },
  { key: "total_amount", header: "Subtotal", render: (row) => money(row.total_amount) },
  { key: "shipping_charge", header: "Shipping", render: (row) => money(row.shipping_charge) },
  { key: "final_amount", header: "Final", render: (row) => money(row.final_amount) },
  {
    key: "billing_address",
    header: "Billing Address",
    editable: true,
    inputType: "textarea",
    cellClassName: "max-w-80",
  },
  {
    key: "items",
    header: "Items",
    cellClassName: "min-w-72",
    render: (row) => (
      <div className="space-y-1 text-xs">
        {(row.items || []).map((item) => (
          <div key={item.id} className="text-muted-foreground">
            <span className="font-medium text-foreground">{item.product_name}</span> x {item.quantity}
          </div>
        ))}
      </div>
    ),
  },
  { key: "razorpay_order_id", header: "Razorpay Order" },
  { key: "razorpay_payment_id", header: "Razorpay Payment" },
  {
    key: "created_at",
    header: "Created At",
    render: (row) =>
      row.created_at ? new Date(row.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-",
  },
];

const OrdersAdminPage = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin/orders`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Failed to load orders");
        setOrders(data.orders || []);
      } catch (err: any) {
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const saveOrder = async (row: AdminOrder) => {
    const response = await fetch(`${API_URL}/api/admin/orders/${row.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_status: row.order_status,
        billing_address: row.billing_address,
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Failed to update order");
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Sales"
        title="Orders"
        description="Live order, item, amount, address, and Razorpay details from the database."
      />

      {loading && <div className="rounded-lg border border-border bg-card p-5 text-sm text-muted-foreground">Loading orders...</div>}
      {!loading && error && <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-300">{error}</div>}
      {!loading && !error && (
        <AdminEditableTable
          rows={orders}
          columns={orderColumns}
          emptyLabel="No orders found"
          searchKeys={["id", "user_id", "userName", "order_status", "razorpay_order_id", "razorpay_payment_id"]}
          onSave={saveOrder}
          hideDelete
        />
      )}
    </div>
  );
};

export default OrdersAdminPage;
