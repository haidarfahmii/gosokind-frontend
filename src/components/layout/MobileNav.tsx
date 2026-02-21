"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiClipboard, FiUser } from "react-icons/fi";
import { cn } from "@/lib/utils";

export default function MobileNav() {
    const pathname = usePathname();

    const navItems = [
        { label: "Beranda", href: "/", icon: <FiHome size={24} /> },
        { label: "Pesanan", href: "/orders", icon: <FiClipboard size={24} /> },
        { label: "Akun", href: "/profile", icon: <FiUser size={24} /> },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center max-w-md mx-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1.5 transition-colors w-16",
                                isActive ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            <div className={cn("transition-all", isActive && "scale-110")}>
                                {item.icon}
                            </div>
                            <span className={cn(
                                "text-[10px] font-medium",
                                isActive ? "font-bold" : "font-normal"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}