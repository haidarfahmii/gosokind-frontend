import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { employeeService } from "@/services/employee.service";
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

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);

      const filterParams: EmployeeFilters = {
        ...filters,
        role: filters.role === "all" ? undefined : filters.role,
        status: filters.status === "all" ? undefined : filters.status,
      };

      const response = await employeeService.getAllEmployees({
        page: filterParams.page,
        limit: filterParams.limit,
        search: filterParams.search,
        role: filterParams.role,
        isActive:
          filterParams.status === "active"
            ? true
            : filterParams.status === "inactive"
              ? false
              : undefined,
      });

      if (response.success) {
        setEmployees(response.data as OutletEmployee[]);
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

  const fetchStats = useCallback(async () => {
    try {
      const statsData = await employeeService.getEmployeeStats();
      setStats(statsData);
    } catch (error: any) {
      console.error("Failed to fetch stats:", error);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
    fetchStats();
  }, [fetchEmployees, fetchStats]);

  const createEmployee = async (data: CreateEmployeeDto) => {
    try {
      const response = await employeeService.createEmployee(data);

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

  const updateEmployee = async (id: string, data: UpdateEmployeeDto) => {
    try {
      const response = await employeeService.updateEmployee(id, data);

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

  const deleteEmployee = async (id: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    try {
      const response = await employeeService.deleteEmployee(id);

      if (response.success) {
        toast.success("Employee deleted successfully");
        fetchEmployees();
        fetchStats();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete employee");
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      // cari employee dari state untuk menadapatkan status saat ini
      const employee = employees.find((e) => e.id === id);
      if (!employee) return;
      // hitung status baru
      const newStatus = !employee.isActive;

      const response = await employeeService.toggleEmployeeStatus(
        id,
        newStatus,
      );

      if (response.success) {
        toast.success(`Employee status changed to ${newStatus}`);
        fetchEmployees();
        fetchStats();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const updateFilters = (newFilters: Partial<EmployeeFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const changePage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const changeLimit = (limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      role: "all",
      status: "all",
      page: 1,
      limit: 10,
    });
  };

  const refresh = () => {
    fetchEmployees();
    fetchStats();
  };

  return {
    employees,
    loading,
    stats,
    filters,
    pagination,
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
