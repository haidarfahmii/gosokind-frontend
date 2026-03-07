"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { dashboardService } from "@/features/dashboard/services/dashboard.service";
import {
  DashboardStats,
  DashboardRecentOrder,
  DashboardRevenuePoint,
} from "@/features/dashboard/types/dashboard.types";

export interface OutletAdminDashboardState {
  stats: DashboardStats | null;
  recentOrders: DashboardRecentOrder[];
  revenueData: DashboardRevenuePoint[];
  loadingStats: boolean;
  loadingOrders: boolean;
  loadingRevenue: boolean;
  error: string | null;
  refetch: () => void;
}

export function useOutletAdminDashboard(): OutletAdminDashboardState {
  const { data: session } = useSession();

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
      // For outlet admin, backend automatically scopes to their outlet.
      // Pass undefined so no outletId filter is sent — backend uses token context.
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (err: any) {
      console.error("Failed to fetch dashboard stats:", err);
      setError(err.response?.data?.message || "Failed to load dashboard stats");
      toast.error("Failed to load dashboard statistics");
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const fetchRecentOrders = useCallback(async () => {
    try {
      setLoadingOrders(true);
      const orders = await dashboardService.getRecentOrders();
      setRecentOrders(orders);
    } catch (err: any) {
      console.error("Failed to fetch recent orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  const fetchRevenue = useCallback(async () => {
    try {
      setLoadingRevenue(true);
      const data = await dashboardService.getRevenueTrend();
      setRevenueData(data);
    } catch (err: any) {
      console.error("Failed to fetch revenue data:", err);
    } finally {
      setLoadingRevenue(false);
    }
  }, []);

  const refetch = useCallback(() => {
    fetchStats();
    fetchRecentOrders();
    fetchRevenue();
  }, [fetchStats, fetchRecentOrders, fetchRevenue]);

  useEffect(() => {
    if (session?.user?.role === "OUTLET_ADMIN") {
      refetch();
    }
  }, [session, refetch]);

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
