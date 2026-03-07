"use client";

import { X, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrderStatus } from "@/features/order/types/order.types";

interface OrderFiltersProps {
  selectedStatus: string;
  selectedOutlet: string;
  startDate: string;
  endDate: string;
  onStatusChange: (value: string) => void;
  onOutletChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onClearFilters: () => void;
  outlets: Array<{ id: string; name: string }>;
  itemsPerPage?: number;
  onItemsPerPageChange?: (limit: number) => void;
  showOutletFilter?: boolean; // Hide untuk outlet admin
}

export function OrderFilters({
  selectedStatus,
  selectedOutlet,
  startDate,
  endDate,
  onStatusChange,
  onOutletChange,
  onStartDateChange,
  onEndDateChange,
  onClearFilters,
  outlets,
  itemsPerPage = 10,
  onItemsPerPageChange,
  showOutletFilter = true,
}: OrderFiltersProps) {
  const hasActiveFilters =
    selectedStatus !== "all" ||
    selectedOutlet !== "all" ||
    startDate ||
    endDate;

  return (
    <div className="space-y-3">
      {/* First Row: Status & Outlet Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        {/* Status Filter */}
        <Select value={selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value={OrderStatus.WAITING_FOR_PICKUP}>
              Waiting Pickup
            </SelectItem>
            <SelectItem value={OrderStatus.PICKUP_ON_THE_WAY}>
              Pickup in Progress
            </SelectItem>
            <SelectItem value={OrderStatus.ARRIVED_AT_OUTLET}>
              Arrived at Outlet
            </SelectItem>
            <SelectItem value={OrderStatus.WASHING}>Washing</SelectItem>
            <SelectItem value={OrderStatus.IRONING}>Ironing</SelectItem>
            <SelectItem value={OrderStatus.PACKING}>Packing</SelectItem>
            <SelectItem value={OrderStatus.WAITING_FOR_PAYMENT}>
              Waiting Payment
            </SelectItem>
            <SelectItem value={OrderStatus.READY_FOR_DELIVERY}>
              Ready for Delivery
            </SelectItem>
            <SelectItem value={OrderStatus.DELIVERY_ON_THE_WAY}>
              Delivery in Progress
            </SelectItem>
            <SelectItem value={OrderStatus.RECEIVED_BY_CUSTOMER}>
              Received by Customer
            </SelectItem>
            <SelectItem value={OrderStatus.COMPLETED}>Completed</SelectItem>
          </SelectContent>
        </Select>

        {/* Outlet Filter - Only shown for Super Admin */}
        {showOutletFilter && (
          <Select value={selectedOutlet} onValueChange={onOutletChange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Select Outlet" />
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
        )}

        {/* Second Row: Date Range Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Calendar className="w-4 h-4 text-slate-500" />
            <Input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              placeholder="Start Date"
              className="w-full sm:w-44"
            />
          </div>
          <span className="text-slate-500 text-sm hidden sm:block">to</span>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            placeholder="End Date"
            className="w-full sm:w-44"
          />
        </div>

        {/* <div className="flex-1" /> */}

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
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
