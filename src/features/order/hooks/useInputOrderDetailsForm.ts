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

  // Pisahkan laundry items berdasarkan tipe untuk kemudahan akses di form
  const kiloanLaundryItems = laundryItems.filter(
    (li) => li.pricingType === "WEIGHT",
  );
  const satuanLaundryItems = laundryItems.filter(
    (li) => li.pricingType === "ITEM",
  );

  const formik = useFormik<InputOrderDetailsFormValues>({
    initialValues: {
      hasKiloan: false,
      totalWeight: 0,
      kiloanItems: [{ laundryItemId: "", quantity: 1 }],
      hasSatuan: false,
      satuanItems: [{ laundryItemId: "", quantity: 1 }],
    },
    validationSchema: inputOrderDetailsSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (!order) return;
      try {
        // Gabungkan kiloan + satuan items ke dalam satu array untuk API
        const combinedItems = [
          ...(values.hasKiloan ? values.kiloanItems : []),
          ...(values.hasSatuan ? values.satuanItems : []),
        ];

        const payload = {
          totalWeight: values.hasKiloan ? values.totalWeight : 0,
          items: combinedItems,
        };

        const response = await orderService.inputOrderDetails(
          order.id,
          payload,
        );
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

  const handleAddKiloanItem = () => {
    formik.setFieldValue("kiloanItems", [
      ...formik.values.kiloanItems,
      { laundryItemId: "", quantity: 1 },
    ]);
  };

  const handleRemoveKiloanItem = (index: number) => {
    if (formik.values.kiloanItems.length === 1) {
      toast.error("Minimal 1 item kiloan diperlukan");
      return;
    }
    formik.setFieldValue(
      "kiloanItems",
      formik.values.kiloanItems.filter((_, i) => i !== index),
    );
  };

  const handleKiloanItemChange = (
    index: number,
    field: "laundryItemId" | "quantity",
    value: string | number,
  ) => {
    const updated = formik.values.kiloanItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    formik.setFieldValue("kiloanItems", updated);
  };

  const handleAddSatuanItem = () => {
    formik.setFieldValue("satuanItems", [
      ...formik.values.satuanItems,
      { laundryItemId: "", quantity: 1 },
    ]);
  };

  const handleRemoveSatuanItem = (index: number) => {
    if (formik.values.satuanItems.length === 1) {
      toast.error("Minimal 1 item satuan diperlukan");
      return;
    }
    formik.setFieldValue(
      "satuanItems",
      formik.values.satuanItems.filter((_, i) => i !== index),
    );
  };

  const handleSatuanItemChange = (
    index: number,
    field: "laundryItemId" | "quantity",
    value: string | number,
  ) => {
    const updated = formik.values.satuanItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    formik.setFieldValue("satuanItems", updated);
  };

  // Kalkulasi Preview Harga
  const getKiloanRate = (): number => {
    // Rate kiloan = basePrice dari kiloan item pertama yang dipilih admin
    const firstSelected = formik.values.kiloanItems.find(
      (i) => i.laundryItemId,
    );
    if (!firstSelected) return 0;
    return (
      kiloanLaundryItems.find((li) => li.id === firstSelected.laundryItemId)
        ?.basePrice ?? 0
    );
  };

  const getKiloanSubtotal = (): number => {
    if (!formik.values.hasKiloan) return 0;
    const rate = getKiloanRate();
    return formik.values.totalWeight * rate;
  };

  const getSatuanSubtotal = (): number => {
    if (!formik.values.hasSatuan) return 0;
    return formik.values.satuanItems.reduce((sum, item) => {
      const li = satuanLaundryItems.find((l) => l.id === item.laundryItemId);
      return sum + (li?.basePrice ?? 0) * item.quantity;
    }, 0);
  };

  const getTotalPrice = (): number => {
    return getKiloanSubtotal() + getSatuanSubtotal();
  };

  const handleClose = () => {
    onClose(false);
    formik.resetForm();
  };

  return {
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
  };
};
