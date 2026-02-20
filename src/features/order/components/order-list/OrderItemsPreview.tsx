import { TableCell, TableRow } from "@/components/ui/table";
import { OrderItem } from "../../types/order.types";

interface OrderItemsPreviewProps {
  items: OrderItem[];
  colSpan?: number;
}

export function OrderItemsPreview({
  items,
  colSpan = 8,
}: OrderItemsPreviewProps) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="bg-slate-50 p-4">
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Order Items:</h4>
          {items.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-2 rounded border text-sm"
                >
                  <div className="font-medium">{item.laundryItem.name}</div>
                  <div className="text-slate-600">Qty: {item.quantity}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              No items recorded yet. Input details required.
            </p>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
