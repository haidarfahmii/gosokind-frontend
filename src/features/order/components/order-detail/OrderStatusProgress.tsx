"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarClock,
  CheckCircle2,
  Truck,
  Package,
  WashingMachine,
  Flame,
  Box,
  CreditCard,
  Home,
} from "lucide-react";
import {
  OrderStatus,
  getStatusConfig,
} from "@/features/order/types/order.types";
import { cn } from "@/lib/utils";

interface OrderStatusProgressProps {
  currentStatus: OrderStatus;
}

const STATUS_STEPS: {
  status: OrderStatus;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
}[] = [
  {
    status: OrderStatus.SCHEDULED_FOR_PICKUP,
    label: "Scheduled for Pickup",
    shortLabel: "Scheduled",
    icon: CalendarClock,
  },
  {
    status: OrderStatus.WAITING_FOR_PICKUP,
    label: "Waiting for Pickup",
    shortLabel: "Pickup Queue",
    icon: Package,
  },
  {
    status: OrderStatus.PICKUP_ON_THE_WAY,
    label: "Pickup in Progress",
    shortLabel: "Pickup",
    icon: Truck,
  },
  {
    status: OrderStatus.ARRIVED_AT_OUTLET,
    label: "Arrived at Outlet",
    shortLabel: "At Outlet",
    icon: Home,
  },
  {
    status: OrderStatus.WASHING,
    label: "Washing",
    shortLabel: "Washing",
    icon: WashingMachine,
  },
  {
    status: OrderStatus.IRONING,
    label: "Ironing",
    shortLabel: "Ironing",
    icon: Flame,
  },
  {
    status: OrderStatus.PACKING,
    label: "Packing",
    shortLabel: "Packing",
    icon: Box,
  },
  {
    status: OrderStatus.WAITING_FOR_PAYMENT,
    label: "Waiting for Payment",
    shortLabel: "Payment",
    icon: CreditCard,
  },
  {
    status: OrderStatus.READY_FOR_DELIVERY,
    label: "Ready for Delivery",
    shortLabel: "Ready",
    icon: Package,
  },
  {
    status: OrderStatus.DELIVERY_ON_THE_WAY,
    label: "Delivery in Progress",
    shortLabel: "Delivery",
    icon: Truck,
  },
  {
    status: OrderStatus.RECEIVED_BY_CUSTOMER,
    label: "Received by Customer",
    shortLabel: "Received",
    icon: Home,
  },
  {
    status: OrderStatus.COMPLETED,
    label: "Completed",
    shortLabel: "Done",
    icon: CheckCircle2,
  },
];

const STATUS_ORDER_INDEX: Record<OrderStatus, number> = {
  [OrderStatus.SCHEDULED_FOR_PICKUP]: 0,
  [OrderStatus.WAITING_FOR_PICKUP]: 1,
  [OrderStatus.PICKUP_ON_THE_WAY]: 2,
  [OrderStatus.ARRIVED_AT_OUTLET]: 3,
  [OrderStatus.WASHING]: 4,
  [OrderStatus.IRONING]: 5,
  [OrderStatus.PACKING]: 6,
  [OrderStatus.WAITING_FOR_PAYMENT]: 7,
  [OrderStatus.READY_FOR_DELIVERY]: 8,
  [OrderStatus.DELIVERY_ON_THE_WAY]: 9,
  [OrderStatus.RECEIVED_BY_CUSTOMER]: 10,
  [OrderStatus.COMPLETED]: 11,
};

/**
 * OrderStatusProgress - Menampilkan visual progress bar alur order.
 * Menunjukkan status mana yang sudah selesai, sedang berjalan, dan belum.
 * Khusus untuk halaman Order Detail (lebih lengkap dari dialog).
 */
export function OrderStatusProgress({
  currentStatus,
}: OrderStatusProgressProps) {
  const currentIndex = STATUS_ORDER_INDEX[currentStatus];
  const statusConfig = getStatusConfig(currentStatus);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <span>Order Progress</span>
          <span
            className={cn(
              "text-sm font-medium px-3 py-1 rounded-full",
              statusConfig.bgColor,
              statusConfig.color,
            )}
          >
            {statusConfig.label}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Mobile: vertical list */}
        <div className="block md:hidden space-y-2">
          {STATUS_STEPS.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const Icon = step.icon;

            return (
              <div key={step.status} className="flex items-center gap-3">
                {/* Icon */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2",
                    isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : isCurrent
                        ? "bg-blue-500 border-blue-500 text-white animate-pulse"
                        : "bg-white border-slate-200 text-slate-400",
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                {/* Label */}
                <div>
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isCompleted
                        ? "text-green-600"
                        : isCurrent
                          ? "text-blue-600"
                          : "text-slate-400",
                    )}
                  >
                    {step.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop: horizontal stepper */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Progress Track */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200">
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{
                  width: `${(currentIndex / (STATUS_STEPS.length - 1)) * 100}%`,
                }}
              />
            </div>

            {/* Steps */}
            <div className="relative flex justify-between">
              {STATUS_STEPS.map((step, index) => {
                const isCompleted = index < currentIndex;
                const isCurrent = index === currentIndex;
                const Icon = step.icon;

                return (
                  <div
                    key={step.status}
                    className="flex flex-col items-center gap-2"
                    style={{ width: `${100 / STATUS_STEPS.length}%` }}
                  >
                    {/* Circle */}
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white z-10 transition-all",
                        isCompleted
                          ? "bg-green-500 border-green-500 text-white"
                          : isCurrent
                            ? "bg-blue-500 border-blue-500 text-white"
                            : "border-slate-200 text-slate-400",
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>

                    {/* Label */}
                    <p
                      className={cn(
                        "text-[10px] text-center font-medium leading-tight max-w-15",
                        isCompleted
                          ? "text-green-600"
                          : isCurrent
                            ? "text-blue-600 font-semibold"
                            : "text-slate-400",
                      )}
                    >
                      {step.shortLabel}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
