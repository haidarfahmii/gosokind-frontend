import * as Yup from "yup";

// Schema untuk Input Order Details (weight & items)
export const inputOrderDetailsSchema = Yup.object().shape({
  totalWeight: Yup.number()
    .min(0.1, "Total weight must be at least 0.1 kg")
    .required("Total weight is required"),
  items: Yup.array()
    .of(
      Yup.object().shape({
        laundryItemId: Yup.string().required("Laundry item is required"),
        quantity: Yup.number()
          .typeError("Quantity harus berupa angka")
          .min(0.1, "Quantity minimal 0.1")
          .required("Quantity wajib diisi"),
      }),
    )
    .min(1, "At least one item is required")
    .required("Items are required"),
});

// Schema untuk Handle Bypass Request
export const handleBypassRequestSchema = Yup.object().shape({
  action: Yup.string()
    .oneOf(["APPROVED", "REJECTED"], "Invalid action")
    .required("Action is required"),
  adminNote: Yup.string()
    .min(5, "Note must be at least 5 characters if provided")
    .optional(),
});

// TypeScript interfaces for form values
export interface InputOrderDetailsFormValues {
  totalWeight: number;
  items: Array<{
    laundryItemId: string;
    quantity: number;
  }>;
}

export interface HandleBypassRequestFormValues {
  action: "APPROVED" | "REJECTED";
  adminNote?: string;
}
