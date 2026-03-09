// Order Status Enum
export enum OrderStatus {
  WAITING_FOR_PICKUP = "WAITING_FOR_PICKUP",
  PICKUP_ON_THE_WAY = "PICKUP_ON_THE_WAY",
  ARRIVED_AT_OUTLET = "ARRIVED_AT_OUTLET",
  WASHING = "WASHING",
  IRONING = "IRONING",
  PACKING = "PACKING",
  WAITING_FOR_PAYMENT = "WAITING_FOR_PAYMENT",
  READY_FOR_DELIVERY = "READY_FOR_DELIVERY",
  DELIVERY_ON_THE_WAY = "DELIVERY_ON_THE_WAY",
  RECEIVED_BY_CUSTOMER = "RECEIVED_BY_CUSTOMER",
  COMPLETED = "COMPLETED",
}

export enum StationType {
  WASHING = "WASHING",
  IRONING = "IRONING",
  PACKING = "PACKING",
}

export enum BypassStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

// Customer Info
export interface CustomerInfo {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
}

// Address Info
export interface AddressInfo {
  id: string;
  label: string;
  address: string;
  latitude: number;
  longitude: number;
}

// Outlet Info
export interface OutletInfo {
  id: string;
  name: string;
  address: string;
}

// Driver Info
export interface DriverInfo {
  id: string;
  fullName: string;
}

// Laundry Item
export interface LaundryItemInfo {
  id: string;
  name: string;
  category?: string;
  pricingType: string;
}

// Order Item
export interface OrderItem {
  id: string;
  laundryItem: {
    id: string;
    name: string;
    category: string | null;
    pricingType: "WEIGHT" | "ITEM";
  };
  quantity: number;
}

// Station Item Check
export interface StationItemCheck {
  id: string;
  laundryItem: {
    id: string;
    name: string;
  };
  inputQuantity: number;
}

// Order Station Process
export interface OrderStationProcess {
  id: string;
  station: StationType;
  worker: {
    id: string;
    fullName: string;
  };
  startedAt: string;
  completedAt?: string;
  itemChecks: StationItemCheck[];
}

// Main Order Interface
export interface Order {
  id: string;
  orderNumber: string;
  totalWeight?: number;
  totalPrice?: number;
  isPaid: boolean;
  status: OrderStatus;
  customer: CustomerInfo;
  address: AddressInfo;
  outlet?: OutletInfo;
  pickupDriver?: DriverInfo;
  deliveryDriver?: DriverInfo;
  orderItems: OrderItem[];
  stationProcesses: OrderStationProcess[];
  createdAt: string;
  updatedAt: string;
}

// Bypass Request
export interface BypassRequest {
  id: string;
  order: {
    id: string;
    orderNumber: string;
    outlet?: OutletInfo;
  };
  worker: {
    id: string;
    fullName: string;
    role: string;
  };
  station: StationType;
  reason: string;
  status: BypassStatus;
  adminNote?: string;
  reviewedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// API Query & Response Types
export interface OrderListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus;
  outletId?: string;
  startDate?: string;
  endDate?: string;
}

export interface OrderListResponse {
  success: boolean;
  message: string;
  data: {
    orders: Order[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

export interface BypassRequestListResponse {
  success: boolean;
  message: string;
  data: {
    bypassRequests: BypassRequest[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

// Input Types for Order Operations
export interface InputOrderDetailsInput {
  totalWeight: number;
  // workerId: string;
  items: Array<{
    laundryItemId: string;
    quantity: number;
  }>;
}

export interface HandleBypassRequestInput {
  action: "APPROVED" | "REJECTED";
  adminNote?: string;
}

// Status Badge Configuration
export const getStatusConfig = (
  status: OrderStatus,
): { label: string; color: string; bgColor: string } => {
  const configs: Record<
    OrderStatus,
    { label: string; color: string; bgColor: string }
  > = {
    [OrderStatus.WAITING_FOR_PICKUP]: {
      label: "Waiting Pickup",
      color: "text-yellow-700",
      bgColor: "bg-yellow-100",
    },
    [OrderStatus.PICKUP_ON_THE_WAY]: {
      label: "Pickup in Progress",
      color: "text-blue-700",
      bgColor: "bg-blue-100",
    },
    [OrderStatus.ARRIVED_AT_OUTLET]: {
      label: "Arrived at Outlet",
      color: "text-purple-700",
      bgColor: "bg-purple-100",
    },
    [OrderStatus.WASHING]: {
      label: "Washing",
      color: "text-cyan-700",
      bgColor: "bg-cyan-100",
    },
    [OrderStatus.IRONING]: {
      label: "Ironing",
      color: "text-orange-700",
      bgColor: "bg-orange-100",
    },
    [OrderStatus.PACKING]: {
      label: "Packing",
      color: "text-pink-700",
      bgColor: "bg-pink-100",
    },
    [OrderStatus.WAITING_FOR_PAYMENT]: {
      label: "Waiting Payment",
      color: "text-red-700",
      bgColor: "bg-red-100",
    },
    [OrderStatus.READY_FOR_DELIVERY]: {
      label: "Ready for Delivery",
      color: "text-indigo-700",
      bgColor: "bg-indigo-100",
    },
    [OrderStatus.DELIVERY_ON_THE_WAY]: {
      label: "Delivery in Progress",
      color: "text-blue-700",
      bgColor: "bg-blue-100",
    },
    [OrderStatus.RECEIVED_BY_CUSTOMER]: {
      label: "Received by Customer",
      color: "text-teal-700",
      bgColor: "bg-teal-100",
    },
    [OrderStatus.COMPLETED]: {
      label: "Completed",
      color: "text-green-700",
      bgColor: "bg-green-100",
    },
  };

  return configs[status];
};
