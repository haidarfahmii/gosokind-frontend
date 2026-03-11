"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface BusyDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BusyDriverModal({ isOpen, onClose }: BusyDriverModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto bg-amber-100 p-3 rounded-full mb-4">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          <DialogTitle className="text-center text-xl">
            Active Task in Progress
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            You are currently handling a pickup or delivery. Please complete
            your active task before accepting a new job.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center mt-4">
          <Button onClick={onClose} className="w-full sm:w-auto min-w-30">
            Understood
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
