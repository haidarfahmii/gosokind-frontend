export interface CustomerAddress {
  id: string;
  label: string;
  address: string;
  latitude: number;
  longitude: number;
  isPrimary: boolean;
}

export interface Customer {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
  isVerified: boolean;
  provider?: string | null;
  createdAt: string;
  updatedAt: string;
  addresses: CustomerAddress[];
}

export interface CustomerListQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CustomerListResponse {
  success: boolean;
  message: string;
  data: Customer[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
