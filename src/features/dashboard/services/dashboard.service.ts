import axiosInstance from "@/utils/axiosInstance";
import { orderService } from "@/features/order/services/order.service";
import { outletService } from "@/features/super-admin/outlet/services/outlet.service";
import { employeeService } from "@/services/employee.service";
import { OrderStatus } from "@/features/order/types/order.types";
import {
  DashboardStats,
  DashboardRecentOrder,
} from "@/features/dashboard/types/dashboard.types";

const PIPELINE_GROUPS = {
  PENDING: [
    OrderStatus.SCHEDULED_FOR_PICKUP,
    OrderStatus.WAITING_FOR_PICKUP,
    OrderStatus.PICKUP_ON_THE_WAY,
    OrderStatus.ARRIVED_AT_OUTLET,
  ],
  PROCESSING: [
    OrderStatus.WASHING,
    OrderStatus.IRONING,
    OrderStatus.PACKING,
    OrderStatus.WAITING_FOR_PAYMENT,
  ],
  READY: [OrderStatus.READY_FOR_DELIVERY],
  DELIVERED: [
    OrderStatus.DELIVERY_ON_THE_WAY,
    OrderStatus.RECEIVED_BY_CUSTOMER,
    OrderStatus.COMPLETED,
  ],
} as const;

// Dropdown filter widget — hanya status yang dikenali backend validator
export const DELIVERY_FILTER_OPTIONS = [
  { value: "ALL", label: "All Statuses" },
  { value: OrderStatus.SCHEDULED_FOR_PICKUP, label: "Scheduled" },
  { value: OrderStatus.WAITING_FOR_PICKUP, label: "Waiting Pickup" },
  { value: OrderStatus.PICKUP_ON_THE_WAY, label: "Pickup in Progress" },
  { value: OrderStatus.ARRIVED_AT_OUTLET, label: "Arrived at Outlet" },
  { value: OrderStatus.WASHING, label: "Washing" },
  { value: OrderStatus.IRONING, label: "Ironing" },
  { value: OrderStatus.PACKING, label: "Packing" },
  { value: OrderStatus.WAITING_FOR_PAYMENT, label: "Waiting Payment" },
  { value: OrderStatus.READY_FOR_DELIVERY, label: "Ready for Delivery" },
  { value: OrderStatus.DELIVERY_ON_THE_WAY, label: "On the Way" },
  { value: OrderStatus.RECEIVED_BY_CUSTOMER, label: "Received by Customer" },
  { value: OrderStatus.COMPLETED, label: "Completed" },
];

const getTodayLocalRange = (): { startDate: string; endDate: string } => {
  const now = new Date();
  // Start of today local time → konversi ke UTC ISO string
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0,
  );
  // End of today local time → konversi ke UTC ISO string
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999,
  );
  return {
    startDate: startOfDay.toISOString(), // e.g. "2025-03-09T17:00:00.000Z" (WIB)
    endDate: endOfDay.toISOString(), // e.g. "2025-03-10T16:59:59.999Z" (WIB)
  };
};

/**
 * Query count untuk SATU status.
 * Axios throw untuk 4xx → catch → return 0 (tidak merusak Promise.all).
 */
const fetchStatusCount = async (
  status: OrderStatus,
  extraParams: Record<string, any> = {},
): Promise<number> => {
  try {
    const res = await axiosInstance.get("/orders", {
      params: { page: 1, limit: 1, status, ...extraParams },
    });
    return (
      res.data?.data?.pagination?.total ?? res.data?.pagination?.total ?? 0
    );
  } catch {
    return 0;
  }
};

/**
 * Jumlahkan count dari beberapa status secara paralel.
 */
const fetchGroupCount = (
  statuses: readonly OrderStatus[],
  extraParams: Record<string, any> = {},
): Promise<number> =>
  Promise.all(statuses.map((s) => fetchStatusCount(s, extraParams))).then(
    (counts) => counts.reduce((a, b) => a + b, 0),
  );

export const dashboardService = {
  /**
   * Ambil stats pipeline order (Pending / Processing / Ready / Delivered).
   * Tidak pakai filter tanggal → menampilkan semua order aktif.
   */
  async getStats(outletId?: string): Promise<DashboardStats> {
    const params: Record<string, any> = {};
    if (outletId && outletId !== "all") params.outletId = outletId;

    const [
      pendingOrders,
      processingOrders,
      readyToDelivery,
      deliveredOrders,
      employeesRes,
      bypassRes,
    ] = await Promise.all([
      fetchGroupCount(PIPELINE_GROUPS.PENDING, params),
      fetchGroupCount(PIPELINE_GROUPS.PROCESSING, params),
      fetchGroupCount(PIPELINE_GROUPS.READY, params),
      fetchGroupCount(PIPELINE_GROUPS.DELIVERED, params),
      employeeService
        .getAllEmployees({ page: 1, limit: 1, isActive: true, ...params })
        .catch(() => null),
      orderService
        .getPendingBypassRequests({ page: 1, limit: 1, ...params })
        .catch(() => null),
    ]);

    return {
      pendingOrders,
      processingOrders,
      readyToDelivery,
      deliveredOrders,
      activeEmployees: employeesRes?.pagination?.total ?? 0,
      pendingBypassRequests: bypassRes?.success
        ? (bypassRes.data?.pagination?.total ?? 0)
        : 0,
    };
  },

  /** Super Admin only: total outlet & karyawan */
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

  /**
   * Ambil orders hari ini untuk tabel "Today's Delivery".
   */
  async getTodaysDeliveryOrders(params: {
    outletId?: string;
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ orders: DashboardRecentOrder[]; total: number }> {
    const { startDate, endDate } = getTodayLocalRange();

    const queryParams: Record<string, any> = {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      startDate, // ISO full string → misal "2025-03-09T17:00:00.000Z"
      endDate, // ISO full string → misal "2025-03-10T16:59:59.999Z"
    };

    if (params.outletId && params.outletId !== "all")
      queryParams.outletId = params.outletId;
    if (params.search?.trim()) queryParams.search = params.search.trim();
    if (params.status && params.status !== "ALL")
      queryParams.status = params.status;

    try {
      const response = await orderService.getAllOrders(queryParams);
      if (!response.success) return { orders: [], total: 0 };

      const orders = (response.data?.orders ?? []).map((order) => ({
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

      return {
        orders,
        total: response.data?.pagination?.total ?? orders.length,
      };
    } catch (err) {
      console.error("getTodaysDeliveryOrders error:", err);
      return { orders: [], total: 0 };
    }
  },
};
