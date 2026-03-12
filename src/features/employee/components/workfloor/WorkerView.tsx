"use client";

import { Inbox, History } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import OrderCard from "@/features/employee/components/workfloor/OrderCard";
import WorkerHistoryCard from "@/features/employee/components/workfloor/WorkerHistoryCard";
import {
  NotificationCenter,
  Notification,
} from "@/features/employee/components/workfloor/NotificationCenter";
import {
  StationOrder,
  StationType,
  WorkerHistoryItem,
} from "@/@types/worker.types";

interface WorkerViewProps {
  activeTab: "active" | "history";
  setActiveTab: (tab: "active" | "history") => void;
  stationOrders: StationOrder[];
  workerHistory: WorkerHistoryItem[];
  effectiveStation: StationType;
  onProcess: (
    orderId: string,
    items: { laundryItemId: string; quantity: number }[],
  ) => Promise<void>;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  page: number;
  setPage: (page: number) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  timeFilter: string;
  setTimeFilter: (filter: string) => void;
  lastPage: number;
}

export default function WorkerView({
  activeTab,
  setActiveTab,
  stationOrders,
  workerHistory,
  effectiveStation,
  onProcess,
  notifications,
  onMarkAsRead,
  onClearAll,
  page,
  setPage,
  sortBy,
  setSortBy,
  timeFilter,
  setTimeFilter,
  lastPage,
}: WorkerViewProps) {
  return (
    <div className="space-y-8">
      {/* Tab Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div className="flex p-1 bg-gray-100 rounded-lg w-fit">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === "active"
                ? "bg-white text-primary shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("active")}
          >
            Active Tasks
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === "history"
                ? "bg-white text-primary shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("history")}
          >
            Task History
          </button>
        </div>

        <div className="flex items-center gap-3">
          <select
            className="text-sm border rounded-md px-3 py-2 bg-white flex-1"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="3_days">Last 3 Days</option>
            <option value="7_days">Last 7 Days</option>
          </select>
          <select
            className="text-sm border rounded-md px-3 py-2 bg-white flex-1"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>

          <NotificationCenter
            notifications={notifications}
            onMarkAsRead={onMarkAsRead}
            onClearAll={onClearAll}
          />
        </div>
      </div>

      {/* Active Tab */}
      {activeTab === "active" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stationOrders.length > 0 ? (
            stationOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                station={effectiveStation}
                onProcess={onProcess}
              />
            ))
          ) : (
            <div className="col-span-full">
              <EmptyState
                icon={Inbox}
                title="All Caught Up!"
                description="There are no active orders waiting at this station."
              />
            </div>
          )}
        </div>
      ) : (
        /* ── History Tab ─────────────────────────────────────────────── */
        <section>
          <h2 className="text-xl font-bold mb-4 text-gray-700">
            Completed Tasks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workerHistory.length > 0 ? (
              workerHistory.map((job) => (
                <WorkerHistoryCard key={job.id} job={job} />
              ))
            ) : (
              <div className="col-span-full">
                <EmptyState
                  icon={History}
                  title="No History Found"
                  description="You haven't completed any tasks yet."
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Pagination Footer ────────────────────────────────────────── */}
      <div className="flex items-center justify-between mt-8 p-4 bg-white/50 rounded-lg border">
        <span className="text-sm text-gray-500">
          Page {page} of {Math.max(1, lastPage)}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 bg-white"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(Math.min(lastPage, page + 1))}
            disabled={page >= lastPage}
            className="px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 bg-white"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
