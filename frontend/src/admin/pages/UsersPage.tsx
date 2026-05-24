import AdminEditableTable, { type AdminTableColumn } from "@/admin/components/AdminEditableTable";
import AdminPageHeader from "@/admin/components/AdminPageHeader";
import AdminStatusBadge from "@/admin/components/AdminStatusBadge";
// import { adminUsers } from "@/admin/data/adminMockData";
import type { AdminUser } from "@/admin/types";

import { useEffect, useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

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

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/getUserData`);

        console.log("Users Data:", res.data);

        setUsers(res.data.userData || []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);


  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Customers"
        title="Users"
        description="Active database users with inline update and delete controls."
      />
      <AdminEditableTable
        rows={users}
        columns={userColumns}
        emptyLabel="No users found"
        searchKeys={["userName", "userMail", "userMobile", "userCity", "userCode"]}
        hideEdit={true}
      />
    </div>
  );
};

export default UsersPage;
