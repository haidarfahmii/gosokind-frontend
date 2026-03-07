"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";

export interface WorkerOption {
  id: string;
  fullName: string;
  role: string;
}

/**
 * Hook untuk fetch daftar worker aktif dari API.
 * Digunakan di InputOrderDetailsDialog untuk memilih worker
 * yang akan di-assign ke order (WORKER_WASHING).
 *
 * @param open - Trigger fetch saat dialog dibuka
 * @param outletId - (opsional) Filter worker berdasarkan outlet
 */
export function useWorkers(open: boolean, outletId?: string) {
  const [workers, setWorkers] = useState<WorkerOption[]>([]);
  const [loadingWorkers, setLoadingWorkers] = useState<boolean>(false);

  useEffect(() => {
    if (!open) return;

    const fetchWorkers = async () => {
      setLoadingWorkers(true);
      try {
        const params: Record<string, unknown> = {
          role: "WORKER_WASHING",
          isActive: true,
          limit: 100,
        };

        if (outletId) {
          params.outletId = outletId;
        }

        const res = await axiosInstance.get("/employees", { params });
        // Response menggunakan struktur { data: Employee[] }
        setWorkers(res.data.data ?? []);
      } catch (error) {
        console.error("Failed to fetch workers:", error);
        setWorkers([]);
      } finally {
        setLoadingWorkers(false);
      }
    };

    fetchWorkers();
  }, [open, outletId]);

  return { workers, loadingWorkers };
}
