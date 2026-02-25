import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAvailableJobs,
  getActiveJob,
  acceptJob,
  completeJob,
  getDriverHistory,
} from "@/features/employee/services/driver.service";

export const driverKeys = {
  all: ["driver"] as const,
  available: () => [...driverKeys.all, "available"] as const,
  active: () => [...driverKeys.all, "active"] as const,
  history: () => [...driverKeys.all, "history"] as const,
};

export function useAvailableJobs(enabled: boolean = true) {
  return useQuery({
    queryKey: driverKeys.available(),
    queryFn: getAvailableJobs,
    staleTime: 1000 * 30, // 30 seconds
    enabled,
  });
}

export function useActiveJob(enabled: boolean = true) {
  return useQuery({
    queryKey: driverKeys.active(),
    queryFn: getActiveJob,
    retry: false,
    enabled,
  });
}

export function useAcceptJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, type }: { jobId: string; type?: string }) =>
      acceptJob(jobId, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: driverKeys.all });
    },
  });
}

export function useCompleteJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, type }: { jobId: string; type: string }) =>
      completeJob(jobId, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: driverKeys.all });
      queryClient.invalidateQueries({ queryKey: ["workfloor"] });
    },
  });
}

export function useDriverHistory(enabled: boolean = true) {
  return useQuery({
    queryKey: driverKeys.history(),
    queryFn: getDriverHistory,
    staleTime: 1000 * 60 * 5,
    enabled,
  });
}
