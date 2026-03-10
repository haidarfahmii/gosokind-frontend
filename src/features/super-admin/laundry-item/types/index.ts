export type PricingType = "WEIGHT" | "ITEM";

export interface LaundryItem {
  id: string;
  name: string;
  category: string | null;
  unit: string | null;
  basePrice: number | null;
  pricingType: PricingType;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLaundryItemInput {
  name: string;
  pricingType: PricingType;
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
  pricingType?: PricingType;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface LaundryItemListResponse {
  success: boolean;
  message: string;
  data: LaundryItem[];
  pagination: {
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

export const PRICING_TYPE_OPTIONS: {
  value: PricingType;
  label: string;
  description: string;
}[] = [
  {
    value: "WEIGHT",
    label: "Kiloan",
    description: "Harga dihitung per kg (misal: 7.000/kg)",
  },
  {
    value: "ITEM",
    label: "Satuan",
    description: "Harga dihitung per pcs/set (misal: 15.000/pcs)",
  },
];
