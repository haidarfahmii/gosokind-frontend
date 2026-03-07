"use client";

import { useState } from "react";
import { BypassRequest } from "@/features/order/types/order.types";
import { toast } from "react-toastify";

interface UseBypassRequestReviewProps {
  onApprove: (id: string, note?: string) => void;
  onReject: (id: string, note: string) => void;
}

export const useBypassRequestReview = ({
  onApprove,
  onReject,
}: UseBypassRequestReviewProps) => {
  const [selectedRequest, setSelectedRequest] = useState<BypassRequest | null>(
    null,
  );
  const [adminNote, setAdminNote] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleSelect = (request: BypassRequest) => setSelectedRequest(request);

  const handleCancel = () => {
    setSelectedRequest(null);
    setAdminNote("");
  };

  const handleApprove = async (request: BypassRequest) => {
    setIsProcessing(true);

    try {
      await onApprove(request.id, adminNote || undefined);
      handleCancel();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (request: BypassRequest) => {
    if (!adminNote.trim()) {
      toast.error("Admin note is required when rejecting a bypass request");
      return;
    }

    setIsProcessing(true);
    try {
      await onReject(request.id, adminNote);
      handleCancel();
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    selectedRequest,
    adminNote,
    setAdminNote,
    isProcessing,
    handleSelect,
    handleCancel,
    handleApprove,
    handleReject,
  };
};
