export enum EmployeeRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  OUTLET_ADMIN = "OUTLET_ADMIN",
  WORKER_WASHING = "WORKER_WASHING",
  WORKER_IRONING = "WORKER_IRONING",
  WORKER_PACKING = "WORKER_PACKING",
  DRIVER = "DRIVER",
}

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  role: EmployeeRole;
  outletId?: string;
  outletName?: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface OutletOption {
  id: string;
  name: string;
}

export interface CreateEmployeeInput {
  fullName: string;
  email: string;
  password: string;
  role: EmployeeRole;
  outletId?: string;
  isActive?: boolean;
}

export interface UpdateEmployeeInput {
  fullName?: string;
  email?: string;
  password?: string;
  role?: EmployeeRole;
  outletId?: string;
  isActive?: boolean;
}

export interface EmployeeListQuery {
  page?: number;
  limit?: number;
  role?: EmployeeRole;
  outletId?: string;
  search?: string;
  isActive?: boolean;
}

export interface EmployeeListResponse {
  success: boolean;
  message: string;
  data: Employee[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface EmployeeResponse {
  success: boolean;
  message: string;
  data: Employee;
}

export interface EmployeeLoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      fullName: string;
      role: EmployeeRole;
      avatarUrl?: string;
    };
  };
}
