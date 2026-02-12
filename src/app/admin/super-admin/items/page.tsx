"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { laundryItemService } from "@/features/super-admin/laundry-item/services/laundry-item.service";
import { LaundryItem } from "@/features/super-admin/laundry-item/types";
import { LaundryItemTable } from "@/features/super-admin/laundry-item/components/LaundryItemTable";
import { LaundryItemForm } from "@/features/super-admin/laundry-item/components/LaundryItemForm";
import Pagination from "@/components/shared/Pagination";

export default function LaundryItemsPage() {
  const [items, setItems] = useState<LaundryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<LaundryItem | undefined>(
    undefined,
  );

  const debouncedSearch = useDebounce(search, 500);

  const fetchItems = async () => {
    try {
      setIsLoading(true);

      const res = await laundryItemService.getAllLaundryItems({
        page,
        limit: 10,
        search: debouncedSearch,
      });

      setItems(res.data);
      setTotalPages(res.meta.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [page, debouncedSearch]);

  // Handlers Create, Edit, Delete
  const handleCreate = () => {
    setSelectedItem(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: LaundryItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus item ini?")) {
      try {
        await laundryItemService.deleteLaundryItem(id);
        fetchItems();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSuccess = () => {
    fetchItems();
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
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Cari item..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Content */}
      <LaundryItemTable
        data={items}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      <div className="flex justify-end">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

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
