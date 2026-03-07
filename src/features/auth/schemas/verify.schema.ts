import * as Yup from "yup";

export const verifySchema = Yup.object().shape({
  fullName: Yup.string().required("Nama lengkap wajib diisi"),
  password: Yup.string()
    .min(6, "Password minimal 6 karakter")
    .required("Password wajib diisi"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Password tidak cocok")
    .required("Konfirmasi password wajib diisi"),
});
