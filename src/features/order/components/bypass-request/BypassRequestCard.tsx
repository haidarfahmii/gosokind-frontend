"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  XCircle,
  User,
  Package,
  MapPin,
  Calendar,
  Loader2,
} from "lucide-react";
import { BypassRequest } from "../../types/order.types";
import { format } from "date-fns";

interface BypassRequestCardProps {
  request: BypassRequest;
  isSelected: boolean;
  adminNote: string;
  isProcessing: boolean;
  onSelect: (request: BypassRequest) => void;
  onCancel: () => void;
  onApprove: (request: BypassRequest) => void;
  onReject: (request: BypassRequest) => void;
  onNoteChange: (note: string) => void;
}

export function BypassRequestCard({
  request,
  isSelected,
  adminNote,
  isProcessing,
  onSelect,
  onCancel,
  onApprove,
  onReject,
  onNoteChange,
}: BypassRequestCardProps) {
  return (
    <Card className="border-2 border-orange-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="w-4 h-4" />
              Order #{request.order.orderNumber}
            </CardTitle>
            {request.order.outlet && (
              <p className="text-sm text-slate-600 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {request.order.outlet.name}
              </p>
            )}
          </div>
          <Badge variant="secondary">{request.station}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Worker Info */}
        <div>
          <p className="text-sm text-slate-600 mb-1 flex items-center gap-1">
            <User className="w-3 h-3" />
            Worker
          </p>
          <p className="font-medium">{request.worker.fullName}</p>
          <p className="text-xs text-slate-500">{request.worker.role}</p>
        </div>

        {/* Reason */}
        <div>
          <p className="text-sm text-slate-600 mb-1">Reason</p>
          <p className="text-sm bg-slate-50 p-3 rounded border">
            {request.reason}
          </p>
        </div>

        {/* Timestamp */}
        <p className="text-sm text-slate-600 flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          Requested at:{" "}
          {format(new Date(request.createdAt), "dd MMM yyyy, HH:mm")}
        </p>

        {/* Admin Note Input (when selected) */}
        {isSelected && (
          <div className="space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Label htmlFor={`adminNote-${request.id}`}>
              Admin Note{" "}
              <span className="text-xs text-slate-600">
                (Optional for approval, required for rejection)
              </span>
            </Label>
            <Textarea
              id={`adminNote-${request.id}`}
              value={adminNote}
              onChange={(e) => onNoteChange(e.target.value)}
              placeholder="Add a note about your decision..."
              rows={3}
              className="bg-white"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t">
          {isSelected ? (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={onCancel}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onReject(request)}
                disabled={isProcessing || !adminNote.trim()}
                className="gap-2"
              >
                {isProcessing && <Loader2 className="w-3 h-3 animate-spin" />}
                <XCircle className="w-3 h-3" />
                Reject
              </Button>
              <Button
                size="sm"
                onClick={() => onApprove(request)}
                disabled={isProcessing}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                {isProcessing && <Loader2 className="w-3 h-3 animate-spin" />}
                <CheckCircle className="w-3 h-3" />
                Approve
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              onClick={() => onSelect(request)}
              className="gap-2"
            >
              Review Request
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
