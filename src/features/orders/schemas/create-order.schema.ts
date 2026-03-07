import * as Yup from "yup";

export const createOrderSchema = Yup.object().shape({
    addressId: Yup.string().required("Alamat penjemputan wajib dipilih"),
    pickupAt: Yup.string()
        .optional()
        .test(
            "is-future-time",
            "Waktu penjemputan tidak boleh kurang dari jam saat ini",
            function (value) {
                if (!value) return true; // Jika kosong, biarkan .required() yang menangani

                // Pisahkan jam dan menit dari input (misal: "14:30" menjadi 14 dan 30)
                const [selectedHour, selectedMinute] = value.split(":").map(Number);

                // Ambil waktu saat ini
                const now = new Date();
                const currentHour = now.getHours();
                const currentMinute = now.getMinutes();

                // Validasi logika waktu
                if (selectedHour > currentHour) {
                    return true; // Jika jam yang dipilih lebih besar dari jam sekarang -> Valid
                }

                if (selectedHour === currentHour && selectedMinute > currentMinute) {
                    return true; // Jika jam sama, tapi menit yang dipilih lebih besar -> Valid
                }

                // Jika jam yang dipilih lebih kecil atau sama persis dengan sekarang -> Tidak Valid
                return false;
            }
        ),
});