import * as Yup from "yup";

export const verifySchema = Yup.object().shape({
  fullName: Yup.string().required("Nama lengkap wajib diisi"),
  phone: Yup.string()
    .required("Nomor telepon wajib diisi")
    .matches(/^[0-9]+$/, "Hanya boleh berisi angka")
    .min(10, "Nomor telepon minimal 10 angka")
    .max(15, "Nomor telepon maksimal 15 angka"),
  password: Yup.string()
    .min(6, "Password minimal 6 karakter")
    .required("Password wajib diisi"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Password tidak cocok")
    .required("Konfirmasi password wajib diisi"),
});
