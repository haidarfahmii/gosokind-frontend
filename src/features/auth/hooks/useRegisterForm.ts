"use client";

import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import { authService } from "../services/auth.service";
import { registerSchema } from "../schemas/register.schema";
import { RegisterFormValues } from "@/@types";

export const useRegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik<RegisterFormValues & { acceptTerms: boolean }>({
    initialValues: {
      email: "",
      acceptTerms: false,
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);

        await authService.register(values);

        // Feedback sukses
        toast.success("Link verifikasi telah dikirim ke email Anda!");

        // Opsional: Redirect atau kosongkan form
        formik.resetForm();
      } catch (error: any) {
        // Handle error dari backend (misal: Email already exists)
        toast.error(error?.response?.data?.message || "Registrasi gagal");
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
