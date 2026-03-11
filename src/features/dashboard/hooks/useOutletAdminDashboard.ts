"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { dashboardService } from "@/features/dashboard/services/dashboard.service";
import { DashboardStats } from "@/features/dashboard/types/dashboard.types";

export interface OutletAdminDashboardState {
  stats: DashboardStats | null;
  loadingStats: boolean;
  error: string | null;
  refetch: () => void;
}

export function useOutletAdminDashboard(): OutletAdminDashboardState {
  const { data: session } = useSession();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      // Backend auto-scope ke outlet dari JWT token, tidak perlu kirim outletId
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

  const refetch = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (session?.user?.role === "OUTLET_ADMIN") {
      refetch();
    }
  }, [session, refetch]);

  return { stats, loadingStats, error, refetch };
}
