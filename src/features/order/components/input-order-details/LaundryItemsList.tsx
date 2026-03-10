import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { LaundryItem } from "@/features/order/hooks/useLaundryItems";
import { LaundryItemRow } from "@/features/order/components/input-order-details/LaundryItemRow";

interface OrderItem {
  laundryItemId: string;
  quantity: number;
}

interface LaundryItemsListProps {
  items: OrderItem[];
  laundryItems: LaundryItem[];
  loadingItems: boolean;
  itemsError?: string;
  itemsTouched?: boolean;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onItemChange: (
    index: number,
    field: "laundryItemId" | "quantity",
    value: string | number,
  ) => void;
  onItemSelect: (index: number, laundryItemId: string) => void;
}

/**
 * Section Laundry Items: header dengan tombol Add, daftar baris item,
 * loading state, dan pesan error validasi untuk keseluruhan list.
 */
export function LaundryItemsList({
  items,
  laundryItems,
  loadingItems,
  itemsError,
  itemsTouched,
  onAddItem,
  onRemoveItem,
  onItemChange,
  onItemSelect,
}: LaundryItemsListProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">
          Laundry Items <span className="text-red-500">*</span>
        </Label>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onAddItem}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      {/* Content */}
      {loadingItems ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <LaundryItemRow
              key={index}
              item={item}
              index={index}
              laundryItems={laundryItems}
              onItemChange={onItemChange}
              onItemSelect={onItemSelect}
              onRemove={onRemoveItem}
            />
          ))}
        </div>
      )}

      {/* Error validasi untuk keseluruhan list items */}
      {typeof itemsError === "string" && itemsTouched && (
        <p className="text-sm text-red-500">{itemsError}</p>
      )}
    </div>
  );
}
