"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Package } from "lucide-react";
import { Order } from "../types/order.types";
import { useInputOrderDetailsForm } from "../hooks/useInputOrderDetailsForm";
import {
  TotalWeightField,
  LaundryItemsList,
  EstimatedPriceCard,
} from "./input-order-details";

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
    laundryItems,
    loadingItems,
    handleAddItem,
    handleRemoveItem,
    handleItemChange,
    getTotalPrice,
    handleClose,
  } = useInputOrderDetailsForm({
    order,
    open,
    onSuccess,
    onClose: onOpenChange,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Input Order Details
          </DialogTitle>
          <DialogDescription>
            Order Number:{" "}
            <span className="font-semibold">{order?.orderNumber}</span>
            <br />
            Customer:{" "}
            <span className="font-semibold">{order?.customer.fullName}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Total Weight */}
          <TotalWeightField
            value={formik.values.totalWeight}
            touched={formik.touched.totalWeight}
            error={formik.errors.totalWeight}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {/* Laundry Items */}
          <LaundryItemsList
            items={formik.values.items}
            laundryItems={laundryItems}
            loadingItems={loadingItems}
            itemsError={
              typeof formik.errors.items === "string"
                ? formik.errors.items
                : undefined
            }
            itemsTouched={!!formik.touched.items}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            onItemChange={handleItemChange}
          />

          {/* Estimated Price */}
          <EstimatedPriceCard total={getTotalPrice()} />

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={formik.isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={formik.isSubmitting}
              className="gap-2"
            >
              {formik.isSubmitting && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              Save Order Details
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
