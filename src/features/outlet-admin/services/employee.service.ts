import axiosInstance from "@/utils/axiosInstance";
import {
  OutletEmployee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeFilters,
  EmployeesResponse,
  EmployeeResponse,
} from "../types/employee.types";

class EmployeeService {
  private baseUrl = "/employees";

  /**
   * Get all employees for outlet admin's outlet
   * Backend akan otomatis filter berdasarkan outletId dari token
   */
  async getAll(filters?: EmployeeFilters): Promise<EmployeesResponse> {
    try {
      const params = new URLSearchParams();

      if (filters?.search) params.append("search", filters.search);
      if (filters?.role) params.append("role", filters.role);
      if (filters?.status) params.append("status", filters.status);
      if (filters?.page) params.append("page", filters.page.toString());
      if (filters?.limit) params.append("limit", filters.limit.toString());

      const response = await axiosInstance.get<EmployeesResponse>(
        `${this.baseUrl}?${params.toString()}`,
      );

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch employees",
      );
    }
  }

  /**
   * Get employee by ID
   * Backend akan verify apakah employee ini milik outlet admin
   */
  async getById(id: string): Promise<EmployeeResponse> {
    try {
      const response = await axiosInstance.get<EmployeeResponse>(
        `${this.baseUrl}/${id}`,
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch employee",
      );
    }
  }

  /**
   * Create new employee
   * Backend akan otomatis assign outletId dari token
   */
  async create(data: CreateEmployeeDto): Promise<EmployeeResponse> {
    try {
      const response = await axiosInstance.post<EmployeeResponse>(
        this.baseUrl,
        data,
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to create employee",
      );
    }
  }

  /**
   * Update employee
   * Backend akan verify apakah employee ini milik outlet admin
   */
  async update(id: string, data: UpdateEmployeeDto): Promise<EmployeeResponse> {
    try {
      const response = await axiosInstance.put<EmployeeResponse>(
        `${this.baseUrl}/${id}`,
        data,
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update employee",
      );
    }
  }

  /**
   * Delete employee
   * Backend akan verify apakah employee ini milik outlet admin
   */
  async delete(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosInstance.delete(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to delete employee",
      );
    }
  }

  /**
   * Toggle employee status (ACTIVE/INACTIVE)
   */
  async toggleStatus(
    id: string,
    status: "ACTIVE" | "INACTIVE",
  ): Promise<EmployeeResponse> {
    try {
      const response = await axiosInstance.patch<EmployeeResponse>(
        `${this.baseUrl}/${id}/status`,
        { status },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update employee status",
      );
    }
  }

  /**
   * Get employee statistics
   */
  async getStats(): Promise<any> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/stats`);
      return response.data;
    } catch (error: any) {
      // If stats endpoint not implemented, calculate from getAll
      const employees = await this.getAll();
      return this.calculateStats(employees.data);
    }
  }

  /**
   * Calculate statistics from employee list
   */
  private calculateStats(employees: OutletEmployee[]) {
    const total = employees.length;
    const active = employees.filter((e) => e.status === "ACTIVE").length;
    const inactive = employees.filter((e) => e.status === "INACTIVE").length;

    const byRole = employees.reduce(
      (acc, emp) => {
        acc[emp.role] = (acc[emp.role] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      total,
      active,
      inactive,
      byRole,
    };
  }
}

export const employeeService = new EmployeeService();
