"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, Package } from "lucide-react";
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
          {order.orderItems.map((item) => {
            const isWeight = item.laundryItem.pricingType === "WEIGHT";
            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{item.laundryItem.name}</p>
                    {/* Badge tipe */}
                    {isWeight ? (
                      <Badge
                        variant="outline"
                        className="text-xs border-blue-300 text-blue-700 bg-blue-50 gap-1"
                      >
                        <Scale className="w-3 h-3" /> Kiloan
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-xs border-green-300 text-green-700 bg-green-50 gap-1"
                      >
                        <Package className="w-3 h-3" /> Satuan
                      </Badge>
                    )}
                  </div>
                  {item.laundryItem.category && (
                    <p className="text-sm text-slate-600">
                      {item.laundryItem.category}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold">{`${item.quantity} pcs`}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
