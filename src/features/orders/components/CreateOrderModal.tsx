// src/features/orders/components/CreateOrderModal.tsx
"use client";

import { useEffect } from "react"; // <-- Import useEffect
import { FiX, FiClock, FiMapPin } from "react-icons/fi";
import { Button } from "@/features/auth/components/ui/button";
import { Label } from "@/features/auth/components/ui/label";
import { useCreateOrderForm } from "../hooks/useCreateOrderForm";
import { cn } from "@/lib/utils";

interface CreateOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    addresses: any[];
}

// Fungsi pembantu untuk membuat opsi jam kelipatan 30 menit (08:00 - 20:00)
const generateTimeSlots = () => {
    const slots = [];
    for (let i = 8; i <= 20; i++) {
        slots.push(`${i.toString().padStart(2, "0")}:00`);
        if (i !== 20) {
            slots.push(`${i.toString().padStart(2, "0")}:30`);
        }
    }
    return slots;
};

export default function CreateOrderModal({ isOpen, onClose, addresses }: CreateOrderModalProps) {
    const { formik, isLoading } = useCreateOrderForm({
        onSuccess: onClose,
    });

    const timeSlots = generateTimeSlots();

    // --- Efek untuk set default alamat (Primary) ketika modal dibuka ---
    useEffect(() => {
        // Cek jika modal terbuka, ada data alamat, dan belum ada alamat yang dipilih di formik
        if (isOpen && addresses.length > 0 && !formik.values.addressId) {
            const primaryAddress = addresses.find((addr) => addr.isPrimary);

            if (primaryAddress) {
                // Set ID alamat utama sebagai default
                formik.setFieldValue("addressId", primaryAddress.id);
            } else {
                // Jika user tidak punya alamat utama, jadikan alamat list pertama sebagai default opsional
                formik.setFieldValue("addressId", addresses[0].id);
            }
        }
    }, [isOpen, addresses, formik]);
    // ------------------------------------------------------------------

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">

                {/* Header Modal */}
                <div className="flex justify-between items-center mb-6 border-b border-slate-50 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Buat Pesanan Baru</h2>
                        <p className="text-slate-400 text-xs mt-1">Atur penjemputan pakaian kotor Anda.</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500 transition">
                        <FiX size={20} />
                    </button>
                </div>

                {/* Formik Form */}
                <form onSubmit={formik.handleSubmit} className="space-y-5">

                    {/* Input Alamat */}
                    <div className="space-y-2">
                        <Label htmlFor="addressId" className="flex items-center gap-2">
                            <FiMapPin className="text-blue-500" /> Pilih Alamat Penjemputan
                        </Label>
                        {addresses.length === 0 ? (
                            <div className="p-3 bg-red-50 text-red-500 text-sm rounded-xl border border-red-100">
                                Anda belum memiliki alamat tersimpan. Silakan tambah alamat di menu profil.
                            </div>
                        ) : (
                            <select
                                id="addressId"
                                name="addressId"
                                value={formik.values.addressId}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={cn(
                                    "w-full px-4 py-3.5 bg-slate-50 border rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer",
                                    formik.touched.addressId && formik.errors.addressId ? "border-red-500" : "border-slate-200"
                                )}
                            >
                                <option value="" disabled>-- Pilih Alamat --</option>
                                {addresses.map((addr) => (
                                    <option key={addr.id} value={addr.id}>
                                        {addr.isPrimary ? "(Utama)" : ""} {addr.label}  - {addr.address.substring(0, 30)}...
                                    </option>
                                ))}
                            </select>
                        )}
                        {formik.touched.addressId && formik.errors.addressId && (
                            <p className="text-xs text-red-500">{formik.errors.addressId}</p>
                        )}
                    </div>

                    {/* Input Jam Penjemputan */}
                    <div className="space-y-2">
                        <Label htmlFor="pickupAt" className="flex items-center gap-2">
                            <FiClock className="text-blue-500" /> Jam Penjemputan (Hari Ini)
                        </Label>
                        <select
                            id="pickupAt"
                            name="pickupAt"
                            value={formik.values.pickupAt}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={cn(
                                "w-full px-4 py-3.5 bg-slate-50 border rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer",
                                formik.touched.pickupAt && formik.errors.pickupAt ? "border-red-500" : "border-slate-200"
                            )}
                        >
                            <option value="">Sekarang</option>
                            {timeSlots.map((time) => (
                                <option key={time} value={time}>
                                    {time} WIB
                                </option>
                            ))}
                        </select>
                        {formik.touched.pickupAt && formik.errors.pickupAt && (
                            <p className="text-xs text-red-500">{formik.errors.pickupAt}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <Button
                            type="submit"
                            className="w-full h-12 text-base rounded-xl"
                            disabled={isLoading || addresses.length === 0}
                        >
                            {isLoading ? "Memproses..." : "Konfirmasi Penjemputan"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}