"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import MobileNav from "@/components/layout/MobileNav";
import { PlusCircle, Clock, MapPin, Shirt, ChevronRight, User } from "lucide-react";
import Link from "next/link";
import axiosInstance from "@/utils/axiosInstance";
import CreateOrderModal from "@/features/orders/components/CreateOrderModal";
import OrderStatusBadge from "@/components/home/OrderStatusBadge"; // Sesuaikan path jika berbeda
import Image from "next/image";
import PhoneAlertModal from "@/components/home/PhoneAlertModal";

export default function HomePage() {
    const { data: session } = useSession();
    const router = useRouter();

    const [primaryAddress, setPrimaryAddress] = useState<{ label: string; detail: string } | null>(null);
    const [allAddresses, setAllAddresses] = useState<any[]>([]);
    const [isLoadingAddress, setIsLoadingAddress] = useState(true);

    const [activeOrder, setActiveOrder] = useState<any>(null);
    const [isLoadingOrder, setIsLoadingOrder] = useState(true);

    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [isPhoneAlertOpen, setIsPhoneAlertOpen] = useState(false);
    const userName = session?.user?.name?.split(" ")[0] || "Pelanggan";

    useEffect(() => {
        if (!session?.user) return;

        const fetchData = async () => {
            try {
                // Fetch Alamat
                const resAddress = await axiosInstance.get('/addresses');
                const addresses = resAddress.data.data || resAddress.data;
                if (addresses?.length > 0) {
                    setAllAddresses(addresses);
                    const mainAddress = addresses.find((a: any) => a.isPrimary) || addresses[0];
                    setPrimaryAddress({
                        label: mainAddress.label,
                        detail: mainAddress.address.length > 25 ? `${mainAddress.address.substring(0, 25)}...` : mainAddress.address
                    });
                }
            } catch (error) {
                console.error("Gagal memuat alamat:", error);
            } finally {
                setIsLoadingAddress(false);
            }

            try {
                // Fetch Pesanan Aktif
                const resOrders = await axiosInstance.get('/customer/orders');
                const orders = resOrders.data.data?.data || resOrders.data.data?.orders || [];
                // Cari pesanan pertama yang belum selesai
                const active = orders.find((o: any) => o.status !== "COMPLETED");
                setActiveOrder(active || null);
            } catch (error) {
                console.error("Gagal memuat pesanan aktif:", error);
            } finally {
                setIsLoadingOrder(false);
            }
        };

        fetchData();
    }, [session]);

    return (
        <div className="min-h-screen bg-[#f8f9fa] pb-24 font-sans">
            <div className="max-w-md mx-auto min-h-screen flex flex-col relative bg-[#f8f9fa] shadow-sm">

                {/* Header Section */}
                <header className="bg-blue-600 text-white p-6 rounded-b-3xl shadow-md">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <p className="text-blue-100 text-sm">Selamat datang kembali,</p>
                            <h1 className="text-2xl font-bold truncate max-w-50">{userName}</h1>
                        </div>
                        <Link href="/profile">
                            <div className="w-14 h-14 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-xl border-2 border-blue-200 overflow-hidden shrink-0">
                                {session?.user?.avatarUrl ? (
                                    <Image
                                        src={session.user.avatarUrl}
                                        alt="User Avatar"
                                        width={40}
                                        height={40}
                                        priority
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <User className="h-9 w-9 text-slate-400" />
                                )}
                            </div>
                        </Link>
                    </div>

                    <Link href="/profile/address" className="bg-white/20 rounded-lg p-3 flex items-center justify-between gap-2 backdrop-blur-sm hover:bg-white/30 transition-colors active:scale-[0.98]">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <MapPin size={18} className="text-white shrink-0" />
                            <div className="text-sm font-medium text-white truncate">
                                <span className="opacity-90">Kirim ke: </span>
                                {isLoadingAddress ? (
                                    <span className="font-normal opacity-70 animate-pulse">Memuat alamat...</span>
                                ) : primaryAddress ? (
                                    <span className="font-semibold">{primaryAddress.label} <span className="font-normal opacity-90">- {primaryAddress.detail}</span></span>
                                ) : (
                                    <span className="font-normal opacity-90">Belum ada alamat (Tambah)</span>
                                )}
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-white opacity-70 shrink-0" />
                    </Link>
                </header>

                <main className="flex-1 px-5 pt-6 pb-6">
                    {/* Active Order Banner */}
                    <div className="mb-8">
                        <div className="flex justify-between items-end mb-3">
                            <h2 className="font-semibold text-gray-800">Pesanan Aktif</h2>
                            <Link href="/orders" className="text-sm text-blue-600 font-medium hover:underline">Lihat Semua</Link>
                        </div>

                        {isLoadingOrder ? (
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center h-24 animate-pulse">
                                <p className="text-sm text-gray-400">Memuat pesanan...</p>
                            </div>
                        ) : activeOrder ? (
                            <div
                                onClick={() => router.push(`/orders/${activeOrder.orderNumber}`)}
                                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:border-blue-200 hover:shadow-md transition-all active:bg-gray-50"
                            >
                                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                    <Shirt size={24} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 mb-1">{activeOrder.orderNumber}</p>
                                    <OrderStatusBadge status={activeOrder.status} />
                                    <p className="text-xs text-blue-600 mt-2 flex items-center gap-1 font-medium">
                                        <Clock size={12} /> {activeOrder.totalWeight ? `${activeOrder.totalWeight} Kg` : "Menunggu penimbangan"}
                                    </p>
                                </div>
                                <ChevronRight size={20} className="text-gray-300" />
                            </div>
                        ) : (
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center gap-2">
                                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center">
                                    <Shirt size={20} className="text-slate-300" />
                                </div>
                                <p className="text-sm text-gray-500">Belum ada pesanan yang sedang berjalan.</p>
                            </div>
                        )}
                    </div>

                    {/* Action Button: Trigger Modal */}
                    <h2 className="font-semibold text-gray-800 mb-3">Layanan Kami</h2>
                    <button
                        onClick={() => {
                            // Cek apakah user memiliki phone number
                            if (!session?.user?.phone) {
                                setIsPhoneAlertOpen(true);
                            } else {
                                setIsOrderModalOpen(true);
                            }
                        }}
                        className="w-full bg-blue-600 text-white rounded-2xl p-6 flex flex-col items-center justify-center gap-3 shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors active:scale-[0.98]"
                    >
                        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <PlusCircle size={32} />
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold text-lg">Buat Pesanan Baru</h3>
                            <p className="text-blue-100 text-sm mt-1 px-4">Panggil kurir untuk menjemput pakaianmu sekarang</p>
                        </div>
                    </button>
                </main>

                <MobileNav />

                <CreateOrderModal
                    isOpen={isOrderModalOpen}
                    onClose={() => setIsOrderModalOpen(false)}
                    addresses={allAddresses}
                />

                <PhoneAlertModal
                    isOpen={isPhoneAlertOpen}
                    onClose={() => setIsPhoneAlertOpen(false)}
                />
            </div>
        </div>
    );
}