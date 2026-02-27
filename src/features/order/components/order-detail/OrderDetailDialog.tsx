"use client";

import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, ExternalLink } from "lucide-react";
import { useSession } from "next-auth/react";
import { Order, getStatusConfig } from "@/features/order/types/order.types";
import {
  CustomerInfoCard,
  OrderSummaryCard,
  LaundryItemsCard,
  StationProcessTimeline,
} from "@/features/order/components/order-detail";

interface OrderDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

export function OrderDetailDialog({
  open,
  onOpenChange,
  order,
}: OrderDetailDialogProps) {
  const { data: session } = useSession();

  if (!order) return null;

  const statusConfig = getStatusConfig(order.status);

  const role = session?.user?.role;
  const detailPageHref =
    role === "SUPER_ADMIN"
      ? `/admin/super-admin/orders/${order.orderNumber}`
      : role === "OUTLET_ADMIN"
        ? `/admin/outlet-admin/orders/${order.orderNumber}`
        : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Order Details - {order.orderNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-600">Status:</span>
            <Badge
              className={`${statusConfig.bgColor} ${statusConfig.color} text-sm px-3 py-1`}
            >
              {statusConfig.label}
            </Badge>
          </div>

          {/* Customer Information */}
          <CustomerInfoCard order={order} />

          {/* Order Summary */}
          <OrderSummaryCard order={order} />

          {/* Laundry Items */}
          <LaundryItemsCard order={order} />

          {/* Processing Timeline */}
          <StationProcessTimeline order={order} />
        </div>

        {detailPageHref && (
          <div className="pt-4 border-t flex justify-end">
            <Link href={detailPageHref} onClick={() => onOpenChange(false)}>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-slate-500"
              >
                <ExternalLink className="w-4 h-4" />
                View Full Details Page
              </Button>
            </Link>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
