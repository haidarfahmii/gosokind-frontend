import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Scale, Package } from "lucide-react";
import { LaundryItem } from "@/features/order/hooks/useLaundryItems";

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
  // update laundryItemId + quantity atomik
  onItemSelect: (index: number, laundryItemId: string) => void;
  onRemove: (index: number) => void;
}

export function LaundryItemRow({
  item,
  index,
  laundryItems,
  onItemChange,
  onItemSelect,
  onRemove,
}: LaundryItemRowProps) {
  const selectedItem = laundryItems.find((li) => li.id === item.laundryItemId);
  const isWeightType = selectedItem?.pricingType === "WEIGHT";

  const weightItems = laundryItems.filter((li) => li.pricingType === "WEIGHT");
  const unitItems = laundryItems.filter((li) => li.pricingType === "ITEM");

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (isWeightType) {
      const val = parseFloat(raw);
      onItemChange(index, "quantity", isNaN(val) ? 0.1 : val);
    } else {
      const val = parseInt(raw);
      onItemChange(index, "quantity", isNaN(val) ? 1 : Math.max(1, val));
    }
  };

  const estimatedPrice =
    selectedItem?.basePrice && item.quantity > 0
      ? selectedItem.basePrice * item.quantity
      : null;

  return (
    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
      <div className="flex-1 space-y-3">
        {/* ── Item Select ── */}
        <div className="space-y-1">
          <Label className="text-sm">
            Item <span className="text-red-500">*</span>
          </Label>

          <Select
            value={item.laundryItemId}
            onValueChange={(value) => onItemSelect(index, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih item laundry" />
            </SelectTrigger>

            <SelectContent>
              {weightItems.length > 0 && (
                <SelectGroup>
                  <SelectLabel className="text-blue-600">
                    <Scale className="w-3 h-3" />
                    Kiloan (per kg)
                  </SelectLabel>
                  {weightItems.map((li) => (
                    <SelectItem key={li.id} value={li.id}>
                      {li.name}
                      {li.basePrice
                        ? ` — Rp ${li.basePrice.toLocaleString("id-ID")}/kg`
                        : ""}
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}

              {unitItems.length > 0 && (
                <SelectGroup>
                  <SelectLabel className="text-green-600">
                    <Package className="w-3 h-3" />
                    Satuan (per pcs)
                  </SelectLabel>
                  {unitItems.map((li) => (
                    <SelectItem key={li.id} value={li.id}>
                      {li.name}
                      {li.basePrice
                        ? ` — Rp ${li.basePrice.toLocaleString("id-ID")}/pcs`
                        : ""}
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}
            </SelectContent>
          </Select>

          {selectedItem && (
            <div className="flex items-center gap-2 mt-1">
              {isWeightType ? (
                <Badge
                  variant="outline"
                  className="text-xs border-blue-300 text-blue-700 bg-blue-50"
                >
                  <Scale className="w-3 h-3" />
                  Kiloan
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-xs border-green-300 text-green-700 bg-green-50"
                >
                  <Package className="w-3 h-3" />
                  Satuan
                </Badge>
              )}
              {selectedItem.basePrice && (
                <span className="text-xs text-slate-500">
                  Rp {selectedItem.basePrice.toLocaleString("id-ID")}{" "}
                  {isWeightType ? "/ kg" : "/ pcs"}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Quantity Input ── */}
        <div className="space-y-1">
          <Label className="text-sm">
            {isWeightType ? "Berat (kg)" : "Jumlah (pcs)"}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            min={isWeightType ? "0.1" : "1"}
            step={isWeightType ? "0.1" : "1"}
            value={item.quantity}
            onChange={handleQuantityChange}
            placeholder={isWeightType ? "contoh: 3.2" : "contoh: 1"}
          />
          {estimatedPrice !== null && (
            <p className="text-xs text-slate-500">
              = Rp {estimatedPrice.toLocaleString("id-ID")}
            </p>
          )}
        </div>
      </div>

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
