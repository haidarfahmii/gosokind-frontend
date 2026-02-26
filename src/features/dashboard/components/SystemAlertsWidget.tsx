"use client";

import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Alert {
  id: string;
  type: "error" | "warning" | "info";
  title: string;
  description: string;
}

interface SystemAlertsWidgetProps {
  alerts?: Alert[];
  pendingRequests?: number;
  pendingOrders?: number;
}

const ALERT_STYLES: Record<Alert["type"], { wrapper: string; title: string }> =
  {
    error: {
      wrapper: "p-4 bg-red-50 border border-red-200 rounded-lg",
      title: "text-xs font-semibold text-red-700",
    },
    warning: {
      wrapper: "p-4 bg-yellow-50 border border-yellow-200 rounded-lg",
      title: "text-xs font-semibold text-yellow-700",
    },
    info: {
      wrapper: "p-4 bg-blue-50 border border-blue-200 rounded-lg",
      title: "text-xs font-semibold text-blue-700",
    },
  };

/**
 * SystemAlertsWidget — shows operational alerts and notifications on dashboard.
 * Accepts dynamic alert items or falls back to operational defaults.
 */
export function SystemAlertsWidget({
  alerts,
  pendingRequests = 0,
  pendingOrders = 0,
}: SystemAlertsWidgetProps) {
  // Build default alerts from props if no custom alerts passed
  const activeAlerts: Alert[] = alerts ?? [
    ...(pendingRequests > 0
      ? [
          {
            id: "bypass",
            type: "warning" as const,
            title: `⚠️ ${pendingRequests} Employee Request${pendingRequests > 1 ? "s" : ""} Pending`,
            description: "Requires your approval",
          },
        ]
      : []),
    ...(pendingOrders > 0
      ? [
          {
            id: "orders",
            type: "info" as const,
            title: `📦 ${pendingOrders} Order${pendingOrders > 1 ? "s" : ""} in Queue`,
            description: "Waiting to be processed",
          },
        ]
      : []),
  ];

  return (
    <Card className="shadow-sm border-none">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-500" />
          Alerts &amp; Notifications
        </CardTitle>
      </CardHeader>
      <ScrollArea className="h-48">
        <CardContent className="space-y-3">
          {activeAlerts.length === 0 ? (
            <div className="h-24 flex items-center justify-center text-slate-400 text-sm">
              No active alerts. All clear! ✅
            </div>
          ) : (
            activeAlerts.map((alert) => {
              const style = ALERT_STYLES[alert.type];
              return (
                <div key={alert.id} className={style.wrapper}>
                  <p className={style.title}>{alert.title}</p>
                  <p className="text-xs text-slate-600 mt-1">
                    {alert.description}
                  </p>
                </div>
              );
            })
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
