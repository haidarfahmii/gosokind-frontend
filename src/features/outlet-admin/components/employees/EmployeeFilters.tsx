"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmployeeFilters as FiltersType } from "../../types/employee.types";

interface EmployeeFiltersProps {
  filters: FiltersType;
  onFilterChange: (filters: Partial<FiltersType>) => void;
  onClear: () => void;
  itemsPerPage: number;
  onItemsPerPageChange: (limit: number) => void;
}

export function EmployeeFilters({
  filters,
  onFilterChange,
  onClear,
  itemsPerPage,
  onItemsPerPageChange,
}: EmployeeFiltersProps) {
  const hasActiveFilters =
    filters.search || filters.role !== "all" || filters.status !== "all";

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search by name or email..."
            value={filters.search || ""}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="pl-10"
          />
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600 font-medium min-w-fit">
              Role:
            </label>
            <Select
              value={filters.role || "all"}
              onValueChange={(value) => onFilterChange({ role: value })}
            >
              <SelectTrigger className="w-45">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="WORKER_WASHING">Washing</SelectItem>
                <SelectItem value="WORKER_IRONING">Ironing</SelectItem>
                <SelectItem value="WORKER_PACKING">Packing</SelectItem>
                <SelectItem value="DRIVER">Driver</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600 font-medium min-w-fit">
              Status:
            </label>
            <Select
              value={filters.status || "all"}
              onValueChange={(value) => onFilterChange({ status: value })}
            >
              <SelectTrigger className="w-37.5">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="text-slate-600 hover:text-slate-800"
            >
              <X className="h-4 w-4 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Items Per Page */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600 font-medium min-w-fit">
            Show:
          </label>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => onItemsPerPageChange(parseInt(value))}
          >
            <SelectTrigger className="w-25">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
