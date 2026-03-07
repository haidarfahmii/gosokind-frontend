"use client";

import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import { forgotPasswordSchema } from "../schemas/forgot-password.schema";
import { authService } from "../services/auth.service";
import { AxiosError } from "axios";
import { ForgotPasswordFormValues } from "@/@types";

export const useForgotPasswordForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    // State opsional: jika ingin menampilkan pesan sukses di UI bukan cuma toast
    const [isSuccess, setIsSuccess] = useState(false);

    const formik = useFormik<ForgotPasswordFormValues>({
        initialValues: {
            email: "",
        },
        validationSchema: forgotPasswordSchema,
        onSubmit: async (values) => {
            try {
                setIsLoading(true);
                setIsSuccess(false);

                // Call service
                await authService.forgotPassword(values);

                toast.success("Link reset password telah dikirim ke email Anda!");
                setIsSuccess(true);

                // Opsional: Reset form setelah sukses
                formik.resetForm();

            } catch (error) {
                console.error("Forgot Password Error:", error);

                if (error instanceof AxiosError && error.response) {
                    // Menangkap pesan error dari backend (misal: "User with this email does not exist")
                    toast.error(error.response.data.message || "Gagal mengirim email verifikasi");
                } else {
                    toast.error("Terjadi kesalahan sistem");
                }
            } finally {
                setIsLoading(false);
            }
        },
    });

    return {
        formik,
        isLoading,
        isSuccess, // Bisa digunakan untuk conditional rendering di UI (misal: menyembunyikan form dan menampilkan pesan "Cek Email")
    };
};