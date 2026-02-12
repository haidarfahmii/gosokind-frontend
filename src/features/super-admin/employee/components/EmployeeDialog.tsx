"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Employee } from "@/@types/employee.types";
import { EmployeeForm } from "./EmployeeForm";

interface EmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEmployee: Employee | null;
  onSuccess: (employee: Employee) => void;
  outlets: Array<{ id: string; name: string }>;
}

export function EmployeeDialog({
  open,
  onOpenChange,
  selectedEmployee,
  onSuccess,
  outlets,
}: EmployeeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {selectedEmployee ? "Edit Employee" : "Add New Employee"}
          </DialogTitle>
        </DialogHeader>

        <EmployeeForm
          initialData={selectedEmployee || undefined}
          onSuccess={onSuccess}
          onCancel={() => onOpenChange(false)}
          outlets={outlets}
        />
      </DialogContent>
    </Dialog>
  );
}
