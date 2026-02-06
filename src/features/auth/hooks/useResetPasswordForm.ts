"use client";

import { useFormik } from "formik";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { resetPasswordSchema } from "../schemas/reset-password.schema";
import { authService } from "../services/auth.service";
import { AxiosError } from "axios";
import { useVerifyToken } from "./useVerifyToken"; // Import hook baru

interface UseResetPasswordFormProps {
    token: string;
}

export const useResetPasswordForm = ({ token }: UseResetPasswordFormProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // 1. Panggil hook validasi token
    const { isVerifyingToken, isTokenValid } = useVerifyToken({
        token,
        // Redirect ke login jika token salah
        // redirectOnInvalid: "/auth/login",
    });

    const formik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validationSchema: resetPasswordSchema,
        onSubmit: async (values) => {
            if (!isTokenValid) {
                toast.error("Token tidak valid. Silakan request reset password ulang.");
                return;
            }

            try {
                setIsLoading(true);
                await authService.resetPassword({
                    token: token,
                    password: values.password
                });
                toast.success("Password berhasil diubah! Silakan login.");
                router.push("/auth/login");
            } catch (error) {
                console.error("Reset Password Error:", error);
                if (error instanceof AxiosError && error.response) {
                    toast.error(error.response.data.message || "Gagal mengubah password");
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
        isVerifyingToken, // Return state ini ke komponen
        isTokenValid,
    };
};