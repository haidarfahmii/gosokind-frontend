import * as Yup from "yup";
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png", "image/gif"];

export const updateProfileSchema = Yup.object().shape({
    fullName: Yup.string()
        .required("Nama lengkap wajib diisi")
        .min(3, "Nama minimal 3 karakter"),
    email: Yup.string()
        .required("Email wajib diisi")
        .email("Format email tidak valid"),
    phone: Yup.string() // Tambahkan validasi phone
        .required("Nomor telepon wajib diisi")
        .matches(/^[0-9]+$/, "Hanya boleh berisi angka")
        .min(10, "Nomor telepon minimal 10 angka")
        .max(15, "Nomor telepon maksimal 15 angka"),
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