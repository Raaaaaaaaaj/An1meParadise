import AdminEditableTable, { type AdminTableColumn } from "@/admin/components/AdminEditableTable";
import AdminPageHeader from "@/admin/components/AdminPageHeader";
import AdminStatusBadge from "@/admin/components/AdminStatusBadge";
import { adminCategories, adminProductImages, adminProducts } from "@/admin/data/adminMockData";
import type { AdminProduct } from "@/admin/types";

const categoryOptions = adminCategories.map((category) => ({
  label: category.category_name,
  value: category.id,
}));

const getCategoryName = (id: number) => adminCategories.find((category) => category.id === id)?.category_name || `#${id}`;
const getProductImage = (productId: number) => adminProductImages.find((image) => image.product_id === productId);

const productColumns: Array<AdminTableColumn<AdminProduct>> = [
  { key: "id", header: "ID", className: "w-20" },
  {
    key: "prod_title",
    header: "Product",
    editable: true,
    render: (row) => {
      const image = getProductImage(row.id);

      return (
        <div className="flex min-w-72 items-center gap-3">
          <img
            src={image?.thumbnail_image || "/placeholder.svg"}
            alt={row.prod_title}
            className="h-14 w-14 rounded-md border border-border bg-background object-contain"
          />
          <div>
            <p className="font-medium text-foreground">{row.prod_title}</p>
            <p className="text-xs text-muted-foreground">{getCategoryName(row.prod_categoryId)}</p>
          </div>
        </div>
      );
    },
  },
  { key: "prod_description", header: "Description", editable: true, inputType: "textarea", cellClassName: "max-w-96" },
  { key: "prod_mainPrice", header: "Main Price", editable: true, inputType: "number" },
  { key: "prod_actualPrice", header: "Actual Price", editable: true, inputType: "number" },
  { key: "prod_quantity", header: "Qty", editable: true, inputType: "number" },
  {
    key: "prod_categoryId",
    header: "Category",
    editable: true,
    inputType: "select",
    options: categoryOptions,
    render: (row) => <span className="whitespace-nowrap">{getCategoryName(row.prod_categoryId)}</span>,
  },
  { key: "prod_badgeName", header: "Badge", editable: true },
  {
    key: "is_featured",
    header: "Featured",
    editable: true,
    inputType: "select",
    options: [
      { label: "Active", value: 1 },
      { label: "Inactive", value: 0 },
    ],
    render: (row) => <AdminStatusBadge value={row.is_featured} />,
  },
  {
    key: "prod_createdAt",
    header: "Created At",
  },
];

const ProductsAdminPage = () => {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Catalog"
        title="Products"
        description="Product table with mapped product image thumbnail and inline editable inventory fields."
      />
      <AdminEditableTable
        rows={adminProducts}
        columns={productColumns}
        emptyLabel="No products found"
        searchKeys={["prod_title", "prod_description", "prod_badgeName"]}
      />
    </div>
  );
};

export default ProductsAdminPage;
