import axiosInstance from "@/utils/axiosInstance";
import {
  OrderListQuery,
  OrderListResponse,
  OrderResponse,
  InputOrderDetailsInput,
  HandleBypassRequestInput,
  BypassRequestListResponse,
} from "../types/order.types";

export const orderService = {
  /**
   * Get all orders with filters
   * Super Admin: can see all orders, can filter by outlet
   * Outlet Admin: automatically scoped to their outlet
   */
  async getAllOrders(params: OrderListQuery): Promise<OrderListResponse> {
    const response = await axiosInstance.get("/orders", { params });
    return response.data;
  },

  /**
   * Get order by ID
   * Includes full details with station processes and bypass requests
   */
  async getOrderById(orderId: string): Promise<OrderResponse> {
    const response = await axiosInstance.get(`/orders/${orderId}`);
    return response.data;
  },

  /**
   * Get order by orderNumber (human-readable identifier)
   * Digunakan untuk halaman detail dengan URL /orders/INV-YYYYMMDDXXX
   */
  async getOrderByOrderNumber(orderNumber: string): Promise<OrderResponse> {
    const response = await axiosInstance.get(`/orders/number/${orderNumber}`);
    return response.data;
  },

  /**
   * Input order details (weight & items) after arrival at outlet
   * Precondition: Order status must be ARRIVED_AT_OUTLET
   * Result: Status changes to WASHING
   */
  async inputOrderDetails(
    orderId: string,
    data: InputOrderDetailsInput,
  ): Promise<OrderResponse> {
    const response = await axiosInstance.post(
      `/orders/${orderId}/input-details`,
      data,
    );
    return response.data;
  },

  /**
   * Get pending bypass requests
   * Super Admin: can see all, can filter by outlet
   * Outlet Admin: automatically scoped to their outlet
   */
  async getPendingBypassRequests(params?: {
    page?: number;
    limit?: number;
    outletId?: string;
  }): Promise<BypassRequestListResponse> {
    const response = await axiosInstance.get(
      "/orders/bypass-requests/pending",
      {
        params,
      },
    );
    return response.data;
  },

  /**
   * Handle bypass request (approve/reject)
   * Only admins can perform this action
   */
  async handleBypassRequest(
    bypassRequestId: string,
    data: HandleBypassRequestInput,
  ): Promise<{
    success: boolean;
    message: string;
    data: any;
  }> {
    const response = await axiosInstance.patch(
      `/orders/bypass-requests/${bypassRequestId}`,
      data,
    );
    return response.data;
  },
};
