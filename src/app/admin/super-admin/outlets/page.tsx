"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOutletList } from "@/features/super-admin/outlet/hooks/useOutletList";
import { OutletTable } from "@/features/super-admin/outlet/components/OutletTable";
import { OutletDialog } from "@/features/super-admin/outlet/components/OutletDialog";
import { Outlet } from "@/features/super-admin/outlet/types";

export default function OutletManagementPage() {
  const {
    outlets,
    loading,
    pagination,
    search,
    refetch,
    deleteOutlet,
    handlePageChange,
    handleSearch,
  } = useOutletList();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
  const [searchQuery, setSearchQuery] = useState(search);

  // handlers search dengan debounce
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    const timer = setTimeout(() => {
      handleSearch(value);
    }, 500);
    return () => clearTimeout(timer);
  };

  // Handlers untuk Create dan Edit Outlet
  const handleCreateOutlet = () => {
    setSelectedOutlet(null);
    setDialogOpen(true);
  };

  const handleEditOutlet = (outlet: Outlet) => {
    setSelectedOutlet(outlet);
    setDialogOpen(true);
  };

  const handleSuccess = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Outlet Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage all laundry outlets and their locations
          </p>
        </div>
        <Button
          onClick={handleCreateOutlet}
          className="bg-blue-600 hover:bg-blue-700 gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New Outlet
        </Button>
      </div>

      {/* Stats Cards (Optional) */}
      {pagination.total > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Outlets</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">
                  {pagination.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Current Page</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">
                  {pagination.page} / {pagination.totalPages}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Per Page</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">
                  {pagination.limit} items
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search outlets..."
            className="pl-9 bg-white border-slate-200 focus-visible:ring-blue-600"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        {/* <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">
            Showing {outlets.length} of {pagination.total} outlets
          </span>
        </div> */}
      </div>

      {/* Outlet Table */}
      <OutletTable
        data={outlets}
        onEdit={handleEditOutlet}
        onDelete={deleteOutlet}
        pagination={pagination}
        onPageChange={handlePageChange}
        loading={loading}
      />

      {/* Outlet Dialog (Create/Edit) */}
      <OutletDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedOutlet={selectedOutlet}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
