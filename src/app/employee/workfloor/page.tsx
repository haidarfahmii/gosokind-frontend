"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/features/employee/hooks/use-toast";
import AttendanceGuard from "@/features/employee/components/workfloor/AttendanceGuard";
import BypassModal from "@/features/employee/components/workfloor/BypassModal";
import { WorkfloorSkeleton } from "@/features/employee/components/workfloor/WorkfloorSkeleton";
import { NewOrderAlert } from "@/features/employee/components/workfloor/NewOrderAlert";
import { Notification } from "@/features/employee/components/workfloor/NotificationCenter";
import DriverView from "@/features/employee/components/workfloor/DriverView";
import WorkerView from "@/features/employee/components/workfloor/WorkerView";
import {
  useStationOrders,
  useProcessOrder,
  useSubmitBypass,
  useWorkerHistory,
} from "@/features/employee/hooks/useWorkfloor";
import {
  useAvailableJobs,
  useActiveJob,
  useAcceptJob,
  useCompleteJob,
  useDriverHistory,
} from "@/features/employee/hooks/useDriver";
import { StationType } from "@/@types/worker.types";

const mapRoleToStation = (role: string): StationType | null => {
  if (role === "WORKER_WASHING") return "WASHING";
  if (role === "WORKER_IRONING") return "IRONING";
  if (role === "WORKER_PACKING") return "PACKING";
  return null;
};

/**
 * Workfloor Page — Feature 3
 *
 * Key changes from Feature 3:
 * - `user` state from `localStorage.getItem("user")` → `useSession()` (NextAuth).
 * - Notification persistence still uses localStorage but keyed by `session.user.id`.
 * - All service calls go through Feature 2's `axiosInstance` (NextAuth token).
 */
export default function WorkfloorPage() {
  const { data: session, status } = useSession();
  const role = session?.user?.role || "";
  const userId = session?.user?.id || "";

  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [page, setPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("desc");
  const [timeFilter, setTimeFilter] = useState<string>("all");

  // Reset page when switching tabs or changing filters
  useEffect(() => {
    setPage(1);
  }, [activeTab, sortBy, timeFilter]);

  const [bypassData, setBypassData] = useState<{
    isOpen: boolean;
    orderId: string;
    orderNumber: string;
    details: any[];
  }>({ isOpen: false, orderId: "", orderNumber: "", details: [] });

  const { toast } = useToast();

  const isDriver = role === "DRIVER";
  const station = mapRoleToStation(role);
  // Outlet admin can view any station (defaults to WASHING for testing)
  const effectiveStation: StationType =
    station ||
    (role === "SUPER_ADMIN" || role === "OUTLET_ADMIN" ? "WASHING" : "WASHING");

  // ── React Query hooks ────────────────────────────────────────────────────
  // ── React Query hooks ────────────────────────────────────────────────────
  const { data: driverJobsResponse, isLoading: isDriverJobsLoading } =
    useAvailableJobs(page, 10, sortBy, timeFilter, !!isDriver && activeTab === "active");
  const driverJobs = driverJobsResponse?.data || [];
  const driverActiveMeta = driverJobsResponse?.meta || { lastPage: 1 };

  const { data: activeDriverJob = null, isLoading: isActiveJobLoading } =
    useActiveJob(!!isDriver);
  
  const { data: historyJobsResponse } = useDriverHistory(
    page, 10, sortBy, timeFilter, !!isDriver && activeTab === "history"
  );
  const historyJobs = historyJobsResponse?.data || [];
  const driverHistoryMeta = historyJobsResponse?.meta || { lastPage: 1 };

  const { data: workerHistoryResponse } = useWorkerHistory(
    page, 10, sortBy, timeFilter, !isDriver && activeTab === "history"
  );
  const workerHistory = workerHistoryResponse?.data || [];
  const workerHistoryMeta = workerHistoryResponse?.meta || { lastPage: 1 };

  const { data: stationOrdersResponse, isLoading: isStationOrdersLoading } =
    useStationOrders(isDriver ? null : effectiveStation, page, 10, sortBy, timeFilter);
  const stationOrders = stationOrdersResponse?.data || [];
  const workerActiveMeta = stationOrdersResponse?.meta || { lastPage: 1 };

  const { mutate: processOrderMutate } = useProcessOrder();
  const { mutate: acceptJobMutate } = useAcceptJob();
  const { mutate: completeJobMutate } = useCompleteJob();
  const { mutateAsync: submitBypassAsync } = useSubmitBypass();

  // ── Notification State ───────────────────────────────────────────────────
  const [newOrderAlert, setNewOrderAlert] = useState<{
    isOpen: boolean;
    orderNumber: string;
  }>({ isOpen: false, orderNumber: "" });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const seenIdsRef = useRef<Set<string>>(new Set());
  const isInitializedRef = useRef(false);

  // Initialize notifications from localStorage once session is available
  useEffect(() => {
    if (userId && !isInitializedRef.current) {
      try {
        const storedNotifs = localStorage.getItem(`gosokind_notifs_${userId}`);
        const storedSeen = localStorage.getItem(`gosokind_seen_${userId}`);
        if (storedNotifs) {
          const rehydrated = JSON.parse(storedNotifs).map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp),
          }));
          setNotifications(rehydrated);
        }
        if (storedSeen) seenIdsRef.current = new Set(JSON.parse(storedSeen));
      } catch {
        /* ignore */
      }
      isInitializedRef.current = true;
    }
  }, [userId]);

  // Detect new orders and show alert
  useEffect(() => {
    if (!userId || !isInitializedRef.current || activeTab !== "active") return;
    if (stationOrders.length === 0) return;

    const newNotifs: Notification[] = [];
    stationOrders.forEach((order) => {
      if (!seenIdsRef.current.has(order.id)) {
        seenIdsRef.current.add(order.id);
        newNotifs.push({
          id: crypto.randomUUID(),
          orderNumber: order.orderNumber,
          timestamp: new Date(),
          read: false,
        });
      }
    });

    if (newNotifs.length > 0) {
      const updated = [...newNotifs, ...notifications];
      setNotifications(updated);
      localStorage.setItem(
        `gosokind_notifs_${userId}`,
        JSON.stringify(updated),
      );
      localStorage.setItem(
        `gosokind_seen_${userId}`,
        JSON.stringify(Array.from(seenIdsRef.current)),
      );
      setNewOrderAlert({ isOpen: true, orderNumber: newNotifs[0].orderNumber });
    }
  }, [stationOrders, activeTab, userId]); // eslint-disable-line

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleMarkAsRead = (id: string) => {
    if (!userId) return;
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n,
    );
    setNotifications(updated);
    localStorage.setItem(`gosokind_notifs_${userId}`, JSON.stringify(updated));
  };

  const handleClearNotifications = () => {
    if (!userId) return;
    setNotifications([]);
    localStorage.removeItem(`gosokind_notifs_${userId}`);
  };

  const handleProcess = (
    orderId: string,
    items: { laundryItemId: string; quantity: number }[],
  ) => {
    processOrderMutate(
      { orderId, station: effectiveStation, items, actualQty: 0 },
      {
        onSuccess: () =>
          toast({ title: "Success", description: "Order processed." }),
        onError: (error: any) => {
          if (error.response?.data?.message === "QTY_MISMATCH") {
            const order = stationOrders.find((o) => o.id === orderId);
            setBypassData({
              isOpen: true,
              orderId,
              orderNumber: order?.orderNumber || "Unknown",
              details: error.response.data.details || [],
            });
          } else {
            toast({
              title: "Error",
              description: error.response?.data?.message || "Failed to process",
              variant: "destructive",
            });
          }
        },
      },
    );
  };

  const handleAcceptJob = (jobId: string) => {
    acceptJobMutate(
      { jobId },
      {
        onSuccess: () =>
          toast({
            title: "Job Accepted",
            description: "You accepted the job.",
          }),
        onError: (error: any) => {
          const msg =
            error.response?.data?.message === "DRIVER_BUSY"
              ? "You already have an active job. Please complete it first."
              : "Failed to accept job.";
          toast({
            title: "Cannot Accept Job",
            description: msg,
            variant: "destructive",
          });
        },
      },
    );
  };

  const handleCompleteJob = (jobId: string, type: string) => {
    completeJobMutate(
      { jobId, type },
      {
        onSuccess: () =>
          toast({
            title: "Job Completed",
            description: "You are now available for new jobs.",
          }),
        onError: () =>
          toast({
            title: "Error",
            description: "Failed to complete job.",
            variant: "destructive",
          }),
      },
    );
  };

  const handleBypassSubmit = async (reason: string): Promise<void> => {
    const itemChecks = bypassData.details.map((d) => ({
      laundryItemId: d.itemId,
      inputQuantity: d.actual, // Qty yang diinput worker (berbeda dari admin)
    }));

    await submitBypassAsync({
      orderId: bypassData.orderId,
      station: effectiveStation,
      reason,
      itemChecks,
    });
    // Tampilkan toast sukses (modal menutup dirinya sendiri setelah ini)
    toast({
      title: "Request Sent",
      description: "Bypass request submitted. Waiting for admin approval.",
    });
  };

  const isLoading =
    status === "loading" ||
    (isDriver
      ? isDriverJobsLoading || isActiveJobLoading
      : isStationOrdersLoading);

  return (
    <AttendanceGuard>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            {isDriver ? "Driver Jobs" : `Workfloor: ${effectiveStation}`}
          </h1>
          <span className="text-sm text-gray-500">
            {isDriver
              ? `Available: ${driverJobs.length}`
              : `Active Orders: ${stationOrders.length}`}
          </span>
        </div>

        {isLoading ? (
          <WorkfloorSkeleton />
        ) : isDriver ? (
            <DriverView
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              driverJobs={driverJobs}
              activeJob={activeDriverJob}
              historyJobs={historyJobs}
              onAccept={handleAcceptJob}
              onComplete={handleCompleteJob}
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onClearAll={handleClearNotifications}
              // Pagination & Filters
              page={page}
              setPage={setPage}
              sortBy={sortBy}
              setSortBy={setSortBy}
              timeFilter={timeFilter}
              setTimeFilter={setTimeFilter}
              lastPage={activeTab === "active" ? driverActiveMeta.lastPage : driverHistoryMeta.lastPage}
            />
          ) : (
            <WorkerView
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              stationOrders={stationOrders}
              workerHistory={workerHistory}
              effectiveStation={effectiveStation}
              onProcess={handleProcess}
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onClearAll={handleClearNotifications}
              // Pagination & Filters
              page={page}
              setPage={setPage}
              sortBy={sortBy}
              setSortBy={setSortBy}
              timeFilter={timeFilter}
              setTimeFilter={setTimeFilter}
              lastPage={activeTab === "active" ? workerActiveMeta.lastPage : workerHistoryMeta.lastPage}
            />
        )}

        <BypassModal
          isOpen={bypassData.isOpen}
          onClose={() => setBypassData((prev) => ({ ...prev, isOpen: false }))}
          onSubmit={handleBypassSubmit}
          details={bypassData.details}
          orderNumber={bypassData.orderNumber}
        />

        <NewOrderAlert
          isOpen={newOrderAlert.isOpen}
          onClose={() =>
            setNewOrderAlert((prev) => ({ ...prev, isOpen: false }))
          }
          orderNumber={newOrderAlert.orderNumber}
        />
      </div>
    </AttendanceGuard>
  );
}
