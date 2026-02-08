import { CheckCircle2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { UseOutletFormReturn } from "../hooks/useOutletForm";

interface LocationPreviewProps {
  locationPreview: UseOutletFormReturn["locationPreview"];
}

export function LocationPreview({ locationPreview }: LocationPreviewProps) {
  if (!locationPreview) return null;

  return (
    <div className="border rounded-lg p-4 bg-blue-50 space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-blue-900">
          Location Preview
        </Label>
        <Badge
          variant="secondary"
          className={
            locationPreview.source === "manual"
              ? "bg-purple-100 text-purple-700"
              : "bg-green-100 text-green-700"
          }
        >
          {locationPreview.source === "manual" ? (
            <>📍 Manual Coordinates</>
          ) : (
            <>🌍 Auto-Geocoded</>
          )}
        </Badge>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-slate-800">
              {locationPreview.preview.willUse}
            </p>
            <p className="text-xs text-slate-600">
              {locationPreview.preview.message}
            </p>
          </div>
        </div>

        <div className="bg-white rounded p-3 space-y-2">
          <p className="text-xs font-semibold text-slate-500">
            Formatted Address:
          </p>
          <p className="text-sm text-slate-700">
            {locationPreview.formattedAddress}
          </p>

          <div className="flex gap-2 pt-2">
            <span className="text-xs bg-slate-100 px-2 py-1 rounded">
              Lat: {locationPreview.latitude.toFixed(6)}
            </span>
            <span className="text-xs bg-slate-100 px-2 py-1 rounded">
              Lng: {locationPreview.longitude.toFixed(6)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
