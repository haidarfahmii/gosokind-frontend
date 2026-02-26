import axiosInstance from "@/utils/axiosInstance";
import { orderService } from "@/features/order/services/order.service";
import { reportService } from "@/features/report/services/report.service";
import { outletService } from "@/features/super-admin/outlet/services/outlet.service";
import { employeeService } from "@/services/employee.service";
import {
  DashboardStats,
  DashboardRecentOrder,
  DashboardRevenuePoint,
} from "@/features/dashboard/types/dashboard.types";

const getTodayDateString = () => new Date().toISOString().split("T")[0];

const getMonthsAgoDateString = (months: number) => {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  return d.toISOString().split("T")[0];
};

const getFirstDayOfMonth = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split("T")[0];
};

export const dashboardService = {
  /**
   * Fetch aggregated stats for the dashboard.
   * - outletId: "all" for Super Admin, specific ID for Outlet Admin
   */
  async getStats(outletId?: string): Promise<DashboardStats> {
    const today = getTodayDateString();
    const firstDayOfMonth = getFirstDayOfMonth();

    const orderParams: any = {
      page: 1,
      limit: 1,
      startDate: today,
      endDate: today,
    };
    if (outletId && outletId !== "all") {
      orderParams.outletId = outletId;
    }

    // Run requests in parallel
    const [
      todayOrdersRes,
      pendingOrdersRes,
      completedOrdersRes,
      salesRes,
      employeesRes,
      bypassRes,
    ] = await Promise.allSettled([
      // Total orders today
      axiosInstance.get("/orders", { params: { ...orderParams } }),
      // Pending orders (WAITING_FOR_PICKUP + ARRIVED_AT_OUTLET)
      axiosInstance.get("/orders", {
        params: {
          ...orderParams,
          startDate: undefined,
          endDate: undefined,
          status: "WAITING_FOR_PICKUP",
          limit: 1,
        },
      }),
      // Completed today
      axiosInstance.get("/orders", {
        params: { ...orderParams, status: "COMPLETED" },
      }),
      // Today's revenue via sales report
      reportService.getSalesReport({
        period: "daily",
        startDate: firstDayOfMonth,
        endDate: today,
        outletId: outletId !== "all" ? outletId : undefined,
      }),
      // Active employees
      employeeService.getAllEmployees({
        page: 1,
        limit: 1,
        isActive: true,
        ...(outletId && outletId !== "all" ? { outletId } : {}),
      }),
      // Pending bypass requests
      orderService.getPendingBypassRequests({
        page: 1,
        limit: 1,
        ...(outletId && outletId !== "all" ? { outletId } : {}),
      }),
    ]);

    const todayOrders =
      todayOrdersRes.status === "fulfilled"
        ? (todayOrdersRes.value.data?.data?.pagination?.total ?? 0)
        : 0;

    const pendingOrders =
      pendingOrdersRes.status === "fulfilled"
        ? (pendingOrdersRes.value.data?.data?.pagination?.total ?? 0)
        : 0;

    const completedToday =
      completedOrdersRes.status === "fulfilled"
        ? (completedOrdersRes.value.data?.data?.pagination?.total ?? 0)
        : 0;

    // Sum revenue from today's data points in sales report
    let todayRevenue = 0;
    if (salesRes.status === "fulfilled" && salesRes.value.success) {
      const todayPoint = salesRes.value.data.data.find(
        (d) => d.period === today,
      );
      todayRevenue = todayPoint?.totalRevenue ?? 0;
    }

    const activeEmployees =
      employeesRes.status === "fulfilled"
        ? (employeesRes.value.pagination?.total ?? 0)
        : 0;

    const pendingBypassRequests =
      bypassRes.status === "fulfilled" && bypassRes.value.success
        ? (bypassRes.value.data?.pagination?.total ?? 0)
        : 0;

    return {
      totalOrders: todayOrders,
      pendingOrders,
      completedToday,
      todayRevenue,
      activeEmployees,
      pendingBypassRequests,
    };
  },

  // Fetch super admin specific stats (adds outlet & total employee counts).
  async getSuperAdminStats(): Promise<Partial<DashboardStats>> {
    const [outletsRes, employeesRes] = await Promise.allSettled([
      outletService.getAllOutlets({ page: 1, limit: 1 }),
      employeeService.getAllEmployees({ page: 1, limit: 1 }),
    ]);

    const totalOutlets =
      outletsRes.status === "fulfilled" && outletsRes.value.success
        ? (outletsRes.value.pagination?.total ??
          outletsRes.value.data?.length ??
          0)
        : 0;

    // Active outlets
    const activeOutletsRes = await outletService
      .getAllOutlets({ page: 1, limit: 1 })
      .catch(() => null);
    const activeOutlets = activeOutletsRes?.pagination?.total ?? totalOutlets;

    const totalEmployees =
      employeesRes.status === "fulfilled" && employeesRes.value.success
        ? (employeesRes.value.pagination?.total ?? 0)
        : 0;

    return { totalOutlets, activeOutlets, totalEmployees };
  },

  // Fetch recent orders for dashboard widget (top 5)
  async getRecentOrders(outletId?: string): Promise<DashboardRecentOrder[]> {
    const params: any = { page: 1, limit: 5 };
    if (outletId && outletId !== "all") params.outletId = outletId;

    const response = await orderService.getAllOrders(params);
    if (!response.success) return [];

    return (response.data?.orders ?? []).map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customer?.fullName ?? "-",
      outletName: order.outlet?.name,
      status: order.status,
      isPaid: order.isPaid,
      totalWeight: order.totalWeight,
      totalPrice: order.totalPrice,
      createdAt: order.createdAt,
    }));
  },

  // Fetch revenue trend data for the last 6 months
  async getRevenueTrend(outletId?: string): Promise<DashboardRevenuePoint[]> {
    const endDate = getTodayDateString();
    const startDate = getMonthsAgoDateString(6);

    const response = await reportService.getSalesReport({
      period: "monthly",
      startDate,
      endDate,
      outletId: outletId !== "all" ? outletId : undefined,
    });

    if (!response.success) return [];

    return response.data.data.map((d) => ({
      period: d.period,
      totalRevenue: d.totalRevenue,
      totalOrders: d.totalOrders,
      paidOrders: d.paidOrders,
    }));
  },
};
