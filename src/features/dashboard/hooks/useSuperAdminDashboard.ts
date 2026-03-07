"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { dashboardService } from "@/features/dashboard/services/dashboard.service";
import { useBypassRequests } from "@/features/order/hooks/useBypassRequests";
import { useOutletFilter } from "@/hooks/useOutletFilter";
import {
  DashboardStats,
  DashboardRecentOrder,
  DashboardRevenuePoint,
} from "@/features/dashboard/types/dashboard.types";

export interface SuperAdminDashboardState {
  stats: DashboardStats | null;
  recentOrders: DashboardRecentOrder[];
  revenueData: DashboardRevenuePoint[];
  loadingStats: boolean;
  loadingOrders: boolean;
  loadingRevenue: boolean;
  error: string | null;
  refetch: () => void;
}

export function useSuperAdminDashboard(): SuperAdminDashboardState {
  const { selectedOutletId } = useOutletFilter();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<DashboardRecentOrder[]>([]);
  const [revenueData, setRevenueData] = useState<DashboardRevenuePoint[]>([]);

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingRevenue, setLoadingRevenue] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);

      // Fetch base stats + super admin extra stats in parallel
      const [baseStats, superStats] = await Promise.all([
        dashboardService.getStats(selectedOutletId),
        dashboardService.getSuperAdminStats(),
      ]);

      setStats({ ...baseStats, ...superStats });
    } catch (err: any) {
      console.error("Failed to fetch dashboard stats:", err);
      setError(err.response?.data?.message || "Failed to load dashboard stats");
      toast.error("Failed to load dashboard statistics");
    } finally {
      setLoadingStats(false);
    }
  }, [selectedOutletId]);

  const fetchRecentOrders = useCallback(async () => {
    try {
      setLoadingOrders(true);
      const orders = await dashboardService.getRecentOrders(selectedOutletId);
      setRecentOrders(orders);
    } catch (err: any) {
      console.error("Failed to fetch recent orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  }, [selectedOutletId]);

  const fetchRevenue = useCallback(async () => {
    try {
      setLoadingRevenue(true);
      const data = await dashboardService.getRevenueTrend(selectedOutletId);
      setRevenueData(data);
    } catch (err: any) {
      console.error("Failed to fetch revenue data:", err);
    } finally {
      setLoadingRevenue(false);
    }
  }, [selectedOutletId]);

  const refetch = useCallback(() => {
    fetchStats();
    fetchRecentOrders();
    fetchRevenue();
  }, [fetchStats, fetchRecentOrders, fetchRevenue]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    stats,
    recentOrders,
    revenueData,
    loadingStats,
    loadingOrders,
    loadingRevenue,
    error,
    refetch,
  };
}
