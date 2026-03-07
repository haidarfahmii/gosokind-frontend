import { TableCell, TableRow } from "@/components/ui/table";
import {
  User,
  MapPin,
  Calendar,
  Package,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { BypassRequest, Order } from "@/features/order/types/order.types";
import { formatCurrency } from "@/utils/formatters";
import {
  OrderStatusBadge,
  OrderActionButtons,
  OrderItemsPreview,
} from "@/features/order/components/order-list";

interface OrderTableRowProps {
  order: Order;
  isExpanded: boolean;
  onToggleExpand: (orderId: string) => void;
  onViewDetail: (order: Order) => void;
  onInputDetails: (order: Order) => void;
  canInputDetails: boolean;
  showOutletColumn?: boolean;
  colSpan?: number;
  orderBypassRequests: BypassRequest[];
  onViewOrderBypass: (order: Order, requests: BypassRequest[]) => void;
}

export function OrderTableRow({
  order,
  isExpanded,
  onToggleExpand,
  onViewDetail,
  onInputDetails,
  canInputDetails,
  showOutletColumn = true,
  colSpan = 8,
  orderBypassRequests,
  onViewOrderBypass,
}: OrderTableRowProps) {
  return (
    <>
      <TableRow
        className="hover:bg-slate-50 cursor-pointer"
        onClick={() => onToggleExpand(order.id)}
      >
        {/* Order Number */}
        <TableCell className="font-medium">
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            )}
            <Package className="w-4 h-4 text-slate-400 shrink-0" />
            {order.orderNumber}
          </div>
        </TableCell>

        {/* Customer */}
        <TableCell>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <div className="font-medium text-sm">
                {order.customer.fullName}
              </div>
              <div className="text-xs text-slate-500">
                {order.customer.email}
              </div>
            </div>
          </div>
        </TableCell>

        {/* Outlet - hanya super admin*/}
        {showOutletColumn && (
          <TableCell>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-sm">{order.outlet?.name ?? "-"}</span>
            </div>
          </TableCell>
        )}

        {/* Status */}
        <TableCell>
          <OrderStatusBadge status={order.status} />
        </TableCell>

        {/* Weight */}
        <TableCell>
          {order.totalWeight ? (
            <span className="font-medium">{order.totalWeight} kg</span>
          ) : (
            <span className="text-slate-400 text-sm">-</span>
          )}
        </TableCell>

        {/* Price */}
        <TableCell>
          {order.totalPrice ? (
            <span className="font-medium">
              {formatCurrency(order.totalPrice)}
            </span>
          ) : (
            <span className="text-slate-400 text-sm">-</span>
          )}
        </TableCell>

        {/* Date */}
        <TableCell>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            {format(new Date(order.createdAt), "dd MMM yyyy")}
          </div>
        </TableCell>

        {/* Actions — stop propagation agar klik tombol tidak trigger toggle row */}
        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
          <OrderActionButtons
            order={order}
            canInputDetails={canInputDetails}
            onViewDetail={onViewDetail}
            onInputDetails={onInputDetails}
            orderBypassRequests={orderBypassRequests}
            onViewOrderBypass={onViewOrderBypass}
          />
        </TableCell>
      </TableRow>

      {/* Expanded Row — Order Items Preview */}
      {isExpanded && <OrderItemsPreview items={order.orderItems} colSpan={8} />}
    </>
  );
}
