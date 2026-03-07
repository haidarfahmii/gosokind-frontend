import axiosInstance from "@/utils/axiosInstance";
import type {
  Employee,
  CreateEmployeeInput,
  UpdateEmployeeInput,
  EmployeeListQuery,
  EmployeeListResponse,
  EmployeeResponse,
  EmployeeStats,
} from "@/@types/employee.types";

export const getAllEmployees = async (
  query?: EmployeeListQuery,
): Promise<EmployeeListResponse> => {
  try {
    const params = new URLSearchParams();

    if (query?.page) params.append("page", query.page.toString());
    if (query?.limit) params.append("limit", query.limit.toString());
    if (query?.role) params.append("role", query.role.toString());
    if (query?.outletId) params.append("outletId", query.outletId);
    if (query?.search) params.append("search", query.search);
    if (query?.isActive !== undefined) {
      params.append("isActive", query.isActive.toString());
    }

    const response = await axiosInstance.get(`/employees?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    console.error("Get employees error:", error);
    throw error;
  }
};

export const getEmployeeById = async (
  id: string,
): Promise<EmployeeResponse> => {
  try {
    const response = await axiosInstance.get(`/employees/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Get employee error:", error);
    throw error;
  }
};

export const createEmployee = async (
  data: CreateEmployeeInput,
): Promise<EmployeeResponse> => {
  try {
    const response = await axiosInstance.post("/employees", data);
    return response.data;
  } catch (error: any) {
    console.error("Create employee error:", error);
    throw error;
  }
};

export const updateEmployee = async (
  id: string,
  data: UpdateEmployeeInput,
): Promise<EmployeeResponse> => {
  try {
    const response = await axiosInstance.put(`/employees/${id}`, data);
    return response.data;
  } catch (error: any) {
    console.error("Update employee error:", error);
    throw error;
  }
};

export const toggleEmployeeStatus = async (
  id: string,
  isActive: boolean,
): Promise<EmployeeResponse> => {
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
};

export const deleteEmployee = async (
  id: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axiosInstance.delete(`/employees/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Delete employee error:", error);
    throw error;
  }
};

export const getEmployeeStats = async (): Promise<EmployeeStats> => {
  try {
    const response = await axiosInstance.get("/employees/stats");

    const stats: EmployeeStats = response.data.data;

    if (!stats || typeof stats.total !== "number") {
      throw new Error("Invalid stats response");
    }

    return stats;
  } catch (error: any) {
    console.warn(
      "Stats endpoint failed, calculating from employee list:",
      error?.message,
    );
    const employees = await getAllEmployees();
    return calculateEmployeeStats(employees.data);
  }
};

export const calculateEmployeeStats = (
  employees: Employee[],
): EmployeeStats => {
  const total = employees.length;
  const active = employees.filter((e) => e.isActive === true).length;
  const inactive = employees.filter((e) => e.isActive === false).length;

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
};

export const getAllCustomers = async (query?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<any> => {
  try {
    const params = new URLSearchParams();

    if (query?.page) params.append("page", query.page.toString());
    if (query?.limit) params.append("limit", query.limit.toString());
    if (query?.search) params.append("search", query.search);

    const response = await axiosInstance.get(
      `/employees/customers?${params.toString()}`,
    );
    return response.data;
  } catch (error: any) {
    console.error("Get customers error:", error);
    throw error;
  }
};

// Export as object for backward compatibility
export const employeeService = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  toggleEmployeeStatus,
  deleteEmployee,
  getEmployeeStats,
  calculateEmployeeStats,
  getAllCustomers,
};
