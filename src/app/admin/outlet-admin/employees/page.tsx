"use client";

import { useState, Suspense } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEmployees } from "@/features/outlet-admin/hooks/useEmployees";
import { EmployeeStats } from "@/features/outlet-admin/components/employees/EmployeeStats";
import { EmployeeFilters } from "@/features/outlet-admin/components/employees/EmployeeFilters";
import { EmployeeTable } from "@/features/outlet-admin/components/employees/EmployeeTable";
import { EmployeeForm } from "@/features/outlet-admin/components/employees/EmployeeForm";
import { OutletEmployee } from "@/features/outlet-admin/types/employee.types";

function EmployeesPageContent() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState<OutletEmployee | null>(null);

  const {
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
  } = useEmployees();

  // Handlers
  const handleAdd = () => {
    setSelectedEmployee(null);
    setDialogOpen(true);
  };

  const handleEdit = (employee: OutletEmployee) => {
    setSelectedEmployee(employee);
    setDialogOpen(true);
  };

  const handleSubmit = async (data: any) => {
    if (selectedEmployee) {
      await updateEmployee(selectedEmployee.id, data);
    } else {
      await createEmployee(data);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Employee Management
          </h1>
          <p className="text-slate-500 mt-1">
            Manage your outlet staff and team members
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {/* Statistics */}
      <EmployeeStats stats={stats} loading={loading && !employees.length} />

      {/* Main Card */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">All Staff Members</CardTitle>
          {pagination.total > 0 && (
            <p className="text-sm text-slate-500 mt-1">
              Total: {pagination.total} employees
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filters */}
          <EmployeeFilters
            filters={filters}
            onFilterChange={updateFilters}
            onClear={clearFilters}
            itemsPerPage={pagination.limit}
            onItemsPerPageChange={changeLimit}
          />

          {/* Table */}
          <EmployeeTable
            employees={employees}
            loading={loading}
            pagination={pagination}
            onEdit={handleEdit}
            onDelete={deleteEmployee}
            onToggleStatus={toggleStatus}
            onPageChange={changePage}
          />
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <EmployeeForm
        open={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        employee={selectedEmployee}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default function EmployeesPage() {
  return (
    <Suspense fallback={<div>Loading employees...</div>}>
      <EmployeesPageContent />
    </Suspense>
  );
}
