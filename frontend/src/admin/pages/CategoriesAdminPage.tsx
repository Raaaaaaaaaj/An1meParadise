import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import AdminEditableTable, { type AdminTableColumn } from "@/admin/components/AdminEditableTable";
import AdminPageHeader from "@/admin/components/AdminPageHeader";
import {
  createAdminCategory,
  deleteAdminCategory,
  fetchAdminCategories,
  resolveUploadUrl,
  updateAdminCategory,
} from "@/admin/lib/catalogApi";
import type { AdminCategory } from "@/admin/types";
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

const categoryColumns: Array<AdminTableColumn<AdminCategory>> = [
  { key: "id", header: "ID", className: "w-20" },
  { key: "category_name", header: "Category Name" },
  {
    key: "category_image",
    header: "Image",
    render: (row) => (
      <div className="flex min-w-52 items-center gap-3">
        <img
          src={resolveUploadUrl(row.category_image)}
          alt={row.category_name}
          className="h-12 w-12 rounded-md border border-border bg-background object-cover"
        />
        <span className="max-w-44 truncate text-xs text-muted-foreground">{row.category_image || "-"}</span>
      </div>
    ),
  },
  { key: "created_at", header: "Created At" },
];

const CategoriesAdminPage = () => {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setCategories(await fetchAdminCategories());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const openCreateDialog = () => {
    setEditingCategory(null);
    setCategoryName("");
    setCategoryImage(null);
    setDialogOpen(true);
  };

  const openEditDialog = (category: AdminCategory) => {
    setEditingCategory(category);
    setCategoryName(category.category_name);
    setCategoryImage(null);
    setDialogOpen(true);
  };

  const saveCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    const formData = new FormData();
    formData.append("category_name", categoryName.trim());

    if (categoryImage) {
      formData.append("category_image", categoryImage);
    }

    try {
      setSaving(true);

      if (editingCategory) {
        await updateAdminCategory(editingCategory.id, formData);
        toast.success("Category updated");
      } else {
        await createAdminCategory(formData);
        toast.success("Category created");
      }

      setDialogOpen(false);
      await loadCategories();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save category");
    } finally {
      setSaving(false);
    }
  };

  const removeCategory = async (category: AdminCategory) => {
    try {
      await deleteAdminCategory(category.id);
      setCategories((current) => current.filter((item) => item.id !== category.id));
      toast.success("Category deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete category");
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Catalog"
        title="Categories"
        description="Category ID, name, created date, and database image preview."
        actions={
          <Button type="button" onClick={openCreateDialog}>
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        }
      />
      <AdminEditableTable
        rows={categories}
        columns={categoryColumns}
        emptyLabel={loading ? "Loading categories..." : "No categories found"}
        searchKeys={["category_name", "created_at"]}
        onEditRow={openEditDialog}
        onDelete={removeCategory}
        confirmDeleteMessage={(row) => `Delete category "${row.category_name}"?`}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl bg-primary">
          <form onSubmit={saveCategory} className="space-y-5">
            <DialogHeader>
              <DialogTitle className="text-muted">{editingCategory ? "Update Category" : "Add Category"}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="category_name">Category Name</Label>
                <Input
                  id="category_name"
                  value={categoryName}
                  onChange={(event) => setCategoryName(event.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category_image">Category Image</Label>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <label className="flex min-h-24 flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border bg-card px-4 py-5 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground">
                    <Upload className="h-4 w-4" />
                    <span className="truncate">{categoryImage?.name || "Choose image"}</span>
                    <Input
                      id="category_image"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(event) => setCategoryImage(event.target.files?.[0] || null)}
                    />
                  </label>
                  {editingCategory?.category_image && (
                    <img
                      src={resolveUploadUrl(editingCategory.category_image)}
                      alt={editingCategory.category_name}
                      className="h-24 w-24 rounded-md border border-border object-cover"
                    />
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving} variant="outline" >
                {saving ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriesAdminPage;
