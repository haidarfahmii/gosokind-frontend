export enum OutletStatus {
  AVAILABLE = "AVAILABLE",
  MAINTENANCE = "MAINTENANCE",
}

export interface Outlet {
  id: string;
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

export interface OutletWithGeocoding extends Outlet {
  geocoding?: {
    source: "manual" | "opencage";
    usedManualCoordinates: boolean;
  };
}

export interface CreateOutletInput {
  name: string;
  province?: string;
  city?: string;
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateOutletInput {
  id: string;
  name?: string;
  province?: string;
  city?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
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

export interface OutletWithGeocodingResponse {
  success: boolean;
  message: string;
  data: OutletWithGeocoding;
}

export interface CheckLocationInput {
  province?: string;
  city?: string;
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface CheckLocationResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  source: "manual" | "opencage";
  preview: {
    willUse: string;
    message: string;
  };
}

export interface CheckLocationResponse {
  success: boolean;
  message: string;
  data: CheckLocationResult;
}

export interface OutletListQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface OutletFormValues {
  name: string;
  province: string;
  city: string;
  status: string;
  address: string;
  latitude: number | "";
  longitude: number | "";
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
