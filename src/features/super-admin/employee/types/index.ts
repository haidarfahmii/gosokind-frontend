export type EmployeeRole =
  | "SUPER_ADMIN"
  | "OUTLET_ADMIN"
  | "WORKER_WASHING"
  | "WORKER_IRONING"
  | "WORKER_PACKING"
  | "DRIVER";

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  role: EmployeeRole;
  outletId?: string;
  outletName?: string;
  avatarUrl?: string;
  isActive?: boolean;
  password?: string; // Optional saat edit/display
}

export interface OutletOption {
  id: string;
  name: string;
}
