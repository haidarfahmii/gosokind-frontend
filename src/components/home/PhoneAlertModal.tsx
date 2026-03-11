"use client";

import { useRouter } from "next/navigation";
import { FaExclamation } from "react-icons/fa";

interface PhoneAlertModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PhoneAlertModal({ isOpen, onClose }: PhoneAlertModalProps) {
    const router = useRouter();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaExclamation size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Lengkapi Profil Anda</h3>
                <p className="text-sm text-gray-500 mb-6 px-2">
                    Anda harus mengisi nomor telepon aktif pada profil terlebih dahulu sebelum dapat membuat pesanan.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
                    >
                        Nanti Saja
                    </button>
                    <button
                        onClick={() => {
                            onClose(); // Tutup modal sebelum pindah halaman
                            router.push('/profile/account');
                        }}
                        className="flex-1 py-3.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                    >
                        Isi Sekarang
                    </button>
                </div>
            </div>
        </div>
    );
}