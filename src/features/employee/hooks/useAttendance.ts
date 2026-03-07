import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  getDashboard,
  getHistory,
  clockIn,
  clockOut,
} from "@/features/employee/services/attendance.service";

export const attendanceKeys = {
  all: ["attendance"] as const,
  dashboard: () => [...attendanceKeys.all, "dashboard"] as const,
  history: () => [...attendanceKeys.all, "history"] as const,
};

// Role yang boleh akses GET /api/attendance (semua outlet data)
const ADMIN_ROLES = ["SUPER_ADMIN", "OUTLET_ADMIN"];

export function useAttendanceDashboard() {
  return useQuery({
    queryKey: attendanceKeys.dashboard(),
    queryFn: getDashboard,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * GET /api/attendance hanya boleh dipanggil oleh SUPER_ADMIN & OUTLET_ADMIN.
 * Untuk employee (DRIVER, WORKER_*), history tidak ditampilkan via endpoint ini.
 * Data attendance employee sudah tercakup di useAttendanceDashboard().
 */
export function useAttendanceHistory() {
  const { data: session } = useSession();
  const role = session?.user?.role || "";
  const isAdmin = ADMIN_ROLES.includes(role);

  return useQuery({
    queryKey: attendanceKeys.history(),
    queryFn: getHistory,
    enabled: isAdmin, // ← hanya fetch jika admin
    staleTime: 1000 * 60 * 5,
  });
}

export function useClockIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      latitude,
      longitude,
    }: {
      latitude: number;
      longitude: number;
    }) => clockIn(latitude, longitude),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
    },
  });
}

export function useClockOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clockOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
    },
  });
}
