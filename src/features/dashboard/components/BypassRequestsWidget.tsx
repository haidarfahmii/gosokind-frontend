"use client";

import { AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { BypassRequest } from "@/features/order/types/order.types";

interface BypassRequestsWidgetProps {
  requests: BypassRequest[];
  loading?: boolean;
  subtitle?: string;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewAll?: () => void;
}

/**
 * BypassRequestsWidget — shows pending bypass requests inline on dashboard.
 * Approve / Reject actions trigger parent callbacks.
 */
export function BypassRequestsWidget({
  requests,
  loading = false,
  subtitle,
  onApprove,
  onReject,
  onViewAll,
}: BypassRequestsWidgetProps) {
  if (loading) {
    return (
      <Card className="shadow-sm border-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-44" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">Bypass Requests</CardTitle>
          <CardDescription>
            {subtitle ?? "Workers needing approval"}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {requests.length > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {requests.length} Pending
            </Badge>
          )}
          {onViewAll && requests.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 text-xs"
              onClick={onViewAll}
            >
              View All
            </Button>
          )}
        </div>
      </CardHeader>

      <ScrollArea className="h-64">
        <CardContent className="space-y-3">
          {requests.length === 0 ? (
            <div className="h-32 flex flex-col items-center justify-center gap-2 text-slate-400">
              <AlertCircle className="w-8 h-8 text-slate-300" />
              <p className="text-sm">No pending bypass requests.</p>
            </div>
          ) : (
            requests.slice(0, 4).map((req) => (
              <div
                key={req.id}
                className="flex items-start justify-between p-4 bg-orange-50 rounded-lg border border-orange-200"
              >
                <div className="space-y-1 min-w-0 flex-1 mr-3">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {req.worker.fullName}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {req.reason}
                  </p>
                  <p className="text-xs text-orange-600 font-semibold">
                    Order: {req.order.orderNumber} · {req.station}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-xs h-7"
                    onClick={() => onApprove(req.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7 hover:bg-red-50 hover:text-red-600"
                    onClick={() => onReject(req.id)}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
