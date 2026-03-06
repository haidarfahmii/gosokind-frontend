"use client";

import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerPageHeader } from "@/features/super-admin/customer/components/CustomerPageHeader";
import { CustomerSearchBar } from "@/features/super-admin/customer/components/CustomerSearchBar";
import { CustomerFilters } from "@/features/super-admin/customer/components/CustomerFilters";
import { CustomerTable } from "@/features/super-admin/customer/components/CustomerTable";
import { CustomerStatsCards } from "@/features/super-admin/customer/components/CustomerStatsCards";
import { useCustomerList } from "@/features/super-admin/customer/hooks/useCustomerList";

export default function CustomersPage() {
  const {
    customers,
    loading,
    search,
    setSearch,
    pagination,
    handlePageChange,
    handleLimitChange,
  } = useCustomerList();

  const showInitialLoader = loading && customers.length === 0 && !search;

  if (showInitialLoader) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <CustomerPageHeader />

      {/* Stats Cards */}
      <CustomerStatsCards
        customers={customers}
        totalFromPagination={pagination.total}
      />

      {/* Main Table Card */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <CardTitle className="text-base">Registered Customers</CardTitle>
              {pagination.total > 0 && (
                <p className="text-sm text-slate-500 mt-1">
                  Total: {pagination.total} customers
                </p>
              )}
            </div>
            <CustomerSearchBar value={search} onChange={setSearch} />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filter row */}
          <CustomerFilters
            itemsPerPage={pagination.limit}
            onItemsPerPageChange={handleLimitChange}
          />

          {/* Table or loading spinner */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <CustomerTable
              data={customers}
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
