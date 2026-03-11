"use client";

import { Button } from "@/features/auth/components/ui/button";
import { Input } from "@/features/auth/components/ui/input";
import { Label } from "@/features/auth/components/ui/label";
import { useUpdateProfileForm } from "../hooks/useUpdateProfileForm";
import Image from "next/image";
import { User } from "lucide-react";
import { FiUser } from "react-icons/fi";

export default function UpdateProfileForm() {
    const { formik, isLoading, previewAvatar, handleAvatarChange } = useUpdateProfileForm();

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-200 flex justify-center items-center">
                    {previewAvatar ? (
                        <Image
                            src={previewAvatar}
                            alt="Profile Preview"
                            fill
                            className="object-cover"
                            sizes="xl"
                            priority
                            onError={(e) => {
                                // Jika gambar error, kita bisa kosongkan preview agar kembali ke icon
                                // atau biarkan kosong. Di sini kita set display none pada img yg error
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    ) : (
                        <FiUser className="w-12 h-12 text-slate-400" />
                    )}
                </div>
                {formik.errors.avatar && (
                    <p className="text-sm text-red-500 mt-1">{formik.errors.avatar as string}</p>
                )}
                <div className="flex items-center gap-2">
                    <Label htmlFor="avatar-upload" className="cursor-pointer bg-slate-100 px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-200 transition">
                        Change Photo
                    </Label>
                    <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                    />
                </div>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isLoading}
                />
                {formik.touched.fullName && formik.errors.fullName && (
                    <p className="text-sm text-red-500">{formik.errors.fullName}</p>
                )}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="081234567890"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isLoading}
                />
                {formik.touched.phone && formik.errors.phone && (
                    <p className="text-sm text-red-500">{formik.errors.phone as string}</p>
                )}
            </div>

            {/* Email */}
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isLoading}
                />
                {/* Helper Text untuk Backend Logic */}
                <p className="text-xs text-slate-500">
                    Changing email will require re-verification.
                </p>
                {formik.touched.email && formik.errors.email && (
                    <p className="text-sm text-red-500">{formik.errors.email}</p>
                )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Saving Changes..." : "Save Changes"}
            </Button>
        </form>
    );
}