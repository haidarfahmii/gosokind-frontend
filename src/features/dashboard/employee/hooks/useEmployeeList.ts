"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { Employee, EmployeeRole } from "@/@types/employee.types";
import { employeeService } from "../services/employee.service";
import { useDebounce } from "@/hooks/useDebounce";
import { useUrlState } from "@/hooks/useUrlState";

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const useEmployeeList = () => {
  const urlState = useUrlState();
  const isInitialMount = useRef<boolean>(true);
  const fetchController = useRef<AbortController | null>(null);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // State Filter
  const [search, setSearchState] = useState(() =>
    urlState.getParam("search", ""),
  );
  const [filterRole, setFilterRoleState] = useState(() =>
    urlState.getParam("role", "all"),
  );
  const [filterOutlet, setFilterOutletState] = useState(() =>
    urlState.getParam("outletId", "all"),
  );
  const [filterStatus, setFilterStatusState] = useState(() =>
    urlState.getParam("status", "all"),
  );

  // Debounce search agar tidak fetch setiap ketikan
  const debouncedSearch = useDebounce(search, 500);

  // State Pagination
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: urlState.getParamAsNumber("page", 1),
    limit: urlState.getParamAsNumber("limit", 10),
    totalPages: 0,
  });

  // Fetching
  const fetchEmployees = useCallback(async () => {
    try {
      // Abort request sebelumnya jika masih berjalan
      if (fetchController.current) {
        fetchController.current.abort();
      }
      fetchController.current = new AbortController();

      setLoading(true);

      const queryParams: any = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (filterRole !== "all") queryParams.role = filterRole as EmployeeRole;
      if (filterOutlet !== "all") queryParams.outletId = filterOutlet;
      if (filterStatus !== "all")
        queryParams.isActive = filterStatus === "active";
      if (debouncedSearch) queryParams.search = debouncedSearch;

      const response = await employeeService.getAllEmployees(queryParams);

      if (response.success) {
        setEmployees(response.data || []);
        setPagination((prev) => ({
          ...prev,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.totalPages || 0,
        }));
      }
    } catch (error: any) {
      if (error.name === "AbortError") return;
      console.error("Failed to fetch employees:", error);
      toast.error(error.response?.data?.message || "Failed to load employees");
    } finally {
      setLoading(false);
      fetchController.current = null;
    }
  }, [
    pagination.page,
    pagination.limit,
    filterRole,
    filterOutlet,
    filterStatus,
    debouncedSearch,
  ]);

  // Reset Page ke 1 jika Filter Berubah
  // Ini akan memicu Effect 2 karena pagination.page berubah
  useEffect(() => {
    if (isInitialMount.current) return;

    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [filterRole, filterOutlet, filterStatus, debouncedSearch]);

  // Sinkronisasi URL & Trigger Fetch
  useEffect(() => {
    // Update URL Params
    const urlParams: Record<string, string | null> = {
      search: debouncedSearch || null,
      role: filterRole !== "all" ? filterRole : null,
      outletId: filterOutlet !== "all" ? filterOutlet : null,
      status: filterStatus !== "all" ? filterStatus : null,
      page: pagination.page !== 1 ? String(pagination.page) : null,
      limit: pagination.limit !== 10 ? String(pagination.limit) : null,
    };
    urlState.setParams(urlParams);

    // Jalankan Fetch
    fetchEmployees();

    isInitialMount.current = false;
  }, [fetchEmployees]);

  const deleteEmployee = async (id: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;
    try {
      await employeeService.deleteEmployee(id);
      toast.success("Employee deleted successfully");
      fetchEmployees();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete employee");
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      const employee = employees.find((e) => e.id === id);
      if (!employee) return;

      const newStatus = !employee.isActive;
      await employeeService.toggleEmployeeStatus(id, newStatus);
      toast.success(
        `Employee ${newStatus ? "activated" : "deactivated"} successfully`,
      );

      // Update local state untuk responsivitas UI
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === id ? { ...emp, isActive: newStatus } : emp,
        ),
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const clearFilters = () => {
    setSearchState("");
    setFilterRoleState("all");
    setFilterOutletState("all");
    setFilterStatusState("all");
    setPagination((prev) => ({ ...prev, page: 1, limit: 10 }));
  };

  const addEmployee = (_: Employee) => {
    fetchEmployees();
  };

  const updateEmployee = (updatedEmployee: Employee) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === updatedEmployee.id ? updatedEmployee : e)),
    );
  };

  // Cleanup
  useEffect(() => {
    return () => fetchController.current?.abort();
  }, []);

  return {
    employees,
    loading,
    search,
    setSearch: setSearchState,
    filterRole,
    setFilterRole: setFilterRoleState,
    filterOutlet,
    setFilterOutlet: setFilterOutletState,
    filterStatus,
    setFilterStatus: setFilterStatusState,
    clearFilters,
    deleteEmployee,
    toggleStatus,
    addEmployee,
    updateEmployee,
    pagination,
    handlePageChange: (page: number) =>
      setPagination((prev) => ({ ...prev, page })),
    handleLimitChange: (limit: number) =>
      setPagination((prev) => ({ ...prev, limit, page: 1 })),
    refetch: fetchEmployees,
  };
};
