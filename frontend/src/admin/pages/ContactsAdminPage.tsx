import AdminEditableTable, { type AdminTableColumn } from "@/admin/components/AdminEditableTable";
import AdminPageHeader from "@/admin/components/AdminPageHeader";
import AdminStatusBadge from "@/admin/components/AdminStatusBadge";
import { adminContacts } from "@/admin/data/adminMockData";
import type { AdminContact } from "@/admin/types";

const contactColumns: Array<AdminTableColumn<AdminContact>> = [
  { key: "id", header: "ID", className: "w-20" },
  { key: "contact_name", header: "Name", editable: true },
  { key: "contact_mail", header: "Mail", editable: true, inputType: "email" },
  { key: "contact_mobile", header: "Mobile", editable: true },
  { key: "subject", header: "Subject", editable: true },
  { key: "message", header: "Message", editable: true, inputType: "textarea", cellClassName: "max-w-96" },
  {
    key: "status",
    header: "Status",
    editable: true,
    inputType: "select",
    options: [
      { label: "New", value: "New" },
      { label: "In Review", value: "In Review" },
      { label: "Closed", value: "Closed" },
    ],
    render: (row) => <AdminStatusBadge value={row.status} />,
  },
  { key: "created_at", header: "Created At" },
];

const ContactsAdminPage = () => {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Support"
        title="Contacts"
        description="Contact form submissions with inline status and response tracking fields."
      />
      <AdminEditableTable
        rows={adminContacts}
        columns={contactColumns}
        emptyLabel="No contacts found"
        searchKeys={["contact_name", "contact_mail", "contact_mobile", "subject", "status"]}
      />
    </div>
  );
};

export default ContactsAdminPage;
