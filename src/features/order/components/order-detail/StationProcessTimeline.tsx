"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock } from "lucide-react";
import { Order } from "@/features/order/types/order.types";
import { format } from "date-fns";

interface StationProcessTimelineProps {
  order: Order;
}

/**
 * StationProcessTimeline - Menampilkan timeline proses pengerjaan pesanan di setiap station.
 * Setiap tahapan menunjukkan status proses, waktu, serta worker yang bertanggung jawab.
 */
export function StationProcessTimeline({ order }: StationProcessTimelineProps) {
  if (!order.stationProcesses || order.stationProcesses.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Processing Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {order.stationProcesses.map((process, index) => (
            <div
              key={process.id}
              className="relative pl-8 pb-4 border-l-2 border-slate-200 last:border-0 last:pb-0"
            >
              {/* Timeline Dot */}
              <div
                className={`absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full ${
                  process.completedAt
                    ? "bg-green-500"
                    : "bg-blue-500 animate-pulse"
                }`}
              />

              {/* Process Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={process.completedAt ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {process.station}
                    </Badge>
                    {process.completedAt ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <span className="text-xs text-slate-500">
                    {format(new Date(process.startedAt), "dd MMM, HH:mm")}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-slate-600">Worker</p>
                  <p className="font-medium">{process.worker.fullName}</p>
                </div>

                {process.completedAt && (
                  <div>
                    <p className="text-sm text-slate-600">Completed at</p>
                    <p className="font-medium text-sm text-green-600">
                      {format(
                        new Date(process.completedAt),
                        "dd MMM yyyy, HH:mm",
                      )}
                    </p>
                  </div>
                )}

                {/* Item Checks */}
                {process.itemChecks && process.itemChecks.length > 0 && (
                  <div className="mt-2 p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs font-semibold text-slate-600 mb-2">
                      Item Verification:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {process.itemChecks.map((check) => (
                        <div
                          key={check.id}
                          className="text-xs flex items-center justify-between"
                        >
                          <span>{check.laundryItem.name}</span>
                          <span className="font-medium">
                            {check.inputQuantity}x
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
