"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Shirt, Calendar, MoreVertical } from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

// Import mock data
import {
  incomeData,
  statsData,
  employeePerformance,
  bypassRequests,
  recentOrders,
  getStatusBadge,
} from "@/data/mock";

// Import global outlet filter
import { useOutletFilter } from "@/hooks/useOutletFilter";

export default function SuperAdminDashboardPage() {
  // Global Outlet Filter
  const { selectedOutletId, outlets } = useOutletFilter();

  // State untuk filtered data (nanti ini akan diganti dengan actual API call)
  const [filteredStats, setFilteredStats] = useState(statsData);
  const [filteredOrders, setFilteredOrders] = useState(recentOrders);

  // Effect untuk filter data berdasarkan outlet yang dipilih
  useEffect(() => {
    // Fetch data dengan outlet filter
    const fetchDashboardData = async () => {
      const params =
        selectedOutletId !== "all" ? { outletId: selectedOutletId } : {};

      // Call API dengan params
      // const response = await dashboardService.getStats(params);
      // setFilteredStats(response.data);
    };

    fetchDashboardData();
  }, [selectedOutletId]);

  // Get selected outlet name
  const getSelectedOutletName = () => {
    if (selectedOutletId === "all") return "All Outlets";
    const outlet = outlets.find((o) => o.id === selectedOutletId);
    return outlet?.name || "Unknown Outlet";
  };

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Operational Overview
          </h1>
          <p className="text-slate-500 text-sm">
            Monitor laundry status, requests, and revenue
            {selectedOutletId !== "all" && (
              <span className="font-semibold text-blue-600">
                {" "}
                - {getSelectedOutletName()}
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 text-slate-600">
            <Calendar className="w-4 h-4" /> Date Filter
          </Button>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Shirt className="w-4 h-4" /> New Order (Walk-in)
          </Button>
        </div>
      </div>

      {/* Active Filter Banner */}
      {selectedOutletId !== "all" && (
        <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-800">
              <span className="font-semibold">🔍 Filtered View:</span> Dashboard
              data is currently filtered to show{" "}
              <span className="font-bold">{getSelectedOutletName()}</span> only.
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Statistics, orders, and reports below reflect this outlet's data.
            </p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredStats.map((stat, index) => (
          <Card
            key={index}
            className="shadow-sm border-none hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div
                  className={`w-10 h-10 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon size={20} />
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    stat.change.includes("+")
                      ? "text-green-600 bg-green-50"
                      : "text-slate-600 bg-slate-50"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-slate-500 text-sm font-medium">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-bold text-slate-800">
                  {stat.value}
                </h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-none col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Monthly Revenue Trend</CardTitle>
            <CardDescription>
              Income analysis for the last 6 months
              {selectedOutletId !== "all" && ` - ${getSelectedOutletName()}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={incomeData}>
                  <defs>
                    <linearGradient
                      id="colorIncome"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    stroke="#94a3b8"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    fill="url(#colorIncome)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Worker Alerts & Bypass Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Bypass Requests</CardTitle>
              <CardDescription>
                Workers needing approval
                {selectedOutletId !== "all" && ` - ${getSelectedOutletName()}`}
              </CardDescription>
            </div>
            <Badge variant="destructive" className="animate-pulse">
              {bypassRequests.length} Pending
            </Badge>
          </CardHeader>
          <ScrollArea className="h-64">
            <CardContent className="space-y-3">
              {bypassRequests.map((req, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between p-4 bg-orange-50 rounded-lg border border-orange-200"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-800">
                      {req.worker}
                    </p>
                    <p className="text-xs text-slate-600">{req.issue}</p>
                    <p className="text-xs text-orange-600 font-semibold">
                      Order: {req.orderId}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-xs h-7"
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-7 hover:bg-red-50 hover:text-red-600"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </ScrollArea>
        </Card>

        {/* Active Warnings */}
        <Card className="shadow-sm border-none">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Active System Alerts
            </CardTitle>
            <CardDescription>
              Issues requiring attention
              {selectedOutletId !== "all" && ` - ${getSelectedOutletName()}`}
            </CardDescription>
          </CardHeader>
          <ScrollArea className="h-64">
            <CardContent className="space-y-3">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs font-semibold text-red-700">
                  ⚠️ Machine Error - Washer #2
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Reported 15 mins ago. Technician notified.
                </p>
              </div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs font-semibold text-yellow-700">
                  ⏰ Driver Delayed - Order #3020
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Expected delay: 20 minutes. Customer notified.
                </p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs font-semibold text-blue-700">
                  📦 Low Stock Alert - Detergent
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Only 15% remaining. Reorder recommended.
                </p>
              </div>
            </CardContent>
          </ScrollArea>
        </Card>
      </div>

      {/* Employee Performance & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee Performance Leaderboard */}
        <Card className="col-span-1 shadow-sm border-none">
          <CardHeader>
            <CardTitle className="text-base">Top Employees</CardTitle>
            <CardDescription>
              Based on completed jobs today
              {selectedOutletId !== "all" && ` - ${getSelectedOutletName()}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-50 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={employeePerformance}
                  margin={{ top: 0, right: 30, left: 20, bottom: 0 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={100}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip cursor={{ fill: "transparent" }} />
                  <Bar
                    dataKey="jobs"
                    fill="#4f46e5"
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders List */}
        <Card className="col-span-1 lg:col-span-2 shadow-sm border-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent Laundry Orders</CardTitle>
              <CardDescription>
                Real-time order statuses
                {selectedOutletId !== "all" && ` - ${getSelectedOutletName()}`}
              </CardDescription>
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
                <TableHead>Service Info</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order, i) => (
                <TableRow key={i}>
                  <TableCell className="font-semibold text-blue-600">
                    {order.id}
                  </TableCell>
                  <TableCell className="font-medium text-slate-700">
                    {order.customer}
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <p className="font-semibold">{order.service}</p>
                      <p className="text-slate-500">
                        {order.weight || order.qty}
                      </p>
                    </div>
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
                      className={`text-xs font-bold ${order.payment === "Paid" ? "text-green-600" : "text-orange-500"}`}
                    >
                      {order.payment}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-slate-400 hover:text-blue-600"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
