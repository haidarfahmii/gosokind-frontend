"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { Order, getStatusConfig } from "../types/order.types";
import {
  CustomerInfoCard,
  OrderSummaryCard,
  LaundryItemsCard,
  StationProcessTimeline,
} from "./order-detail";

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
  if (!order) return null;

  const statusConfig = getStatusConfig(order.status);

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
      </DialogContent>
    </Dialog>
  );
}
