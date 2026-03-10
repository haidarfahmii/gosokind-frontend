"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { dashboardService } from "@/features/dashboard/services/dashboard.service";
import { useOutletFilter } from "@/hooks/useOutletFilter";
import { DashboardStats } from "@/features/dashboard/types/dashboard.types";

export interface SuperAdminDashboardState {
  stats: DashboardStats | null;
  loadingStats: boolean;
  error: string | null;
  refetch: () => void;
}

export function useSuperAdminDashboard(): SuperAdminDashboardState {
  const { selectedOutletId } = useOutletFilter();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);
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

  const refetch = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { stats, loadingStats, error, refetch };
}
