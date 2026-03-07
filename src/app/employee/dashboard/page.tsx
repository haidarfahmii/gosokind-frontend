"use client";

import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import AttendanceDashboard from "@/features/employee/components/attendance/AttendanceDashboard";
import AttendanceHistoryView from "@/features/employee/components/attendance/AttendanceHistoryView";
import {
  useAvailableJobs,
  useActiveJob,
} from "@/features/employee/hooks/useDriver";
import { useStationOrders } from "@/features/employee/hooks/useWorkfloor";
import { StationType } from "@/@types/worker.types";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Package, Briefcase, ArrowRight, LayoutDashboard, History } from "lucide-react";

const mapRoleToStation = (role: string): StationType | null => {
  if (role === "WORKER_WASHING") return "WASHING";
  if (role === "WORKER_IRONING") return "IRONING";
  if (role === "WORKER_PACKING") return "PACKING";
  return null;
};

/**
 * Employee Dashboard Page
 *
 * Menampilkan:
 * 1. Attendance widget (semua employee)
 * 2. Driver summary card  — hanya DRIVER
 * 3. Worker station card  — hanya WORKER_WASHING / IRONING / PACKING
 *
 * Key change dari Feature 3:
 * - Role dibaca dari `useSession()` (NextAuth) bukan `localStorage`.
 * - Semua API call melalui `axiosInstance` (NextAuth token), bukan localStorage axios.
 */
export default function EmployeeDashboardPage() {
  const { data: session, status } = useSession();
  const role = session?.user?.role || "";
  const [activeTab, setActiveTab] = useState<"dashboard" | "history">("dashboard");

  const isDriver = role === "DRIVER";
  const station = mapRoleToStation(role);
  const isWorker = !!station;

  if (status === "loading") {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto md:max-w-3xl space-y-6">
      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Welcome back, {session?.user?.name || "Employee"}
          </p>
        </div>
        <Badge variant="secondary" className="text-xs px-3 py-1">
          {role.replace(/_/g, " ")}
        </Badge>
      </div>

      {/* ── Tabs Navigation ─────────────────────────────────────────── */}
      <div className="flex p-1 bg-gray-100 rounded-lg w-fit">
        <button
          className={`px-4 py-2 flex items-center gap-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === "dashboard"
              ? "bg-white text-primary shadow-sm"
              : "text-gray-500 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab("dashboard")}
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </button>
        <button
          className={`px-4 py-2 flex items-center gap-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === "history"
              ? "bg-white text-primary shadow-sm"
              : "text-gray-500 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab("history")}
        >
          <History className="w-4 h-4" />
          History
        </button>
      </div>

      {/* ── Tab Content ──────────────────────────────────────────────── */}
      {activeTab === "dashboard" ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* 1. Attendance Widget — always shown */}
          <section>
            <AttendanceDashboard />
          </section>

          {/* 2. Role-specific summary card */}
          {isDriver && <DriverSummaryCard />}
          {isWorker && station && <WorkerSummaryCard station={station} />}
        </div>
      ) : (
        <div className="animate-in fade-in duration-300">
          <AttendanceHistoryView />
        </div>
      )}
    </div>
  );
}

// ─── Driver Summary Card ──────────────────────────────────────────────────────
function DriverSummaryCard() {
  const { data: availableJobsResponse, isLoading: isAvailableLoading } =
    useAvailableJobs(1, 10, "asc", "all", true);
  const availableJobs = availableJobsResponse?.data || [];
  const { data: activeJob, isLoading: isActiveLoading } = useActiveJob(true);

  const isLoading = isAvailableLoading || isActiveLoading;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Truck className="w-4 h-4 text-blue-600" />
          Job Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading jobs...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-blue-700">
                  {availableJobs.length}
                </p>
                <p className="text-xs text-blue-600 mt-0.5">Available Jobs</p>
              </div>
              <div
                className={`rounded-lg p-3 text-center ${
                  activeJob ? "bg-green-50" : "bg-gray-50"
                }`}
              >
                <p
                  className={`text-2xl font-bold ${
                    activeJob ? "text-green-700" : "text-gray-400"
                  }`}
                >
                  {activeJob ? "1" : "0"}
                </p>
                <p
                  className={`text-xs mt-0.5 ${
                    activeJob ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  Active Job
                </p>
              </div>
            </div>

            {activeJob && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">
                  Current Job
                </p>
                <p className="text-sm font-medium text-gray-800">
                  {activeJob.customerName}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                  {activeJob.address}
                </p>
                <Badge
                  variant="default"
                  className="mt-2 bg-green-600 hover:bg-green-700 text-xs"
                >
                  {activeJob.type} — IN PROGRESS
                </Badge>
              </div>
            )}

            <Link href="/employee/workfloor">
              <Button className="w-full gap-2" variant="outline">
                Go to Workfloor
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Worker Summary Card ──────────────────────────────────────────────────────
function WorkerSummaryCard({ station }: { station: StationType }) {
  const { data: stationOrdersResponse, isLoading } = useStationOrders(station);
  const stationOrders = stationOrdersResponse?.data || [];

  const pendingCount = stationOrders.filter((o) => !o.isLocked).length;
  const lockedCount = stationOrders.filter((o) => o.isLocked).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-indigo-600" />
          Station: {station}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading orders...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-indigo-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-indigo-700">
                  {pendingCount}
                </p>
                <p className="text-xs text-indigo-600 mt-0.5">Pending Orders</p>
              </div>
              <div
                className={`rounded-lg p-3 text-center ${
                  lockedCount > 0 ? "bg-yellow-50" : "bg-gray-50"
                }`}
              >
                <p
                  className={`text-2xl font-bold ${
                    lockedCount > 0 ? "text-yellow-700" : "text-gray-400"
                  }`}
                >
                  {lockedCount}
                </p>
                <p
                  className={`text-xs mt-0.5 ${
                    lockedCount > 0 ? "text-yellow-600" : "text-gray-400"
                  }`}
                >
                  Bypass Pending
                </p>
              </div>
            </div>

            {stationOrders.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Next Orders
                </p>
                {stationOrders.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <Package className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-sm font-mono font-medium">
                        #{order.orderNumber}
                      </span>
                    </div>
                    <Badge
                      variant={order.isLocked ? "destructive" : "secondary"}
                      className="text-[10px]"
                    >
                      {order.isLocked ? "On Hold" : `${order.totalQty} items`}
                    </Badge>
                  </div>
                ))}
                {stationOrders.length > 3 && (
                  <p className="text-xs text-gray-400 text-center">
                    +{stationOrders.length - 3} more orders
                  </p>
                )}
              </div>
            )}

            {stationOrders.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-2">
                No orders at this station right now.
              </p>
            )}

            <Link href="/employee/workfloor">
              <Button className="w-full gap-2" variant="outline">
                Go to Workfloor
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
}
