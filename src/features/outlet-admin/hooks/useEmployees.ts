import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { employeeService } from "@/services/employee.service";
import {
  OutletEmployee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeFilters,
  EmployeeStats,
} from "@/features/outlet-admin/types/employee.types";
import { useUrlState } from "@/hooks/useUrlState";
import { useDebounce } from "@/hooks/useDebounce";

export function useEmployees() {
  const urlState = useUrlState();
  const isInitialMount = useRef<boolean>(true);

  const [employees, setEmployees] = useState<OutletEmployee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [stats, setStats] = useState<EmployeeStats | null>(null);

  // Inisialisasi filter dari URL params (agar refresh tidak reset ke default)
  const [filters, setFilters] = useState<EmployeeFilters>({
    search: urlState.getParam("search", ""),
    role: urlState.getParam("role", "all"),
    status: urlState.getParam("status", "all"),
    page: urlState.getParamAsNumber("page", 1),
    limit: urlState.getParamAsNumber("limit", 10),
  });

  const [pagination, setPagination] = useState({
    page: urlState.getParamAsNumber("page", 1),
    limit: urlState.getParamAsNumber("limit", 10),
    total: 0,
    totalPages: 0,
  });

  // Debounce search agar tidak fetch tiap keystroke
  const debouncedSearch = useDebounce(filters.search, 500);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);

      const response = await employeeService.getAllEmployees({
        page: filters.page,
        limit: filters.limit,
        search: debouncedSearch || undefined,
        role: filters.role === "all" ? undefined : filters.role,
        isActive:
          filters.status === "ACTIVE"
            ? true
            : filters.status === "INACTIVE"
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
  }, [
    filters.page,
    filters.limit,
    filters.role,
    filters.status,
    debouncedSearch,
  ]);

  const fetchStats = useCallback(async () => {
    try {
      const statsData = await employeeService.getEmployeeStats();
      setStats(statsData);
    } catch (error: any) {
      console.error("Failed to fetch stats:", error);
    }
  }, []);

  // Reset ke halaman 1 saat filter berubah (kecuali saat mount pertama)
  useEffect(() => {
    if (isInitialMount.current) return;
    setFilters((prev) => ({ ...prev, page: 1 }));
  }, [filters.role, filters.status, debouncedSearch]);

  // Sinkronisasi URL params & trigger fetch
  useEffect(() => {
    urlState.setParams({
      search: debouncedSearch || null,
      role: filters.role !== "all" ? (filters.role ?? null) : null,
      status: filters.status !== "all" ? (filters.status ?? null) : null,
      page: filters.page !== 1 ? String(filters.page) : null,
      limit: filters.limit !== 10 ? String(filters.limit) : null,
    });

    fetchEmployees();
    isInitialMount.current = false;
  }, [fetchEmployees]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

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
      const employee = employees.find((e) => e.id === id);
      if (!employee) return;

      const newStatus = !employee.isActive;
      const response = await employeeService.toggleEmployeeStatus(
        id,
        newStatus,
      );

      if (response.success) {
        toast.success(
          `Employee ${newStatus ? "activated" : "deactivated"} successfully`,
        );
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
