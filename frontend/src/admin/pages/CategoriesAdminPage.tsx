import AdminEditableTable, { type AdminTableColumn } from "@/admin/components/AdminEditableTable";
import AdminPageHeader from "@/admin/components/AdminPageHeader";
import { adminCategories } from "@/admin/data/adminMockData";
import type { AdminCategory } from "@/admin/types";

const categoryColumns: Array<AdminTableColumn<AdminCategory>> = [
  { key: "id", header: "ID", className: "w-20" },
  { key: "category_name", header: "Category Name", editable: true },
  {
    key: "category_image",
    header: "Image",
    render: (row) => (
      <div className="flex items-center gap-3">
        <img
          src={row.category_image}
          alt={row.category_name}
          className="h-12 w-12 rounded-md border border-border bg-background object-contain"
        />
        <span className="max-w-44 truncate text-xs text-muted-foreground">{row.category_image}</span>
      </div>
    ),
  },
  { key: "created_at", header: "Created At" },
];

const CategoriesAdminPage = () => {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Catalog"
        title="Categories"
        description="Category ID, name, created date, and database image preview."
      />
      <AdminEditableTable
        rows={adminCategories}
        columns={categoryColumns}
        emptyLabel="No categories found"
        searchKeys={["category_name", "created_at"]}
      />
    </div>
  );
};

export default CategoriesAdminPage;
