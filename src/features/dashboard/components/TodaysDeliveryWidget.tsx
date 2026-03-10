"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Filter, RefreshCw } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  dashboardService,
  DELIVERY_FILTER_OPTIONS,
} from "@/features/dashboard/services/dashboard.service";
import { DashboardRecentOrder } from "@/features/dashboard/types/dashboard.types";
import { getStatusConfig } from "@/features/order/types/order.types";
import { formatCurrency } from "@/utils/formatters";
import { format } from "date-fns";
import { useDebounce } from "@/hooks/useDebounce";

interface TodaysDeliveryWidgetProps {
  outletId?: string;
  showOutlet?: boolean;
  subtitle?: string;
}

export function TodaysDeliveryWidget({
  outletId,
  showOutlet = false,
  subtitle,
}: TodaysDeliveryWidgetProps) {
  const [orders, setOrders] = useState<DashboardRecentOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const debouncedSearch = useDebounce(search, 350);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const result = await dashboardService.getTodaysDeliveryOrders({
        outletId,
        search: debouncedSearch || undefined,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        limit: 8,
      });
      setOrders(result.orders);
      setTotal(result.total);
    } catch (err) {
      console.error("Failed to fetch today's delivery orders:", err);
    } finally {
      setLoading(false);
    }
  }, [outletId, debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <Card className="shadow-sm border-none flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Today's Delivery</CardTitle>
            <CardDescription>
              {subtitle ?? `${total} order${total !== 1 ? "s" : ""} today`}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchOrders}
            disabled={loading}
            className="h-8 w-8 text-slate-500 hover:text-slate-700"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {/* Search + Filter */}
        <div className="flex gap-2 pt-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Search order / customer..."
              className="pl-8 h-8 text-sm bg-slate-50 border-slate-200 focus-visible:ring-1 focus-visible:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 h-8 text-sm bg-slate-50 border-slate-200 gap-1.5">
              <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              {DELIVERY_FILTER_OPTIONS.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="text-sm"
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 overflow-hidden">
        {loading ? (
          <div className="px-6 space-y-3 py-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="h-40 flex flex-col items-center justify-center gap-2 text-slate-400">
            <Search className="w-8 h-8 text-slate-300" />
            <p className="text-sm">No orders found for today.</p>
          </div>
        ) : (
          <div className="overflow-auto max-h-72">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0">
                <TableRow>
                  <TableHead className="text-xs">Order</TableHead>
                  <TableHead className="text-xs">Customer</TableHead>
                  {showOutlet && (
                    <TableHead className="text-xs">Outlet</TableHead>
                  )}
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const statusCfg = getStatusConfig(order.status as any);
                  return (
                    <TableRow key={order.id} className="hover:bg-slate-50/50">
                      <TableCell className="py-2.5">
                        <p className="font-semibold text-blue-600 text-sm leading-tight">
                          {order.orderNumber}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {format(new Date(order.createdAt), "HH:mm")}
                        </p>
                      </TableCell>
                      <TableCell className="text-sm text-slate-700 py-2.5">
                        {order.customerName}
                      </TableCell>
                      {showOutlet && (
                        <TableCell className="text-sm text-slate-600 py-2.5">
                          {order.outletName ?? "-"}
                        </TableCell>
                      )}
                      <TableCell className="py-2.5">
                        <Badge
                          variant="secondary"
                          className={`${statusCfg?.bgColor ?? "bg-slate-100"} ${statusCfg?.color ?? "text-slate-700"} border-none text-[11px] px-2 py-0.5`}
                        >
                          {statusCfg?.label ?? order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium text-slate-700 py-2.5">
                        {order.totalPrice
                          ? formatCurrency(order.totalPrice)
                          : order.totalWeight
                            ? `${order.totalWeight} kg`
                            : "-"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
