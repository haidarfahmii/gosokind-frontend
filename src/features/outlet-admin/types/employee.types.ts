export * from "@/@types/employee.types";
import { Employee, EmployeeRole } from "@/@types/employee.types";

export interface OutletEmployee extends Employee {
  phoneNumber?: string | null;
  outletId: string;
  outlet?: {
    id: string;
    name: string;
  };
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
  isActive?: boolean;
}

export interface EmployeeFilters {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
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

export interface OutletEmployeeResponse {
  success: boolean;
  data: OutletEmployee;
  message?: string;
}
