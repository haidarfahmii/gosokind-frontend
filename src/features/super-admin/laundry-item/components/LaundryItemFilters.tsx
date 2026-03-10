"use client";

import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { CATEGORY_OPTIONS } from "../types";

interface LaundryItemFiltersProps {
  search: string;
  filterCategory: string;
  filterPricingType: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onPricingTypeChange: (value: string) => void;
  onClearFilters: () => void;
  itemsPerPage?: number;
  onItemsPerPageChange?: (limit: number) => void;
}

export function LaundryItemFilters({
  search,
  filterCategory,
  filterPricingType,
  onSearchChange,
  onCategoryChange,
  onPricingTypeChange,
  onClearFilters,
  itemsPerPage = 10,
  onItemsPerPageChange,
}: LaundryItemFiltersProps) {
  const hasActiveFilters =
    search !== "" || filterCategory !== "all" || filterPricingType !== "all";

  return (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 w-full">
      {/* Search */}
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Cari nama item..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex items-center gap-2">
        {/* Category Filter */}
        <Select value={filterCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Semua Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {CATEGORY_OPTIONS.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Pricing Type Filter */}
        <Select value={filterPricingType} onValueChange={onPricingTypeChange}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Semua Tipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tipe</SelectItem>
            <SelectItem value="WEIGHT">Kiloan</SelectItem>
            <SelectItem value="ITEM">Satuan</SelectItem>
          </SelectContent>
        </Select>

        {/* Items Per Page */}
        {onItemsPerPageChange && (
          <Select
            value={String(itemsPerPage)}
            onValueChange={(val) => onItemsPerPageChange(Number(val))}
          >
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 / page</SelectItem>
              <SelectItem value="10">10 / page</SelectItem>
              <SelectItem value="20">20 / page</SelectItem>
              <SelectItem value="50">50 / page</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="gap-2 shrink-0"
          >
            <X className="w-4 h-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
