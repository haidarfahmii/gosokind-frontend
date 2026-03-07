"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomerFiltersProps {
  itemsPerPage: number;
  onItemsPerPageChange: (limit: number) => void;
}

export function CustomerFilters({
  itemsPerPage,
  onItemsPerPageChange,
}: CustomerFiltersProps) {
  return (
    <div className="flex items-center justify-end gap-3">
      <span className="text-sm text-slate-500 hidden sm:block">Show</span>
      <Select
        value={itemsPerPage.toString()}
        onValueChange={(value) => onItemsPerPageChange(parseInt(value))}
      >
        <SelectTrigger className="bg-white w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="25">25</SelectItem>
          <SelectItem value="50">50</SelectItem>
          <SelectItem value="100">100</SelectItem>
        </SelectContent>
      </Select>
      <span className="text-sm text-slate-500 hidden sm:block">per page</span>
    </div>
  );
}
