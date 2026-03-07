import { ReactNode } from "react";
import { FiChevronRight } from "react-icons/fi";

interface ProfileMenuItemProps {
    icon: ReactNode;
    label: string;
    onClick?: () => void;
    className?: string;
}

export default function ProfileMenuItem({ icon, label, onClick, className }: ProfileMenuItemProps) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors ${className}`}
        >
            <div className="flex items-center gap-4">
                {/* Icon Wrapper dengan warna background tipis sesuai gambar */}
                <div className="w-10 h-10 rounded-full bg-blue-50/50 text-blue-600 flex items-center justify-center">
                    {icon}
                </div>
                <span className="text-slate-700 font-medium text-sm md:text-base">
                    {label}
                </span>
            </div>
            <FiChevronRight className="text-slate-300" size={20} />
        </button>
    );
}