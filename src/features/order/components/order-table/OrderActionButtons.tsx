import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-react";
import { Order, OrderStatus } from "../../types/order.types";

interface OrderActionButtonsProps {
  order: Order;
  canInputDetails: boolean;
  onViewDetail: (order: Order) => void;
  onInputDetails: (order: Order) => void;
}

export function OrderActionButtons({
  order,
  canInputDetails,
  onViewDetail,
  onInputDetails,
}: OrderActionButtonsProps) {
  const needsInputDetails = order.status === OrderStatus.ARRIVED_AT_OUTLET;

  return (
    <div className="flex items-center justify-end gap-2">
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
