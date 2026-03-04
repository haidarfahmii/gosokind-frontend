"use client";

import { useState, useEffect } from "react";
import MobileNav from "@/components/layout/MobileNav";
import { Package, ChevronRight, CheckCircle2, Clock, Loader2, ChevronLeft } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import OrderStatusBadge from "@/components/home/OrderStatusBadge";

export default function OrdersPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const urlTab = searchParams.get("tab") as "Active" | "Completed" | null;
    const urlPage = searchParams.get("page");

    const [activeTab, setActiveTab] = useState<"Active" | "Completed">(urlTab || "Active");
    const [page, setPage] = useState<number>(urlPage ? parseInt(urlPage) : 1);

    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 5;

    const updateUrlParams = (newTab: string, newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", newTab);
        params.set("page", newPage.toString());
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    useEffect(() => {
        let isMounted = true;
        const fetchOrders = async () => {
            if (!session?.user) return;
            try {
                setIsLoading(true);
                let url = `/customer/orders?page=${page}&limit=${limit}`;
                if (activeTab === "Completed") {
                    url += `&status=COMPLETED`;
                }
                const response = await axiosInstance.get(url);
                if (isMounted) {
                    const responseData = response.data.data;
                    const fetchedOrders = responseData?.orders || [];
                    const pagination = responseData?.pagination;

                    setOrders(fetchedOrders);

                    if (pagination) {
                        setTotalPages(pagination.totalPages || 1);
                    }
                    updateUrlParams(activeTab, page);
                }
            } catch (error) {
                console.error("Gagal memuat riwayat pesanan:", error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchOrders();
        return () => {
            isMounted = false;
        };
    }, [session, page, activeTab]);

    const handleTabChange = (tab: "Active" | "Completed") => {
        setActiveTab(tab);
        setPage(1); // Reset ke halaman 1 setiap kali pindah tab
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const displayedOrders = activeTab === "Active"
        ? orders.filter(order => order.status !== "COMPLETED")
        : orders;

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
                <header className="bg-white px-5 pt-8 pb-4 sticky top-0 z-10 border-b border-gray-100 shadow-sm">
                    <h1 className="text-xl font-bold text-gray-800">Riwayat Pesanan</h1>
                    <div className="flex gap-4 mt-6 border-b border-gray-200">
                        <button
                            onClick={() => handleTabChange("Active")}
                            className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === "Active" ? "text-blue-600" : "text-gray-500"}`}
                        >
                            Sedang Berjalan
                            {activeTab === "Active" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
                        </button>
                        <button
                            onClick={() => handleTabChange("Completed")}
                            className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === "Completed" ? "text-blue-600" : "text-gray-500"}`}
                        >
                            Selesai
                            {activeTab === "Completed" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
                        </button>
                    </div>
                </header>

                <main className="flex-1 p-5">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-64 text-blue-600">
                            <Loader2 className="h-8 w-8 animate-spin mb-4" />
                            <p className="text-sm text-gray-500">Memuat data pesanan...</p>
                        </div>
                    ) : displayedOrders.length > 0 ? (
                        <div className="space-y-4">
                            {displayedOrders.map((order) => (
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

                            {/* Kontrol Pagination - Model Compact */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-6 pt-4 border-t border-gray-100">
                                    <div className="flex items-center bg-white border border-gray-200 rounded-full px-2 py-1 shadow-sm">
                                        <button
                                            onClick={() => handlePageChange(Math.max(page - 1, 1))}
                                            disabled={page === 1}
                                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full disabled:text-gray-300 disabled:hover:bg-transparent transition-all"
                                            aria-label="Halaman Sebelumnya"
                                        >
                                            <ChevronLeft size={18} />
                                        </button>

                                        <span className="text-xs font-semibold text-gray-600 px-4 min-w-16 text-center">
                                            {page} / {totalPages}
                                        </span>

                                        <button
                                            onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
                                            disabled={page === totalPages}
                                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full disabled:text-gray-300 disabled:hover:bg-transparent transition-all"
                                            aria-label="Halaman Selanjutnya"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                <CheckCircle2 size={32} />
                            </div>
                            <h3 className="font-bold text-gray-800 mb-1">Belum ada pesanan</h3>
                            <p className="text-sm text-gray-500">Anda belum memiliki pesanan {activeTab === "Completed" ? "yang selesai" : "yang sedang berjalan"}.</p>
                        </div>
                    )}
                </main>
                <MobileNav />
            </div>
        </div>
    );
}