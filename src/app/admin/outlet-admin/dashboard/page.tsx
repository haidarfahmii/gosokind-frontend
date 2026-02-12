"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Package,
  Users,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data
const mockStats = {
  todayOrders: 24,
  pendingOrders: 8,
  completedToday: 16,
  revenue: 2450000,
  activeEmployees: 12,
  pendingRequests: 3,
};

const mockRecentOrders = [
  {
    id: "#ORD-1234",
    customer: "John Doe",
    service: "Cuci Setrika",
    weight: "3.5 kg",
    status: "Processing",
    payment: "Paid",
  },
  {
    id: "#ORD-1235",
    customer: "Jane Smith",
    service: "Cuci Kering",
    weight: "5.0 kg",
    status: "Washing",
    payment: "Pending",
  },
  {
    id: "#ORD-1236",
    customer: "Bob Johnson",
    service: "Setrika",
    weight: "2.0 kg",
    status: "Ready",
    payment: "Paid",
  },
];

export default function OutletAdminDashboard() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(mockStats);
  const [orders, setOrders] = useState(mockRecentOrders);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setStats(mockStats);
        setOrders(mockRecentOrders);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      Processing: "bg-blue-100 text-blue-700",
      Washing: "bg-yellow-100 text-yellow-700",
      Ready: "bg-green-100 text-green-700",
      Completed: "bg-green-100 text-green-700",
    };
    return variants[status] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
          Dashboard Overview
        </h1>
        <p className="text-slate-500 mt-1">
          Welcome back, {session?.user?.name || "Admin"}! Here's what's
          happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Today's Orders */}
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Today's Orders
            </CardTitle>
            <Package className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">
              {stats.todayOrders}
            </div>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +12% from yesterday
            </p>
          </CardContent>
        </Card>

        {/* Pending Orders */}
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Pending Orders
            </CardTitle>
            <Clock className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">
              {stats.pendingOrders}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Needs immediate attention
            </p>
          </CardContent>
        </Card>

        {/* Completed Today */}
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Completed Today
            </CardTitle>
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">
              {stats.completedToday}
            </div>
            <p className="text-xs text-green-600 mt-1">
              {((stats.completedToday / stats.todayOrders) * 100).toFixed(0)}%
              completion rate
            </p>
          </CardContent>
        </Card>

        {/* Revenue */}
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Today's Revenue
            </CardTitle>
            <DollarSign className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">
              Rp {(stats.revenue / 1000).toFixed(0)}k
            </div>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +8% from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
            <CardDescription>Common tasks for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Package className="mr-2 h-4 w-4" />
              Create New Order
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Manage Staff
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Process Pending Orders
            </Button>
          </CardContent>
        </Card>

        {/* Alerts & Notifications */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Alerts & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-xs font-semibold text-orange-700">
                ⚠️ {stats.pendingRequests} Employee Requests Pending
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Requires your approval
              </p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs font-semibold text-blue-700">
                📦 {stats.pendingOrders} Orders in Queue
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Waiting to be processed
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Recent Orders</CardTitle>
            <CardDescription>Latest orders from your outlet</CardDescription>
          </div>
          <Button variant="ghost" className="text-blue-600 text-sm">
            View All
          </Button>
        </CardHeader>
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order, i) => (
              <TableRow key={i}>
                <TableCell className="font-semibold text-blue-600">
                  {order.id}
                </TableCell>
                <TableCell className="font-medium text-slate-700">
                  {order.customer}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p className="font-semibold">{order.service}</p>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-slate-600">
                  {order.weight}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`${getStatusBadge(order.status)} border-none`}
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span
                    className={`text-xs font-bold ${
                      order.payment === "Paid"
                        ? "text-green-600"
                        : "text-orange-500"
                    }`}
                  >
                    {order.payment}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Employee Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Active Staff Today</CardTitle>
            <CardDescription>
              {stats.activeEmployees} employees currently working
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Washing Team</p>
                    <p className="text-xs text-slate-500">4 active workers</p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700"
                >
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Ironing Team</p>
                    <p className="text-xs text-slate-500">5 active workers</p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700"
                >
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Packing Team</p>
                    <p className="text-xs text-slate-500">3 active workers</p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700"
                >
                  Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
