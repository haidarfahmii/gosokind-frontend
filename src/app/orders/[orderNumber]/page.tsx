"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    FiArrowLeft,
    FiPackage,
    FiMapPin,
    FiClock,
    FiCheckCircle,
    FiLoader,
    FiFileText
} from "react-icons/fi";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import OrderStatusBadge from "@/components/home/OrderStatusBadge";
import { Loader2 } from "lucide-react";
import { usePayment } from "@/features/orders/hooks/usePayment";
import { useConfirmOrder } from "@/features/orders/hooks/useConfirmOrder";
import { Button } from "@/features/auth/components/ui/button";

const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "-";
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
};

const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date) + ' WIB';
};

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const orderNumber = params?.orderNumber as string;

    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { handlePayment, isLoading: isPaymentLoading } = usePayment();

    const fetchOrderDetail = useCallback(async () => {
        if (!orderNumber) return;
        try {
            // setIsLoading(true); // Opsional: matikan loading penuh jika ingin silent refresh
            const response = await axiosInstance.get(`/customer/orders/number/${orderNumber}`);
            setOrder(response.data.data);
        } catch (error: any) {
            console.error("Gagal memuat detail pesanan:", error);
            toast.error(error?.response?.data?.message || "Gagal memuat detail pesanan");
        } finally {
            setIsLoading(false);
        }
    }, [orderNumber]);

    const { handleConfirmOrder, isLoading: isConfirmLoading } = useConfirmOrder({
        onSuccess: () => {
            fetchOrderDetail(); // Refresh data pesanan setelah sukses
        }
    });

    useEffect(() => {
        fetchOrderDetail();
    }, [fetchOrderDetail]);

    return (
        <div className="min-h-screen bg-[#f8f9fa] pb-24 font-sans">
            <div className="max-w-md mx-auto min-h-screen flex flex-col relative bg-[#f8f9fa]">

                {/* --- HEADER --- */}
                <div className="bg-white p-4 flex items-center gap-4 sticky top-0 z-10 border-b border-slate-100 shadow-sm">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-700"
                    >
                        <FiArrowLeft size={24} />
                    </button>
                    <h1 className="text-lg font-bold text-slate-900">Detail Pesanan</h1>
                </div>

                {/* --- MAIN CONTENT --- */}
                <main className="flex-1 p-5 space-y-5">

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-64 text-blue-600">
                            <Loader2 className="h-8 w-8 animate-spin mb-4" />
                            <p className="text-sm text-gray-500">Memuat data pesanan...</p>
                        </div>
                    ) : !order ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                                <FiPackage size={32} />
                            </div>
                            <h3 className="font-bold text-slate-800 mb-1">Pesanan Tidak Ditemukan</h3>
                            <p className="text-sm text-slate-500">Nomor pesanan yang Anda cari tidak tersedia.</p>
                            <button
                                onClick={() => router.push('/orders')}
                                className="mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-full text-sm"
                            >
                                Kembali ke Daftar Pesanan
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* STATUS & INFO CARD */}
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                                <div className="flex justify-between items-start mb-4 border-b border-slate-50 pb-4">
                                    <div>
                                        <p className="text-xs text-slate-400 mb-1">Nomor Pesanan</p>
                                        <h2 className="font-bold text-slate-900 flex items-center gap-2">
                                            {order.orderNumber}
                                        </h2>
                                    </div>
                                    <OrderStatusBadge
                                        status={order.status}
                                        className="px-3 py-1.5 text-xs" // Bisa di-override ukurannya via prop className
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                            <FiClock size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400">Waktu Pemesanan</p>
                                            <p className="font-medium text-slate-700">{formatDate(order.createdAt)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                            <FiPackage size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400">Total Berat Pakaian</p>
                                            <p className="font-medium text-slate-700">
                                                {order.totalWeight ? `${order.totalWeight} Kg` : "Menunggu penimbangan kurir"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ALAMAT PENJEMPUTAN */}
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
                                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                    <FiMapPin className="text-blue-600" /> Alamat Penjemputan
                                </h3>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <p className="font-semibold text-slate-800 text-sm mb-1">
                                        {order.address?.label || "Alamat Rumah"}
                                    </p>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        {order.address?.address || "Detail alamat tidak tersedia."}
                                    </p>
                                </div>
                            </div>

                            {/* RINCIAN PEMBAYARAN */}
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
                                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                    <FiFileText className="text-blue-600" /> Rincian Pembayaran
                                </h3>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-slate-500">
                                        <span>Biaya Layanan {order.totalWeight ? `(${order.totalWeight} Kg)` : ''}</span>
                                        <span className="font-medium text-slate-700">
                                            {order.totalPrice ? formatCurrency(order.totalPrice) : "Menunggu"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-slate-500">
                                        <span>Biaya Pengiriman</span>
                                        <span className="font-medium text-slate-700">Gratis</span>
                                    </div>

                                    <div className="h-px bg-slate-100 my-2"></div>

                                    <div className="flex justify-between font-bold text-base pt-1">
                                        <span className="text-slate-900">Total Tagihan</span>
                                        <span className="text-blue-600">
                                            {order.totalPrice ? formatCurrency(order.totalPrice) : "-"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* ACTION BUTTON JIKA STATUS BUTUH PEMBAYARAN */}
                            {order.status === "WAITING_FOR_PAYMENT" && (
                                <Button
                                    onClick={() => handlePayment(order.id)}
                                    disabled={isLoading}
                                    className="w-full sm:w-auto"
                                >
                                    {isPaymentLoading ? "Memproses..." : "Bayar Sekarang"}
                                </Button>
                            )}
                            {order.status === "RECEIVED_BY_CUSTOMER" && (
                                <Button
                                    onClick={() => handleConfirmOrder(order.id)}
                                    disabled={isConfirmLoading || isPaymentLoading}
                                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 shadow-green-600/20"
                                >
                                    {isConfirmLoading ? "Memproses..." : "Selesaikan Pesanan"}
                                </Button>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}