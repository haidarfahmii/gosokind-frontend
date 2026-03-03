import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/axiosInstance";
import { createOrderSchema } from "../schemas/create-order.schema";

interface UseCreateOrderFormProps {
    onSuccess: () => void;
}

export const useCreateOrderForm = ({ onSuccess }: UseCreateOrderFormProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            addressId: "",
            pickupAt: "",
        },
        validationSchema: createOrderSchema,
        onSubmit: async (values, { resetForm }) => {
            setIsLoading(true);
            try {

                let isoPickupAt = values.pickupAt;
                if (values.pickupAt) { // konversi ke ISO8601
                    const [hours, minutes] = values.pickupAt.split(":").map(Number);
                    const pickupDate = new Date();
                    pickupDate.setHours(hours, minutes, 0, 0);
                    isoPickupAt = pickupDate.toISOString();
                }
                await axiosInstance.post("/customer/orders", {
                    addressId: values.addressId,
                    pickupAt: isoPickupAt,
                });

                toast.success("Pesanan berhasil dibuat!");
                resetForm();
                onSuccess(); // Tutup modal atau refresh data
            } catch (error: any) {
                console.error("Create order error:", error);
                toast.error(error?.response?.data?.message || "Gagal membuat pesanan");
            } finally {
                setIsLoading(false);
            }
        },
    });

    return { formik, isLoading };
};