"use client";

import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  OrderPageHeader,
  SearchBar,
  OrderFilters,
  OrderTable,
  OrderDetailDialog,
  InputOrderDetailsDialog,
  BypassRequestDialog,
} from "@/features/order/components";
import { useOrderPage } from "@/features/order/hooks";

/**
 * Order Management Page - Reusable for Outlet Admin & Super Admin
 *
 * FEATURES:
 * 1. Show All Orders
 *    - Super Admin dapat melihat seluruh order dari semua outlet
 *      dan memfilter berdasarkan outlet.
 *    - Outlet Admin otomatis hanya melihat order milik outlet-nya.
 *
 * 2. Order Tracking
 *    - Melihat status order, alur proses di setiap station,
 *      serta worker yang menangani.
 *
 * 3. Input Order Details
 *    - Digunakan saat order tiba di outlet.
 *    - Admin dapat menginput berat dan jumlah item laundry
 *      untuk menghitung total harga.
 *
 * 4. Bypass Request Management
 *    - Melihat permintaan bypass dari worker.
 *    - Menyetujui atau menolak dengan catatan admin.
 */
export default function OrderPage() {
  const {
    // Session
    isSuperAdmin,

    // Orders
    orders,
    loading,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    filterOutlet,
    setFilterOutlet,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    clearFilters,
    pagination,
    handlePageChange,
    handleLimitChange,

    // Outlets
    outlets,
    activeOutletName,

    // Bypass
    bypassRequests,
    loadingBypass,
    bypassPagination,
    handleBypassPageChange,

    // Dialog state
    selectedOrder,
    isDetailDialogOpen,
    setIsDetailDialogOpen,
    isInputDialogOpen,
    setIsInputDialogOpen,
    isBypassDialogOpen,
    setIsBypassDialogOpen,

    // Handlers
    handleViewDetail,
    handleInputDetails,
    handleInputSuccess,
    handleViewBypassRequests,
    handleBypassAction,

    // Loader
    showInitialLoader,
  } = useOrderPage();

  if (showInitialLoader) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OrderPageHeader
        onViewBypassRequests={handleViewBypassRequests}
        bypassRequestCount={bypassRequests.length}
      />

      {isSuperAdmin && filterOutlet !== "all" && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">🌐 Global Filter Active:</span>{" "}
            Showing orders from{" "}
            <span className="font-bold">{activeOutletName}</span>. Change the
            outlet filter below to view different outlets.
          </p>
        </div>
      )}

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <CardTitle className="text-base">All Orders</CardTitle>
              {pagination.total > 0 && (
                <p className="text-sm text-slate-500 mt-1">
                  Total: {pagination.total} orders
                </p>
              )}
            </div>
            <SearchBar value={search} onChange={setSearch} />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <OrderFilters
            selectedStatus={filterStatus}
            selectedOutlet={filterOutlet}
            startDate={startDate}
            endDate={endDate}
            onStatusChange={setFilterStatus}
            onOutletChange={setFilterOutlet}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onClearFilters={clearFilters}
            outlets={outlets}
            itemsPerPage={pagination.limit}
            onItemsPerPageChange={handleLimitChange}
            showOutletFilter={isSuperAdmin}
          />

          <OrderTable
            data={orders}
            isLoading={loading}
            onViewDetail={handleViewDetail}
            onInputDetails={handleInputDetails}
            pagination={pagination}
            onPageChange={handlePageChange}
            canInputDetails={true}
          />
        </CardContent>
      </Card>

      <OrderDetailDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        order={selectedOrder}
      />

      <InputOrderDetailsDialog
        open={isInputDialogOpen}
        onOpenChange={setIsInputDialogOpen}
        order={selectedOrder}
        onSuccess={handleInputSuccess}
      />

      <BypassRequestDialog
        open={isBypassDialogOpen}
        onOpenChange={setIsBypassDialogOpen}
        bypassRequests={bypassRequests}
        loading={loadingBypass}
        pagination={{
          page: bypassPagination.page,
          totalPages: bypassPagination.totalPages,
        }}
        onPageChange={handleBypassPageChange}
        onApprove={(id, note) => handleBypassAction("APPROVED", id, note)}
        onReject={(id, note) => handleBypassAction("REJECTED", id, note)}
      />
    </div>
  );
}
