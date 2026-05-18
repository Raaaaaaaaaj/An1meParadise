import AdminEditableTable, { type AdminTableColumn } from "@/admin/components/AdminEditableTable";
import AdminPageHeader from "@/admin/components/AdminPageHeader";
import AdminStatusBadge from "@/admin/components/AdminStatusBadge";
import { adminCoupons } from "@/admin/data/adminMockData";
import type { AdminCoupon } from "@/admin/types";

const couponColumns: Array<AdminTableColumn<AdminCoupon>> = [
  { key: "id", header: "ID", className: "w-20" },
  { key: "coupon_code", header: "Coupon Code", editable: true },
  {
    key: "discount_type",
    header: "Type",
    editable: true,
    inputType: "select",
    options: [
      { label: "Flat", value: "Flat" },
      { label: "Percentage", value: "Percentage" },
    ],
  },
  { key: "discount_value", header: "Value", editable: true, inputType: "number" },
  {
    key: "status",
    header: "Status",
    editable: true,
    inputType: "select",
    options: [
      { label: "Active", value: "Active" },
      { label: "Inactive", value: "Inactive" },
      { label: "Blocked", value: "Blocked" },
    ],
    render: (row) => <AdminStatusBadge value={row.status} />,
  },
  { key: "created_at", header: "Created At" },
];

const CouponsAdminPage = () => {
  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow="Sales" title="Coupons" description="Optional coupon table surface." />
      <AdminEditableTable
        rows={adminCoupons}
        columns={couponColumns}
        emptyLabel="No coupons found"
        searchKeys={["coupon_code", "discount_type", "status"]}
      />
    </div>
  );
};

export default CouponsAdminPage;
