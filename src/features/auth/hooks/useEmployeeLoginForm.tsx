"use client";

import { useFormik } from "formik";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { loginSchema } from "../schemas/login.schema";
import { LoginFormValues } from "@/@types";
import { getDefaultDashboard } from "@/config/navigation";

export const useEmployeeLoginForm = () => {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

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

        const res = await signIn("employee", {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (res?.error) {
          toast.error(res.error || "Email atau password salah");
          return;
        }

        if (res?.ok) {
          toast.success("Login berhasil!");

          // Refresh session agar role tersedia, lalu redirect sesuai role
          const updatedSession = await update();
          const role: string = updatedSession?.user?.role ?? "";
          const destination = getDefaultDashboard(role);

          router.push(destination);
          router.refresh();
        }
      } catch (error: any) {
        console.error("Employee Login Error:", error);
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
