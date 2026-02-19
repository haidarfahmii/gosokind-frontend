import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { LaundryItem } from "../../hooks/useLaundryItems";

interface OrderItem {
  laundryItemId: string;
  quantity: number;
}

interface LaundryItemRowProps {
  item: OrderItem;
  index: number;
  laundryItems: LaundryItem[];
  onItemChange: (
    index: number,
    field: "laundryItemId" | "quantity",
    value: string | number,
  ) => void;
  onRemove: (index: number) => void;
}

/**
 * Satu baris item laundry di dalam form order details.
 * Berisi dropdown pilihan item dan input quantity,
 * serta tombol hapus untuk menghilangkan baris ini.
 */
export function LaundryItemRow({
  item,
  index,
  laundryItems,
  onItemChange,
  onRemove,
}: LaundryItemRowProps) {
  return (
    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
      <div className="flex-1 space-y-3">
        {/* Item Select */}
        <div className="space-y-1">
          <Label className="text-sm">
            Item <span className="text-red-500">*</span>
          </Label>
          <Select
            value={item.laundryItemId}
            onValueChange={(value) =>
              onItemChange(index, "laundryItemId", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select item" />
            </SelectTrigger>
            <SelectContent>
              {laundryItems.map((laundryItem) => (
                <SelectItem key={laundryItem.id} value={laundryItem.id}>
                  {laundryItem.name}
                  {laundryItem.basePrice && (
                    <span className="text-slate-500 ml-2">
                      (Rp {laundryItem.basePrice.toLocaleString()})
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quantity Input */}
        <div className="space-y-1">
          <Label className="text-sm">
            Quantity <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) =>
              onItemChange(index, "quantity", parseInt(e.target.value) || 1)
            }
            placeholder="Quantity"
          />
        </div>
      </div>

      {/* Remove Button */}
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => onRemove(index)}
        className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-6"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
