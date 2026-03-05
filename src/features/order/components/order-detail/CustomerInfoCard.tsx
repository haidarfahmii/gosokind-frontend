"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MapPin } from "lucide-react";
import { Order } from "@/features/order/types/order.types";

interface CustomerInfoCardProps {
  order: Order;
}
/**
 * CustommerInfoCard - Menampilkan informasi pelanggan dan alamat pickup/delivery
 * berdasarkan data pesanan (`order`)
 */
export function CustomerInfoCard({ order }: CustomerInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <User className="w-4 h-4" />
          Customer Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-600">Name</p>
            <p className="font-medium">{order.customer.fullName}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Email</p>
            <p className="font-medium">{order.customer.email}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-slate-600 mb-1 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Pickup/Delivery Address
          </p>
          <p className="font-medium">{order.address.label}</p>
          <p className="text-sm text-slate-600">{order.address.address}</p>
        </div>
      </CardContent>
    </Card>
  );
}
