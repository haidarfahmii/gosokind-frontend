export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedToday: number;
  todayRevenue: number;
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

export interface DashboardData {
  stats: DashboardStats;
  recentOrders: DashboardRecentOrder[];
  revenueData: DashboardRevenuePoint[];
  loading: boolean;
  error: string | null;
}

export interface StatCardItem {
  label: string;
  value: string | number;
  change?: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  changeColor?: string;
}
