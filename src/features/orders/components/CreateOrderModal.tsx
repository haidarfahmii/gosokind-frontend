"use client";

import { useEffect, useMemo } from "react"; // [!IMPORT useMemo]
import { FiX, FiClock, FiMapPin } from "react-icons/fi";
import { Button } from "@/features/auth/components/ui/button";
import { Label } from "@/features/auth/components/ui/label";
import { useCreateOrderForm } from "../hooks/useCreateOrderForm";
import { cn } from "@/lib/utils";
import { TimePickerWheel } from "@/components/ui/time-picker-wheel";

interface CreateOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    addresses: any[];
}

// Pindahkan helper function ke luar komponen agar tidak dibuat ulang
const generateTimeSlots = () => {
    const slots = [];
    slots.push("Sekarang");
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

    const timeSlots = useMemo(() => generateTimeSlots(), []);

    useEffect(() => {
        if (isOpen && addresses.length > 0 && !formik.values.addressId) {
            const primaryAddress = addresses.find((addr) => addr.isPrimary);
            if (primaryAddress) {
                formik.setFieldValue("addressId", primaryAddress.id);
            } else {
                formik.setFieldValue("addressId", addresses[0].id);
            }
        }

    }, [isOpen, addresses, formik]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">

                <div className="flex justify-between items-center mb-6 border-b border-slate-50 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Buat Pesanan Baru</h2>
                        <p className="text-slate-400 text-xs mt-1">Atur penjemputan pakaian kotor Anda.</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500 transition">
                        <FiX size={20} />
                    </button>
                </div>

                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    {/* Input Alamat */}
                    <div className="space-y-3">
                        <Label htmlFor="addressId" className="flex items-center gap-2 text-base">
                            <FiMapPin className="text-blue-500" /> Pilih Alamat Penjemputan
                        </Label>
                        {addresses.length === 0 ? (
                            <div className="p-3 bg-red-50 text-red-500 text-sm rounded-xl border border-red-100">
                                Anda belum memiliki alamat tersimpan.
                            </div>
                        ) : (
                            <div className="relative">
                                <select
                                    id="addressId"
                                    name="addressId"
                                    value={formik.values.addressId}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={cn(
                                        "w-full px-4 py-4 bg-slate-50 border rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer text-sm font-medium",
                                        formik.touched.addressId && formik.errors.addressId ? "border-red-500" : "border-slate-200"
                                    )}
                                >
                                    <option value="" disabled>-- Pilih Alamat --</option>
                                    {addresses.map((addr) => (
                                        <option key={addr.id} value={addr.id}>
                                            {addr.isPrimary ? "(Utama)" : ""} {addr.label} - {addr.address.substring(0, 25)}...
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        )}
                        {formik.touched.addressId && formik.errors.addressId && (
                            <p className="text-xs text-red-500">{formik.errors.addressId}</p>
                        )}
                    </div>

                    {/* Input Jam (Wheel) */}
                    <div className="space-y-3">
                        <Label htmlFor="pickupAt" className="flex items-center gap-2 text-base">
                            <FiClock className="text-blue-500" /> Jam Penjemputan (Hari Ini)
                        </Label>

                        <TimePickerWheel
                            options={timeSlots}
                            value={formik.values.pickupAt || "Sekarang"}
                            onChange={(val) => {
                                const backendVal = val === "Sekarang" ? "" : val;
                                formik.setFieldValue("pickupAt", backendVal);
                            }}
                        />

                        {formik.touched.pickupAt && formik.errors.pickupAt && (
                            <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg flex items-center gap-2">
                                <span className="font-bold">!</span> {formik.errors.pickupAt}
                            </div>
                        )}

                        <p className="text-center text-xs text-slate-400 mt-2">
                            {formik.values.pickupAt && formik.values.pickupAt !== "Sekarang"
                                ? `Kurir akanmenjemput sekitar pukul ${formik.values.pickupAt} WIB`
                                : "Kurir akan menjemput secepatnya (Estimasi 30-60 menit)"}
                        </p>
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            className="w-full h-14 text-base font-bold rounded-2xl shadow-xl shadow-blue-600/20"
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