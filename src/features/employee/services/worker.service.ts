import axiosInstance from "@/utils/axiosInstance";
import {
  StationOrder,
  StationOrderDTO,
  ProcessPayload,
  BypassPayload,
  StationType,
  WorkerHistoryDTO,
  WorkerHistoryItem,
} from "@/@types/worker.types";

const WORKER_ENDPOINT = "/worker";

// Mapper
const mapDtoToStationOrder = (dto: StationOrderDTO): StationOrder => ({
  id: dto.id,
  orderId: dto.id,
  orderNumber: dto.orderNumber,
  items: dto.orderItems.map((item) => ({
    id: item.laundryItem.id,
    name: item.laundryItem.name,
    qty: item.quantity,
  })),
  totalQty: dto.orderItems.reduce((acc, i) => acc + i.quantity, 0),
  status: dto.status as StationType | "ON_HOLD",
  isLocked: dto.hasPendingBypass === true,
});

// API Calls
export const getStationOrders = async (
  station: StationType,
  page: number = 1,
  limit: number = 10,
  sortBy: string = "asc",
  timeFilter: string = "all"
): Promise<{ data: StationOrder[]; meta: any }> => {
  const { data } = await axiosInstance.get<{ data: StationOrderDTO[]; meta: any }>(
    `${WORKER_ENDPOINT}/orders`,
    { params: { station, page, limit, sortBy, timeFilter } },
  );
  return {
    data: data.data.map(mapDtoToStationOrder),
    meta: data.meta
  };
};

export const processOrder = async (payload: ProcessPayload): Promise<void> => {
  await axiosInstance.post(`${WORKER_ENDPOINT}/process`, payload);
};

/**
 * CRITICAL: Backend bypass endpoint is /api/bypass, NOT /api/worker/bypass.
 * This matches Feature 2's bypass service route.
 */
export const requestBypass = async (payload: BypassPayload): Promise<void> => {
  const { orderId, station, reason, itemChecks } = payload;

  await axiosInstance.post(`/orders/${orderId}/bypass-request`, {
    station,
    reason,
    itemChecks,
  });
};

export const getWorkerHistory = async (
  page: number = 1,
  limit: number = 10,
  sortBy: string = "desc",
  timeFilter: string = "all"
): Promise<{ data: WorkerHistoryItem[]; meta: any }> => {
  const { data } = await axiosInstance.get<{ data: WorkerHistoryDTO[]; meta: any }>(
    `${WORKER_ENDPOINT}/history`,
    { params: { page, limit, sortBy, timeFilter } }
  );
  return {
    data: data.data.map((dto) => ({
      id: dto.id,
      orderNumber: dto.order.orderNumber,
      items: dto.order.orderItems
        .map((i) => `${i.quantity} ${i.laundryItem.name}`)
        .join(", "),
      date:
        new Date(dto.completedAt).toLocaleDateString("id-ID") +
        " " +
        new Date(dto.completedAt).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      status: dto.order.status.replace(/_/g, " "),
    })),
    meta: data.meta
  };
};
