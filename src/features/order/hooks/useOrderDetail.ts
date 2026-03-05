"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { Order } from "@/features/order/types/order.types";
import { orderService } from "@/features/order/services/order.service";

interface UseOrderDetailReturn {
  order: Order | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook untuk fetch detail order berdasarkan orderNumber.
 *
 * Digunakan di halaman Order Detail (/admin/[role]/orders/[orderNumber])
 * maupun bisa digunakan ulang di komponen lain yang butuh data order tunggal.
 *
 * @param orderNumber - Nomor order (contoh: INV-20260225002)
 */
export function useOrderDetail(orderNumber: string): UseOrderDetailReturn {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!orderNumber) return;

    try {
      setLoading(true);
      setError(null);

      const response = await orderService.getOrderByOrderNumber(orderNumber);

      if (response.success) {
        setOrder(response.data);
      } else {
        setError("Failed to load order details");
      }
    } catch (err: any) {
      console.error("Failed to fetch order detail:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to load order details";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [orderNumber]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return { order, loading, error, refetch: fetchOrder };
}
