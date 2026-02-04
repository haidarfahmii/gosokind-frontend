import * as Yup from "yup";

export const registerSchema = Yup.object().shape({
  email: Yup.string()
    .email("Format email tidak valid")
    .required("Email wajib diisi"),
  acceptTerms: Yup.boolean()
    .oneOf([true], "Anda harus menyetujui syarat dan ketentuan")
    .required("Syarat dan ketentuan wajib disetujui"),
});

