"use client";

import { useState, useEffect, Suspense } from "react";
import MobileNav from "@/components/layout/MobileNav";
import { Package, ChevronRight, CheckCircle2, Clock, Loader2, ChevronLeft, Search, Filter, ArrowUpDown, SlidersHorizontal } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import OrderStatusBadge from "@/components/home/OrderStatusBadge";
import { useDebounce } from "@/hooks/useDebounce";

function OrdersPageContent() {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const urlTab = searchParams.get("tab") as "Active" | "Completed" | null;
    const urlPage = searchParams.get("page");
    const urlSearch = searchParams.get("search") || "";
    const urlStatus = searchParams.get("status") || "ALL";
    const urlSort = searchParams.get("sort") || "desc";

    const [activeTab, setActiveTab] = useState<"Active" | "Completed">(urlTab || "Active");
    const [page, setPage] = useState<number>(urlPage ? parseInt(urlPage) : 1);
    const [searchTerm, setSearchTerm] = useState<string>(urlSearch);
    const [statusFilter, setStatusFilter] = useState<string>(urlStatus);
    const [sortOrder, setSortOrder] = useState<string>(urlSort);

    // STATE BARU: Untuk Hide/Show Filter
    const [showFilters, setShowFilters] = useState<boolean>(false);

    const debouncedSearch = useDebounce(searchTerm, 500);

    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 5;

    // Cek apakah ada filter yang sedang berjalan
    const hasActiveFilters = searchTerm !== "" || statusFilter !== "ALL" || sortOrder !== "desc";

    const updateUrlParams = () => {
        const params = new URLSearchParams();
        params.set("tab", activeTab);
        params.set("page", page.toString());
        if (debouncedSearch) params.set("search", debouncedSearch);
        if (statusFilter !== "ALL") params.set("status", statusFilter);
        if (sortOrder !== "desc") params.set("sort", sortOrder);

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    useEffect(() => {
        let isMounted = true;
        const fetchOrders = async () => {
            if (!session?.user) return;
            try {
                setIsLoading(true);
                let url = `/customer/orders?page=${page}&limit=${limit}`;
                url += `&sortBy=createdAt&sortOrder=${sortOrder}`;

                if (activeTab === "Completed") {
                    url += `&status=COMPLETED`;
                } else if (statusFilter !== "ALL") {
                    url += `&status=${statusFilter}`;
                }

                if (debouncedSearch) {
                    url += `&search=${encodeURIComponent(debouncedSearch)}`;
                }

                const response = await axiosInstance.get(url);

                if (isMounted) {
                    const responseData = response.data.data;
                    const fetchedOrders = responseData?.orders || [];
                    const pagination = responseData?.pagination;

                    setOrders(fetchedOrders);
                    setTotalPages(pagination?.totalPages || 1);
                    updateUrlParams();
                }
            } catch (error: any) {
                console.error("Gagal memuat riwayat pesanan:", error);
                if (isMounted) {
                    setOrders([]);
                    setTotalPages(1);
                    updateUrlParams();
                }
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
    }, [session, page, activeTab, debouncedSearch, statusFilter, sortOrder]);

    const handleTabChange = (tab: "Active" | "Completed") => {
        setActiveTab(tab);
        setPage(1);
        setStatusFilter("ALL");
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    let result = [...orders];

    if (activeTab === "Active" && statusFilter === "ALL") {
        result = result.filter(order => order.status !== "COMPLETED");
    }

    if (debouncedSearch) {
        result = result.filter(order =>
            (order.orderNumber && order.orderNumber.toLowerCase().includes(debouncedSearch.toLowerCase())) ||
            (order.id && order.id.toLowerCase().includes(debouncedSearch.toLowerCase()))
        );
    }

    result.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    const displayedOrders = result;

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
                    {/* Header Row dengan Tombol Filter */}
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-bold text-gray-800">Riwayat Pesanan</h1>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`p-2 rounded-full transition-all relative ${showFilters || hasActiveFilters
                                    ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                    : 'bg-gray-50 text-gray-600 border border-gray-100 hover:bg-gray-100'
                                }`}
                            aria-label="Toggle Filters"
                        >
                            <SlidersHorizontal size={18} />
                            {/* Indikator Merah jika ada filter aktif tapi menu disembunyikan */}
                            {hasActiveFilters && !showFilters && (
                                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                            )}
                        </button>
                    </div>

                    {/* Bagian Filter yang bisa di-Toggle */}
                    {showFilters && (
                        <div className="mt-4 space-y-3 animate-in slide-in-from-top-2 fade-in duration-200">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Cari nomor pesanan..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setPage(1);
                                    }}
                                    className="w-full bg-gray-50 border border-gray-200 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div className="flex gap-2">
                                {activeTab === "Active" && (
                                    <div className="relative flex-1">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <Filter size={14} className="text-gray-400" />
                                        </div>
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => {
                                                setStatusFilter(e.target.value);
                                                setPage(1);
                                            }}
                                            className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg block w-full pl-8 p-2.5 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                                        >
                                            <option value="ALL">Semua Status</option>
                                            <option value="WAITING_FOR_PICKUP">Menunggu Penjemputan</option>
                                            <option value="PICKUP_ON_THE_WAY">Sedang Dijemput</option>
                                            <option value="ARRIVED_AT_OUTLET">Tiba di Outlet</option>
                                            <option value="WASHING">Sedang Dicuci</option>
                                            <option value="IRONING">Sedang Disetrika</option>
                                            <option value="PACKING">Sedang Dikemas</option>
                                            <option value="WAITING_FOR_PAYMENT">Menunggu Pembayaran</option>
                                            <option value="READY_FOR_DELIVERY">Siap Dikirim</option>
                                            <option value="DELIVERY_ON_THE_WAY">Sedang Dikirim</option>
                                        </select>
                                    </div>
                                )}

                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <ArrowUpDown size={14} className="text-gray-400" />
                                    </div>
                                    <select
                                        value={sortOrder}
                                        onChange={(e) => {
                                            setSortOrder(e.target.value);
                                            setPage(1);
                                        }}
                                        className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg block w-full pl-8 p-2.5 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                                    >
                                        <option value="desc">Terbaru</option>
                                        <option value="asc">Terlama</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={`flex gap-4 border-b border-gray-200 ${showFilters ? 'mt-4' : 'mt-6'}`}>
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

                            {totalPages > 1 && (
                                <div className="flex justify-center mt-6 pt-4 border-t border-gray-100">
                                    <div className="flex items-center bg-white border border-gray-200 rounded-full px-2 py-1 shadow-sm">
                                        <button
                                            onClick={() => handlePageChange(Math.max(page - 1, 1))}
                                            disabled={page === 1}
                                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full disabled:text-gray-300 disabled:hover:bg-transparent transition-all"
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
                                {hasActiveFilters ? <Search size={32} /> : <CheckCircle2 size={32} />}
                            </div>
                            <h3 className="font-bold text-gray-800 mb-1">
                                {hasActiveFilters ? "Pesanan tidak ditemukan" : "Belum ada pesanan"}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {hasActiveFilters
                                    ? "Coba ubah kata kunci atau hapus filter status Anda."
                                    : `Anda belum memiliki pesanan ${activeTab === "Completed" ? "yang selesai" : "yang sedang berjalan"}.`}
                            </p>
                        </div>
                    )}
                </main>
                <MobileNav />
            </div>
        </div>
    );
}

export default function OrdersPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">Loading orders...</div>}>
            <OrdersPageContent />
        </Suspense>
    );
}