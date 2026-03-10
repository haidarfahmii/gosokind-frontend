"use client";

import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { LaundryItem } from "@/features/super-admin/laundry-item/types";
import { LaundryItemTable } from "@/features/super-admin/laundry-item/components/LaundryItemTable";
import { LaundryItemForm } from "@/features/super-admin/laundry-item/components/LaundryItemForm";
import { LaundryItemFilters } from "@/features/super-admin/laundry-item/components/LaundryItemFilters";
import { useLaundryItemList } from "@/features/super-admin/laundry-item/hooks/useLaundryItemList";

function LaundryItemsContent() {
  const {
    items,
    loading,
    search,
    setSearch,
    filterCategory,
    setFilterCategory,
    filterPricingType,
    setFilterPricingType,
    clearFilters,
    pagination,
    handlePageChange,
    handleLimitChange,
    refetch,
  } = useLaundryItemList();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<LaundryItem | undefined>(
    undefined,
  );

  const handleCreate = () => {
    setSelectedItem(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: LaundryItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { laundryItemService } =
        await import("@/features/super-admin/laundry-item/services/laundry-item.service");
      await laundryItemService.deleteLaundryItem(id);
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSuccess = () => {
    refetch();
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Laundry Items</h1>
          <p className="text-muted-foreground">
            Kelola daftar harga dan jenis pakaian.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Item
        </Button>
      </div>

      {/* Filters */}
      <LaundryItemFilters
        search={search}
        filterCategory={filterCategory}
        filterPricingType={filterPricingType}
        onSearchChange={setSearch}
        onCategoryChange={setFilterCategory}
        onPricingTypeChange={setFilterPricingType}
        onClearFilters={clearFilters}
        itemsPerPage={pagination.limit}
        onItemsPerPageChange={handleLimitChange}
      />

      {/* Table */}
      <LaundryItemTable
        data={items}
        isLoading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pagination={pagination}
        onPageChange={handlePageChange}
      />

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? "Edit Laundry Item" : "Tambah Laundry Item Baru"}
            </DialogTitle>
          </DialogHeader>
          <LaundryItemForm
            initialData={selectedItem}
            onSuccess={handleSuccess}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function LaundryItemsPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <LaundryItemsContent />
    </Suspense>
  );
}
