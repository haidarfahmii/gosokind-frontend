"use client";

import { useSession } from "next-auth/react"; // 1. Import useSession
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { Button } from "@/features/auth/components/ui/button";
import { Input } from "@/features/auth/components/ui/input";
import { Label } from "@/features/auth/components/ui/label";
import MobileNav from "@/components/layout/MobileNav";
import ChangePasswordForm from "@/features/profile/components/ChangePasswordForm";

export default function SecurityPage() {
    const router = useRouter();
    const { data: session } = useSession(); // 2. Ambil data session

    // Helper untuk inisial nama (misal "Rafa" -> "R")
    const userInitial = session?.user?.name
        ? session.user.name.charAt(0).toUpperCase()
        : "U";

    return (
        <div className="min-h-screen bg-[#f8f9fa] pb-24 font-sans">
            <div className="max-w-md mx-auto min-h-screen flex flex-col relative bg-white sm:bg-[#f8f9fa]">

                {/* --- HEADER --- */}
                <div className="bg-white p-4 flex items-center gap-4 sticky top-0 z-10 sm:rounded-b-3xl sm:shadow-sm sm:mx-4 sm:mt-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-700"
                    >
                        <FiArrowLeft size={24} />
                    </button>
                    <h1 className="text-lg font-bold text-slate-900">Keamanan</h1>
                </div>

                {/* --- MAIN CONTENT --- */}
                <div className="flex-1 px-6 pt-6 sm:px-8">

                    {/* FORM SECTION */}
                    <ChangePasswordForm />
                </div>

                {/* --- BOTTOM NAV --- */}
                <MobileNav />
            </div>
        </div>
    );
}