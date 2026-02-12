"use client";

import { MapPinned } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Outlet } from "../types";
import { OutletForm } from "./OutletForm";
import { useOutletForm } from "../hooks/useOutletForm";

interface OutletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedOutlet?: Outlet | null;
  onSuccess: () => void;
}

export function OutletDialog({
  open,
  onOpenChange,
  selectedOutlet,
  onSuccess,
}: OutletDialogProps) {
  const formContext = useOutletForm({
    initialData: selectedOutlet,
    onSuccess: () => {
      onSuccess();
      onOpenChange(false);
      // Formik reset otomatis terjadi jika component useOutletForm di set demikian,
      // atau bisa panggil formContext.formik.resetForm() disini jika perlu.
    },
  });

  const isEditMode = !!selectedOutlet;

  const handleManualCancel = () => {
    formContext.formik.resetForm(); // Hapus data ketikan
    onOpenChange(false); // Tutup dialog
  };

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
  };

  const handleSuccess = () => {
    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-125 max-h-[90vh] overflow-y-auto"
        // Cegah interaksi luar menutup dialog jika sedang submit
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPinned className="h-5 w-5 text-blue-600" />
            {isEditMode ? "Edit Outlet" : "Add New Outlet"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update outlet information and location"
              : "Enter outlet details and verify location on map"}
          </DialogDescription>
        </DialogHeader>

        <OutletForm
          formContext={formContext}
          isEditMode={isEditMode}
          onCancel={handleManualCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
