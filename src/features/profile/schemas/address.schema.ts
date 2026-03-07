import * as Yup from "yup";

export const addressSchema = Yup.object().shape({
    label: Yup.string()
        .required("Label alamat wajib diisi (contoh: Rumah, Kantor)"),
    fullAddress: Yup.string()
        .required("Alamat lengkap wajib diisi")
        .min(10, "Alamat terlalu pendek"),
    latitude: Yup.number()
        .required("Latitude perlu diisi"),
    longitude: Yup.number()
        .required("Longitude perlu diisi"),
    isPrimary: Yup.boolean().optional(),
});