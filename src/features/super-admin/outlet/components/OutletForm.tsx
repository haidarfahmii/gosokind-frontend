"use client";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { UseOutletFormReturn } from "../hooks/useOutletForm";
import { OutletBasicInfo } from "./OutletBasicInfo";
import { OutletLocationSection } from "./OutletLocationSection";

interface OutletFormProps {
  formContext: UseOutletFormReturn;
  isEditMode: boolean;
  onCancel: () => void;
}

export function OutletForm({
  formContext,
  isEditMode,
  onCancel,
}: OutletFormProps) {
  const { formik } = formContext;

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* Basic Information Section */}
      <OutletBasicInfo formik={formik} />

      <Separator />

      {/* Location Information Section (Inputs + Preview) */}
      <OutletLocationSection formContext={formContext} />

      {/* Actions */}
      <DialogFooter className="gap-2 pt-2 sm:space-y-0">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={formik.isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={
            formik.isSubmitting ||
            !formik.isValid ||
            // Tombol disabled jika koordinat belum dipilih dari peta
            formik.values.latitude === null ||
            formik.values.longitude === null
          }
        >
          {formik.isSubmitting ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              {isEditMode ? "Updating..." : "Creating..."}
            </>
          ) : isEditMode ? (
            "Update Outlet"
          ) : (
            "Create Outlet"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
