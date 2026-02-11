"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import MobileNav from "@/components/layout/MobileNav"; // Import Navigasi Bawah
import ProfileMenuItem from "@/components/profile/ProfileMenuItem"; // Import Menu Item
import {
    FiUser,
    FiMapPin,
    FiCreditCard,
    FiHelpCircle,
    FiFileText,
    FiLogOut,
    FiLock
} from "react-icons/fi";
import Link from "next/link";
import { User } from "lucide-react";

export default function ProfilePage() {
    const { data: session } = useSession();
    const router = useRouter();

    // Inisial nama untuk Avatar jika tidak ada gambar
    const userInitials = session?.user?.name
        ? session.user.name.substring(0, 2).toUpperCase()
        : "GK";

    return (
        <div className="min-h-screen bg-[#f8f9fa] pb-24 font-sans">
            {/* Container utama dibatasi max-w-md agar tampilan tetap seperti mobile di desktop */}
            <div className="max-w-md mx-auto min-h-screen flex flex-col relative bg-[#f8f9fa]">

                {/* SECTION 1: Header Profil */}
                <div className="bg-white p-6 pb-8 rounded-b-4xl shadow-sm mb-6 pt-16">
                    <div className="flex items-center gap-5">
                        {/* Avatar */}
                        <div className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl border-4 border-gray-200 shadow-sm overflow-hidden shrink-0">
                            {session?.user?.avatarUrl ? (
                                <img
                                    src={session.user.avatarUrl}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="h-12 w-12 text-slate-400"/>
                            )}
                        </div>

                        {/* User Info */}
                        <div className="flex flex-col overflow-hidden">
                            <h1 className="text-xl font-bold text-slate-900 truncate">
                                {session?.user?.name || "Pengguna Gosokind"}
                            </h1>
                            <p className="text-sm text-slate-400 truncate">
                                {session?.user?.email || "user@example.com"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* SECTION 2: Menu Group 1 (Settings) */}
                <div className="px-5 mb-5">
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-50">
                        <Link href={"/profile/account"}>
                            <ProfileMenuItem
                                icon={<FiUser size={20} />}
                                label="Informasi Dasar"
                            // onClick={() => router.push("/profile/account")}
                            />
                        </Link>
                        <div className="h-px bg-slate-100 mx-4" /> {/* Divider */}
                        <ProfileMenuItem
                            icon={<FiLock size={20} className="text-red-800" />}
                            label="Keamanan"
                            onClick={() => router.push("/profile/security")}
                        />
                        <div className="h-px bg-slate-100 mx-4" /> {/* Divider */}
                        <ProfileMenuItem
                            icon={<FiMapPin size={20} className="text-green-600" />}
                            label="Alamat Tersimpan"
                            onClick={() => console.log("Alamat")}
                        />
                        <div className="h-px bg-slate-100 mx-4" />
                        <ProfileMenuItem
                            icon={<FiCreditCard size={20} className="text-orange-500" />}
                            label="Metode Pembayaran"
                            onClick={() => console.log("Payment")}
                        />
                    </div>
                </div>

                {/* SECTION 3: Menu Group 2 (Support) */}
                <div className="px-5 mb-8">
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-50">
                        <ProfileMenuItem
                            icon={<FiHelpCircle size={20} />}
                            label="Pusat Bantuan"
                        />
                        <div className="h-px bg-slate-100 mx-4" />
                        <ProfileMenuItem
                            icon={<FiFileText size={20} />}
                            label="Syarat & Ketentuan"
                        />
                    </div>
                </div>

                {/* SECTION 4: Logout Button */}
                <div className="px-5">
                    <button
                        onClick={() => signOut({ callbackUrl: "/auth/login" })}
                        className="w-full py-4 rounded-xl bg-red-50 text-red-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-100 transition-colors mb-6"
                    >
                        <FiLogOut size={18} />
                        Keluar
                    </button>
                </div>

                {/* Bottom Navigation Component */}
                <MobileNav />
            </div>
        </div>
    );
}