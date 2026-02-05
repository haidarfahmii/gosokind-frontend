"use client";

import { useState } from "react";
import { FiEye, FiEyeOff, FiCheckCircle } from "react-icons/fi";
import { useVerifyForm } from "../hooks/useVerifyForm";
import { Button } from "./ui/button"; // Asumsi path sesuai struktur kamu
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { FiLoader } from "react-icons/fi"; // Contoh icon loader

interface VerifyEmailFormProps {
    token: string;
}

export default function VerifyEmailForm({ token }: VerifyEmailFormProps) {
    // Panggil hook dengan token
    const { formik, isLoading, isVerifyingToken } = useVerifyForm(token);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // TAMPILKAN LOADING SCREEN SAAT CEK TOKEN
    if (isVerifyingToken) {
        return (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <FiLoader className="animate-spin text-blue-600" size={40} />
                <p className="text-gray-500">Memvalidasi token anda...</p>
            </div>
        );
    }

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-5">
            {/* Full Name Field */}
            <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    disabled={isLoading}
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.fullName && formik.errors.fullName ? "border-red-500" : ""}
                />
                {formik.touched.fullName && formik.errors.fullName && (
                    <p className="text-xs text-red-500 ml-1">{formik.errors.fullName}</p>
                )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                    <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimal 6 karakter"
                        disabled={isLoading}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`pr-12 ${formik.touched.password && formik.errors.password ? "border-red-500" : ""}`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                        tabIndex={-1}
                    >
                        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                    <p className="text-xs text-red-500 ml-1">{formik.errors.password}</p>
                )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Ulangi password"
                        disabled={isLoading}
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`pr-12 ${formik.touched.confirmPassword && formik.errors.confirmPassword ? "border-red-500" : ""}`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                        tabIndex={-1}
                    >
                        {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                </div>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <p className="text-xs text-red-500 ml-1">{formik.errors.confirmPassword}</p>
                )}
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
            >
                {isLoading ? "Memproses..." : (
                    <>
                        <FiCheckCircle size={20} />
                        Selesaikan Pendaftaran
                    </>
                )}
            </Button>
        </form>
    );
}