"use client";

import {
  Package,
  Users,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/features/dashboard/components/StatsCard";
import { DashboardRevenueChart } from "@/features/dashboard/components/DashboardRevenueChart";
import { RecentOrdersWidget } from "@/features/dashboard/components/RecentOrdersWidget";
import { SystemAlertsWidget } from "@/features/dashboard/components/SystemAlertsWidget";
import { useOutletAdminDashboard } from "@/features/dashboard/hooks/useOutletAdminDashboard";
import { useBypassRequests } from "@/features/order/hooks/useBypassRequests";
import { useEmployees } from "@/features/outlet-admin/hooks/useEmployees";
import { formatCurrency } from "@/utils/formatters";

export default function OutletAdminDashboard() {
  const { data: session } = useSession();
  const {
    stats,
    recentOrders,
    revenueData,
    loadingStats,
    loadingOrders,
    loadingRevenue,
    refetch,
  } = useOutletAdminDashboard();

  const { bypassRequests, loading: loadingBypass } = useBypassRequests();

  const {
    employees,
    stats: empStats,
    loading: loadingEmployees,
  } = useEmployees();

  const completionRate =
    stats && stats.totalOrders > 0
      ? `${((stats.completedToday / stats.totalOrders) * 100).toFixed(0)}% done`
      : undefined;

  const pendingBypassCount = bypassRequests.filter(
    (r) => r.status === "PENDING",
  ).length;

  const isLoading = loadingStats && !stats;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 mt-1">
            Welcome back,{" "}
            <span className="font-semibold text-slate-700">
              {session?.user?.name ?? "Admin"}
            </span>
            ! Here's what's happening today.
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2 text-slate-600"
          onClick={refetch}
          disabled={loadingStats}
        >
          <RefreshCw
            className={`w-4 h-4 ${loadingStats ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Today's Orders"
          value={stats?.totalOrders ?? 0}
          change="+12% from yesterday"
          changePositive
          icon={Package}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          loading={isLoading}
        />
        <StatsCard
          label="Pending Orders"
          value={stats?.pendingOrders ?? 0}
          icon={Clock}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
          loading={isLoading}
        />
        <StatsCard
          label="Completed Today"
          value={stats?.completedToday ?? 0}
          change={completionRate}
          changePositive
          icon={CheckCircle2}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          loading={isLoading}
        />
        <StatsCard
          label="Today's Revenue"
          value={
            stats?.todayRevenue ? formatCurrency(stats.todayRevenue) : "Rp 0"
          }
          change="+8% from yesterday"
          changePositive
          icon={DollarSign}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
          loading={isLoading}
        />
      </div>

      {/* Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardRevenueChart
          data={revenueData}
          loading={loadingRevenue}
          subtitle="Monthly revenue trend for your outlet"
        />
      </div>

      {/* Quick Actions + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
            <CardDescription>Common tasks for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Package className="mr-2 h-4 w-4" />
              Create New Order
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Manage Staff
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Process Pending Orders
            </Button>
          </CardContent>
        </Card>

        {/* Alerts */}
        <SystemAlertsWidget
          pendingRequests={pendingBypassCount}
          pendingOrders={stats?.pendingOrders ?? 0}
        />
      </div>

      {/* Recent Orders */}
      <RecentOrdersWidget
        orders={recentOrders}
        loading={loadingOrders}
        viewAllHref="/admin/outlet-admin/orders"
        showOutlet={false}
        subtitle="Latest orders from your outlet"
      />

      {/* Active Staff Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Active Staff Today</CardTitle>
            <CardDescription>
              {loadingEmployees
                ? "Loading..."
                : `${empStats?.active ?? stats?.activeEmployees ?? 0} employees currently working`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingEmployees ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-16 bg-slate-100 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {/* Group employees by role */}
                {buildRoleGroups(
                  empStats?.byRole ?? {},
                  stats?.activeEmployees ?? 0,
                ).map((group) => (
                  <div
                    key={group.role}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-full ${group.bg} flex items-center justify-center`}
                      >
                        <Users className={`h-5 w-5 ${group.color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{group.label}</p>
                        <p className="text-xs text-slate-500">
                          {group.count} active
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700"
                    >
                      Active
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper: build role group summary
function buildRoleGroups(
  byRole: Record<string, number>,
  fallbackTotal: number,
) {
  const roleConfig: Record<
    string,
    { label: string; bg: string; color: string }
  > = {
    WORKER_WASHING: {
      label: "Washing Team",
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    WORKER_IRONING: {
      label: "Ironing Team",
      bg: "bg-orange-100",
      color: "text-orange-600",
    },
    WORKER_PACKING: {
      label: "Packing Team",
      bg: "bg-purple-100",
      color: "text-purple-600",
    },
    DRIVER: { label: "Drivers", bg: "bg-green-100", color: "text-green-600" },
  };

  const groups = Object.entries(byRole)
    .filter(([role]) => role in roleConfig)
    .map(([role, count]) => ({
      role,
      count,
      ...roleConfig[role],
    }));

  // Fallback if no data
  if (groups.length === 0 && fallbackTotal > 0) {
    return [
      {
        role: "ALL",
        label: "All Staff",
        count: fallbackTotal,
        bg: "bg-blue-100",
        color: "text-blue-600",
      },
    ];
  }

  return groups;
}
