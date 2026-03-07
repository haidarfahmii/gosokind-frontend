import { useState } from "react";
import { useFormik } from "formik";
import { addressSchema } from "../schemas/address.schema";
import { addressService } from "../services/address.service";

interface UseAddressFormProps {
    initialData?: any; // Jika null = Tambah, Jika ada data = Edit
    onSuccess?: () => void; // Trigger untuk refresh data di parent component
    onClose: () => void;
}

export const useAddressForm = ({ initialData, onSuccess, onClose }: UseAddressFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const isEditMode = !!initialData;

    const formik = useFormik({
        // Inisialisasi awal. Memetakan 'address' dari database ke 'fullAddress' milik frontend
        initialValues: {
            label: initialData?.label || "",
            fullAddress: initialData?.address || "",
            latitude: initialData?.latitude?.toString() || "", // Form input menerima string
            longitude: initialData?.longitude?.toString() || "",
            isPrimary: initialData?.isPrimary || false,
        },
        validationSchema: addressSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                // Konversi data frontend ke struktur payload backend
                const payload = {
                    label: values.label,
                    address: values.fullAddress, // Mapping ke 'address'
                    latitude: parseFloat(values.latitude), // Konversi ke float
                    longitude: parseFloat(values.longitude), // Konversi ke float
                    isPrimary: values.isPrimary,
                };

                if (isEditMode && initialData?.id) {
                    await addressService.update(initialData.id, payload);
                } else {
                    await addressService.create(payload);
                }

                // Jika berhasil, panggil callback untuk refresh list dan tutup modal
                if (onSuccess) onSuccess();
                onClose();

            } catch (error: any) {
                console.error("Gagal menyimpan alamat:", error);
                // TODO: Anda bisa menambahkan alert/toast error di sini
                // contoh: toast.error(error?.response?.data?.message || "Terjadi kesalahan")
            } finally {
                setIsLoading(false);
            }
        },
    });

    return { formik, isLoading, isEditMode };
};