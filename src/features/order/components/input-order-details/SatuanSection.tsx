"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, Plus, Trash2, Loader2 } from "lucide-react";
import { LaundryItem } from "@/features/order/hooks/useLaundryItems";

interface SatuanItem {
  laundryItemId: string;
  quantity: number;
}

interface SatuanSectionProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;

  items: SatuanItem[];
  laundryItems: LaundryItem[];
  loadingItems: boolean;
  satuanSubtotal: number;

  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onItemChange: (
    index: number,
    field: "laundryItemId" | "quantity",
    value: string | number,
  ) => void;
}

export function SatuanSection({
  enabled,
  onToggle,
  items,
  laundryItems,
  loadingItems,
  satuanSubtotal,
  onAddItem,
  onRemoveItem,
  onItemChange,
}: SatuanSectionProps) {
  return (
    <div
      className={`rounded-xl border-2 p-4 transition-all ${
        enabled
          ? "border-green-400 bg-green-50/50"
          : "border-slate-200 bg-white"
      }`}
    >
      {/* Header Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`h-9 w-9 rounded-lg flex items-center justify-center ${
              enabled ? "bg-green-500" : "bg-slate-200"
            }`}
          >
            <Package
              className={`w-4 h-4 ${enabled ? "text-white" : "text-slate-400"}`}
            />
          </div>
          <div>
            <p className="font-semibold text-slate-800">Item Satuan</p>
            <p className="text-xs text-slate-500">
              Harga dihitung per pcs · Pakaian Formal, Bed Cover, Selimut, dll.
            </p>
          </div>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-green-500"
        />
      </div>

      {/* Content */}
      {enabled && (
        <div className="space-y-3 pt-2 border-t border-green-200">
          {/* Header + Add button */}
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-slate-700">
              Daftar Item Satuan
            </Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onAddItem}
              className="h-7 text-xs gap-1 border-green-300 text-green-600 hover:bg-green-50"
            >
              <Plus className="w-3 h-3" />
              Tambah
            </Button>
          </div>

          {loadingItems ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-green-500" />
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item, index) => {
                const selectedItem = laundryItems.find(
                  (li) => li.id === item.laundryItemId,
                );
                const itemSubtotal =
                  selectedItem?.basePrice && item.quantity > 0
                    ? selectedItem.basePrice * item.quantity
                    : null;

                return (
                  <div key={index} className="flex items-center gap-2">
                    <Select
                      value={item.laundryItemId}
                      onValueChange={(val) =>
                        onItemChange(index, "laundryItemId", val)
                      }
                    >
                      <SelectTrigger className="flex-1 bg-white">
                        <SelectValue placeholder="Pilih item satuan" />
                      </SelectTrigger>
                      <SelectContent>
                        {laundryItems.map((li) => (
                          <SelectItem key={li.id} value={li.id}>
                            {li.name}
                            {li.basePrice
                              ? ` — Rp ${li.basePrice.toLocaleString("id-ID")}/pcs`
                              : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min="1"
                        step="1"
                        value={item.quantity}
                        onChange={(e) =>
                          onItemChange(
                            index,
                            "quantity",
                            parseInt(e.target.value) || 1,
                          )
                        }
                        className="w-20 text-center bg-white"
                      />
                      <span className="text-xs text-slate-500 w-6">pcs</span>
                    </div>

                    {/* Estimasi harga per baris */}
                    {itemSubtotal !== null && (
                      <span className="text-xs text-green-600 font-medium whitespace-nowrap min-w-24 text-right">
                        Rp {itemSubtotal.toLocaleString("id-ID")}
                      </span>
                    )}

                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => onRemoveItem(index)}
                      className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Satuan Subtotal */}
          {satuanSubtotal > 0 && (
            <div className="flex items-center justify-between pt-2 border-t border-green-200">
              <span className="text-sm text-green-700 font-medium">
                Subtotal Satuan:
              </span>
              <span className="text-sm font-bold text-green-700">
                Rp {satuanSubtotal.toLocaleString("id-ID")}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
