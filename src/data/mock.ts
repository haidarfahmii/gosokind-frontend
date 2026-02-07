import { Users, Store, Shirt, AlertCircle } from "lucide-react";

export const outlets = [
  {
    id: 1,
    name: "Gosokind BSD City",
    address: "Jl. BSD Raya Utama No. 12, Tangerang Selatan",
    phone: "0812-3456-7890",
    lat: "-6.301",
    long: "106.654",
    status: "Active",
  },
  {
    id: 2,
    name: "Gosokind Bintaro",
    address: "Jl. Bintaro Utama Sektor 3, Tangerang Selatan",
    phone: "0812-9876-5432",
    lat: "-6.280",
    long: "106.720",
    status: "Active",
  },
  {
    id: 3,
    name: "Gosokind Pamulang",
    address: "Jl. Siliwangi No. 45, Pamulang",
    phone: "0813-4567-8901",
    lat: "-6.342",
    long: "106.736",
    status: "Maintenance",
  },
];

export const users = [
  {
    id: 1,
    name: "Super Admin",
    email: "admin@gosokind.com",
    role: "super_admin",
    outletId: null,
  },
  {
    id: 2,
    name: "Budi Driver",
    email: "budi@driver.com",
    role: "driver",
    outletId: 1,
  },
  {
    id: 3,
    name: "Siti Worker",
    email: "siti@worker.com",
    role: "worker",
    outletId: 1,
  },
  {
    id: 4,
    name: "Andi Outlet",
    email: "andi@outlet.com",
    role: "outlet_admin",
    outletId: 2,
  },
  {
    id: 5,
    name: "Customer 1",
    email: "cust1@gmail.com",
    role: "customer",
    outletId: null,
  },
];

export const inventoryItems = [
  { id: 1, name: "Kemeja Panjang", category: "Atasan", price: 5000 },
  { id: 2, name: "Celana Jeans", category: "Bawahan", price: 7000 },
  { id: 3, name: "Sprei King", category: "Linen", price: 15000 },
];

// Stats Data (Operational Metrics)
export const statsData = [
  {
    label: "Today's Revenue",
    value: "Rp 2.500.000",
    change: "+12%",
    icon: Store,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    label: "Active Orders",
    value: "45",
    change: "+5",
    icon: Shirt,
    color: "text-indigo-600",
    bg: "bg-indigo-100",
  }, // Orders in process
  {
    label: "Active Workers",
    value: "12",
    change: "80%",
    icon: Users,
    color: "text-green-600",
    bg: "bg-green-100",
  }, // Attendance logic
  {
    label: "Pending Payment",
    value: "Rp 850.000",
    change: "5 Orders",
    icon: AlertCircle,
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
];

// Income Report (Sales Report)
export const incomeData = [
  { name: "Sen", income: 1500000 },
  { name: "Sel", income: 2300000 },
  { name: "Rab", income: 1800000 },
  { name: "Kam", income: 3200000 },
  { name: "Jum", income: 2900000 },
  { name: "Sab", income: 4500000 },
  { name: "Min", income: 3800000 },
];

// Employee Performance (Worker/Driver Jobs)
export const employeePerformance = [
  { name: "Budi (Driver)", jobs: 15, type: "Pickup/Delivery" },
  { name: "Siti (Wash)", jobs: 28, type: "Washing" },
  { name: "Joko (Iron)", jobs: 22, type: "Ironing" },
  { name: "Rina (Pack)", jobs: 20, type: "Packing" },
  { name: "Asep (Driver)", jobs: 12, type: "Pickup/Delivery" },
];

// Bypass Requests (Critical Logic for Item Mismatch)
export const bypassRequests = [
  {
    id: "REQ-001",
    worker: "Siti (Washing)",
    orderId: "#ORD-3021",
    issue: "Kaos kurang 1 pcs dari data awal",
    time: "5 min ago",
  },
  {
    id: "REQ-002",
    worker: "Joko (Ironing)",
    orderId: "#ORD-3015",
    issue: "Ditemukan noda luntur, butuh konfirmasi",
    time: "15 min ago",
  },
];

// Recent Orders with Laundry Statuses
export const recentOrders = [
  {
    id: "ORD-3025",
    customer: "Andi Wijaya",
    service: "Cuci Komplit",
    weight: "5 Kg",
    status: "Menunggu Penjemputan",
    payment: "Unpaid",
  },
  {
    id: "ORD-3024",
    customer: "Luna Maya",
    service: "Dry Clean",
    qty: "3 Pcs",
    status: "Sedang Dicuci",
    payment: "Paid",
  },
  {
    id: "ORD-3023",
    customer: "Deddy Corbuzier",
    service: "Cuci Setrika",
    weight: "12 Kg",
    status: "Sedang Disetrika",
    payment: "Paid",
  },
  {
    id: "ORD-3022",
    customer: "Raffi Ahmad",
    service: "Cuci Komplit",
    weight: "8 Kg",
    status: "Sedang Di Packing",
    payment: "Unpaid",
  },
  {
    id: "ORD-3021",
    customer: "Nagita Slavina",
    service: "Bed Cover",
    qty: "2 Pcs",
    status: "Siap Diantar",
    payment: "Paid",
  },
];

export const getStatusBadge = (status: string) => {
  switch (status) {
    case "Menunggu Penjemputan":
      return "bg-slate-100 text-slate-600";
    case "Sedang Dicuci":
      return "bg-blue-100 text-blue-600";
    case "Sedang Disetrika":
      return "bg-orange-100 text-orange-600";
    case "Sedang Di Packing":
      return "bg-yellow-100 text-yellow-600";
    case "Siap Diantar":
      return "bg-green-100 text-green-600"; // Menunggu pembayaran lunas / kurir
    default:
      return "bg-gray-100 text-gray-600";
  }
};
