"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, CheckCircle2, XCircle, Clock } from "lucide-react";
import { BypassRequest, BypassStatus } from "../../types/order.types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface BypassRequestsSectionProps {
  bypassRequests: BypassRequest[];
}

const bypassStatusConfig: Record<
  BypassStatus,
  { label: string; color: string; bgColor: string; Icon: React.ElementType }
> = {
  [BypassStatus.PENDING]: {
    label: "Pending Review",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
    Icon: Clock,
  },
  [BypassStatus.APPROVED]: {
    label: "Approved",
    color: "text-green-700",
    bgColor: "bg-green-100",
    Icon: CheckCircle2,
  },
  [BypassStatus.REJECTED]: {
    label: "Rejected",
    color: "text-red-700",
    bgColor: "bg-red-100",
    Icon: XCircle,
  },
};

/**
 * BypassRequestsSection - Menampilkan riwayat bypass request pada suatu order.
 * Hanya ditampilkan jika order memiliki bypass request.
 */
export function BypassRequestsSection({
  bypassRequests,
}: BypassRequestsSectionProps) {
  if (!bypassRequests || bypassRequests.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-orange-500" />
          Bypass Request History
          <Badge variant="outline" className="ml-auto text-xs">
            {bypassRequests.length}{" "}
            {bypassRequests.length === 1 ? "request" : "requests"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {bypassRequests.map((request) => {
          const config = bypassStatusConfig[request.status];
          const StatusIcon = config.Icon;

          return (
            <div key={request.id} className="border rounded-lg p-4 space-y-3">
              {/* Header: Station + Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-semibold">
                    {request.station}
                  </Badge>
                  <span className="text-sm text-slate-500">
                    by {request.worker.fullName}
                  </span>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full",
                    config.bgColor,
                    config.color,
                  )}
                >
                  <StatusIcon className="w-3 h-3" />
                  {config.label}
                </span>
              </div>

              {/* Reason */}
              <div>
                <p className="text-xs text-slate-500 mb-1">Reason</p>
                <p className="text-sm text-slate-800 bg-slate-50 p-2 rounded">
                  {request.reason}
                </p>
              </div>

              {/* Admin Note */}
              {request.adminNote && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Admin Note</p>
                  <p className="text-sm text-slate-800 bg-slate-50 p-2 rounded border-l-2 border-blue-400">
                    {request.adminNote}
                  </p>
                </div>
              )}

              {/* Footer: timestamp */}
              <p className="text-xs text-slate-400">
                Submitted:{" "}
                {format(new Date(request.createdAt), "dd MMM yyyy, HH:mm")}
                {request.updatedAt !== request.createdAt && (
                  <>
                    {" "}
                    · Updated:{" "}
                    {format(new Date(request.updatedAt), "dd MMM yyyy, HH:mm")}
                  </>
                )}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
