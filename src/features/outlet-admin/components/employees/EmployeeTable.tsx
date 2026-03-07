"use client";

import { Edit2, Trash2, MoreVertical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Pagination from "@/components/shared/Pagination";
import { OutletEmployee } from "../../types/employee.types";
import {
  DeleteConfirmDialog,
  useDeleteConfirm,
} from "@/components/shared/DeleteConfirmDialog";

interface EmployeeTableProps {
  employees: OutletEmployee[];
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onEdit: (employee: OutletEmployee) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onPageChange: (page: number) => void;
}

export function EmployeeTable({
  employees,
  loading,
  pagination,
  onEdit,
  onDelete,
  onToggleStatus,
  onPageChange,
}: EmployeeTableProps) {
  const deleteConfirm = useDeleteConfirm<OutletEmployee>();
  const getRoleBadge = (role: string) => {
    const variants: Record<string, string> = {
      WORKER_WASHING: "bg-blue-100 text-blue-700",
      WORKER_IRONING: "bg-orange-100 text-orange-700",
      WORKER_PACKING: "bg-purple-100 text-purple-700",
      DRIVER: "bg-green-100 text-green-700",
    };
    return variants[role] || "bg-gray-100 text-gray-700";
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      WORKER_WASHING: "Washing",
      WORKER_IRONING: "Ironing",
      WORKER_PACKING: "Packing",
      DRIVER: "Driver",
    };
    return labels[role] || role;
  };

  const getStatusFromIsActive = (isActive: boolean | undefined): string => {
    if (isActive === true) return "ACTIVE";
    if (isActive === false) return "INACTIVE";
    return "UNKNOWN";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">No employees found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => {
            return (
              <TableRow key={employee.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {employee.avatarUrl ? (
                      <img
                        src={employee.avatarUrl}
                        alt={employee.fullName}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {employee.fullName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="font-medium text-slate-800">
                      {employee.fullName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-slate-600">
                  {employee.email}
                </TableCell>
                <TableCell className="text-slate-600">
                  {employee.phoneNumber || "-"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`${getRoleBadge(employee.role)} border-none`}
                  >
                    {getRoleLabel(employee.role)}
                  </Badge>
                </TableCell>

                {/*Status Badge */}
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={
                      employee.isActive
                        ? "bg-green-100 text-green-700 border-none"
                        : "bg-red-100 text-red-700 border-none"
                    }
                  >
                    {employee.isActive ? "ACTIVE" : "INACTIVE"}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-slate-600"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(employee)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => onToggleStatus(employee.id)}
                      >
                        {employee.isActive ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => deleteConfirm.open(employee)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
        />
      )}

      <DeleteConfirmDialog
        {...deleteConfirm.dialogProps}
        onConfirm={async () => {
          if (deleteConfirm.target) await onDelete(deleteConfirm.target.id);
        }}
        entityType="employee"
        itemName={deleteConfirm.target?.fullName}
        title="Hapus Karyawan"
      />
    </div>
  );
}
