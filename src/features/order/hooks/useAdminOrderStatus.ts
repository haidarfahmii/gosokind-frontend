"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Order, OrderStatus } from "@/features/order/types/order.types";
import axiosInstance from "@/utils/axiosInstance";

/**
 * Mapping: status saat ini → status berikutnya yang diizinkan untuk admin
 * Ini mencerminkan allowedTransitions di backend order.helpers.ts
 * Digunakan hanya untuk keperluan testing sebelum fitur worker management selesai.
 */
const ADMIN_NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  [OrderStatus.WASHING]: [OrderStatus.IRONING],
  [OrderStatus.IRONING]: [OrderStatus.PACKING],
  [OrderStatus.PACKING]: [
    OrderStatus.WAITING_FOR_PAYMENT,
    OrderStatus.READY_FOR_DELIVERY,
  ],
  [OrderStatus.WAITING_FOR_PAYMENT]: [OrderStatus.READY_FOR_DELIVERY],
};

// Label yang ditampilkan di tombol untuk tiap transisi
const STATUS_ACTION_LABEL: Partial<Record<OrderStatus, string>> = {
  [OrderStatus.IRONING]: "Move to Ironing",
  [OrderStatus.PACKING]: "Move to Packing",
  [OrderStatus.WAITING_FOR_PAYMENT]: "Move to Waiting Payment",
  [OrderStatus.READY_FOR_DELIVERY]: "Mark as Ready for Delivery (Paid)",
};

export interface StatusAction {
  targetStatus: OrderStatus;
  label: string;
}

interface UseAdminOrderStatusProps {
  order: Order;
  onSuccess: () => void;
}

export function useAdminOrderStatus({
  order,
  onSuccess,
}: UseAdminOrderStatusProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  // Dapatkan daftar aksi yang tersedia berdasarkan status order saat ini
  const availableActions: StatusAction[] = (
    ADMIN_NEXT_STATUS[order.status] ?? []
  ).map((targetStatus) => ({
    targetStatus,
    label: STATUS_ACTION_LABEL[targetStatus] ?? targetStatus,
  }));

  const hasAvailableActions = availableActions.length > 0;

  // Eksekusi pembaruan status
  const updateStatus = async (targetStatus: OrderStatus) => {
    setIsUpdating(true);
    try {
      const response = await axiosInstance.patch(`/orders/${order.id}/status`, {
        status: targetStatus,
      });

      if (response.data.success) {
        toast.success(
          `Order moved to ${STATUS_ACTION_LABEL[targetStatus] ?? targetStatus}`,
        );
        onSuccess();
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message ?? "Failed to update order status";
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    availableActions,
    hasAvailableActions,
    isUpdating,
    updateStatus,
  };
}
