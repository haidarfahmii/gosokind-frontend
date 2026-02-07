export interface LaundryItem {
  id: string;
  name: string;
  category: string | null;
  unit: string | null;
  basePrice: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLaundryItemInput {
  name: string;
  category?: string;
  unit?: string;
  basePrice?: number;
}

export interface UpdateLaundryItemInput extends Partial<CreateLaundryItemInput> {}

export interface LaundryItemListQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface LaundryItemListResponse {
  success: boolean;
  message: string;
  data: LaundryItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const CATEGORY_OPTIONS = [
  "Atasan",
  "Bawahan",
  "Linen",
  "Sepatu",
  "Lainnya",
];
export const UNIT_OPTIONS = ["Kg", "Pcs", "Set", "Meter"];
