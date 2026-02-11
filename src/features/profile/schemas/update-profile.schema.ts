import * as Yup from "yup";
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png", "image/gif"];

export const updateProfileSchema = Yup.object().shape({
    fullName: Yup.string()
        .required("Nama lengkap wajib diisi")
        .min(3, "Nama minimal 3 karakter"),
    email: Yup.string()
        .required("Email wajib diisi")
        .email("Format email tidak valid"),
    avatar: Yup.mixed()
        .nullable()
        .notRequired()
        .test("fileSize", "Ukuran file maksimal 1MB", (value: any) => {
            // Jika tidak ada file yang diupload (null/undefined), loloskan validasi
            if (!value || !(value instanceof File)) return true;
            return value.size <= 1 * 1024 * 1024;
        })
        .test("fileType", "Format file harus JPG, JPEG, PNG, atau GIF", (value: any) => {
            // Jika tidak ada file yang diupload, loloskan validasi
            if (!value || !(value instanceof File)) return true;
            return SUPPORTED_FORMATS.includes(value.type);
        })
});