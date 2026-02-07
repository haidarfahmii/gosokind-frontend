"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { PageHeader } from "@/features/dashboard/employee/components/PageHeader";
import { SearchBar } from "@/features/dashboard/employee/components/SearchBar";
import { EmployeeFilters } from "@/features/dashboard/employee/components/EmployeeFilters";
import { EmployeeTable } from "@/features/dashboard/employee/components/EmployeeTable";
import { EmployeeDialog } from "@/features/dashboard/employee/components/EmployeeDialog";
import { useEmployeeList } from "@/features/dashboard/employee/hooks/useEmployeeList";
import { useOutletFilter } from "@/hooks/useOutletFilter";
import { Employee } from "@/@types/employee.types";

export default function EmployeesPage() {
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  // Global Outlet Filter dari Context
  const { selectedOutletId, setSelectedOutletId, outlets, loadingOutlets } =
    useOutletFilter();

  const {
    employees,
    loading,
    search,
    setSearch,
    filterRole,
    setFilterRole,
    filterOutlet,
    setFilterOutlet,
    filterStatus,
    setFilterStatus,
    clearFilters,
    deleteEmployee,
    toggleStatus,
    addEmployee,
    updateEmployee,
    pagination,
    handlePageChange,
    handleLimitChange,
  } = useEmployeeList();

  // Sync global outlet filter dengan local filter
  useEffect(() => {
    setFilterOutlet(selectedOutletId);
  }, [selectedOutletId, setFilterOutlet]);

  // Handler Custom untuk Reset
  const handleResetFilters = () => {
    clearFilters(); // Reset filter lokal (Role, Status, Search, Page)
    setSelectedOutletId("all"); // Reset filter Global Header (Outlet)
  };

  // Handlers
  const handleAdd = () => {
    setSelectedEmployee(null);
    setDialogOpen(true);
  };

  const handleEdit = (emp: Employee) => {
    setSelectedEmployee(emp);
    setDialogOpen(true);
  };

  const handleFormSuccess = (employee: Employee) => {
    if (selectedEmployee) {
      updateEmployee(employee);
    } else {
      addEmployee(employee);
    }
    setDialogOpen(false);
  };

  // Loading state dengan initial loader
  const showInitialLoader =
    (loading &&
      employees.length === 0 &&
      !search &&
      filterRole === "all" &&
      filterOutlet === "all" &&
      filterStatus === "all") ||
    loadingOutlets;
  if (showInitialLoader) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader onAdd={handleAdd} />

      {/* Info Banner - Jika ada filter outlet aktif */}
      {selectedOutletId !== "all" && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">🌐 Global Filter Active:</span>{" "}
            Showing employees from{" "}
            <span className="font-bold">
              {outlets.find((o) => o.id === selectedOutletId)?.name ||
                "Selected Outlet"}
            </span>
            . Change the outlet filter in the header to view different outlets.
          </p>
        </div>
      )}

      {/* Main Card */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <CardTitle className="text-base">All Staff Members</CardTitle>
              {pagination.total > 0 && (
                <p className="text-sm text-slate-500 mt-1">
                  Total: {pagination.total} employees
                </p>
              )}
            </div>
            <SearchBar value={search} onChange={setSearch} />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filters */}
          <EmployeeFilters
            selectedRole={filterRole}
            selectedOutlet={filterOutlet}
            selectedStatus={filterStatus}
            onRoleChange={setFilterRole}
            onOutletChange={setFilterOutlet}
            onStatusChange={setFilterStatus}
            onClearFilters={handleResetFilters}
            outlets={outlets}
            itemsPerPage={pagination.limit}
            onItemsPerPageChange={handleLimitChange}
          />

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <EmployeeTable
              data={employees}
              onEdit={handleEdit}
              onDelete={deleteEmployee}
              onToggleStatus={toggleStatus}
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          )}
        </CardContent>
      </Card>

      {/* Dialog */}
      <EmployeeDialog
        open={isDialogOpen}
        onOpenChange={setDialogOpen}
        selectedEmployee={selectedEmployee}
        onSuccess={handleFormSuccess}
        outlets={outlets}
      />
    </div>
  );
}
