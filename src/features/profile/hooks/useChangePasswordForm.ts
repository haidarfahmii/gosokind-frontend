import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import { changePasswordSchema } from "../schemas/change-password.schema";
import { changePassword } from "../services/profile.service";

export const useChangePasswordForm = () => {
    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        validationSchema: changePasswordSchema,
        onSubmit: async (values, { resetForm }) => {
            setIsLoading(true);
            try {
                await changePassword({
                    currentPassword: values.currentPassword,
                    newPassword: values.newPassword,
                });

                toast.success("Password berhasil diubah!");
                resetForm(); // Reset form agar bersih kembali

            } catch (error: any) {
                console.error(error);
                toast.error(error?.response?.data?.message || "Gagal mengubah password");
            } finally {
                setIsLoading(false);
            }
        },
    });

    return {
        formik,
        isLoading,
    };
};