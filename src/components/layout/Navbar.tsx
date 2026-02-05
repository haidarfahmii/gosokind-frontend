"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FiMenu, FiX, FiLogOut, FiUser } from "react-icons/fi";
import { useSession, signOut } from "next-auth/react"; // Import hook auth
import { Button } from "@/features/auth/components/ui/button"; // Pastikan path import benar
import { FaTshirt } from "react-icons/fa";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Mengambil data session user
    const { data: session, status } = useSession();

    // Effect untuk background navbar saat scroll
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
                    ? "bg-[#0a0c14]/90 backdrop-blur-md border-b border-white/10 py-4"
                    : "bg-transparent py-6"
                }`}
        >
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold text-white flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                            <FaTshirt/>
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

                    {/* Desktop Auth Buttons / User Profile */}
                    <div className="hidden md:flex items-center gap-4">
                        {status === "authenticated" ? (
                            // TAMPILAN JIKA SUDAH LOGIN
                            <div className="flex items-center gap-4 animate-fadeIn">
                                {/* Avatar */}
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center">
                                        {session?.user?.avatarUrl ? (
                                            <img
                                                src={session.user.avatarUrl}
                                                alt={session.user.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FiUser className="text-slate-400" size={20} />
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-white">
                                            {session?.user?.name || "User"}
                                        </span>
                                        <span className="text-xs text-slate-400 capitalize">
                                            {session?.user?.role?.toLowerCase() || "Customer"}
                                        </span>
                                    </div>
                                </div>

                                {/* Separator Kecil */}
                                <div className="h-8 w-[1px] bg-white/10 mx-2"></div>

                                {/* Tombol Logout */}
                                <button
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                                >
                                    <FiLogOut size={18} />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            // TAMPILAN JIKA BELUM LOGIN
                            <>
                                <Link
                                    href="/auth/login"
                                    className="text-sm font-semibold text-white hover:text-blue-400 transition-colors"
                                >
                                    Masuk
                                </Link>
                                <Link href="/auth/register">
                                    <Button className="bg-white text-blue-900 hover:bg-slate-100 hover:text-blue-900 border-none">
                                        Daftar Sekarang
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {isOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-[#0a0c14] border-b border-white/10 p-4 flex flex-col gap-4 shadow-xl">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-slate-300 hover:text-white py-2"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="h-[1px] bg-white/10 my-2"></div>

                        {status === "authenticated" ? (
                            // Mobile Logged In View
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                                        {session?.user?.avatarUrl ? (
                                            <img src={session.user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <FiUser className="text-slate-400" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{session?.user?.name}</p>
                                        <p className="text-xs text-slate-400">{session?.user?.email}</p>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => signOut()}
                                    className="w-full bg-red-600/10 text-red-500 hover:bg-red-600/20 border-red-600/20"
                                >
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            // Mobile Guest View
                            <div className="flex flex-col gap-3">
                                <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                                    <Button variant="ghost" className="w-full text-white justify-start">
                                        Masuk
                                    </Button>
                                </Link>
                                <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full bg-blue-600 text-white">
                                        Daftar Sekarang
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