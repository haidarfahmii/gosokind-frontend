export enum OutletStatus {
  AVAILABLE = "AVAILABLE",
  MAINTENANCE = "MAINTENANCE",
}

export interface Outlet {
  id: string;
  outletCode: string;
  name: string;
  province?: string | null;
  city?: string | null;
  status: OutletStatus;
  address: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  employeeCount?: number;
  orderCount?: number;
}

export interface OutletFormValues {
  name: string;
  province: string;
  city: string;
  status: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
}

export interface CreateOutletInput {
  name: string;
  province?: string;
  city?: string;
  address: string;
  latitude: number;
  longitude: number;
  status?: OutletStatus;
}

export interface UpdateOutletInput {
  id: string;
  name?: string;
  province?: string;
  city?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  status?: OutletStatus;
}

export interface OutletListResponse {
  success: boolean;
  message: string;
  data: Outlet[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OutletResponse {
  success: boolean;
  message: string;
  data: Outlet;
}

export interface OutletListQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface OutletStats {
  totalOutlets: number;
  activeOutlets: number;
  totalEmployees: number;
  totalOrders: number;
}

export interface CreateOutletPayload {
  name: string;
  province?: string;
  city?: string;
  status?: OutletStatus;
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateOutletPayload extends CreateOutletPayload {
  id: string;
}
