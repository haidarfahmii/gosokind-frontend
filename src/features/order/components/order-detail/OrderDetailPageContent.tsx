"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  RefreshCw,
  Loader2,
  AlertCircle,
  Package,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOrderDetail, useBypassRequests } from "@/features/order/hooks";
import { getStatusConfig } from "@/features/order/types/order.types";
import { BypassRequestDialog } from "@/features/order/components/bypass-request";
import {
  AdminStatusControl,
  CustomerInfoCard,
  OrderSummaryCard,
  LaundryItemsCard,
  StationProcessTimeline,
  OrderStatusProgress,
  BypassRequestsSection,
  LogisticsInfoCard,
} from "@/features/order/components/order-detail";

interface OrderDetailPageContentProps {
  orderId: string;
  backHref: string; // -> Path balik ke halaman daftar order, sesuai role
  roleLabel?: string; // -> Role label untuk breadcrumb
}

/**
 * OrderDetailPageContent - Shared content untuk halaman Order Detail.
 *
 * Dipakai:
 * - /admin/super-admin/orders/[orderId]
 * - /admin/outlet-admin/orders/[orderId]
 */
export function OrderDetailPageContent({
  orderId,
  backHref,
  roleLabel,
}: OrderDetailPageContentProps) {
  const { order, loading, error, refetch } = useOrderDetail(orderId);
  const {
    bypassRequests: allPendingBypassRequests,
    loading: bypassLoading,
    pagination: bypassPagination,
    handlePageChange: handleBypassPageChange,
    handleBypassRequest,
  } = useBypassRequests();

  // filter, hanya menampilkan bypass request yang milik order ini
  const pendingBypassRequests = allPendingBypassRequests.filter(
    (req) => req.order.id === orderId,
  );
  const [bypassDialogOpen, setBypassDialogOpen] = useState<boolean>(false);
  const hasPendingBypass = pendingBypassRequests.length > 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-slate-500 text-sm">Loading order details...</p>
      </div>
    );
  }

  // Error State
  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 gap-4">
        <AlertCircle className="h-12 w-12 text-red-400" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-800">
            Failed to load order
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {error || "Order not found"}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={refetch}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
          <Link href={backHref}>
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);

  return (
    <div className="space-y-6">
      {/* Header / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href={backHref}>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 pl-0 hover:pl-2 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>

          {/* Breadcrumb */}
          <div className="text-sm text-slate-400 hidden sm:flex items-center gap-2">
            {roleLabel && <span>{roleLabel}</span>}
            <span>›</span>
            <span>Orders</span>
            <span>›</span>
            <span className="text-slate-700 font-medium">
              {order.orderNumber}
            </span>
          </div>
        </div>

        {/* Order Number + Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            <span className="text-lg font-bold text-slate-800">
              {order.orderNumber}
            </span>
          </div>
          {/* <Badge
            className={`${statusConfig.bgColor} ${statusConfig.color} text-sm px-3 py-1`}
          >
            {statusConfig.label}
          </Badge> */}

          {/* ── Bypass Request Action Button ── */}
          {hasPendingBypass && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setBypassDialogOpen(true)}
              className="gap-2 border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400"
            >
              <ShieldAlert className="w-4 h-4" />
              Review Bypass
              <Badge className="bg-orange-500 text-white text-xs px-1.5 py-0 ml-0.5 min-w-5 justify-center">
                {pendingBypassRequests.length}
              </Badge>
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={refetch}
            className="text-slate-500 hover:text-slate-700"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Status Progress */}
      <OrderStatusProgress currentStatus={order.status} />

      {/* ─── Dev/Testing: Admin Manual Status Control ────────────── */}
      {/* Tampil hanya saat status di station (WASHING, IRONING, PACKING, WAITING_FOR_PAYMENT) */}
      {/* <AdminStatusControl order={order} onSuccess={refetch} /> */}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer + Logistics */}
        <div className="lg:col-span-1 space-y-6">
          <CustomerInfoCard order={order} />
          <LogisticsInfoCard order={order} />
        </div>

        {/* Right Column: Summary + Items + Timeline + Bypass */}
        <div className="lg:col-span-2 space-y-6">
          <OrderSummaryCard order={order} />
          <LaundryItemsCard order={order} />
          <StationProcessTimeline order={order} />
          {/* Riwayat semua bypass request */}
          <BypassRequestsSection
            bypassRequests={(order as any).bypassRequests ?? []}
          />
        </div>
      </div>

      {/* Footer: Meta Info */}
      <div className="text-xs text-slate-400 pt-4 border-t flex flex-col sm:flex-row gap-2 sm:gap-6">
        <span>
          Order ID: <span className="font-mono text-slate-600">{order.id}</span>
        </span>
        <span>
          Created:{" "}
          {new Date(order.createdAt).toLocaleString("id-ID", {
            dateStyle: "full",
            timeStyle: "short",
          })}
        </span>
        <span>
          Last Updated:{" "}
          {new Date(order.updatedAt).toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </span>
      </div>

      <BypassRequestDialog
        open={bypassDialogOpen}
        onOpenChange={setBypassDialogOpen}
        bypassRequests={pendingBypassRequests}
        loading={bypassLoading}
        pagination={bypassPagination}
        onPageChange={handleBypassPageChange}
        onApprove={(id, note) => handleBypassRequest(id, "APPROVED", note)}
        onReject={(id, note) => handleBypassRequest(id, "REJECTED", note)}
      />
    </div>
  );
}
