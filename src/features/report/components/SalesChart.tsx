"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { SalesDataPoint, ReportPeriod } from "../types/report.types";
import { formatCurrency, formatAxisCurrency } from "@/utils/formatters";

interface SalesChartProps {
  data: SalesDataPoint[];
  period: ReportPeriod;
  outletName?: string | null;
  loading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 text-white rounded-lg p-3 text-xs shadow-lg space-y-1 min-w-40">
      <p className="font-semibold text-slate-200 mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex justify-between gap-4">
          <span style={{ color: entry.color }}>{entry.name}</span>
          <span className="font-medium">
            {entry.dataKey === "totalRevenue"
              ? formatCurrency(entry.value)
              : entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export function SalesChart({
  data,
  period,
  outletName,
  loading,
}: SalesChartProps) {
  const periodLabel =
    period === "daily" ? "Day" : period === "monthly" ? "Month" : "Year";

  const description = outletName
    ? `Revenue & orders per ${periodLabel.toLowerCase()} · ${outletName}`
    : `Revenue & orders per ${periodLabel.toLowerCase()} · All Outlets`;

  if (loading) {
    return (
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="h-72 flex items-center justify-center">
            <div className="animate-pulse w-full h-full bg-slate-100 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Revenue Trend</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72 flex items-center justify-center text-slate-400 text-sm">
            No data available for the selected period.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Revenue Area Chart */}
      <Card className="border-none shadow-sm lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Revenue Trend</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  stroke="#e2e8f0"
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={formatAxisCurrency}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  stroke="#e2e8f0"
                  tickLine={false}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="totalRevenue"
                  name="Revenue"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Orders Bar Chart */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Orders Overview</CardTitle>
          <CardDescription>
            Total vs paid orders per {periodLabel.toLowerCase()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  stroke="#e2e8f0"
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  stroke="#e2e8f0"
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                />
                <Bar
                  dataKey="totalOrders"
                  name="Total Orders"
                  fill="#cbd5e1"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="paidOrders"
                  name="Paid Orders"
                  fill="#4f46e5"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
