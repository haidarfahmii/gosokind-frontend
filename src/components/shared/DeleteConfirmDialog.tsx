"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  description?: string;
  itemName?: string;
  entityType?: "employee" | "item" | "outlet" | string;
  confirmLabel?: string;
  cancelLabel?: string;
}

function getEntityMeta(entityType?: string) {
  switch (entityType) {
    case "employee":
      return {
        badge: "Karyawan",
        badgeClass: "bg-blue-100 text-blue-700",
        warningText: "Data karyawan, akun login, dan riwayat aktivitasnya",
      };
    case "item":
      return {
        badge: "Laundry Item",
        badgeClass: "bg-purple-100 text-purple-700",
        warningText: "Data item beserta harga dan kategorinya",
      };
    case "outlet":
      return {
        badge: "Outlet",
        badgeClass: "bg-orange-100 text-orange-700",
        warningText: "Data outlet beserta semua informasi lokasinya",
      };
    default:
      return {
        badge: entityType ?? "Data",
        badgeClass: "bg-slate-100 text-slate-700",
        warningText: "Data yang dipilih",
      };
  }
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Hapus Data",
  description,
  itemName,
  entityType,
  confirmLabel = "Hapus",
  cancelLabel = "Batal",
}: DeleteConfirmDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const meta = getEntityMeta(entityType);

  const defaultDescription =
    description ??
    `${meta.warningText} akan dihapus secara permanen dan tidak dapat dipulihkan.`;

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
    } finally {
      setIsDeleting(false);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    if (!isDeleting) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => {
          if (isDeleting) e.preventDefault();
        }}
      >
        {/* ── Header ── */}
        <DialogHeader>
          {/* Icon area */}
          <div className="flex justify-center mb-2">
            <div className="h-14 w-14 rounded-full bg-red-50 border-4 border-red-100 flex items-center justify-center">
              <AlertTriangle className="h-7 w-7 text-red-500" />
            </div>
          </div>

          <DialogTitle className="text-center text-xl font-bold text-slate-800">
            {title}
          </DialogTitle>

          <DialogDescription className="text-center text-slate-500">
            {defaultDescription}
          </DialogDescription>
        </DialogHeader>

        {/* ── Item name badge ── */}
        {itemName && (
          <div className="flex justify-center py-1">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 max-w-full">
              <Trash2 className="h-4 w-4 text-slate-400 shrink-0" />
              <div className="flex items-center gap-2 min-w-0">
                <Badge
                  variant="secondary"
                  className={`${meta.badgeClass} border-none text-xs shrink-0`}
                >
                  {meta.badge}
                </Badge>
                <span className="text-sm font-semibold text-slate-700 truncate">
                  {itemName}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── Warning note ── */}
        <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
          <p className="text-xs text-red-700 leading-relaxed">
            <span className="font-semibold">Perhatian:</span> Tindakan ini
            bersifat permanen dan{" "}
            <span className="font-semibold">tidak dapat dibatalkan</span>.
            Pastikan Anda telah mempertimbangkan keputusan ini dengan baik.
          </p>
        </div>

        {/* ── Footer buttons ── */}
        <DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            className="flex-1 sm:flex-none"
            onClick={handleCancel}
            disabled={isDeleting}
          >
            {cancelLabel}
          </Button>

          <Button
            type="button"
            variant="destructive"
            className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 gap-2"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                {confirmLabel}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Hook pembantu agar tidak perlu mengelola state open/item secara manual.
 *
 * Cara pakai:
 *   const deleteConfirm = useDeleteConfirm();
 *   deleteConfirm.open({ name: "John", id: "abc" });
 *
 *   <DeleteConfirmDialog {...deleteConfirm.dialogProps} onConfirm={...} />
 */
export function useDeleteConfirm<T = { id: string; name?: string }>() {
  const [isOpen, setIsOpen] = useState(false);
  const [target, setTarget] = useState<T | null>(null);

  const open = (item: T) => {
    setTarget(item);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    // Biarkan animasi selesai sebelum reset target
    setTimeout(() => setTarget(null), 300);
  };

  return {
    target,
    open,
    close,
    dialogProps: {
      open: isOpen,
      onOpenChange: (val: boolean) => {
        if (!val) close();
      },
    },
  };
}
