"use client";

import { useFormik } from "formik";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authService } from "../services/auth.service";
import { verifySchema } from "../schemas/verify.schema";
import { useVerifyToken } from "./useVerifyToken"; // 1. Import hook shared

export const useVerifyForm = (token: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 2. Gunakan hook untuk validasi token otomatis saat mount
  const { isVerifyingToken, isTokenValid } = useVerifyToken({
    token,
    // Redirect jika token salah/expired
    // redirectOnInvalid: "/auth/register",
  });

  const formik = useFormik({
    initialValues: {
      fullName: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: verifySchema,
    onSubmit: async (values) => {
      // 3. Guard clause: Pastikan token valid sebelum submit
      if (!isTokenValid) {
        toast.error("Token tidak valid. Silakan daftar ulang.");
        return;
      }

      try {
        setIsLoading(true);
        await authService.verify({
          fullName: values.fullName,
          phone: values.phone,
          password: values.password,
          token: token,
        });
        toast.success("Akun berhasil diverifikasi! Silakan login.");
        router.push("/auth/login");
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message || "Verifikasi gagal";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return {
    formik,
    isLoading,
    isVerifyingToken, // Return state loading token untuk UI
    isTokenValid, // Return status validitas (opsional jika UI butuh)
  };
};
