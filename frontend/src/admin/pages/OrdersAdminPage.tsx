import AdminEditableTable, { type AdminTableColumn } from "@/admin/components/AdminEditableTable";
import AdminPageHeader from "@/admin/components/AdminPageHeader";
import AdminStatusBadge from "@/admin/components/AdminStatusBadge";
import { adminOrders } from "@/admin/data/adminMockData";
import type { AdminOrder } from "@/admin/types";

const money = (value: number) => `Rs. ${value.toLocaleString("en-IN")}`;

const orderStatusOptions = [
  { label: "Pending", value: "Pending" },
  { label: "Processing", value: "Processing" },
  { label: "Shipped", value: "Shipped" },
  { label: "Delivered", value: "Delivered" },
  { label: "Cancelled", value: "Cancelled" },
];

const paymentStatusOptions = [
  { label: "Pending", value: "Pending" },
  { label: "Paid", value: "Paid" },
  { label: "Failed", value: "Failed" },
  { label: "Refunded", value: "Refunded" },
];

const orderColumns: Array<AdminTableColumn<AdminOrder>> = [
  { key: "id", header: "Order ID", className: "w-24" },
  { key: "user_id", header: "User ID", editable: true, inputType: "number" },
  {
    key: "order_status",
    header: "Order Status",
    editable: true,
    inputType: "select",
    options: orderStatusOptions,
    render: (row) => <AdminStatusBadge value={row.order_status} />,
  },
  {
    key: "payment_status",
    header: "Payment",
    editable: true,
    inputType: "select",
    options: paymentStatusOptions,
    render: (row) => <AdminStatusBadge value={row.payment_status} />,
  },
  { key: "total_amount", header: "Total", editable: true, inputType: "number", render: (row) => money(row.total_amount) },
  {
    key: "shipping_charge",
    header: "Shipping",
    editable: true,
    inputType: "number",
    render: (row) => money(row.shipping_charge),
  },
  {
    key: "discount_amount",
    header: "Discount",
    editable: true,
    inputType: "number",
    render: (row) => money(row.discount_amount),
  },
  { key: "final_amount", header: "Final", editable: true, inputType: "number", render: (row) => money(row.final_amount) },
  {
    key: "payment_method",
    header: "Method",
    editable: true,
    inputType: "select",
    options: [
      { label: "COD", value: "COD" },
      { label: "Razorpay", value: "Razorpay" },
      { label: "UPI", value: "UPI" },
      { label: "Card", value: "Card" },
    ],
  },
  {
    key: "shipping_address",
    header: "Shipping Address",
    editable: true,
    inputType: "textarea",
    cellClassName: "max-w-80",
  },
  {
    key: "billing_address",
    header: "Billing Address",
    editable: true,
    inputType: "textarea",
    cellClassName: "max-w-80",
  },
  { key: "razorpay_order_id", header: "Razorpay Order", editable: true },
  { key: "razorpay_payment_id", header: "Razorpay Payment", editable: true },
  { key: "created_at", header: "Created At" },
  { key: "updated_at", header: "Updated At" },
];

const OrdersAdminPage = () => {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Sales"
        title="Orders"
        description="Order, payment, amount, address, and Razorpay ID fields in one editable table."
      />
      <AdminEditableTable
        rows={adminOrders}
        columns={orderColumns}
        emptyLabel="No orders found"
        searchKeys={["id", "user_id", "order_status", "payment_status", "payment_method", "razorpay_order_id"]}
      />
    </div>
  );
};

export default OrdersAdminPage;
