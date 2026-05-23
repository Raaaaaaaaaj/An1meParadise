import AdminEditableTable, { type AdminTableColumn } from "@/admin/components/AdminEditableTable";
import AdminPageHeader from "@/admin/components/AdminPageHeader";
import AdminStatusBadge from "@/admin/components/AdminStatusBadge";
import { adminUsers } from "@/admin/data/adminMockData";
import type { AdminUser } from "@/admin/types";

const userColumns: Array<AdminTableColumn<AdminUser>> = [
  { key: "id", header: "ID", className: "w-20" },
  { key: "userName", header: "Name", editable: true },
  { key: "userMail", header: "Mail", editable: true, inputType: "email" },
  { key: "userMobile", header: "Mobile", editable: true },
  { key: "userCity", header: "City", editable: true },
  { key: "userCode", header: "User Code", editable: true },
  // {
  //   key: "status",
  //   header: "Status",
  //   editable: true,
  //   inputType: "select",
  //   options: [
  //     { label: "Active", value: "Active" },
  //     { label: "Inactive", value: "Inactive" },
  //     { label: "Blocked", value: "Blocked" },
  //   ],
  //   render: (row) => <AdminStatusBadge value={row.status} />,
  // },
  { key: "created_at", header: "Created At" },
];

const UsersPage = () => {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Customers"
        title="Users"
        description="Active database users with inline update and delete controls."
      />
      <AdminEditableTable
        rows={adminUsers}
        columns={userColumns}
        emptyLabel="No users found"
        searchKeys={["userName", "userMail", "userMobile", "userCity", "userCode"]}
        hideEdit={true}
      />
    </div>
  );
};

export default UsersPage;
