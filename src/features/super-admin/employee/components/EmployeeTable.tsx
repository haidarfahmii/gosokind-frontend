"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Pencil,
  Trash2,
  MapPin,
  CheckCircle2,
  Ban,
} from "lucide-react";
import { Employee, EmployeeRole } from "@/@types/employee.types";
import Pagination from "@/components/shared/Pagination";
import {
  DeleteConfirmDialog,
  useDeleteConfirm,
} from "@/components/shared/DeleteConfirmDialog";

interface EmployeeTableProps {
  data: Employee[];
  onEdit: (emp: Employee) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
}

const getRoleBadgeClass = (role: string) => {
  const classes: Record<string, string> = {
    SUPER_ADMIN: "bg-purple-100 text-purple-700",
    OUTLET_ADMIN: "bg-blue-100 text-blue-700",
    WORKER_WASHING: "bg-teal-100 text-teal-700",
    WORKER_IRONING: "bg-orange-100 text-orange-700",
    WORKER_PACKING: "bg-pink-100 text-pink-700",
    DRIVER: "bg-indigo-100 text-indigo-700",
  };
  return classes[role] || "bg-slate-100 text-slate-700";
};

const getRoleLabel = (role: string) => {
  const labels: Record<string, string> = {
    SUPER_ADMIN: "Super Admin",
    OUTLET_ADMIN: "Outlet Admin",
    WORKER_WASHING: "Washing",
    WORKER_IRONING: "Ironing",
    WORKER_PACKING: "Packing",
    DRIVER: "Driver",
  };
  return labels[role] || role;
};

export function EmployeeTable({
  data,
  onEdit,
  onDelete,
  onToggleStatus,
  pagination,
  onPageChange,
}: EmployeeTableProps) {
  const deleteConfirm = useDeleteConfirm<Employee>();
  const showingFrom = pagination
    ? (pagination.page - 1) * pagination.limit + 1
    : 0;
  const showingTo = pagination
    ? Math.min(pagination.page * pagination.limit, pagination.total)
    : 0;

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Table */}
      <Table>
        <TableHeader className="bg-slate-50 border-b">
          <TableRow>
            <TableHead className="font-semibold text-slate-700">
              Employee
            </TableHead>
            <TableHead className="font-semibold text-slate-700">Role</TableHead>
            <TableHead className="font-semibold text-slate-700">
              Outlet
            </TableHead>
            <TableHead className="font-semibold text-slate-700">
              Status
            </TableHead>
            <TableHead className="text-right font-semibold text-slate-700">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-center text-slate-500"
              >
                No employees found
              </TableCell>
            </TableRow>
          ) : (
            data.map((emp) => (
              <TableRow key={emp.id} className="hover:bg-slate-50/50">
                {/* Employee Name & Email */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={emp.avatarUrl || undefined}
                        alt={emp.fullName}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                        {emp.fullName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-slate-800">
                        {emp.fullName}
                      </p>
                      <p className="text-xs text-slate-500">{emp.email}</p>
                    </div>
                  </div>
                </TableCell>

                {/* Role */}
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`${getRoleBadgeClass(emp.role)} border-none font-medium`}
                  >
                    {getRoleLabel(emp.role)}
                  </Badge>
                </TableCell>

                {/* Outlet */}
                <TableCell>
                  {emp.role === EmployeeRole.SUPER_ADMIN ? (
                    <span className="text-xs text-slate-400 italic">
                      All Outlets
                    </span>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="w-3 h-3" />
                      {emp.outletName || "Unassigned"}
                    </div>
                  )}
                </TableCell>

                {/* Status (Active/Inactive) */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        emp.isActive !== false ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span className="text-sm text-slate-600">
                      {emp.isActive !== false ? "Active" : "Inactive"}
                    </span>
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4 text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>

                      <DropdownMenuItem onClick={() => onEdit(emp)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit Details
                      </DropdownMenuItem>

                      {/* Toggle Status Menu */}
                      <DropdownMenuItem onClick={() => onToggleStatus(emp.id)}>
                        {emp.isActive !== false ? (
                          <>
                            <Ban className="mr-2 h-4 w-4 text-orange-500" />
                            <span className="text-orange-600">Deactivate</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                            <span className="text-green-600">Activate</span>
                          </>
                        )}
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => deleteConfirm.open(emp)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination Component */}
      {pagination && onPageChange && pagination.totalPages > 0 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          showingFrom={showingFrom}
          showingTo={showingTo}
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
