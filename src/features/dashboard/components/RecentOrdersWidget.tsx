"use client";

import Link from "next/link";
import { MoreVertical } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardRecentOrder } from "@/features/dashboard/types/dashboard.types";
import { formatCurrency } from "@/utils/formatters";
import { getStatusConfig } from "@/features/order/types/order.types";
import { format } from "date-fns";

interface RecentOrdersWidgetProps {
  orders: DashboardRecentOrder[];
  loading?: boolean;
  viewAllHref: string;
  showOutlet?: boolean;
  subtitle?: string;
}

/**
 * RecentOrdersWidget — compact recent orders table for dashboard.
 * Reused by both Super Admin and Outlet Admin dashboards.
 */
export function RecentOrdersWidget({
  orders,
  loading = false,
  viewAllHref,
  showOutlet = false,
  subtitle,
}: RecentOrdersWidgetProps) {
  if (loading) {
    return (
      <Card className="shadow-sm border-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-52" />
          </div>
          <Skeleton className="h-8 w-16" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">Recent Laundry Orders</CardTitle>
          <CardDescription>
            {subtitle ?? "Real-time order statuses"}
          </CardDescription>
        </div>
        <Button variant="ghost" className="text-blue-600 text-sm" asChild>
          <Link href={viewAllHref}>View All</Link>
        </Button>
      </CardHeader>

      {orders.length === 0 ? (
        <CardContent>
          <div className="h-24 flex items-center justify-center text-slate-400 text-sm">
            No orders yet today.
          </div>
        </CardContent>
      ) : (
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              {showOutlet && <TableHead>Outlet</TableHead>}
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const statusCfg = getStatusConfig(order.status as any);
              return (
                <TableRow key={order.id} className="hover:bg-slate-50/50">
                  <TableCell>
                    <div>
                      <p className="font-semibold text-blue-600 text-sm">
                        {order.orderNumber}
                      </p>
                      <p className="text-xs text-slate-400">
                        {format(new Date(order.createdAt), "dd MMM, HH:mm")}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-slate-700 text-sm">
                    {order.customerName}
                  </TableCell>
                  {showOutlet && (
                    <TableCell className="text-sm text-slate-600">
                      {order.outletName ?? "-"}
                    </TableCell>
                  )}
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`${statusCfg?.bgColor ?? "bg-slate-100"} ${statusCfg?.color ?? "text-slate-700"} border-none text-xs`}
                    >
                      {statusCfg?.label ?? order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-xs font-bold ${
                        order.isPaid ? "text-green-600" : "text-orange-500"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Unpaid"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium text-slate-700">
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
      )}
    </Card>
  );
}
