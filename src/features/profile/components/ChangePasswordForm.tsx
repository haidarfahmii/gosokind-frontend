// src/features/profile/components/ChangePasswordForm.tsx
"use client";

import { Button } from "@/features/auth/components/ui/button";
import { Input } from "@/features/auth/components/ui/input";
import { Label } from "@/features/auth/components/ui/label";
import { useChangePasswordForm } from "../hooks/useChangePasswordForm";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // Pastikan sudah install lucide-react

export default function ChangePasswordForm() {
    const { formik, isLoading } = useChangePasswordForm();

    // State untuk toggle visibility password
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                    <Input
                        id="currentPassword"
                        name="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Enter current password"
                        value={formik.values.currentPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={isLoading}
                    />
                    <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {formik.touched.currentPassword && formik.errors.currentPassword && (
                    <p className="text-sm text-red-500">{formik.errors.currentPassword}</p>
                )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                    <Input
                        id="newPassword"
                        name="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={formik.values.newPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={isLoading}
                    />
                    <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {formik.touched.newPassword && formik.errors.newPassword && (
                    <p className="text-sm text-red-500">{formik.errors.newPassword}</p>
                )}
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={isLoading}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <p className="text-sm text-red-500">{formik.errors.confirmPassword}</p>
                )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Changing Password..." : "Change Password"}
            </Button>
        </form>
    );
}