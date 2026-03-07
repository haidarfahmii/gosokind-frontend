"use client";

import {
  Store,
  Users,
  Shirt,
  Calendar,
  RefreshCw,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSuperAdminDashboard } from "@/features/dashboard/hooks/useSuperAdminDashboard";
import { useOutletFilter } from "@/hooks/useOutletFilter";
import { useBypassRequests } from "@/features/order/hooks/useBypassRequests";
import { useEmployeePerformance } from "@/features/report/hooks/useEmployeePerformance";
import { StatsCard } from "@/features/dashboard/components/StatsCard";
import { DashboardRevenueChart } from "@/features/dashboard/components/DashboardRevenueChart";
import { RecentOrdersWidget } from "@/features/dashboard/components/RecentOrdersWidget";
import { BypassRequestsWidget } from "@/features/dashboard/components/BypassRequestsWidget";
import { EmployeePerformanceWidget } from "@/features/dashboard/components/EmployeePerformanceWidget";
import { SystemAlertsWidget } from "@/features/dashboard/components/SystemAlertsWidget";
import { BypassRequestDialog } from "@/features/order/components/bypass-request/BypassRequestDialog";
import { useState } from "react";
import { formatCurrency } from "@/utils/formatters";

export default function SuperAdminDashboardPage() {
  const { selectedOutletId, outlets } = useOutletFilter();
  const [isBypassDialogOpen, setIsBypassDialogOpen] = useState(false);
  const {
    stats,
    recentOrders,
    revenueData,
    loadingStats,
    loadingOrders,
    loadingRevenue,
    refetch,
  } = useSuperAdminDashboard();

  const {
    bypassRequests,
    loading: loadingBypass,
    pagination: bypassPagination,
    handlePageChange: handleBypassPage,
    handleBypassRequest,
  } = useBypassRequests(
    selectedOutletId !== "all" ? selectedOutletId : undefined,
  );

  const { paginatedData: topEmployees, loading: loadingEmployees } =
    useEmployeePerformance(selectedOutletId);

  // Derived display values
  const selectedOutletName =
    selectedOutletId === "all"
      ? "All Outlets"
      : (outlets.find((o) => o.id === selectedOutletId)?.name ??
        "Unknown Outlet");

  const completionRate =
    stats && stats.totalOrders > 0
      ? `${((stats.completedToday / stats.totalOrders) * 100).toFixed(0)}% done`
      : undefined;

  // Bypass handlers
  const handleApprove = async (id: string, note?: string) => {
    await handleBypassRequest(id, "APPROVED", note);
    refetch();
  };

  const handleReject = async (id: string, note: string) => {
    await handleBypassRequest(id, "REJECTED", note);
    refetch();
  };

  const isLoading = loadingStats && !stats;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Operational Overview
          </h1>
          <p className="text-slate-500 text-sm">
            Monitor laundry status, requests, and revenue
            {selectedOutletId !== "all" && (
              <span className="font-semibold text-blue-600">
                {" "}
                — {selectedOutletName}
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-3">
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
          <Button variant="outline" className="gap-2 text-slate-600">
            <Calendar className="w-4 h-4" /> Date Filter
          </Button>
        </div>
      </div>

      {/* Active Filter Banner */}
      {selectedOutletId !== "all" && (
        <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">🔍 Filtered View:</span> Dashboard
            data is currently filtered to show{" "}
            <span className="font-bold">{selectedOutletName}</span> only.
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Statistics, orders, and reports below reflect this outlet's data.
          </p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Total Outlets"
          value={stats?.totalOutlets ?? 0}
          icon={Store}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          loading={isLoading}
        />
        <StatsCard
          label="Total Employees"
          value={stats?.totalEmployees ?? 0}
          icon={Users}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          loading={isLoading}
        />
        <StatsCard
          label="Orders Today"
          value={stats?.totalOrders ?? 0}
          change={completionRate}
          changePositive
          icon={ShoppingBag}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          loading={isLoading}
        />
        <StatsCard
          label="Today's Revenue"
          value={
            stats?.todayRevenue ? formatCurrency(stats.todayRevenue) : "Rp 0"
          }
          icon={DollarSign}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
          loading={isLoading}
        />
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          label="Pending Orders"
          value={stats?.pendingOrders ?? 0}
          icon={AlertCircle}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
          loading={isLoading}
        />
        <StatsCard
          label="Completed Today"
          value={stats?.completedToday ?? 0}
          icon={TrendingUp}
          iconBg="bg-teal-100"
          iconColor="text-teal-600"
          loading={isLoading}
        />
        <StatsCard
          label="Active Employees"
          value={stats?.activeEmployees ?? 0}
          icon={Users}
          iconBg="bg-indigo-100"
          iconColor="text-indigo-600"
          loading={isLoading}
        />
      </div>

      {/* Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardRevenueChart
          data={revenueData}
          loading={loadingRevenue}
          subtitle={
            selectedOutletId !== "all"
              ? `Income analysis — ${selectedOutletName}`
              : "Income analysis for the last 6 months"
          }
        />
      </div>

      {/* Bypass Requests + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BypassRequestsWidget
          requests={bypassRequests}
          loading={loadingBypass}
          subtitle={
            selectedOutletId !== "all"
              ? `Workers needing approval — ${selectedOutletName}`
              : "Workers needing approval"
          }
          onApprove={(id) => handleApprove(id)}
          onReject={(id) => handleReject(id, "Rejected by admin")}
          onViewAll={() => setIsBypassDialogOpen(true)}
        />
        <SystemAlertsWidget
          pendingRequests={stats?.pendingBypassRequests ?? 0}
          pendingOrders={stats?.pendingOrders ?? 0}
        />
      </div>

      {/* Employee Leaderboard + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <EmployeePerformanceWidget
          data={topEmployees}
          loading={loadingEmployees}
          subtitle={
            selectedOutletId !== "all"
              ? `Based on jobs — ${selectedOutletName}`
              : "Based on completed jobs this month"
          }
        />
        <div className="col-span-1 lg:col-span-2">
          <RecentOrdersWidget
            orders={recentOrders}
            loading={loadingOrders}
            viewAllHref="/admin/super-admin/orders"
            showOutlet
            subtitle={
              selectedOutletId !== "all"
                ? `Real-time — ${selectedOutletName}`
                : "Real-time order statuses"
            }
          />
        </div>
      </div>

      {/* Bypass Dialog */}
      <BypassRequestDialog
        open={isBypassDialogOpen}
        onOpenChange={setIsBypassDialogOpen}
        bypassRequests={bypassRequests}
        loading={loadingBypass}
        pagination={bypassPagination}
        onPageChange={handleBypassPage}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
