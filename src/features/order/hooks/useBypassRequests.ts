"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { BypassRequest } from "../types/order.types";
import { orderService } from "../services/order.service";

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const useBypassRequests = (outletFilter?: string) => {
  const [bypassRequests, setBypassRequests] = useState<BypassRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchBypassRequests = useCallback(async () => {
    try {
      setLoading(true);

      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (outletFilter && outletFilter !== "all") {
        params.outletId = outletFilter;
      }

      const response = await orderService.getPendingBypassRequests(params);

      if (response.success) {
        setBypassRequests(response.data?.bypassRequests || []);
        setPagination((prev) => ({
          ...prev,
          total: response.data?.pagination?.total || 0,
          totalPages: response.data?.pagination?.totalPages || 0,
        }));
      }
    } catch (error: any) {
      console.error("Failed to fetch bypass requests:", error);
      toast.error(
        error.response?.data?.message || "Failed to load bypass requests",
      );
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, outletFilter]);

  useEffect(() => {
    fetchBypassRequests();
  }, [fetchBypassRequests]);

  const handleBypassRequest = async (
    bypassRequestId: string,
    action: "APPROVED" | "REJECTED",
    adminNote?: string,
  ) => {
    try {
      const response = await orderService.handleBypassRequest(bypassRequestId, {
        action,
        adminNote,
      });

      if (response.success) {
        toast.success(`Bypass request ${action.toLowerCase()} successfully`);
        fetchBypassRequests(); // Refresh list
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to handle bypass request",
      );
    }
  };

  return {
    bypassRequests,
    loading,
    pagination,
    handlePageChange: (page: number) =>
      setPagination((prev) => ({ ...prev, page })),
    handleBypassRequest,
    refetch: fetchBypassRequests,
  };
};
