export type ReportPeriod = "daily" | "monthly" | "yearly";

// Sales Report
export interface SalesDataPoint {
  period: string; // "2025-01-15" | "2025-01" | "2025"
  totalOrders: number;
  paidOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
}

export interface SalesSummary {
  totalOrders: number;
  paidOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
}

export interface OutletInfo {
  id: string;
  name: string;
}

export interface SalesReportResponse {
  success: boolean;
  message: string;
  data: {
    period: ReportPeriod;
    startDate: string;
    endDate: string;
    outlet: OutletInfo | null; // null = "all outlets"
    summary: SalesSummary;
    data: SalesDataPoint[];
  };
}

// Employee Performance
export interface EmployeePerformanceItem {
  employeeId: string;
  fullName: string;
  role: string;
  outletId?: string;
  outletName?: string;
  totalStationsCompleted: number;
  washingCompleted: number;
  ironingCompleted: number;
  packingCompleted: number;
  totalPickups: number;
  totalDeliveries: number;
  totalJobsDone: number;
}

export interface TopPerformer {
  employeeId: string;
  fullName: string;
  role: string;
  totalJobsDone: number;
}

export interface EmployeePerformanceSummary {
  totalEmployees: number;
  topPerformer: TopPerformer | null;
}

export interface EmployeePerformanceResponse {
  success: boolean;
  message: string;
  data: {
    startDate: string;
    endDate: string;
    outlet: OutletInfo | null;
    summary: EmployeePerformanceSummary;
    data: EmployeePerformanceItem[];
  };
}

// Query Params
export interface SalesReportQuery {
  period: ReportPeriod;
  startDate?: string;
  endDate?: string;
  outletId?: string; // Super Admin only
}

export interface EmployeePerformanceQuery {
  startDate?: string;
  endDate?: string;
  outletId?: string; // Super Admin only
  role?: string;
}
