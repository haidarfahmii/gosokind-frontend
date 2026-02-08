"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FiMenu, FiX, FiLogOut, FiUser, FiLogIn } from "react-icons/fi"; // Tambah FiLogIn untuk ikon mobile
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/features/auth/components/ui/button";
import { FaTshirt } from "react-icons/fa";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const { data: session, status } = useSession();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Beranda", href: "/" },
        { name: "Layanan", href: "#services" },
        { name: "Harga", href: "#pricing" },
        { name: "Tentang Kami", href: "#about" },
    ];

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
                ? "bg-[#0a0c14]/90 backdrop-blur-md border-b border-white/10 py-3" // Ubah py-4 jadi py-3 agar lebih compact saat scroll
                : "bg-transparent py-5" // Ubah py-6 jadi py-5
                }`}
        >
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                            <FaTshirt size={18} />
                        </div>
                        GOSOKIND
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center gap-6">
                        {status === "authenticated" ? (
                            <div className="flex items-center gap-4 animate-fadeIn">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center">
                                        {session?.user?.avatarUrl ? (
                                            <img
                                                src={session.user.avatarUrl}
                                                alt={session.user.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FiUser className="text-slate-400" size={18} />
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-white">
                                            {session?.user?.name?.split(" ")[0]} {/* Ambil nama depan */}
                                        </span>
                                    </div>
                                </div>
                                <div className="h-6 w-[1px] bg-white/10"></div>
                                <button
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="text-slate-400 hover:text-red-400 transition-colors"
                                    title="Logout"
                                >
                                    <FiLogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/auth/login"
                                    className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                                >
                                    Masuk
                                </Link>
                                <Link href="/auth/register">
                                    <Button size="sm" className="rounded-full px-5 shadow-none hover:shadow-lg hover:shadow-blue-600/20">
                                        Daftar Sekarang
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white p-2 hover:bg-white/5 rounded-lg transition"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {isOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-[#0a0c14] border-b border-white/10 p-4 flex flex-col shadow-2xl animate-in slide-in-from-top-5">
                        <div className="flex flex-col gap-1 mb-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-slate-300 hover:text-white hover:bg-white/5 px-4 py-3 rounded-lg transition font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        <div className="h-[1px] bg-white/10 mb-4 mx-2"></div>

                        {status === "authenticated" ? (
                            <div className="flex flex-col gap-3 p-2">
                                <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl border border-white/5">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                                        {session?.user?.avatarUrl ? (
                                            <img src={session.user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <FiUser className="text-slate-400" />
                                        )}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-white font-medium truncate">{session?.user?.name}</p>
                                        <p className="text-xs text-slate-400 truncate">{session?.user?.email}</p>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => signOut()}
                                    variant="destructive"
                                    className="w-full justify-center"
                                >
                                    <FiLogOut className="mr-2" /> Logout
                                </Button>
                            </div>
                        ) : (
                            // --- PERBAIKAN MOBILE GUEST BUTTONS ---
                            <div className="grid grid-cols-2 gap-3 px-2">
                                <Link href="/auth/login" onClick={() => setIsOpen(false)} className="w-full">
                                    <Button variant="outline" className="w-full bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white border-dashed">
                                        Masuk
                                    </Button>
                                </Link>
                                <Link href="/auth/register" onClick={() => setIsOpen(false)} className="w-full">
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                        Daftar
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}