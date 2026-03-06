import {
  LayoutDashboard,
  Users,
  UserRound,
  Store,
  BarChart2,
  Settings,
  Shirt,
  Truck,
  Package,
  UserCog,
  Briefcase,
} from "lucide-react";

// Tipe untuk item menu
export interface SidebarItem {
  label: string;
  href: string;
  icon: any;
  key?: string;
  alert?: boolean;
}

// Tipe untuk group menu
export interface SidebarGroup {
  group: string;
  items: SidebarItem[];
}

// Struktur menu navigasi berdasarkan role
export const SIDEBAR_ITEMS: {
  superAdmin: SidebarGroup[];
  outletAdmin: SidebarGroup[];
  worker: SidebarGroup[];
  driver: SidebarGroup[];
} = {
  superAdmin: [
    {
      group: "Dashboard",
      items: [
        {
          label: "Dashboard",
          href: "/admin/super-admin/dashboard",
          icon: LayoutDashboard,
        },
        {
          label: "Outlet",
          href: "/admin/super-admin/outlets",
          icon: Store,
        },
        {
          label: "Customers",
          href: "/admin/super-admin/customers",
          icon: UserRound,
        },
        {
          label: "Employees",
          href: "/admin/super-admin/employees",
          icon: Users,
        },
        {
          label: "Laundry Items",
          href: "/admin/super-admin/items",
          icon: Shirt,
        },
        {
          label: "Orders",
          href: "/admin/super-admin/orders",
          icon: Truck,
        },
        {
          label: "Reports",
          href: "/admin/super-admin/reports",
          icon: BarChart2,
        },
      ],
    },
    {
      group: "Settings",
      items: [
        {
          label: "Settings",
          href: "/admin/super-admin/settings",
          icon: Settings,
        },
      ],
    },
  ],
  outletAdmin: [
    {
      group: "Dashboard",
      items: [
        {
          label: "Dashboard",
          href: "/admin/outlet-admin/dashboard",
          icon: LayoutDashboard,
        },
        {
          label: "Employees",
          href: "/admin/outlet-admin/employees",
          icon: UserCog,
        },
        {
          label: "Orders",
          href: "/admin/outlet-admin/orders",
          icon: Package,
        },
        {
          label: "Reports",
          href: "/admin/outlet-admin/reports",
          icon: BarChart2,
        },
      ],
    },
    {
      group: "Settings",
      items: [
        {
          label: "Settings",
          href: "/admin/outlet-admin/settings",
          icon: Settings,
        },
      ],
    },
  ],
  worker: [
    {
      group: "Employee",
      items: [
        {
          label: "Dashboard",
          href: "/employee/dashboard",
          icon: LayoutDashboard,
        },
        {
          label: "Workfloor",
          href: "/employee/workfloor",
          icon: Briefcase,
        },
      ],
    },
  ],
  driver: [
    {
      group: "Employee",
      items: [
        {
          label: "Dashboard",
          href: "/employee/dashboard",
          icon: LayoutDashboard,
        },
        {
          label: "My Jobs",
          href: "/employee/workfloor",
          icon: Truck,
        },
      ],
    },
  ],
};

// Helper function untuk mendapatkan menu berdasarkan role
export function getMenuByRole(role: string): SidebarGroup[] {
  switch (role) {
    case "SUPER_ADMIN":
      return SIDEBAR_ITEMS.superAdmin;
    case "OUTLET_ADMIN":
      return SIDEBAR_ITEMS.outletAdmin;
    case "WORKER_WASHING":
    case "WORKER_IRONING":
    case "WORKER_PACKING":
      return SIDEBAR_ITEMS.worker;
    case "DRIVER":
      return SIDEBAR_ITEMS.driver;
    default:
      return [];
  }
}

export function getDefaultDashboard(role: string): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "/admin/super-admin/dashboard";
    case "OUTLET_ADMIN":
      return "/admin/outlet-admin/dashboard";
    case "WORKER_WASHING":
    case "WORKER_IRONING":
    case "WORKER_PACKING":
    case "DRIVER":
      return "/employee/dashboard";
    default:
      return "/auth/login";
  }
}
