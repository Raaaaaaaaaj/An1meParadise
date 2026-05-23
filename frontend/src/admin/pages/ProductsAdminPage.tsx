import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import AdminEditableTable, { type AdminTableColumn } from "@/admin/components/AdminEditableTable";
import AdminPageHeader from "@/admin/components/AdminPageHeader";
import AdminStatusBadge from "@/admin/components/AdminStatusBadge";
import {
  createAdminProduct,
  deleteAdminProduct,
  fetchAdminCategories,
  fetchAdminProducts,
  resolveUploadUrl,
  updateAdminProduct,
} from "@/admin/lib/catalogApi";
import type { AdminCategory, AdminProduct } from "@/admin/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

type ProductImageField = "thumbnail_image" | "image_2" | "image_3" | "image_4" | "image_5";

interface ProductFormState {
  prod_title: string;
  prod_description: string;
  prod_minPrice: string;
  prod_actualPrice: string;
  prod_maxPrice: string;
  prod_qty: string;
  prod_category_ID: string;
  prod_badgeName: string;
  is_featured: boolean;
}

const productImageFields: Array<{ key: ProductImageField; label: string }> = [
  { key: "thumbnail_image", label: "Thumbnail" },
  { key: "image_2", label: "Image 2" },
  { key: "image_3", label: "Image 3" },
  { key: "image_4", label: "Image 4" },
  { key: "image_5", label: "Image 5" },
];

const emptyProductForm: ProductFormState = {
  prod_title: "",
  prod_description: "",
  prod_minPrice: "",
  prod_actualPrice: "",
  prod_maxPrice: "",
  prod_qty: "",
  prod_category_ID: "",
  prod_badgeName: "",
  is_featured: false,
};

const emptyProductFiles = (): Record<ProductImageField, File | null> => ({
  thumbnail_image: null,
  image_2: null,
  image_3: null,
  image_4: null,
  image_5: null,
});

const valueToString = (value?: number | string | null) => (value === null || value === undefined ? "" : String(value));
const formatPrice = (value?: number | null) => (value === null || value === undefined ? "-" : `₹${Number(value)}`);

const ProductsAdminPage = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [productForm, setProductForm] = useState<ProductFormState>(emptyProductForm);
  const [productFiles, setProductFiles] = useState<Record<ProductImageField, File | null>>(emptyProductFiles);
  const [saving, setSaving] = useState(false);

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        label: category.category_name,
        value: category.id,
      })),
    [categories],
  );

  const getCategoryName = useCallback(
    (id: number, fallback?: string) =>
      fallback || categories.find((category) => Number(category.id) === Number(id))?.category_name || `#${id}`,
    [categories],
  );

  const productColumns = useMemo<Array<AdminTableColumn<AdminProduct>>>(
    () => [
      { key: "id", header: "ID", className: "w-20" },
      {
        key: "prod_title",
        header: "Product",
        render: (row) => {
          const image = row.thumbnail_image || row.image;

          return (
            <div className="flex min-w-72 items-center gap-3">
              <img
                src={resolveUploadUrl(image)}
                alt={row.prod_title}
                className="h-14 w-14 rounded-md border border-border bg-background object-cover"
              />
              <div>
                <p className="font-medium text-foreground">{row.prod_title}</p>
                <p className="text-xs text-muted-foreground">
                  {getCategoryName(row.prod_category_ID, row.category_name)}
                </p>
              </div>
            </div>
          );
        },
      },
      { key: "prod_description", header: "Description", cellClassName: "max-w-96" },
      { key: "prod_minPrice", header: "Min Price", render: (row) => formatPrice(row.prod_minPrice) },
      { key: "prod_actualPrice", header: "Actual Price", render: (row) => formatPrice(row.prod_actualPrice) },
      { key: "prod_maxPrice", header: "Max Price", render: (row) => formatPrice(row.prod_maxPrice) },
      { key: "prod_qty", header: "Qty", render: (row) => valueToString(row.prod_qty) || "-" },
      {
        key: "prod_category_ID",
        header: "Category",
        render: (row) => <span className="whitespace-nowrap">{getCategoryName(row.prod_category_ID, row.category_name)}</span>,
      },
      { key: "prod_badgeName", header: "Badge", render: (row) => row.prod_badgeName || "-" },
      {
        key: "is_featured",
        header: "Featured",
        render: (row) => <AdminStatusBadge value={row.is_featured} />,
      },
      {
        key: "prod_createdAt",
        header: "Created At",
      },
    ],
    [getCategoryName],
  );

  const loadCatalog = useCallback(async () => {
    try {
      setLoading(true);
      const [categoryRows, productRows] = await Promise.all([fetchAdminCategories(), fetchAdminProducts()]);
      setCategories(categoryRows);
      setProducts(productRows);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  const openCreateDialog = () => {
    setEditingProduct(null);
    setProductForm(emptyProductForm);
    setProductFiles(emptyProductFiles());
    setDialogOpen(true);
  };

  const openEditDialog = (product: AdminProduct) => {
    setEditingProduct(product);
    setProductForm({
      prod_title: product.prod_title || "",
      prod_description: product.prod_description || "",
      prod_minPrice: valueToString(product.prod_minPrice),
      prod_actualPrice: valueToString(product.prod_actualPrice),
      prod_maxPrice: valueToString(product.prod_maxPrice),
      prod_qty: valueToString(product.prod_qty),
      prod_category_ID: valueToString(product.prod_category_ID),
      prod_badgeName: product.prod_badgeName || "",
      is_featured: Number(product.is_featured) === 1,
    });
    setProductFiles(emptyProductFiles());
    setDialogOpen(true);
  };

  const updateFormField = (field: keyof ProductFormState, value: string | boolean) => {
    setProductForm((current) => ({ ...current, [field]: value }));
  };

  const updateImageFile = (field: ProductImageField, file?: File) => {
    setProductFiles((current) => ({ ...current, [field]: file || null }));
  };

  const buildProductFormData = () => {
    const formData = new FormData();

    formData.append("prod_title", productForm.prod_title.trim());
    formData.append("prod_description", productForm.prod_description.trim());
    formData.append("prod_minPrice", productForm.prod_minPrice);
    formData.append("prod_actualPrice", productForm.prod_actualPrice);
    formData.append("prod_maxPrice", productForm.prod_maxPrice);
    formData.append("prod_qty", productForm.prod_qty);
    formData.append("prod_category_ID", productForm.prod_category_ID);
    formData.append("prod_badgeName", productForm.prod_badgeName.trim());
    formData.append("is_featured", productForm.is_featured ? "1" : "0");

    productImageFields.forEach(({ key }) => {
      const file = productFiles[key];
      if (file) formData.append(key, file);
    });

    return formData;
  };

  const saveProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!productForm.prod_title.trim()) {
      toast.error("Product title is required");
      return;
    }

    if (!productForm.prod_category_ID) {
      toast.error("Product category is required");
      return;
    }

    if (!editingProduct && !productFiles.thumbnail_image) {
      toast.error("Thumbnail image is required");
      return;
    }

    try {
      setSaving(true);

      if (editingProduct) {
        await updateAdminProduct(editingProduct.id, buildProductFormData());
        toast.success("Product updated");
      } else {
        await createAdminProduct(buildProductFormData());
        toast.success("Product created");
      }

      setDialogOpen(false);
      await loadCatalog();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save product");
    } finally {
      setSaving(false);
    }
  };

  const removeProduct = async (product: AdminProduct) => {
    try {
      await deleteAdminProduct(product.id);
      setProducts((current) => current.filter((item) => item.id !== product.id));
      toast.success("Product deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete product");
      throw error;
    }
  };

  const currentImageFor = (field: ProductImageField) => {
    if (!editingProduct) return null;
    if (field === "thumbnail_image") return editingProduct.thumbnail_image || editingProduct.image || null;
    return editingProduct[field] || null;
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Catalog"
        title="Products"
        description="Product table with mapped product image thumbnail and editable inventory fields."
        actions={
          <Button type="button" onClick={openCreateDialog}>
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        }
      />
      <AdminEditableTable
        rows={products}
        columns={productColumns}
        emptyLabel={loading ? "Loading products..." : "No products found"}
        searchKeys={["prod_title", "prod_description", "prod_badgeName", "category_name"]}
        onEditRow={openEditDialog}
        onDelete={removeProduct}
        confirmDeleteMessage={(row) => `Delete product "${row.prod_title}"?`}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto">
          <form onSubmit={saveProduct} className="space-y-6">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Update Product" : "Add Product"}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="prod_title">Product Title</Label>
                <Input
                  id="prod_title"
                  value={productForm.prod_title}
                  onChange={(event) => updateFormField("prod_title", event.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="prod_category_ID">Category</Label>
                <select
                  id="prod_category_ID"
                  value={productForm.prod_category_ID}
                  onChange={(event) => updateFormField("prod_category_ID", event.target.value)}
                  required
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select category</option>
                  {categoryOptions.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2 lg:col-span-2">
                <Label htmlFor="prod_description">Description</Label>
                <Textarea
                  id="prod_description"
                  value={productForm.prod_description}
                  onChange={(event) => updateFormField("prod_description", event.target.value)}
                  className="min-h-24"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="prod_minPrice">Min Price</Label>
                <Input
                  id="prod_minPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={productForm.prod_minPrice}
                  onChange={(event) => updateFormField("prod_minPrice", event.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="prod_actualPrice">Actual Price</Label>
                <Input
                  id="prod_actualPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={productForm.prod_actualPrice}
                  onChange={(event) => updateFormField("prod_actualPrice", event.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="prod_maxPrice">Max Price</Label>
                <Input
                  id="prod_maxPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={productForm.prod_maxPrice}
                  onChange={(event) => updateFormField("prod_maxPrice", event.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="prod_qty">Quantity</Label>
                <Input
                  id="prod_qty"
                  type="number"
                  min="0"
                  step="1"
                  value={productForm.prod_qty}
                  onChange={(event) => updateFormField("prod_qty", event.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="prod_badgeName">Badge Name</Label>
                <Input
                  id="prod_badgeName"
                  value={productForm.prod_badgeName}
                  onChange={(event) => updateFormField("prod_badgeName", event.target.value)}
                />
              </div>

              <div className="flex items-center justify-between rounded-md border border-border bg-card px-4 py-3">
                <Label htmlFor="is_featured">Featured</Label>
                <Switch
                  id="is_featured"
                  checked={productForm.is_featured}
                  onCheckedChange={(checked) => updateFormField("is_featured", checked)}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {productImageFields.map(({ key, label }) => {
                const currentImage = currentImageFor(key);

                return (
                  <div key={key} className="grid gap-2">
                    <Label htmlFor={key}>{label}</Label>
                    <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-card px-3 py-4 text-center text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground">
                      <Upload className="h-4 w-4" />
                      <span className="line-clamp-2 break-all">{productFiles[key]?.name || "Choose image"}</span>
                      <Input
                        id={key}
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(event) => updateImageFile(key, event.target.files?.[0])}
                      />
                    </label>
                    {currentImage && (
                      <img
                        src={resolveUploadUrl(currentImage)}
                        alt={label}
                        className="h-20 w-full rounded-md border border-border object-cover"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsAdminPage;
