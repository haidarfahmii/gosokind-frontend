"use client";

import { Clock, Cog, PackageCheck, Truck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSuperAdminDashboard } from "@/features/dashboard/hooks/useSuperAdminDashboard";
import { useOutletFilter } from "@/hooks/useOutletFilter";
import { useBypassRequests } from "@/features/order/hooks/useBypassRequests";
import { StatsCard } from "@/features/dashboard/components/StatsCard";
import { TodaysDeliveryWidget } from "@/features/dashboard/components/TodaysDeliveryWidget";
import { OverviewPieChart } from "@/features/dashboard/components/OverviewPieChart";
import { BypassRequestsWidget } from "@/features/dashboard/components/BypassRequestsWidget";
import { SystemAlertsWidget } from "@/features/dashboard/components/SystemAlertsWidget";
import { BypassRequestDialog } from "@/features/order/components/bypass-request/BypassRequestDialog";
import { useState } from "react";

export default function SuperAdminDashboardPage() {
  const { selectedOutletId, outlets } = useOutletFilter();
  const [isBypassDialogOpen, setIsBypassDialogOpen] = useState(false);

  const { stats, loadingStats, refetch } = useSuperAdminDashboard();

  const {
    bypassRequests,
    loading: loadingBypass,
    pagination: bypassPagination,
    handlePageChange: handleBypassPage,
    handleBypassRequest,
  } = useBypassRequests(
    selectedOutletId !== "all" ? selectedOutletId : undefined,
  );

  const selectedOutletName =
    selectedOutletId === "all"
      ? "All Outlets"
      : (outlets.find((o) => o.id === selectedOutletId)?.name ??
        "Unknown Outlet");

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Operational Overview
          </h1>
          <p className="text-slate-500 text-sm">
            Monitor laundry order pipeline, bypass requests, and alerts
            {selectedOutletId !== "all" && (
              <span className="font-semibold text-blue-600">
                {" "}
                — {selectedOutletName}
              </span>
            )}
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2 text-slate-600 self-start"
          onClick={refetch}
          disabled={loadingStats}
        >
          <RefreshCw
            className={`w-4 h-4 ${loadingStats ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {selectedOutletId !== "all" && (
        <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">🔍 Filtered View:</span> Showing
            data for <span className="font-bold">{selectedOutletName}</span>{" "}
            only.
          </p>
        </div>
      )}

      {/* Row 1: pipeline stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          label="Pending Orders"
          value={stats?.pendingOrders ?? 0}
          icon={Clock}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          loading={isLoading}
        />
        <StatsCard
          label="Processing Orders"
          value={stats?.processingOrders ?? 0}
          icon={Cog}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          loading={isLoading}
        />
        <StatsCard
          label="Ready To Delivery"
          value={stats?.readyToDelivery ?? 0}
          icon={PackageCheck}
          iconBg="bg-violet-100"
          iconColor="text-violet-600"
          loading={isLoading}
        />
        <StatsCard
          label="Delivered Orders"
          value={stats?.deliveredOrders ?? 0}
          icon={Truck}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
          loading={isLoading}
        />
      </div>

      {/* Row 2: Today's Delivery table + Overview pie chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <TodaysDeliveryWidget
            outletId={selectedOutletId}
            showOutlet={selectedOutletId === "all"}
            subtitle={
              selectedOutletId !== "all"
                ? `Today's orders — ${selectedOutletName}`
                : "Today's orders across all outlets"
            }
          />
        </div>
        <div className="lg:col-span-1">
          <OverviewPieChart
            stats={stats}
            loading={isLoading}
            subtitle={
              selectedOutletId !== "all"
                ? `Pipeline — ${selectedOutletName}`
                : "Order pipeline across all outlets"
            }
          />
        </div>
      </div>

      {/* Row 3: Bypass Requests + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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
