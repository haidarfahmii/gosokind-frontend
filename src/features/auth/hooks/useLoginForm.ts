"use client";

import { useFormik } from "formik";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { loginSchema } from "../schemas/login.schema";
import { LoginFormValues } from "@/@types";

export type LoginType = "customer" | "employee";

export const useLoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // State untuk toggle antara Customer & Employee login
  const [loginType, setLoginType] = useState<LoginType>("customer");

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleLoginType = () => {
    setLoginType((prev) => (prev === "customer" ? "employee" : "customer"));
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

        // Gunakan provider yang sesuai dengan loginType
        const res = await signIn(loginType, {
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

          // Redirect berdasarkan role
          if (loginType === "employee") {
            // Redirect ke dashboard admin/employee
            router.push("/admin/super-admin/dashboard");
          } else {
            // Redirect ke homepage customer
            router.push("/");
          }

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
    loginType,
    toggleLoginType,
  };
};
