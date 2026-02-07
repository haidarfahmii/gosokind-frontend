import * as Yup from "yup";

export const laundryItemValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Nama item minimal 3 karakter")
    .required("Nama item wajib diisi"),

  category: Yup.string().required("Kategori wajib dipilih"),

  unit: Yup.string().required("Satuan unit wajib diisi (cth: Kg, Pcs)"),

  basePrice: Yup.number()
    .typeError("Harga harus berupa angka")
    .min(0, "Harga tidak boleh negatif")
    .required("Harga dasar wajib diisi"),
});
