"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { BypassRequest } from "../types/order.types";
import Pagination from "@/components/shared/Pagination";
import { useBypassRequestReview } from "../hooks/useBypassRequestReview";
import { BypassRequestCard } from "./bypass-request/BypassRequestCard";

interface BypassRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bypassRequests: BypassRequest[];
  loading: boolean;
  pagination: {
    page: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onApprove: (id: string, note?: string) => Promise<void>;
  onReject: (id: string, note: string) => Promise<void>;
}

export function BypassRequestDialog({
  open,
  onOpenChange,
  bypassRequests,
  loading,
  pagination,
  onPageChange,
  onApprove,
  onReject,
}: BypassRequestDialogProps) {
  const {
    selectedRequest,
    adminNote,
    setAdminNote,
    isProcessing,
    handleSelect,
    handleCancel,
    handleApprove,
    handleReject,
  } = useBypassRequestReview({ onApprove, onReject });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            Pending Bypass Requests
            <Badge variant="secondary" className="ml-2">
              {bypassRequests.length} pending
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : bypassRequests.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              All Clear!
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              No pending bypass requests at the moment.
            </p>
          </div>
        ) : (
          /* Request List */
          <div className="space-y-4">
            {bypassRequests.map((request) => (
              <BypassRequestCard
                key={request.id}
                request={request}
                isSelected={selectedRequest?.id === request.id}
                adminNote={adminNote}
                isProcessing={isProcessing}
                onSelect={handleSelect}
                onCancel={handleCancel}
                onApprove={handleApprove}
                onReject={handleReject}
                onNoteChange={setAdminNote}
              />
            ))}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center pt-4">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={onPageChange}
                />
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
