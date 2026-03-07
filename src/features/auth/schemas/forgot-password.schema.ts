import * as Yup from "yup";

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Format email tidak valid")
    .required("Email wajib diisi"),
});
