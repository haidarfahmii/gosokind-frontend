import Link from "next/link";
import { ReactNode } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { FaTshirt } from "react-icons/fa"; // Atau gunakan icon shirt dari library lain

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
    linkText: string;
    linkUrl: string;
    linkLabel: string;
    showBackArrow?: boolean;
}

export default function AuthLayout({
    children,
    title,
    subtitle,
    linkText,
    linkUrl,
    linkLabel,
    showBackArrow = true,
}: AuthLayoutProps) {
    return (
        <div className="min-h-screen w-full bg-[#f8f9fa] flex items-center justify-center p-4">
            {/* Background decoration (optional blur effect behind card) */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 bg-blue-500/5 blur-[100px] rounded-full" />
            </div>

            {/* Main Card Container */}
            <div className="relative w-full max-w-120 bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-10 z-10">

                {/* Back Arrow */}
                {showBackArrow && (
                    <Link
                        href="/"
                        className="absolute top-8 left-8 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <FiArrowLeft size={24} />
                    </Link>
                )}

                {/* Header Section (Icon & Title) */}
                <div className="flex flex-col items-center text-center mb-8 pt-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl mb-6 shadow-lg shadow-blue-600/20">
                        <FaTshirt />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
                        {title}
                    </h1>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                        {subtitle}
                    </p>
                </div>

                {/* Form Content */}
                <div className="mb-8">
                    {children}
                </div>

                {/* Footer Link */}
                <div className="text-center text-sm text-slate-500">
                    {linkText}{" "}
                    <Link
                        href={linkUrl}
                        className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-all"
                    >
                        {linkLabel}
                    </Link>
                </div>
            </div>
        </div>
    );
}