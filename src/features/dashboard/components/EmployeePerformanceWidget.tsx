"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmployeePerformanceItem } from "@/features/report/types/report.types";

interface EmployeePerformanceWidgetProps {
  data: EmployeePerformanceItem[];
  loading?: boolean;
  subtitle?: string;
}

/**
 * EmployeePerformanceWidget — top employees bar chart for dashboard.
 * Shows top 5 employees by total jobs done.
 */
export function EmployeePerformanceWidget({
  data,
  loading = false,
  subtitle,
}: EmployeePerformanceWidgetProps) {
  if (loading) {
    return (
      <Card className="col-span-1 shadow-sm border-none">
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48 mt-1" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-52 w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  // Take top 5 sorted by totalJobsDone
  const chartData = [...data]
    .sort((a, b) => b.totalJobsDone - a.totalJobsDone)
    .slice(0, 5)
    .map((emp) => ({
      name: emp.fullName.split(" ")[0], // First name for brevity
      jobs: emp.totalJobsDone,
    }));

  return (
    <Card className="col-span-1 shadow-sm border-none">
      <CardHeader>
        <CardTitle className="text-base">Top Employees</CardTitle>
        <CardDescription>
          {subtitle ?? "Based on completed jobs today"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-52 flex items-center justify-center text-slate-400 text-sm">
            No employee data available.
          </div>
        ) : (
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 0, right: 30, left: 20, bottom: 0 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={80}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(val) => [`${val} jobs`, "Jobs"]}
                />
                <Bar
                  dataKey="jobs"
                  fill="#4f46e5"
                  radius={[0, 4, 4, 0]}
                  barSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
