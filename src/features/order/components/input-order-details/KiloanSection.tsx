"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Scale, Plus, Trash2, Loader2 } from "lucide-react";
import { LaundryItem } from "@/features/order/hooks/useLaundryItems";

interface KiloanItem {
  laundryItemId: string;
  quantity: number;
}

interface KiloanSectionProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;

  totalWeight: number;
  onTotalWeightChange: React.ChangeEventHandler<HTMLInputElement>;
  totalWeightError?: string;
  totalWeightTouched?: boolean;

  items: KiloanItem[];
  laundryItems: LaundryItem[];
  loadingItems: boolean;
  kiloanRate: number;
  kiloanSubtotal: number;

  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onItemChange: (
    index: number,
    field: "laundryItemId" | "quantity",
    value: string | number,
  ) => void;
}

export function KiloanSection({
  enabled,
  onToggle,
  totalWeight,
  onTotalWeightChange,
  totalWeightError,
  totalWeightTouched,
  items,
  laundryItems,
  loadingItems,
  kiloanRate,
  kiloanSubtotal,
  onAddItem,
  onRemoveItem,
  onItemChange,
}: KiloanSectionProps) {
  return (
    <div
      className={`rounded-xl border-2 p-4 transition-all ${
        enabled ? "border-blue-400 bg-blue-50/50" : "border-slate-200 bg-white"
      }`}
    >
      {/* Header Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`h-9 w-9 rounded-lg flex items-center justify-center ${
              enabled ? "bg-blue-500" : "bg-slate-200"
            }`}
          >
            <Scale
              className={`w-4 h-4 ${enabled ? "text-white" : "text-slate-400"}`}
            />
          </div>
          <div>
            <p className="font-semibold text-slate-800">Layanan Kiloan</p>
            <p className="text-xs text-slate-500">
              Harga dihitung per kg ·{" "}
              {kiloanRate > 0
                ? `Rp ${kiloanRate.toLocaleString("id-ID")}/kg`
                : "Rate belum diset"}
            </p>
          </div>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-blue-500"
        />
      </div>

      {/* Content (tampil jika enabled) */}
      {enabled && (
        <div className="space-y-4 pt-2 border-t border-blue-200">
          {/* Total Weight Input */}
          <div className="space-y-1">
            <Label className="text-sm font-medium flex items-center gap-1">
              Total Berat Kiloan <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.1"
                min="0.1"
                value={totalWeight || ""}
                onChange={onTotalWeightChange}
                placeholder="contoh: 2.5"
                className={`max-w-40 ${totalWeightTouched && totalWeightError ? "border-red-500" : ""}`}
              />
              <span className="text-sm font-semibold text-slate-600">kg</span>
              {kiloanSubtotal > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 bg-blue-100 text-blue-700 border-0"
                >
                  = Rp {kiloanSubtotal.toLocaleString("id-ID")}
                </Badge>
              )}
            </div>
            {totalWeightTouched && totalWeightError && (
              <p className="text-xs text-red-500">{totalWeightError}</p>
            )}
          </div>

          {/* Rincian Item Kiloan */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-slate-700">
                Rincian Item (untuk verifikasi worker)
              </Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onAddItem}
                className="h-7 text-xs gap-1 border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                <Plus className="w-3 h-3" />
                Tambah
              </Button>
            </div>

            {loadingItems ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Select
                      value={item.laundryItemId}
                      onValueChange={(val) =>
                        onItemChange(index, "laundryItemId", val)
                      }
                    >
                      <SelectTrigger className="flex-1 bg-white">
                        <SelectValue placeholder="Pilih jenis pakaian kiloan" />
                      </SelectTrigger>
                      <SelectContent>
                        {laundryItems.map((li) => (
                          <SelectItem key={li.id} value={li.id}>
                            {li.name}
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
                ))}
              </div>
            )}

            <p className="text-xs text-slate-400 italic">
              Rincian ini digunakan untuk verifikasi petugas di setiap station.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
