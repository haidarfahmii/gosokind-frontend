"use client";

import { useFormik } from "formik";
import { Order } from "@/features/order/types/order.types";
import { toast } from "react-toastify";
import {
  InputOrderDetailsFormValues,
  inputOrderDetailsSchema,
} from "@/features/order/schemas/order.schemas";
import { orderService } from "@/features/order/services/order.service";
import { useLaundryItems } from "@/features/order/hooks/useLaundryItems";

interface UseInputOrderDetailsFormProps {
  order: Order | null;
  open: boolean;
  onSuccess: () => void;
  onClose: (open: boolean) => void;
}

/**
 * Hook ini hanya bertanggung jawab atas:
 * 1. State dan logika form (formik)
 * 2. Handler untuk manipulasi items (add, remove, change)
 * 3. Kalkulasi total harga
 * 4. Submit dan close handler
 *
 * Fetching laundry items didelegasikan ke useLaundryItems.
 */
export const useInputOrderDetailsForm = ({
  order,
  open,
  onSuccess,
  onClose,
}: UseInputOrderDetailsFormProps) => {
  const { laundryItems, loadingItems } = useLaundryItems(open);

  const formik = useFormik<InputOrderDetailsFormValues>({
    initialValues: {
      totalWeight: 0,
      items: [{ laundryItemId: "", quantity: 1 }],
    },
    validationSchema: inputOrderDetailsSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (!order) return;
      try {
        const response = await orderService.inputOrderDetails(order.id, values);
        if (response.success) {
          toast.success("Order details saved successfully");
          onSuccess();
          onClose(false);
          formik.resetForm();
        }
      } catch (error: any) {
        console.error("Failed to save order details:", error);
        toast.error(
          error.response?.data?.message || "Failed to save order details",
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleAddItem = () => {
    formik.setFieldValue("items", [
      ...formik.values.items,
      { laundryItemId: "", quantity: 1 },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (formik.values.items.length === 1) {
      toast.error("At least one item is required");
      return;
    }
    formik.setFieldValue(
      "items",
      formik.values.items.filter((_, i) => i !== index),
    );
  };

  const handleItemChange = (
    index: number,
    field: "laundryItemId" | "quantity",
    value: string | number,
  ) => {
    const newItems = formik.values.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    formik.setFieldValue("items", newItems);
  };

  const handleItemSelect = (index: number, laundryItemId: string) => {
    const selected = laundryItems.find((li) => li.id === laundryItemId);
    const quantity = selected?.pricingType === "WEIGHT" ? 1.0 : 1;

    const newItems = formik.values.items.map((item, i) =>
      i === index ? { ...item, laundryItemId, quantity } : item,
    );
    formik.setFieldValue("items", newItems);
  };

  // basePrice * quantity works for both types
  // WEIGHT: 7000/kg × 3.2kg = 22400
  // ITEM:   15000/pcs × 2pcs = 30000
  const getTotalPrice = () =>
    formik.values.items.reduce((total, item) => {
      const found = laundryItems.find((li) => li.id === item.laundryItemId);
      return found?.basePrice ? total + found.basePrice * item.quantity : total;
    }, 0);

  const handleClose = () => {
    onClose(false);
    formik.resetForm();
  };

  return {
    formik,
    laundryItems,
    loadingItems,
    handleAddItem,
    handleRemoveItem,
    handleItemChange,
    handleItemSelect,
    getTotalPrice,
    handleClose,
  };
};
