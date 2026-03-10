"use client";

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
import { Scale, Package } from "lucide-react";
import { useLaundryItemForm } from "../hooks/useLaundryItemForm";
import {
  LaundryItem,
  CATEGORY_OPTIONS,
  UNIT_OPTIONS,
  PRICING_TYPE_OPTIONS,
} from "../types";
import { Badge } from "@/components/ui/badge";

interface LaundryItemFormProps {
  initialData?: LaundryItem;
  onSuccess: () => void;
  onCancel: () => void;
}

export function LaundryItemForm(props: LaundryItemFormProps) {
  const { formik, isEditMode } = useLaundryItemForm({
    initialData: props.initialData,
    onSuccess: props.onSuccess,
    onClose: props.onCancel,
  });

  const isWeightType = formik.values.pricingType === "WEIGHT";
  const handlePricingTypeChange = (value: string) => {
    formik.setFieldValue("pricingType", value);
    // Auto-set unit saat pricingType berubah
    if (value === "WEIGHT") {
      formik.setFieldValue("unit", "Kg");
    } else {
      formik.setFieldValue("unit", "Pcs");
    }
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>
          Tipe Harga <span className="text-red-500">*</span>
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {PRICING_TYPE_OPTIONS.map((option) => {
            const isSelected = formik.values.pricingType === option.value;
            const Icon = option.value === "WEIGHT" ? Scale : Package;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handlePricingTypeChange(option.value)}
                className={`
                  p-3 rounded-lg border-2 text-left transition-all
                  ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon
                    className={`w-4 h-4 ${isSelected ? "text-blue-600" : "text-slate-400"}`}
                  />
                  <span
                    className={`font-semibold text-sm ${isSelected ? "text-blue-700" : "text-slate-700"}`}
                  >
                    {option.label}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{option.description}</p>
              </button>
            );
          })}
        </div>
        {formik.touched.pricingType && formik.errors.pricingType && (
          <p className="text-red-500 text-xs">{formik.errors.pricingType}</p>
        )}
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Nama Item</Label>
        <Input
          id="name"
          placeholder="Contoh: Kemeja Panjang"
          {...formik.getFieldProps("name")}
          disabled={formik.isSubmitting}
        />
        {formik.touched.name && formik.errors.name && (
          <p className="text-red-500 text-xs">{formik.errors.name}</p>
        )}
      </div>

      {/* Category & Unit */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Kategori</Label>
          <Select
            value={formik.values.category || ""}
            onValueChange={(val) => formik.setFieldValue("category", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Kategori" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formik.touched.category && formik.errors.category && (
            <p className="text-red-500 text-xs">{formik.errors.category}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>
            Satuan (Unit)
            {isWeightType && (
              <Badge variant="secondary" className="ml-2 text-xs">
                Auto: Kg
              </Badge>
            )}
          </Label>
          {/* Jika WEIGHT, unit dikunci ke Kg */}
          {isWeightType ? (
            <Input
              value="Kg"
              disabled
              className="bg-slate-100 text-slate-600"
            />
          ) : (
            <Select
              value={formik.values.unit || ""}
              onValueChange={(val) => formik.setFieldValue("unit", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Unit" />
              </SelectTrigger>
              <SelectContent>
                {UNIT_OPTIONS.filter((u) => u !== "Kg").map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Base Price */}
      <div className="space-y-2">
        <Label htmlFor="basePrice">Harga Dasar (Rp)</Label>
        <Input
          id="basePrice"
          type="number"
          placeholder="0"
          {...formik.getFieldProps("basePrice")}
          disabled={formik.isSubmitting}
        />
        {formik.touched.basePrice && formik.errors.basePrice && (
          <p className="text-red-500 text-xs">{formik.errors.basePrice}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" type="button" onClick={props.onCancel}>
          Batal
        </Button>
        <Button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting
            ? "Menyimpan..."
            : isEditMode
              ? "Update"
              : "Buat"}
        </Button>
      </div>
    </form>
  );
}
