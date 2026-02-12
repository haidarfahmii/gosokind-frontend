import axiosInstance from "@/utils/axiosInstance";
import {
  Employee,
  CreateEmployeeInput,
  UpdateEmployeeInput,
  EmployeeListQuery,
  EmployeeListResponse,
  EmployeeResponse,
} from "@/@types/employee.types";

export const employeeService = {
  async getAllEmployees(
    query?: EmployeeListQuery,
  ): Promise<EmployeeListResponse> {
    try {
      const params = new URLSearchParams();

      if (query?.page) params.append("page", query.page.toString());
      if (query?.limit) params.append("limit", query.limit.toString());
      if (query?.role) params.append("role", query.role);
      if (query?.outletId) params.append("outletId", query.outletId);
      if (query?.search) params.append("search", query.search);
      if (query?.isActive !== undefined)
        params.append("isActive", query.isActive.toString());

      const response = await axiosInstance.get(
        `/employees?${params.toString()}`,
      );
      return response.data;
    } catch (error: any) {
      console.error("Get employees error:", error);
      throw error;
    }
  },

  async getEmployeeById(id: string): Promise<EmployeeResponse> {
    try {
      const response = await axiosInstance.get(`/employees/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("Get employee error:", error);
      throw error;
    }
  },

  async createEmployee(data: CreateEmployeeInput): Promise<EmployeeResponse> {
    try {
      const response = await axiosInstance.post("/employees", data);
      return response.data;
    } catch (error: any) {
      console.error("Create employee error:", error);
      throw error;
    }
  },

  async updateEmployee(
    id: string,
    data: UpdateEmployeeInput,
  ): Promise<EmployeeResponse> {
    try {
      const response = await axiosInstance.put(`/employees/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error("Update employee error:", error);
      throw error;
    }
  },

  async toggleEmployeeStatus(
    id: string,
    isActive: boolean,
  ): Promise<EmployeeResponse> {
    try {
      const response = await axiosInstance.patch(
        `/employees/${id}/toggle-status`,
        { isActive },
      );
      return response.data;
    } catch (error: any) {
      console.error("Toggle status error:", error);
      throw error;
    }
  },

  async deleteEmployee(
    id: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosInstance.delete(`/employees/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("Delete employee error:", error);
      throw error;
    }
  },
};
