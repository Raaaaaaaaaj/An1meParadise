import type { AdminCategory, AdminProduct } from "@/admin/types";

export const API_URL = import.meta.env.VITE_API_URL || "";

const toApiUrl = (path: string) => `${API_URL}${path}`;

const readJson = async <T>(response: Response): Promise<T> => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = typeof data?.message === "string" ? data.message : "Request failed";
    throw new Error(message);
  }

  return data as T;
};

const unwrapList = <T>(data: T[] | { data?: T[] }) => {
  if (Array.isArray(data)) return data;
  return data.data || [];
};

export const resolveUploadUrl = (value?: string | null) => {
  if (!value) return "/placeholder.svg";
  if (/^(https?:|data:|blob:)/i.test(value)) return value;

  const cleanValue = value.replace(/^\/+/, "");

  if (cleanValue.startsWith("uploads/")) {
    return `${API_URL}/${cleanValue}`;
  }

  return `${API_URL}/uploads/${cleanValue}`;
};

export const fetchAdminCategories = async () => {
  const response = await fetch(toApiUrl("/api/categories"));
  return unwrapList<AdminCategory>(await readJson<AdminCategory[] | { data?: AdminCategory[] }>(response));
};

export const createAdminCategory = async (formData: FormData) => {
  const response = await fetch(toApiUrl("/api/categories/add"), {
    method: "POST",
    body: formData,
  });

  return readJson(response);
};

export const updateAdminCategory = async (id: number, formData: FormData) => {
  const response = await fetch(toApiUrl(`/api/categories/update/${id}`), {
    method: "PUT",
    body: formData,
  });

  return readJson(response);
};

export const deleteAdminCategory = async (id: number) => {
  const response = await fetch(toApiUrl(`/api/categories/remove/${id}`), {
    method: "DELETE",
  });

  return readJson(response);
};

export const fetchAdminProducts = async () => {
  const response = await fetch(toApiUrl("/api/products?sort=latest"));
  return unwrapList<AdminProduct>(await readJson<AdminProduct[] | { data?: AdminProduct[] }>(response));
};

export const createAdminProduct = async (formData: FormData) => {
  const response = await fetch(toApiUrl("/api/admin/product"), {
    method: "POST",
    body: formData,
  });

  return readJson(response);
};

export const updateAdminProduct = async (id: number, formData: FormData) => {
  const response = await fetch(toApiUrl(`/api/admin/product/${id}`), {
    method: "PUT",
    body: formData,
  });

  return readJson(response);
};

export const deleteAdminProduct = async (id: number) => {
  const response = await fetch(toApiUrl(`/api/admin/product/${id}`), {
    method: "DELETE",
  });

  return readJson(response);
};
