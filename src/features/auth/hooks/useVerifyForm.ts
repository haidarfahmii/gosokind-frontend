"use client";

import { useFormik } from "formik";
import { useState, useEffect } from "react"; // Import useEffect
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authService } from "../services/auth.service";
import { verifySchema } from "../schemas/verify.schema";

export const useVerifyForm = (token: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifyingToken, setIsVerifyingToken] = useState(true); // State loading awal halaman
    const router = useRouter();

    //validasi token saat halaman dimuat
    useEffect(() => {
        const validateToken = async () => {
            try {
                await authService.checkVerifyToken(token);
                // Jika sukses, biarkan user di halaman ini (loading token selesai)
                setIsVerifyingToken(false);
            } catch (error) {
                // Jika error (Token expired/invalid)
                toast.error("Token verifikasi tidak valid atau sudah kadaluarsa.");
                // Redirect balik ke Register
                router.replace("/auth/register");
            }
        };

        if (token) {
            validateToken();
        }
    }, [token, router]);

    // 2. Formik Logic (tetap sama, hanya tambah validasi state)
    const formik = useFormik({
        initialValues: {
            fullName: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema: verifySchema,
        onSubmit: async (values) => {
            try {
                setIsLoading(true);
                await authService.verify({
                    fullName: values.fullName,
                    password: values.password,
                    token: token,
                });
                toast.success("Akun berhasil diverifikasi! Silakan login.");
                router.push("/auth/login");
            } catch (error: any) {
                const errorMessage = error?.response?.data?.message || "Verifikasi gagal";
                toast.error(errorMessage);
            } finally {
                setIsLoading(false);
            }
        },
    });

    return {
        formik,
        isLoading,
        isVerifyingToken, // Return state ini untuk UI
    };
};