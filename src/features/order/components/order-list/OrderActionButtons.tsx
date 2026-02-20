import { Button } from "@/components/ui/button";
import { Eye, Edit, ShieldAlert } from "lucide-react";
import { Order, OrderStatus, BypassRequest } from "../../types/order.types";

interface OrderActionButtonsProps {
  order: Order;
  canInputDetails: boolean;
  onViewDetail: (order: Order) => void;
  onInputDetails: (order: Order) => void;
  orderBypassRequests: BypassRequest[];
  onViewOrderBypass: (order: Order, requests: BypassRequest[]) => void;
}

export function OrderActionButtons({
  order,
  canInputDetails,
  onViewDetail,
  onInputDetails,
  orderBypassRequests,
  onViewOrderBypass,
}: OrderActionButtonsProps) {
  const needsInputDetails = order.status === OrderStatus.ARRIVED_AT_OUTLET;
  const hasPendingBypass = orderBypassRequests.length > 0;

  return (
    <div className="flex items-center justify-end gap-2">
      {hasPendingBypass && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onViewOrderBypass(order, orderBypassRequests)}
          className="gap-2 border-orange-300 text-orange-600 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-400 relative"
        >
          <ShieldAlert className="w-3 h-3" />
          Bypass
          {/* Badge jumlah request */}
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white leading-none">
            {orderBypassRequests.length}
          </span>
        </Button>
      )}

      {canInputDetails && needsInputDetails && (
        <Button
          size="sm"
          onClick={() => onInputDetails(order)}
          className="gap-2"
        >
          <Edit className="w-3 h-3" />
          Input Details
        </Button>
      )}
      <Button
        size="sm"
        variant="outline"
        onClick={() => onViewDetail(order)}
        className="gap-2"
      >
        <Eye className="w-3 h-3" />
        View
      </Button>
    </div>
  );
}
