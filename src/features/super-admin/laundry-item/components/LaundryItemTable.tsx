"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { LaundryItem } from "../types";
import { formatCurrency } from "@/utils/formatters";
import {
  DeleteConfirmDialog,
  useDeleteConfirm,
} from "@/components/shared/DeleteConfirmDialog";
import Pagination from "@/components/shared/Pagination";

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface LaundryItemTableProps {
  data: LaundryItem[];
  isLoading: boolean;
  onEdit: (item: LaundryItem) => void;
  onDelete: (id: string) => void;
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function LaundryItemTable({
  data,
  isLoading,
  onEdit,
  onDelete,
  pagination,
  onPageChange,
}: LaundryItemTableProps) {
  const deleteConfirm = useDeleteConfirm<LaundryItem>();

  if (isLoading) {
    return <div className="p-4 text-center">Loading items...</div>;
  }

  return (
    <>
      <div className="space-y-4">
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Item</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Harga Dasar</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Tidak ada data laundry item.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category || "-"}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>
                      {item.basePrice ? formatCurrency(item.basePrice) : "-"}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => deleteConfirm.open(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex justify-end">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>

      <DeleteConfirmDialog
        {...deleteConfirm.dialogProps}
        onConfirm={async () => {
          if (deleteConfirm.target) await onDelete(deleteConfirm.target.id);
        }}
        entityType="item"
        itemName={deleteConfirm.target?.name}
        title="Hapus Laundry Item"
      />
    </>
  );
}
