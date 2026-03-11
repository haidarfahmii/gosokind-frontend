export interface DashboardStats {
  pendingOrders: number;
  processingOrders: number;
  readyToDelivery: number;
  deliveredOrders: number;
  activeEmployees: number;
  pendingBypassRequests: number;
  // Super Admin only
  totalOutlets?: number;
  activeOutlets?: number;
  totalEmployees?: number;
}

export interface DashboardRecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  outletName?: string;
  status: string;
  isPaid: boolean;
  totalWeight?: number;
  totalPrice?: number;
  createdAt: string;
}

export interface DashboardRevenuePoint {
  period: string;
  totalRevenue: number;
  totalOrders: number;
  paidOrders: number;
}
