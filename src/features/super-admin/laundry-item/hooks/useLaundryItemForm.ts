import { useFormik } from "formik";
import { toast } from "react-toastify";
import { CreateLaundryItemInput, LaundryItem } from "../types";
import { laundryItemValidationSchema } from "../schemas/laundryItemValidationSchema";
import { laundryItemService } from "../services/laundry-item.service";

interface UseLaundryItemFormProps {
  initialData?: LaundryItem;
  onSuccess: () => void;
  onClose: () => void;
}

export const useLaundryItemForm = ({
  initialData,
  onSuccess,
  onClose,
}: UseLaundryItemFormProps) => {
  const isEditMode = !!initialData;

  const formik = useFormik<CreateLaundryItemInput>({
    initialValues: {
      name: initialData?.name || "",
      category: initialData?.category || "",
      unit: initialData?.unit || "Pcs",
      basePrice: initialData?.basePrice || 0,
    },
    validationSchema: laundryItemValidationSchema,
    onSubmit: async (values) => {
      try {
        if (isEditMode && initialData) {
          await laundryItemService.updateLaundryItem(initialData.id, values);
          toast.success("Item berhasil diperbarui");
        } else {
          await laundryItemService.createLaundryItem(values);
          toast.success("Item berhasil dibuat");
        }
        onSuccess();
        onClose();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Terjadi kesalahan");
      }
    },
  });

  return {
    formik,
    isEditMode,
  };
};
