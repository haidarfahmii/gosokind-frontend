"use client";

import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface EmployeeFiltersProps {
  selectedRole: string;
  selectedOutlet: string;
  selectedStatus: string;
  onRoleChange: (value: string) => void;
  onOutletChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClearFilters: () => void;
  outlets: Array<{ id: string; name: string }>;
  itemsPerPage?: number;
  onItemsPerPageChange?: (limit: number) => void;
}

export function EmployeeFilters({
  selectedRole,
  selectedOutlet,
  selectedStatus,
  onRoleChange,
  onOutletChange,
  onStatusChange,
  onClearFilters,
  outlets,
  itemsPerPage = 10,
  onItemsPerPageChange,
}: EmployeeFiltersProps) {
  const hasActiveFilters = selectedRole !== "all" || selectedStatus !== "all";

  return (
    <div className="flex flex-col sm:flex-row items-center justify-end gap-3 w-full">
      {/* Role Filter */}
      <Select value={selectedRole} onValueChange={onRoleChange}>
        <SelectTrigger className="w-full sm:w-37.5">
          <SelectValue placeholder="Select Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
          <SelectItem value="OUTLET_ADMIN">Outlet Admin</SelectItem>
          <SelectItem value="WORKER_WASHING">Washing</SelectItem>
          <SelectItem value="WORKER_IRONING">Ironing</SelectItem>
          <SelectItem value="WORKER_PACKING">Packing</SelectItem>
          <SelectItem value="DRIVER">Driver</SelectItem>
        </SelectContent>
      </Select>

      {/* Outlet Filter */}
      <Select value={selectedOutlet} onValueChange={onOutletChange}>
        <SelectTrigger className="bg-white">
          <SelectValue placeholder="Filter by outlet" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Outlets</SelectItem>
          {outlets.map((outlet) => (
            <SelectItem key={outlet.id} value={outlet.id}>
              {outlet.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select value={selectedStatus} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full sm:w-32.5">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>

      {/* Items per page selector */}
      {onItemsPerPageChange && (
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => onItemsPerPageChange(parseInt(value))}
        >
          <SelectTrigger className="bg-white lg:w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 per page</SelectItem>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="25">25 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
            <SelectItem value="100">100 per page</SelectItem>
          </SelectContent>
        </Select>
      )}

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          onClick={onClearFilters}
          className="h-8 px-2 lg:px-3 text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          Reset
          <X className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
