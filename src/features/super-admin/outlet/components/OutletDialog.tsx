"use client";

import { MapPinned } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Outlet } from "@/features/super-admin/outlet/types";
import { OutletForm } from "@/features/super-admin/outlet/components/OutletForm";
import { useOutletForm } from "@/features/super-admin/outlet/hooks/useOutletForm";

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
  const isEditMode = !!selectedOutlet;

  const formContext = useOutletForm({
    initialData: selectedOutlet,
    onSuccess: () => {
      onSuccess();
      onOpenChange(false);
    },
  });

  const handleCancel = () => {
    formContext.formik.resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        // Reset form saat dialog ditutup
        if (!isOpen) formContext.formik.resetForm();
        onOpenChange(isOpen);
      }}
    >
      <DialogContent
        className="sm:max-w-lg max-h-[90vh] overflow-y-auto"
        // Cegah klik luar menutup dialog jika sedang submit
        onInteractOutside={(e) => {
          if (formContext.formik.isSubmitting) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPinned className="h-5 w-5 text-blue-600" />
            {isEditMode ? "Edit Outlet" : "Add New Outlet"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update outlet information. Click the map to change location."
              : "Fill in outlet details and click the map to set the location."}
          </DialogDescription>
        </DialogHeader>

        <OutletForm
          formContext={formContext}
          isEditMode={isEditMode}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
