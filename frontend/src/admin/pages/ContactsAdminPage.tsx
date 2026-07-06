import AdminEditableTable, { type AdminTableColumn } from "@/admin/components/AdminEditableTable";
import AdminPageHeader from "@/admin/components/AdminPageHeader";
import AdminStatusBadge from "@/admin/components/AdminStatusBadge";
// import { adminContacts } from "@/admin/data/adminMockData";
import type { AdminContact } from "@/admin/types";

import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const contactColumns: Array<AdminTableColumn<AdminContact>> = [
  { key: "id", header: "ID", className: "w-20" },

  { key: "name", header: "Name", editable: true },

  {
    key: "email",header: "Mail", editable: true,inputType: "email",
  },

  {
    key: "number", header: "Mobile",editable: true,
  },

  {
    key: "message",header: "Message", editable: true,inputType: "textarea",cellClassName: "max-w-96",
  },

  { key: "created_at", header: "Created At" },
];

const ContactsAdminPage = () => {
  const [contacts, setContacts] = useState<AdminContact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/contact`);

        console.log("Contacts Data:", res.data);

        setContacts(res.data.contactData || res.data.contacts || res.data || []);
      } catch (err) {
        console.error("Failed to fetch contacts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Support"
        title="Contacts"
        description="Contact form submissions with inline status and response tracking fields."
      />

      <AdminEditableTable
        rows={contacts}
        columns={contactColumns}
        emptyLabel={loading ? "Loading contacts..." : "No contacts found"}
        searchKeys={[
          "name",
          "email",
          "number",
          "message",
        ]}
        hideEdit={true}
      />
    </div>
  );
};

export default ContactsAdminPage;
