"use client";

import { Calendar, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReportPeriod } from "@/features/report/types/report.types";

// Sales Filter Bar
interface SalesFilterBarProps {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  outletId?: string;
  outlets?: Array<{ id: string; name: string }>;
  showOutletFilter?: boolean;
  onPeriodChange: (v: ReportPeriod) => void;
  onStartDateChange: (v: string) => void;
  onEndDateChange: (v: string) => void;
  onOutletChange?: (v: string) => void;
  onRefresh: () => void;
  loading?: boolean;
}

export function SalesFilterBar({
  period,
  startDate,
  endDate,
  outletId = "all",
  outlets = [],
  showOutletFilter = false,
  onPeriodChange,
  onStartDateChange,
  onEndDateChange,
  onOutletChange,
  onRefresh,
  loading,
}: SalesFilterBarProps) {
  const handleOutletChange = onOutletChange ?? (() => {});

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Period */}
      <Select
        value={period}
        onValueChange={(v) => onPeriodChange(v as ReportPeriod)}
      >
        <SelectTrigger className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
          <SelectItem value="yearly">Yearly</SelectItem>
        </SelectContent>
      </Select>

      {/* Date Range */}
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
        <Input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="w-40"
        />
        <span className="text-slate-400 text-sm">–</span>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="w-40"
        />
      </div>

      {/* Outlet (Super Admin only) */}
      {showOutletFilter && (
        <Select value={outletId} onValueChange={handleOutletChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Outlets" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">🌐 All Outlets</SelectItem>
            {outlets.map((o) => (
              <SelectItem key={o.id} value={o.id}>
                📍 {o.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={loading}
        className="gap-2"
      >
        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        Refresh
      </Button>
    </div>
  );
}

// Employee Filter Bar
interface EmployeeFilterBarProps {
  startDate: string;
  endDate: string;
  outletId?: string;
  roleFilter: string;
  outlets?: Array<{ id: string; name: string }>;
  showOutletFilter?: boolean;
  onStartDateChange: (v: string) => void;
  onEndDateChange: (v: string) => void;
  onOutletChange?: (v: string) => void;
  onRoleChange: (v: string) => void;
  onRefresh: () => void;
  loading?: boolean;
}

export function EmployeeFilterBar({
  startDate,
  endDate,
  outletId = "all",
  roleFilter,
  outlets = [],
  showOutletFilter = false,
  onStartDateChange,
  onEndDateChange,
  onOutletChange,
  onRoleChange,
  onRefresh,
  loading,
}: EmployeeFilterBarProps) {
  const handleOutletChange = onOutletChange ?? (() => {});
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Date Range */}
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
        <Input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="w-40"
        />
        <span className="text-slate-400 text-sm">–</span>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="w-40"
        />
      </div>

      {/* Role Filter */}
      <Select value={roleFilter} onValueChange={onRoleChange}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder="All Roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="WORKER_WASHING">Washing Worker</SelectItem>
          <SelectItem value="WORKER_IRONING">Ironing Worker</SelectItem>
          <SelectItem value="WORKER_PACKING">Packing Worker</SelectItem>
          <SelectItem value="DRIVER">Driver</SelectItem>
        </SelectContent>
      </Select>

      {/* Outlet (Super Admin only) */}
      {showOutletFilter && (
        <Select value={outletId} onValueChange={handleOutletChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Outlets" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">🌐 All Outlets</SelectItem>
            {outlets.map((o) => (
              <SelectItem key={o.id} value={o.id}>
                📍 {o.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={loading}
        className="gap-2"
      >
        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        Refresh
      </Button>
    </div>
  );
}
