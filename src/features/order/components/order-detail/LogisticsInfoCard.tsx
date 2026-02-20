"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, MapPin, User } from "lucide-react";
import { Order } from "../../types/order.types";

interface LogisticsInfoCardProps {
  order: Order;
}

/**
 * LogisticsInfoCard - Menampilkan informasi driver pickup & delivery,
 * serta koordinat lokasi customer.
 */
export function LogisticsInfoCard({ order }: LogisticsInfoCardProps) {
  const hasDriverInfo = order.pickupDriver || order.deliveryDriver;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Truck className="w-4 h-4" />
          Logistics & Delivery
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Driver Assignments */}
        {hasDriverInfo ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pickup Driver */}
            <div className="p-3 bg-slate-50 rounded-lg space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Pickup Driver
              </p>
              {order.pickupDriver ? (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="font-medium text-sm">
                    {order.pickupDriver.fullName}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">Not assigned</p>
              )}
            </div>

            {/* Delivery Driver */}
            <div className="p-3 bg-slate-50 rounded-lg space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Delivery Driver
              </p>
              {order.deliveryDriver ? (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="font-medium text-sm">
                    {order.deliveryDriver.fullName}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">Not assigned</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic">
            No drivers assigned yet.
          </p>
        )}

        {/* Customer Address with Coordinates */}
        <div className="pt-3 border-t space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Customer Address
          </p>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <Badge variant="outline" className="text-xs mb-1">
                {order.address.label}
              </Badge>
              <p className="text-sm text-slate-700">{order.address.address}</p>
              {order.address.latitude && order.address.longitude && (
                <p className="text-xs text-slate-400 mt-1">
                  Coordinates: {order.address.latitude.toFixed(6)},{" "}
                  {order.address.longitude.toFixed(6)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Outlet Info */}
        {order.outlet && (
          <div className="pt-3 border-t space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Processing Outlet
            </p>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">{order.outlet.name}</p>
                <p className="text-sm text-slate-500">{order.outlet.address}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
