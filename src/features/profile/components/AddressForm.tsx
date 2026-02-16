"use client";

import { FiSave, FiX, FiMapPin } from "react-icons/fi";
import { Button } from "@/features/auth/components/ui/button";
import { Input } from "@/features/auth/components/ui/input";
import { Label } from "@/features/auth/components/ui/label";
import { Checkbox } from "@/features/auth/components/ui/checkbox";
import { useAddressForm } from "../hooks/useAddressForm";
import { cn } from "@/lib/utils";

interface AddressFormProps {
    initialData?: any;
    onClose: () => void;
    onSuccess?: () => void; // Digunakan untuk trigger refresh data list alamat
}

export default function AddressForm({ initialData, onClose, onSuccess }: AddressFormProps) {
    // Memanggil custom hook
    const { formik, isLoading, isEditMode } = useAddressForm({
        initialData,
        onClose,
        onSuccess
    });

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">

                <div className="flex justify-between items-center mb-6 border-b border-slate-50 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            {isEditMode ? <FiMapPin className="text-blue-600" /> : <FiMapPin className="text-green-600" />}
                            {isEditMode ? "Ubah Alamat" : "Tambah Alamat Baru"}
                        </h2>
                        <p className="text-slate-400 text-xs mt-1">
                            {isEditMode ? "Perbarui detail lokasi pengiriman." : "Pastikan alamat yang Anda masukkan akurat."}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500 transition">
                        <FiX size={20} />
                    </button>
                </div>

                <form onSubmit={formik.handleSubmit} className="space-y-5">
                    {/* Input Label */}
                    <div className="space-y-2">
                        <Label htmlFor="label">Label Alamat</Label>
                        <Input
                            id="label"
                            placeholder="Contoh: Rumah, Kantor, Kos"
                            {...formik.getFieldProps("label")}
                            className={cn(formik.touched.label && formik.errors.label && "border-red-500")}
                        />
                        {formik.touched.label && formik.errors.label && (
                            <p className="text-xs text-red-500">{formik.errors.label as string}</p>
                        )}
                    </div>

                    {/* Input Alamat Lengkap */}
                    <div className="space-y-2">
                        <Label htmlFor="fullAddress">Alamat Lengkap</Label>
                        <textarea
                            id="fullAddress"
                            rows={3}
                            className={cn(
                                "w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none text-sm font-sans",
                                formik.touched.fullAddress && formik.errors.fullAddress && "border-red-500"
                            )}
                            placeholder="Jl. Nama Jalan, No. Rumah, RT/RW, Kecamatan, Kota, Kode Pos..."
                            {...formik.getFieldProps("fullAddress")}
                        />
                        {formik.touched.fullAddress && formik.errors.fullAddress && (
                            <p className="text-xs text-red-500">{formik.errors.fullAddress as string}</p>
                        )}
                    </div>

                    {/* Input Koordinat */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="latitude">Latitude</Label>
                            <Input
                                id="latitude"
                                type="number"
                                step="any"
                                className={cn(formik.touched.latitude && formik.errors.latitude && "border-red-500")}
                                placeholder="-6.200000"
                                {...formik.getFieldProps("latitude")}
                            />
                            {formik.touched.latitude && formik.errors.latitude && (
                                <p className="text-xs text-red-500">{formik.errors.latitude as string}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="longitude">Longitude</Label>
                            <Input
                                id="longitude"
                                type="number"
                                step="any"
                                className={cn(formik.touched.longitude && formik.errors.longitude && "border-red-500")}
                                placeholder="106.816666"
                                {...formik.getFieldProps("longitude")}
                            />
                            {formik.touched.longitude && formik.errors.longitude && (
                                <p className="text-xs text-red-500">{formik.errors.longitude as string}</p>
                            )}
                        </div>
                    </div>

                    {/* Checkbox Primary */}
                    <div className="flex items-start space-x-3 py-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <Checkbox
                            id="isPrimary"
                            checked={formik.values.isPrimary}
                            onCheckedChange={(checked) => formik.setFieldValue("isPrimary", checked)}
                        />
                        <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="isPrimary" className="cursor-pointer font-semibold text-slate-700">
                                Jadikan Alamat Utama
                            </Label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <Button type="submit" className="w-full h-12 text-base rounded-xl" disabled={isLoading}>
                            {isLoading ? "Menyimpan..." : (
                                <>
                                    <FiSave className="mr-2" />
                                    {isEditMode ? "Simpan Perubahan" : "Simpan Alamat"}
                                </>
                            )}
                        </Button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full mt-3 py-3 text-slate-400 font-semibold text-sm hover:text-slate-600 transition"
                            disabled={isLoading}
                        >
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}