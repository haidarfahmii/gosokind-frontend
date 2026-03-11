import * as Yup from "yup";

const orderItemSchema = Yup.object({
  laundryItemId: Yup.string().required("Pilih item"),
  quantity: Yup.number()
    .integer("Harus angka bulat")
    .min(1, "Minimal 1 pcs")
    .required("Jumlah wajib diisi"),
});

// Schema untuk Input Order Details (weight & items)
export const inputOrderDetailsSchema = Yup.object()
  .shape({
    hasKiloan: Yup.boolean().required(),
    totalWeight: Yup.number()
      .typeError("Berat harus berupa angka")
      .nullable()
      .when("hasKiloan", {
        is: true,
        then: (schema) =>
          schema
            .positive("Berat harus lebih dari 0 kg")
            .required("Berat total wajib diisi untuk layanan kiloan"),
        otherwise: (schema) => schema.optional().nullable(),
      }),
    kiloanItems: Yup.array().when("hasKiloan", {
      is: true,
      then: (schema) =>
        schema
          .of(orderItemSchema)
          .min(1, "Tambahkan minimal 1 item kiloan")
          .required(),
      otherwise: (schema) => schema.optional(),
    }),

    // Satuan Section
    hasSatuan: Yup.boolean().required(),
    satuanItems: Yup.array().when("hasSatuan", {
      is: true,
      then: (schema) =>
        schema
          .of(orderItemSchema)
          .min(1, "Tambahkan minimal 1 item satuan")
          .required(),
      otherwise: (schema) => schema.optional(),
    }),
  })
  .test(
    "at-least-one-service",
    "Pilih minimal satu jenis layanan (kiloan atau satuan)",
    (values) => {
      return Boolean(values.hasKiloan || values.hasSatuan);
    },
  );

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
  hasKiloan: boolean;
  totalWeight: number;
  kiloanItems: { laundryItemId: string; quantity: number }[];

  hasSatuan: boolean;
  satuanItems: { laundryItemId: string; quantity: number }[];
}

export interface HandleBypassRequestFormValues {
  action: "APPROVED" | "REJECTED";
  adminNote?: string;
}
