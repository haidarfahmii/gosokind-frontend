"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Wrench, ChevronRight, TriangleAlert } from "lucide-react";
import { Order } from "@/features/order/types/order.types";
import {
  useAdminOrderStatus,
  StatusAction,
} from "@/features/order/hooks/useAdminOrderStatus";

interface AdminStatusControlProps {
  order: Order;
  onSuccess: () => void;
}

/**
 * AdminStatusControl
 *
 * Komponen sementara untuk keperluan testing sebelum fitur worker management selesai.
 * Memungkinkan admin memajukan status order secara manual untuk station-station
 * yang seharusnya dikerjakan worker (WASHING → IRONING → PACKING → dst).
 *
 * Komponen ini HANYA muncul ketika order berada di status yang normalnya
 * ditangani worker, yaitu: WASHING, IRONING, PACKING, WAITING_FOR_PAYMENT.
 *
 * TODO: Hapus komponen ini setelah fitur worker management selesai.
 */
export function AdminStatusControl({
  order,
  onSuccess,
}: AdminStatusControlProps) {
  const { availableActions, hasAvailableActions, isUpdating, updateStatus } =
    useAdminOrderStatus({ order, onSuccess });

  const [pendingAction, setPendingAction] = useState<StatusAction | null>(null);

  if (!hasAvailableActions) return null;

  const handleConfirm = async () => {
    if (!pendingAction) return;
    await updateStatus(pendingAction.targetStatus);
    setPendingAction(null);
  };

  return (
    <>
      <Card className="border-2 border-dashed border-amber-300 bg-amber-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2 text-amber-800">
            <Wrench className="w-4 h-4" />
            Dev / Testing — Manual Status Control
            <span className="ml-auto text-xs font-normal bg-amber-200 text-amber-700 px-2 py-0.5 rounded-full">
              Temporary
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Keterangan */}
          <div className="flex items-start gap-2 p-3 bg-amber-100 rounded-lg border border-amber-200">
            <TriangleAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">
              Panel ini tersedia karena fitur <strong>Worker Management</strong>{" "}
              belum selesai. Normalnya, worker yang akan memajukan status di
              setiap station. Hapus komponen ini setelah worker management
              terintegrasi.
            </p>
          </div>

          {/* Status saat ini */}
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>Current status:</span>
            <span className="font-semibold text-slate-800">{order.status}</span>
          </div>

          {/* Tombol aksi */}
          <div className="flex flex-wrap gap-2">
            {availableActions.map((action) => (
              <Button
                key={action.targetStatus}
                size="sm"
                variant="outline"
                disabled={isUpdating}
                onClick={() => setPendingAction(action)}
                className="gap-2 border-amber-400 text-amber-800 hover:bg-amber-100 hover:border-amber-500"
              >
                {isUpdating &&
                pendingAction?.targetStatus === action.targetStatus ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
                {action.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Konfirmasi Dialog */}
      <AlertDialog
        open={!!pendingAction}
        onOpenChange={(open) => !open && setPendingAction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Perubahan Status</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <span className="block">
                Kamu akan memajukan status order{" "}
                <strong>{order.orderNumber}</strong> dari{" "}
                <strong>{order.status}</strong> ke{" "}
                <strong>{pendingAction?.targetStatus}</strong>.
              </span>
              <span className="block text-amber-600 text-xs">
                Ini adalah aksi manual untuk keperluan testing. Normalnya status
                ini diubah oleh worker.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isUpdating}
              className="gap-2 bg-amber-600 hover:bg-amber-700"
            >
              {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
              Ya, Lanjutkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
