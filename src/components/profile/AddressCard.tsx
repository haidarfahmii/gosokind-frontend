import { cn } from "@/lib/utils";
import { FiEdit2, FiTrash2, FiMapPin, FiCheckCircle } from "react-icons/fi";

interface AddressCardProps {
    label: string;
    isPrimary?: boolean;
    address: string;
    onEdit?: () => void;
    onDelete?: () => void;
    onSetPrimary?: () => void; // Tambahan properti baru
}

export default function AddressCard({
    label,
    isPrimary,
    address,
    onEdit,
    onDelete,
    onSetPrimary
}: AddressCardProps) {
    return (
        <div className={cn(
            "border rounded-3xl p-5 mb-4 relative transition-all duration-300",
            isPrimary ? "bg-[#f0f7ff] border-blue-200 shadow-sm shadow-blue-100/50" : "bg-white border-slate-200"
        )}>
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <span className={cn(
                        "font-bold text-sm uppercase tracking-wide",
                        isPrimary ? "text-blue-600" : "text-slate-700"
                    )}>
                        {label}
                    </span>
                    {isPrimary && (
                        <span className="text-slate-400 font-bold text-[10px] bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
                            Utama
                        </span>
                    )}
                </div>
                <div className="flex gap-3">
                    <button onClick={onEdit} className="text-slate-400 hover:text-blue-600 transition-colors">
                        <FiEdit2 size={18} />
                    </button>
                    {!isPrimary && (
                        <button onClick={onDelete} className="text-slate-400 hover:text-red-500 transition-colors">
                            <FiTrash2 size={18} />
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-1 mb-4">
                <p className="text-slate-500 text-sm leading-relaxed max-w-[90%]">
                    {address}
                </p>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100/60 pt-4 mt-4">
                <div className="flex items-center gap-1.5 text-blue-500 bg-white/50 w-fit px-3 py-1 rounded-full border border-blue-50">
                    <FiMapPin size={14} />
                    <span className="text-xs font-semibold">Titik lokasi tersimpan</span>
                </div>

                {/* Tombol Set As Primary */}
                {!isPrimary && onSetPrimary && (
                    <button
                        onClick={onSetPrimary}
                        className="flex items-center gap-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 px-3 py-1 rounded-full transition-colors"
                    >
                        <FiCheckCircle size={14} />
                        <span className="text-xs font-semibold">Jadikan Utama</span>
                    </button>
                )}
            </div>
        </div>
    );
}