"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { Order } from "../types/order.types";
import { orderService } from "../services/order.service";

interface UseOrderDetailReturn {
  order: Order | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook untuk fetch detail order berdasarkan ID.
 *
 * Digunakan di halaman Order Detail (/admin/[role]/orders/[orderId])
 * maupun bisa digunakan ulang di komponen lain yang butuh data order tunggal.
 *
 * @param orderId - ID order yang ingin di-fetch
 */
export function useOrderDetail(orderId: string): UseOrderDetailReturn {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await orderService.getOrderById(orderId);

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
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return { order, loading, error, refetch: fetchOrder };
}
