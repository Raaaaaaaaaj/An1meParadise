import AdminEditableTable, { type AdminTableColumn } from "@/admin/components/AdminEditableTable";
import AdminPageHeader from "@/admin/components/AdminPageHeader";
import AdminStatusBadge from "@/admin/components/AdminStatusBadge";
import { adminTags } from "@/admin/data/adminMockData";
import type { AdminTag } from "@/admin/types";

const tagColumns: Array<AdminTableColumn<AdminTag>> = [
  { key: "id", header: "ID", className: "w-20" },
  { key: "tag_name", header: "Tag Name", editable: true },
  { key: "slug", header: "Slug", editable: true },
  { key: "product_count", header: "Products", editable: true, inputType: "number" },
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

const TagsAdminPage = () => {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Catalog"
        title="Tags"
        description="Product tag UI prepared for the future tags table."
      />
      <AdminEditableTable
        rows={adminTags}
        columns={tagColumns}
        emptyLabel="No tags found"
        searchKeys={["tag_name", "slug", "status"]}
      />
    </div>
  );
};

export default TagsAdminPage;
