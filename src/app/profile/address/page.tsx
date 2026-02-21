"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiPlus, FiMapPin, FiLoader } from "react-icons/fi";
import MobileNav from "@/components/layout/MobileNav";
import AddressCard from "@/components/profile/AddressCard";
import AddressForm from "@/features/profile/components/AddressForm";
import { addressService } from "@/features/profile/services/address.service";
import { toast } from "react-toastify";

export default function AddressPage() {
    const router = useRouter();

    // State Modal & Data
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<any>(null);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch data alamat dari backend
    const fetchAddresses = async () => {
        setIsLoading(true);
        try {
            const response = await addressService.getAll();
            setAddresses(response.data); // Asumsi backend mengembalikan { success: true, data: [...] }
        } catch (error: any) {
            console.error("Fetch addresses error:", error);
            toast.error(error.response?.data?.message || "Gagal memuat daftar alamat");
        } finally {
            setIsLoading(false);
        }
    };

    // Panggil fetchAddresses saat komponen pertama kali dirender
    useEffect(() => {
        fetchAddresses();
    }, []);

    // Handler Buka Form
    const handleCreate = () => {
        setSelectedAddress(null);
        setIsModalOpen(true);
    };

    const handleEdit = (addr: any) => {
        setSelectedAddress(addr);
        setIsModalOpen(true);
    };

    // Handler Hapus Alamat
    const handleDelete = async (id: string) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus alamat ini?")) return;

        try {
            await addressService.delete(id);
            toast.success("Alamat berhasil dihapus");
            fetchAddresses(); // Refresh list setelah hapus
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal menghapus alamat");
        }
    };

    // Handler Set Alamat Utama
    const handleSetPrimary = async (id: string) => {
        try {
            await addressService.setPrimary(id);
            toast.success("Alamat utama berhasil diperbarui");
            fetchAddresses(); // Refresh list setelah update
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal mengubah alamat utama");
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] pb-24 font-sans">
            <div className="max-w-md mx-auto min-h-screen flex flex-col relative bg-white sm:bg-[#f8f9fa]">

                {/* --- HEADER --- */}
                <div className="bg-white p-4 flex items-center gap-4 sticky top-0 z-10 sm:rounded-b-3xl sm:shadow-sm sm:mx-4 sm:mt-4 border-b sm:border-none border-slate-50">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-700"
                    >
                        <FiArrowLeft size={24} />
                    </button>
                    <h1 className="text-lg font-bold text-slate-900">Alamat Tersimpan</h1>
                </div>

                {/* --- MAIN CONTENT --- */}
                <div className="flex-1 px-5 pt-6">
                    {/* LOADING STATE */}
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
                            <FiLoader className="animate-spin mb-4" size={32} />
                            <p className="text-sm font-medium">Memuat alamat...</p>
                        </div>
                    ) : addresses.length === 0 ? (
                        /* LOGIKA KONDISIONAL EMPTY STATE */
                        <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-in fade-in zoom-in duration-500">
                            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
                                <FiMapPin size={40} className="text-blue-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                                Belum ada alamat
                            </h3>
                            <p className="text-slate-500 text-sm mb-8 max-w-62.5 leading-relaxed">
                                Yuk, tambahkan alamat rumah atau kantormu untuk mempermudah penjemputan laundry.
                            </p>
                            <button
                                onClick={handleCreate}
                                className="bg-blue-600 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/30 transition-all w-full max-w-xs flex items-center justify-center gap-2"
                            >
                                <FiPlus size={20} />
                                Tambah Alamat Baru
                            </button>
                        </div>
                    ) : (
                        /* TAMPILAN JIKA SUDAH ADA ALAMAT (LIST VIEW) */
                        <>
                            {addresses.map((addr) => (
                                <AddressCard
                                    key={addr.id}
                                    label={addr.label}
                                    isPrimary={addr.isPrimary}
                                    address={addr.address}
                                    onEdit={() => handleEdit(addr)}
                                    onDelete={() => handleDelete(addr.id)}
                                    onSetPrimary={() => handleSetPrimary(addr.id)}
                                />
                            ))}

                            {/* Tombol Tambah (Versi Dashed/Secondary) saat list ada */}
                            <button
                                onClick={handleCreate}
                                className="w-full py-5 border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center gap-3 text-slate-500 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 transition-all mt-4 mb-8 group"
                            >
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                    <FiPlus size={18} className="text-slate-400 group-hover:text-blue-600" />
                                </div>
                                <span className="font-bold text-sm">Tambah Alamat Baru</span>
                            </button>
                        </>
                    )}
                </div>

                {/* --- BOTTOM NAV --- */}
                <MobileNav />

                {/* --- MODAL FORM --- */}
                {isModalOpen && (
                    <AddressForm
                        initialData={selectedAddress}
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={() => {
                            toast.success(selectedAddress ? "Alamat berhasil diperbarui!" : "Alamat baru berhasil ditambahkan!");
                            fetchAddresses(); // Refresh data otomatis setelah submit sukses
                        }}
                    />
                )}
            </div>
        </div>
    );
}