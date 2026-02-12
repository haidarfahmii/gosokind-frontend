import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { employeeService } from "../services/employee.service";
import {
  OutletEmployee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeFilters,
  EmployeeStats,
} from "../types/employee.types";

export function useEmployees() {
  const [employees, setEmployees] = useState<OutletEmployee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [stats, setStats] = useState<EmployeeStats | null>(null);
  const [filters, setFilters] = useState<EmployeeFilters>({
    search: "",
    role: "all",
    status: "all",
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  /**
   * Fetch employees with filters
   */
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);

      const filterParams: EmployeeFilters = {
        ...filters,
        role: filters.role === "all" ? undefined : filters.role,
        status: filters.status === "all" ? undefined : filters.status,
      };

      const response = await employeeService.getAll(filterParams);

      if (response.success) {
        setEmployees(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (error: any) {
      console.error("Failed to fetch employees:", error);
      toast.error(error.message || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * Fetch employee statistics
   */
  const fetchStats = useCallback(async () => {
    try {
      const statsData = await employeeService.getStats();
      setStats(statsData);
    } catch (error: any) {
      console.error("Failed to fetch stats:", error);
    }
  }, []);

  /**
   * Initial load
   */
  useEffect(() => {
    fetchEmployees();
    fetchStats();
  }, [fetchEmployees, fetchStats]);

  /**
   * Create new employee
   */
  const createEmployee = async (data: CreateEmployeeDto) => {
    try {
      const response = await employeeService.create(data);

      if (response.success) {
        toast.success("Employee created successfully");
        fetchEmployees();
        fetchStats();
        return response.data;
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create employee");
      throw error;
    }
  };

  /**
   * Update employee
   */
  const updateEmployee = async (id: string, data: UpdateEmployeeDto) => {
    try {
      const response = await employeeService.update(id, data);

      if (response.success) {
        toast.success("Employee updated successfully");
        fetchEmployees();
        fetchStats();
        return response.data;
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update employee");
      throw error;
    }
  };

  /**
   * Delete employee
   */
  const deleteEmployee = async (id: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    try {
      const response = await employeeService.delete(id);

      if (response.success) {
        toast.success("Employee deleted successfully");
        fetchEmployees();
        fetchStats();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete employee");
    }
  };

  /**
   * Toggle employee status
   */
  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    try {
      const response = await employeeService.toggleStatus(id, newStatus);

      if (response.success) {
        toast.success(`Employee status changed to ${newStatus}`);
        fetchEmployees();
        fetchStats();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  /**
   * Update filters
   */
  const updateFilters = (newFilters: Partial<EmployeeFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  /**
   * Change page
   */
  const changePage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  /**
   * Change limit
   */
  const changeLimit = (limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  };

  /**
   * Clear filters
   */
  const clearFilters = () => {
    setFilters({
      search: "",
      role: "all",
      status: "all",
      page: 1,
      limit: 10,
    });
  };

  /**
   * Refresh data
   */
  const refresh = () => {
    fetchEmployees();
    fetchStats();
  };

  return {
    // Data
    employees,
    loading,
    stats,
    filters,
    pagination,

    // Actions
    createEmployee,
    updateEmployee,
    deleteEmployee,
    toggleStatus,
    updateFilters,
    changePage,
    changeLimit,
    clearFilters,
    refresh,
  };
}
