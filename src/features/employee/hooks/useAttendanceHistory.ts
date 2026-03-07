import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { Attendance } from "@/@types/worker.types";

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    lastPage: number;
  };
}

export const useAttendanceHistory = (page: number, limit: number, date?: string) => {
  return useQuery({
    queryKey: ["attendance-history", page, limit, date],
    queryFn: async () => {
      // Clean up empty strings or undefined logic
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (date) {
        params.append("date", date);
      }
      
      const response = await axiosInstance.get<PaginatedResponse<Attendance>>(
        `/attendance/history?${params.toString()}`
      );
      return response.data;
    },
  });
};
