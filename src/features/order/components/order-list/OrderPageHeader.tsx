"use client";

import { Package, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface OrderPageHeaderProps {
  onViewBypassRequests?: () => void;
  bypassRequestCount?: number;
}

export function OrderPageHeader({
  onViewBypassRequests,
  bypassRequestCount = 0,
}: OrderPageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Package className="w-6 h-6 text-blue-600" /> Order Management
        </h1>
        <p className="text-slate-500 text-sm">
          Track and manage laundry orders, process pickups, and handle bypass
          requests.
        </p>
      </div>

      {onViewBypassRequests && (
        <Button
          onClick={onViewBypassRequests}
          variant="outline"
          className="gap-2 relative"
        >
          <Bell className="w-4 h-4" />
          Bypass Requests
          {bypassRequestCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {bypassRequestCount}
            </Badge>
          )}
        </Button>
      )}
    </div>
  );
}
