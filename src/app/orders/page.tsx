"use client";

import { useState, useEffect } from "react";
import MobileNav from "@/components/layout/MobileNav";
import { Package, ChevronRight, CheckCircle2, Clock, Loader2 } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import OrderStatusBadge from "@/components/home/OrderStatusBadge";

export default function OrdersPage() {
    const { data: session } = useSession();
    const router = useRouter();
    
    const [activeTab, setActiveTab] = useState<"AKTIF" | "SELESAI">("AKTIF");
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!session?.user) return;
            try {
                setIsLoading(true);
                const response = await axiosInstance.get('/customer/orders');
                const fetchedOrders = response.data.data?.data || response.data.data.orders || [];
                const sortedOrders = fetchedOrders.sort((a: any, b: any) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setOrders(sortedOrders);
            } catch (error) {
                console.error("Gagal memuat riwayat pesanan:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [session]);

    const filteredOrders = orders.filter(order =>
        activeTab === "SELESAI" ? order.status === "COMPLETED" : order.status !== "COMPLETED"
    );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
    };

    const formatCurrency = (amount: number | null | undefined) => {
        if (amount === null || amount === undefined) return "-";
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] pb-24 font-sans">
            <div className="max-w-md mx-auto min-h-screen flex flex-col relative bg-[#f8f9fa]">
                {/* Header ... */}
                <header className="bg-white px-5 pt-8 pb-4 sticky top-0 z-10 border-b border-gray-100">
                    <h1 className="text-xl font-bold text-gray-800">Riwayat Pesanan</h1>
                    <div className="flex gap-4 mt-6 border-b border-gray-200">
                        <button onClick={() => setActiveTab("AKTIF")} className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === "AKTIF" ? "text-blue-600" : "text-gray-500"}`}>
                            Sedang Berjalan {activeTab === "AKTIF" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
                        </button>
                        <button onClick={() => setActiveTab("SELESAI")} className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === "SELESAI" ? "text-blue-600" : "text-gray-500"}`}>
                            Selesai {activeTab === "SELESAI" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
                        </button>
                    </div>
                </header>

                {/* Orders List */}
                <main className="flex-1 p-5">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-64 text-blue-600">
                            <Loader2 className="h-8 w-8 animate-spin mb-4" />
                            <p className="text-sm text-gray-500">Memuat data pesanan...</p>
                        </div>
                    ) : filteredOrders.length > 0 ? (
                        <div className="space-y-4">
                            {filteredOrders.map((order) => (
                                <div 
                                    key={order.id} 
                                    onClick={() => router.push(`/orders/${order.orderNumber}`)} 
                                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md active:bg-gray-50 transition-all cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <Package size={16} className="text-gray-400" />
                                            <span className="font-bold text-gray-800 text-sm">{order.orderNumber || order.id}</span>
                                        </div>
                                        
                                        {/* Gunakan Komponen di sini */}
                                        <OrderStatusBadge status={order.status} />

                                    </div>

                                    <div className="flex justify-between items-end mt-4">
                                        <div>
                                            <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                                                <Clock size={12} /> {formatDate(order.createdAt)}
                                            </p>
                                            <p className="text-sm font-medium text-gray-700">
                                                {order.totalWeight ? `${order.totalWeight} Kg` : "Menunggu timbangan"}
                                            </p>
                                        </div>
                                        <div className="text-right flex flex-col items-end">
                                            <p className="text-[11px] text-gray-500 mb-0.5">Total Harga</p>
                                            <p className="font-bold text-blue-600">{formatCurrency(order.totalPrice)}</p>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-100 mt-4 pt-3 flex justify-between items-center text-xs text-gray-500 font-medium">
                                        Lihat detail pesanan <ChevronRight size={16} className="text-blue-500" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                <CheckCircle2 size={32} />
                            </div>
                            <h3 className="font-bold text-gray-800 mb-1">Belum ada pesanan</h3>
                            <p className="text-sm text-gray-500">Anda belum memiliki pesanan {activeTab === "SELESAI" ? "yang selesai" : "yang sedang berjalan"}.</p>
                        </div>
                    )}
                </main>
                <MobileNav />
            </div>
        </div>
    );
}