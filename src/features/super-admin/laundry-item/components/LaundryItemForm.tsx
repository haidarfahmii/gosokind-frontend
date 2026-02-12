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
import { useLaundryItemForm } from "../hooks/useLaundryItemForm";
import { LaundryItem, CATEGORY_OPTIONS, UNIT_OPTIONS } from "../types";

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

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
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
          <Label>Satuan (Unit)</Label>
          <Select
            value={formik.values.unit || ""}
            onValueChange={(val) => formik.setFieldValue("unit", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Unit" />
            </SelectTrigger>
            <SelectContent>
              {UNIT_OPTIONS.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formik.touched.unit && formik.errors.unit && (
            <p className="text-red-500 text-xs">{formik.errors.unit}</p>
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
