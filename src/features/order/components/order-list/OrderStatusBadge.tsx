import { Badge } from "@/components/ui/badge";
import {
  OrderStatus,
  getStatusConfig,
} from "@/features/order/types/order.types";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const { label, color, bgColor } = getStatusConfig(status);

  return <Badge className={`${bgColor} ${color} text-xs`}>{label}</Badge>;
}
