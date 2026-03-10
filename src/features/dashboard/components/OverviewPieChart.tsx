"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardStats } from "@/features/dashboard/types/dashboard.types";

interface OverviewPieChartProps {
  stats: DashboardStats | null;
  loading?: boolean;
  subtitle?: string;
}

const SEGMENTS = [
  {
    key: "pendingOrders" as keyof DashboardStats,
    label: "Pending",
    color: "#f59e0b",
    bg: "bg-amber-100",
    text: "text-amber-700",
  },
  {
    key: "processingOrders" as keyof DashboardStats,
    label: "Processing",
    color: "#3b82f6",
    bg: "bg-blue-100",
    text: "text-blue-700",
  },
  {
    key: "readyToDelivery" as keyof DashboardStats,
    label: "Ready To Delivery",
    color: "#8b5cf6",
    bg: "bg-violet-100",
    text: "text-violet-700",
  },
  {
    key: "deliveredOrders" as keyof DashboardStats,
    label: "Delivered",
    color: "#10b981",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
  },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 text-white rounded-lg px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-slate-200">{payload[0].name}</p>
      <p className="text-slate-300 mt-0.5">
        {payload[0].value} order{payload[0].value !== 1 ? "s" : ""}
      </p>
    </div>
  );
};

export function OverviewPieChart({
  stats,
  loading = false,
  subtitle,
}: OverviewPieChartProps) {
  if (loading || !stats) {
    return (
      <Card className="shadow-sm border-none">
        <CardHeader>
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-44 mt-1" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-52 w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  const chartData = SEGMENTS.map((seg) => ({
    name: seg.label,
    value: (stats[seg.key] as number) ?? 0,
    color: seg.color,
  }));

  const total = chartData.reduce((s, d) => s + d.value, 0);

  return (
    <Card className="shadow-sm border-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Overview</CardTitle>
        <CardDescription>
          {subtitle ?? `${total} total active orders`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Donut chart */}
        <div className="relative h-44 w-full">
          {total === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
              No order data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}

          {total > 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-slate-800">{total}</span>
              <span className="text-[11px] text-slate-400 font-medium">
                Total Orders
              </span>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 space-y-2">
          {SEGMENTS.map((seg) => {
            const value = (stats[seg.key] as number) ?? 0;
            const pct = total > 0 ? Math.round((value / total) * 100) : 0;
            return (
              <div key={seg.key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="text-xs text-slate-600">{seg.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-1.5 py-0.5 rounded ${seg.bg} ${seg.text}`}
                  >
                    {value}
                  </span>
                  <span className="text-[11px] text-slate-400 w-8 text-right">
                    {pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
