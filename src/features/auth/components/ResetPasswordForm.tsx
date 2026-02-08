"use client";

import { useResetPasswordForm } from "../hooks/useResetPasswordForm";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { FiEye, FiEyeOff, FiLoader } from "react-icons/fi";

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const { formik, isLoading, isVerifyingToken, isTokenValid } =
    useResetPasswordForm({ token });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (isVerifyingToken) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-4">
        <FiLoader className="animate-spin text-4xl text-blue-600" />
        <p className="text-slate-500">Memverifikasi token...</p>
      </div>
    );
  }

  if (!isTokenValid) {
    return (
      <div className="text-center py-10 text-red-500">
        <p>Token tidak valid atau sudah kadaluarsa.</p>
        <Button
          variant="link"
          onClick={() => (window.location.href = "/auth/forgot-password")}
        >
          Kirim Ulang Link
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={formik.handleSubmit}>
        <div className="grid gap-4">
          {/* Password Field */}
          <div className="grid gap-2">
            <Label htmlFor="password">Password Baru</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="password"
                disabled={isLoading}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="pr-10" /* Tambahkan padding kanan agar teks tidak menabrak icon */
              />
              <button
                type="button"
                /* Gunakan top-1/2 dan -translate-y-1/2 agar selalu di tengah secara vertikal */
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1} // Agar tidak bisa difokuskan dengan tab (opsional)
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-sm text-red-500">{formik.errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="confirm password"
                disabled={isLoading}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="pr-10" /* Tambahkan padding kanan */
              />
              <button
                type="button"
                /* Samakan class positioning */
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <FiEyeOff size={18} />
                ) : (
                  <FiEye size={18} />
                )}
              </button>
            </div>
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {formik.errors.confirmPassword}
                </p>
              )}
          </div>

          <Button disabled={isLoading} type="submit">
            {isLoading ? "Menyimpan..." : "Ubah Password"}
          </Button>
        </div>
      </form>
    </div>
  );
}
