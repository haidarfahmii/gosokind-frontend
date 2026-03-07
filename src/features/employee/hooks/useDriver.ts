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
  available: (params?: any) => [...driverKeys.all, "available", params] as const,
  active: () => [...driverKeys.all, "active"] as const,
  history: (params?: any) => [...driverKeys.all, "history", params] as const,
};

export function useAvailableJobs(
  page: number = 1,
  limit: number = 10,
  sortBy: string = "asc",
  timeFilter: string = "all",
  enabled: boolean = true
) {
  return useQuery({
    queryKey: driverKeys.available({ page, limit, sortBy, timeFilter }),
    queryFn: () => getAvailableJobs(page, limit, sortBy, timeFilter),
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

export function useDriverHistory(
  page: number = 1,
  limit: number = 10,
  sortBy: string = "desc",
  timeFilter: string = "all",
  enabled: boolean = true
) {
  return useQuery({
    queryKey: driverKeys.history({ page, limit, sortBy, timeFilter }),
    queryFn: () => getDriverHistory(page, limit, sortBy, timeFilter),
    staleTime: 1000 * 60 * 5,
    enabled,
  });
}
