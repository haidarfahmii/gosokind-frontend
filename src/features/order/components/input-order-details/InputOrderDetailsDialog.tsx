"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Package, AlertCircle } from "lucide-react";
import { Order } from "@/features/order/types/order.types";
import { useInputOrderDetailsForm } from "@/features/order/hooks/useInputOrderDetailsForm";
import { KiloanSection } from "@/features/order/components/input-order-details/KiloanSection";
import { SatuanSection } from "@/features/order/components/input-order-details/SatuanSection";

interface InputOrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onSuccess: () => void;
}

/**
 * Dialog untuk menginput detail order (berat dan item laundry).
 *
 * Komponen ini hanya bertanggung jawab atas:
 * - Struktur layout Dialog
 * - Merakit sub-komponen form
 * - Meneruskan state & handler dari useInputOrderDetailsForm
 *
 * Semua logika bisnis ada di hook, semua detail UI ada di sub-komponen.
 */
export function InputOrderDetailsDialog({
  open,
  onOpenChange,
  order,
  onSuccess,
}: InputOrderDetailsDialogProps) {
  const {
    formik,
    kiloanLaundryItems,
    satuanLaundryItems,
    loadingItems,
    handleAddKiloanItem,
    handleRemoveKiloanItem,
    handleKiloanItemChange,
    handleAddSatuanItem,
    handleRemoveSatuanItem,
    handleSatuanItemChange,
    getKiloanRate,
    getKiloanSubtotal,
    getSatuanSubtotal,
    getTotalPrice,
    handleClose,
  } = useInputOrderDetailsForm({
    order,
    open,
    onSuccess,
    onClose: onOpenChange,
  });

  // Error global (at-least-one-service)
  const globalError =
    typeof formik.errors === "object" &&
    !Array.isArray(formik.errors) &&
    "at-least-one-service" in formik.errors
      ? (formik.errors as any)["at-least-one-service"]
      : formik.submitCount > 0 &&
          !formik.values.hasKiloan &&
          !formik.values.hasSatuan
        ? "Pilih minimal satu jenis layanan (kiloan atau satuan)"
        : null;

  const totalPrice = getTotalPrice();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Input Detail Order
          </DialogTitle>
          <DialogDescription>
            Order:{" "}
            <span className="font-semibold text-slate-700">
              {order?.orderNumber}
            </span>{" "}
            · Customer:{" "}
            <span className="font-semibold text-slate-700">
              {order?.customer.fullName}
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4 pt-2">
          {/* Error global jika tidak ada layanan dipilih */}
          {globalError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-sm text-red-600">{globalError as string}</p>
            </div>
          )}

          {/* Section 1: Kiloan */}
          <KiloanSection
            enabled={formik.values.hasKiloan}
            onToggle={(val) => formik.setFieldValue("hasKiloan", val)}
            totalWeight={formik.values.totalWeight}
            onTotalWeightChange={formik.handleChange("totalWeight")}
            totalWeightError={formik.errors.totalWeight as string | undefined}
            totalWeightTouched={formik.touched.totalWeight}
            items={formik.values.kiloanItems}
            laundryItems={kiloanLaundryItems}
            loadingItems={loadingItems}
            kiloanRate={getKiloanRate()}
            kiloanSubtotal={getKiloanSubtotal()}
            onAddItem={handleAddKiloanItem}
            onRemoveItem={handleRemoveKiloanItem}
            onItemChange={handleKiloanItemChange}
          />

          {/* Section 2: Satuan */}
          <SatuanSection
            enabled={formik.values.hasSatuan}
            onToggle={(val) => formik.setFieldValue("hasSatuan", val)}
            items={formik.values.satuanItems}
            laundryItems={satuanLaundryItems}
            loadingItems={loadingItems}
            satuanSubtotal={getSatuanSubtotal()}
            onAddItem={handleAddSatuanItem}
            onRemoveItem={handleRemoveSatuanItem}
            onItemChange={handleSatuanItemChange}
          />

          {/* ── Estimasi Total Harga ── */}
          {totalPrice > 0 && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <p className="text-sm font-semibold text-slate-700 mb-2">
                Ringkasan Harga
              </p>

              {formik.values.hasKiloan && getKiloanSubtotal() > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                    Kiloan ({formik.values.totalWeight} kg × Rp{" "}
                    {getKiloanRate().toLocaleString("id-ID")}/kg)
                  </span>
                  <span className="font-medium">
                    Rp {getKiloanSubtotal().toLocaleString("id-ID")}
                  </span>
                </div>
              )}

              {formik.values.hasSatuan && getSatuanSubtotal() > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                    Item Satuan
                  </span>
                  <span className="font-medium">
                    Rp {getSatuanSubtotal().toLocaleString("id-ID")}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-300">
                <span className="font-semibold text-slate-800">
                  Total Estimasi
                </span>
                <span className="text-lg font-bold text-blue-600">
                  Rp {totalPrice.toLocaleString("id-ID")}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                * Harga dapat berubah sesuai treatment khusus atau diskon
              </p>
            </div>
          )}

          {/* ── Action Buttons ── */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={formik.isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={formik.isSubmitting}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {formik.isSubmitting && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              Simpan Detail Order
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
