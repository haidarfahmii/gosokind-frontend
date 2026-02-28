"use client";

import { useRegisterForm } from "../hooks/useRegisterForm";
import { Button } from "@/features/auth/components/ui/button"; // Asumsi pakai Shadcn/UI
import { Input } from "@/features/auth/components/ui/input";
import { Label } from "@/features/auth/components/ui/label";
import { Checkbox } from "./ui/checkbox";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

export default function RegisterForm() {
    const { formik, isLoading } = useRegisterForm();
    const termsError = formik.submitCount > 0 ? formik.errors.acceptTerms : null;
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
                            placeholder="nama@contoh.com"
                            type="text"
                            disabled={isLoading}
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <p className="text-sm text-red-500">
                                {formik.errors.email}
                            </p>
                        )}
                    </div>

                    {/* Terms Checkbox */}
                    <div className="space-y-1">
                        <div className="flex items-center space-x-2 mt-2">
                            <Checkbox
                                id="terms"
                                checked={formik.values.acceptTerms}
                                onCheckedChange={(checked) =>
                                    formik.setFieldValue("acceptTerms", checked)
                                }
                                className={
                                    termsError
                                        ? "border-red-500 data-[state=unchecked]:border-red-500"
                                        : ""
                                }
                            />
                            <label
                                htmlFor="terms"
                                className={`text-sm font-medium leading-none cursor-pointer ${termsError ? "text-red-600" : "text-slate-700"
                                    }`}
                            >
                                I agree to the Terms & Conditions
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button disabled={isLoading} type="submit"
                        className="">
                        {isLoading ? "Memproses..." : "Daftar Sekarang"}
                    </Button>

                </div>
            </form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">
                        Or continue with
                    </span>
                </div>
            </div>

            <Button
                variant="outline" // Pastikan Button support variant ini atau sesuaikan style
                type="button"
                className="w-full"
                onClick={() => signIn("google", { callbackUrl: "/home" })}
            >
                <FcGoogle className="mr-2 h-4 w-4" />
                Google
            </Button>
        </div>
    );
}