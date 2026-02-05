"use client";

import Link from "next/link";
import { FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";
import { useLoginForm } from "../hooks/useLoginForm"; //
import { Button } from "./ui/button"; //
import { Input } from "./ui/input"; //
import { Label } from "./ui/label"; //

export default function LoginForm() {
    const { formik, isLoading, showPassword, togglePasswordVisibility } = useLoginForm();

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
                <Label htmlFor="email" className="ml-1">
                    Email
                </Label>
                <Input
                    id="email"
                    name="email"
                    type="text"
                    placeholder="nama@email.com"
                    autoComplete="email"
                    disabled={isLoading}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    // Tambahkan class error jika ada error validasi
                    className={
                        formik.touched.email && formik.errors.email
                            ? "border-red-500 focus-visible:ring-red-200"
                            : ""
                    }
                />
                {/* Error Message Email */}
                {formik.touched.email && formik.errors.email && (
                    <div className="text-xs text-red-500 ml-1 mt-1">
                        {formik.errors.email}
                    </div>
                )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                    <Label htmlFor="password">Password</Label>
                    <Link
                        href="/auth/forgot-password"
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                        Forgot Password?
                    </Link>
                </div>
                <div className="relative">
                    <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Masukkan password"
                        autoComplete="current-password"
                        disabled={isLoading}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        // pr-12 untuk memberi ruang bagi icon mata
                        className={`pr-12 ${formik.touched.password && formik.errors.password
                                ? "border-red-500 focus-visible:ring-red-200"
                                : ""
                            }`}
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                        disabled={isLoading}
                        tabIndex={-1} // Agar tidak bisa difocus dengan tab (opsional)
                    >
                        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                </div>
                {/* Error Message Password */}
                {formik.touched.password && formik.errors.password && (
                    <div className="text-xs text-red-500 ml-1 mt-1">
                        {formik.errors.password}
                    </div>
                )}
            </div>

            {/* Submit Button */}
            {/* Button component sudah handle styling base, hover, dan active */}
            <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
            >
                {isLoading ? (
                    "Processing..."
                ) : (
                    <>
                        <FiLogIn size={20} className="mr-2" />
                        Login
                    </>
                )}
            </Button>
        </form>
    );
}