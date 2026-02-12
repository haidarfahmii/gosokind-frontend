export interface OutletEmployee {
  id: string;
  fullName: string;
  email: string;
  role: EmployeeRole;
  phoneNumber?: string | null;
  status: EmployeeStatus;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  outletId: string;
  outlet?: {
    id: string;
    name: string;
  };
}

export enum EmployeeRole {
  OUTLET_ADMIN = "OUTLET_ADMIN",
  WORKER_WASHING = "WORKER_WASHING",
  WORKER_IRONING = "WORKER_IRONING",
  WORKER_PACKING = "WORKER_PACKING",
  DRIVER = "DRIVER",
}

export enum EmployeeStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface CreateEmployeeDto {
  fullName: string;
  email: string;
  password: string;
  role: EmployeeRole;
  phoneNumber?: string;
}

export interface UpdateEmployeeDto {
  fullName?: string;
  email?: string;
  role?: EmployeeRole;
  phoneNumber?: string;
  status?: EmployeeStatus;
}

export interface EmployeeFilters {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface EmployeeStats {
  total: number;
  active: number;
  inactive: number;
  byRole: {
    [key in EmployeeRole]?: number;
  };
}

export interface EmployeesResponse {
  success: boolean;
  data: OutletEmployee[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface EmployeeResponse {
  success: boolean;
  data: OutletEmployee;
}
