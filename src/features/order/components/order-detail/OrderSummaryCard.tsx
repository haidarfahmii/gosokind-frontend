"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Weight, DollarSign, Calendar, TruckIcon } from "lucide-react";
import { Order } from "../../types/order.types";
import { format } from "date-fns";

interface OrderSummaryCardProps {
  order: Order;
}

/**
 * OrderSummaryCard - Menampilkan ringkasan pesanan seperti berat, total harga,
 * status pembayaran, tanggal pesanan, outlet, serta driver.
 */
export function OrderSummaryCard({ order }: OrderSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Package className="w-4 h-4" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-slate-600 flex items-center gap-1">
              {/* <Weight className="w-4 h-4" /> */}
              Total Weight
            </p>
            <p className="font-bold text-lg">
              {order.totalWeight ? `${order.totalWeight} kg` : "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600 flex items-center gap-1">
              {/* <DollarSign className="w-4 h-4" /> */}
              Total Price
            </p>
            <p className="font-bold text-lg">
              {order.totalPrice
                ? `Rp ${order.totalPrice.toLocaleString("id-ID")}`
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Payment Status</p>
            <Badge variant={order.isPaid ? "default" : "secondary"}>
              {order.isPaid ? "Paid" : "Unpaid"}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-slate-600 flex items-center gap-1">
              {/* <Calendar className="w-4 h-4" /> */}
              Order Date
            </p>
            <p className="font-medium text-sm">
              {format(new Date(order.createdAt), "dd MMM yyyy, HH:mm")}
            </p>
          </div>
        </div>

        {/* Outlet Info */}
        {order.outlet && (
          <div className="pt-3 border-t">
            <p className="text-sm text-slate-600 mb-1">Outlet</p>
            <p className="font-medium">{order.outlet.name}</p>
            <p className="text-sm text-slate-600">{order.outlet.address}</p>
          </div>
        )}

        {/* Driver Info */}
        {(order.pickupDriver || order.deliveryDriver) && (
          <div className="pt-3 border-t grid grid-cols-2 gap-4">
            {order.pickupDriver && (
              <div>
                <p className="text-sm text-slate-600 mb-1 flex items-center gap-1">
                  <TruckIcon className="w-4 h-4" />
                  Pickup Driver
                </p>
                <p className="font-medium">{order.pickupDriver.fullName}</p>
              </div>
            )}
            {order.deliveryDriver && (
              <div>
                <p className="text-sm text-slate-600 mb-1 flex items-center gap-1">
                  <TruckIcon className="w-4 h-4" />
                  Delivery Driver
                </p>
                <p className="font-medium">{order.deliveryDriver.fullName}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
