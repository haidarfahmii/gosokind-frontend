import axiosInstance from "@/utils/axiosInstance";
import {
  SalesReportQuery,
  SalesReportResponse,
  EmployeePerformanceQuery,
  EmployeePerformanceResponse,
} from "../types/report.types";

export const reportService = {
  /**
   * GET /api/reports/sales
   *
   * Super Admin: can see all outlets or filter by outletId
   * Outlet Admin: automatically scoped to their outlet (outletId ignored)
   *
   * Required query: period (daily | monthly | yearly)
   * Optional: startDate, endDate, outletId
   */
  async getSalesReport(query: SalesReportQuery): Promise<SalesReportResponse> {
    const params = new URLSearchParams();
    params.append("period", query.period);
    if (query.startDate) params.append("startDate", query.startDate);
    if (query.endDate) params.append("endDate", query.endDate);
    if (query.outletId && query.outletId !== "all") {
      params.append("outletId", query.outletId);
    }

    const response = await axiosInstance.get(
      `/reports/sales?${params.toString()}`,
    );
    return response.data;
  },

  /**
   * GET /api/reports/employee-performance
   *
   * Super Admin: can see all outlets or filter by outletId & role
   * Outlet Admin: automatically scoped to their outlet
   *
   * Optional: startDate, endDate, outletId, role
   */
  async getEmployeePerformance(
    query: EmployeePerformanceQuery,
  ): Promise<EmployeePerformanceResponse> {
    const params = new URLSearchParams();
    if (query.startDate) params.append("startDate", query.startDate);
    if (query.endDate) params.append("endDate", query.endDate);
    if (query.outletId && query.outletId !== "all") {
      params.append("outletId", query.outletId);
    }
    if (query.role && query.role !== "all") {
      params.append("role", query.role);
    }

    const response = await axiosInstance.get(
      `/reports/employee-performance?${params.toString()}`,
    );
    return response.data;
  },
};
