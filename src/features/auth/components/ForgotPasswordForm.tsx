"use client";

import { useForgotPasswordForm } from "../hooks/useForgotPasswordForm";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { FiCheckCircle } from "react-icons/fi"; // Opsional: icon sukses

export default function ForgotPasswordForm() {
    const { formik, isLoading, isSuccess } = useForgotPasswordForm();

    // Tampilkan pesan sukses jika email berhasil dikirim
    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center text-center space-y-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <FiCheckCircle className="text-4xl text-green-600" />
                <div>
                    <h3 className="text-lg font-medium text-green-800">Email Terkirim!</h3>
                    <p className="text-sm text-green-700 mt-1">
                        Silakan periksa inbox (dan spam) email Anda untuk link reset password.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid gap-6">
            <form onSubmit={formik.handleSubmit}>
                <div className="grid gap-4">

                    {/* Email Field */}
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="nama@email.com"
                            disabled={isLoading}
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur} // Penting: agar validasi berjalan saat field ditinggalkan
                        />

                        {/* Error Message */}
                        {formik.touched.email && formik.errors.email ? (
                            <p className="text-sm text-red-500">
                                {formik.errors.email}
                            </p>
                        ) : (
                            // Helper text hanya muncul jika tidak ada error
                            <p className="text-[0.8rem] text-slate-500">
                                Kami akan mengirimkan link reset password ke email Anda.
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button disabled={isLoading} type="submit">
                        {isLoading ? "Mengirim..." : "Reset Password"}
                    </Button>

                </div>
            </form>
        </div>
    );
}