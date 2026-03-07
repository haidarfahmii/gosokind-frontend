"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/features/order/types/order.types";

interface LaundryItemsCardProps {
  order: Order;
}

// LaundryItemsCard - Menampilkan daftar item laundry yang terdapat dalam pesanan.
export function LaundryItemsCard({ order }: LaundryItemsCardProps) {
  if (!order.orderItems || order.orderItems.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Laundry Items</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {order.orderItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
            >
              <div>
                <p className="font-medium">{item.laundryItem.name}</p>
                {item.laundryItem.category && (
                  <p className="text-sm text-slate-600">
                    {item.laundryItem.category}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="font-semibold">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
