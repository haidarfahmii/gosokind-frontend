"use client";

import { Suspense } from "react";
import { Clock, Cog, PackageCheck, Truck, RefreshCw } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/features/dashboard/components/StatsCard";
import { TodaysDeliveryWidget } from "@/features/dashboard/components/TodaysDeliveryWidget";
import { OverviewPieChart } from "@/features/dashboard/components/OverviewPieChart";
import { BypassRequestsWidget } from "@/features/dashboard/components/BypassRequestsWidget";
import { SystemAlertsWidget } from "@/features/dashboard/components/SystemAlertsWidget";
import { useOutletAdminDashboard } from "@/features/dashboard/hooks/useOutletAdminDashboard";
import { useBypassRequests } from "@/features/order/hooks/useBypassRequests";

function OutletAdminDashboardContent() {
  const { data: session } = useSession();
  const { stats, loadingStats, refetch } = useOutletAdminDashboard();
  const { bypassRequests, loading: loadingBypass } = useBypassRequests();

  const pendingBypassCount = bypassRequests.filter(
    (r) => r.status === "PENDING",
  ).length;

  const isLoading = loadingStats && !stats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm">
            Welcome back,{" "}
            <span className="font-semibold text-slate-700">
              {session?.user?.name ?? "Admin"}
            </span>{" "}
            — here's your outlet overview for today.
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
            showOutlet={false}
            subtitle="Today's orders from your outlet"
          />
        </div>
        <div className="lg:col-span-1">
          <OverviewPieChart
            stats={stats}
            loading={isLoading}
            subtitle="Your outlet's order pipeline"
          />
        </div>
      </div>

      {/* Row 3: Bypass Requests + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <BypassRequestsWidget
          requests={bypassRequests}
          loading={loadingBypass}
          subtitle="Workers needing your approval"
          onApprove={() => {}}
          onReject={() => {}}
        />
        <SystemAlertsWidget
          pendingRequests={pendingBypassCount}
          pendingOrders={stats?.pendingOrders ?? 0}
        />
      </div>
    </div>
  );
}

export default function OutletAdminDashboard() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <OutletAdminDashboardContent />
    </Suspense>
  );
}
