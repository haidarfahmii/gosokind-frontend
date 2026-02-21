import * as Yup from "yup";

export const changePasswordSchema = Yup.object().shape({
    currentPassword: Yup.string()
        .required("Password saat ini wajib diisi"),
    newPassword: Yup.string()
        .required("Password baru wajib diisi")
        .min(6, "Password minimal 6 karakter")
        .notOneOf([Yup.ref("currentPassword")], "Password baru tidak boleh sama dengan password lama"),
    confirmPassword: Yup.string()
        .required("Konfirmasi password wajib diisi")
        .oneOf([Yup.ref("newPassword")], "Password tidak cocok"),
});