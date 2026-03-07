import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStationOrders,
  processOrder,
  requestBypass,
  getWorkerHistory,
} from "@/features/employee/services/worker.service";
import {
  StationType,
  ProcessPayload,
  BypassPayload,
} from "@/@types/worker.types";

export const workfloorKeys = {
  all: ["workfloor"] as const,
  orders: (station: StationType | null, params?: any) =>
    [...workfloorKeys.all, "orders", station, params] as const,
  history: (params?: any) => [...workfloorKeys.all, "history", params] as const,
};

export function useStationOrders(
  station: StationType | null,
  page: number = 1,
  limit: number = 10,
  sortBy: string = "asc",
  timeFilter: string = "all"
) {
  return useQuery({
    queryKey: workfloorKeys.orders(station, { page, limit, sortBy, timeFilter }),
    queryFn: () => getStationOrders(station!, page, limit, sortBy, timeFilter),
    enabled: !!station,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 10, // Poll every 10 seconds
  });
}

export function useWorkerHistory(
  page: number = 1,
  limit: number = 10,
  sortBy: string = "desc",
  timeFilter: string = "all",
  enabled: boolean = true
) {
  return useQuery({
    queryKey: workfloorKeys.history({ page, limit, sortBy, timeFilter }),
    queryFn: () => getWorkerHistory(page, limit, sortBy, timeFilter),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useProcessOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProcessPayload) => processOrder(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: workfloorKeys.orders(variables.station),
      });
    },
  });
}

export function useSubmitBypass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BypassPayload) => requestBypass(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: workfloorKeys.orders(variables.station),
      });
    },
  });
}
