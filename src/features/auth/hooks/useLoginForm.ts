"use client";

import { useFormik } from "formik";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { loginSchema } from "../schemas/login.schema";
// Sesuaikan path import interface jika berbeda
import { LoginFormValues } from "@/@types"; 

export const useLoginForm = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const formik = useFormik<LoginFormValues>({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: loginSchema,
        onSubmit: async (values) => {
            try {
                setIsLoading(true);

                // Menggunakan signIn dari NextAuth (bukan authService langsung)
                // karena kita perlu set session di sisi client Next.js
                const res = await signIn("credentials", {
                    email: values.email,
                    password: values.password,
                    redirect: false,
                });

                if (res?.error) {
                    toast.error(res.error || "Email atau password salah");
                    return;
                }

                if (res?.ok) {
                    toast.success("Login berhasil! Mengalihkan...");
                    router.push("/home");
                    router.refresh();
                }
            } catch (error: any) {
                console.error("Login Error:", error);
                toast.error("Terjadi kesalahan sistem");
            } finally {
                setIsLoading(false);
            }
        },
    });

    return {
        formik,
        isLoading,
        showPassword,
        togglePasswordVisibility,
    };
};