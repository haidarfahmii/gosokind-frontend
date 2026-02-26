"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardRevenuePoint } from "@/features/dashboard/types/dashboard.types";
import { formatCurrency } from "@/utils/formatters";

interface DashboardRevenueChartProps {
  data: DashboardRevenuePoint[];
  loading?: boolean;
  subtitle?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 text-white rounded-lg p-3 text-xs shadow-lg space-y-1 min-w-36">
      <p className="font-semibold text-slate-200 mb-1">{label}</p>
      <div className="flex justify-between gap-4">
        <span className="text-indigo-300">Revenue</span>
        <span className="font-medium">
          {formatCurrency(payload[0]?.value ?? 0)}
        </span>
      </div>
      {payload[1] && (
        <div className="flex justify-between gap-4">
          <span className="text-emerald-300">Orders</span>
          <span className="font-medium">{payload[1]?.value ?? 0}</span>
        </div>
      )}
    </div>
  );
};

/**
 * DashboardRevenueChart — monthly revenue trend chart for dashboard widgets.
 * Reused by both Super Admin and Outlet Admin dashboards.
 */
export function DashboardRevenueChart({
  data,
  loading = false,
  subtitle,
}: DashboardRevenueChartProps) {
  if (loading) {
    return (
      <Card className="shadow-sm border-none col-span-1 lg:col-span-2">
        <CardHeader>
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-64 mt-1" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-72 w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-none col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-base">Monthly Revenue Trend</CardTitle>
        <CardDescription>
          {subtitle ?? "Income analysis for the last 6 months"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-72 flex items-center justify-center text-slate-400 text-sm">
            No revenue data available for this period.
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 12 }}
                  stroke="#94a3b8"
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  stroke="#94a3b8"
                  tickLine={false}
                  tickFormatter={(v) =>
                    v >= 1_000_000
                      ? `${(v / 1_000_000).toFixed(1)}M`
                      : v >= 1_000
                        ? `${(v / 1_000).toFixed(0)}K`
                        : String(v)
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="totalRevenue"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
