"use client";

import dynamic from "next/dynamic";
import { Globe, MapPin, Navigation } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UseOutletFormReturn } from "../hooks/useOutletForm";

// Lazy-load MapPicker karena Leaflet tidak bisa di-render di server (SSR)
const MapPicker = dynamic(() => import("@/components/shared/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-75 w-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400 text-sm">
      Loading Map...
    </div>
  ),
});

interface OutletLocationSectionProps {
  formContext: UseOutletFormReturn;
}

export function OutletLocationSection({
  formContext,
}: OutletLocationSectionProps) {
  const { formik, isLocating, handleGetCurrentLocation, handleMapChange } =
    formContext;

  // Tampilkan error map jika latitude/longitude sudah "disentuh" namun masih null
  const hasMapError =
    (formik.touched.latitude && formik.errors.latitude) ||
    (formik.touched.longitude && formik.errors.longitude);

  const ErrorMessage = ({ field }: { field: keyof typeof formik.values }) => {
    if (formik.touched[field] && formik.errors[field]) {
      return (
        <span className="text-xs text-red-500 mt-1 block">
          {formik.errors[field] as string}
        </span>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold flex items-center gap-2">
        <Globe className="h-4 w-4" />
        Location Information
      </Label>

      {/* Province & City — opsional, hanya untuk info tampilan */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="city" className="text-sm">
            City <span className="text-slate-400 font-normal">(optional)</span>
          </Label>
          <Input
            id="city"
            name="city"
            placeholder="e.g., Jakarta Selatan"
            value={formik.values.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={formik.isSubmitting}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="province" className="text-sm">
            Province{" "}
            <span className="text-slate-400 font-normal">(optional)</span>
          </Label>
          <Input
            id="province"
            name="province"
            placeholder="e.g., DKI Jakarta"
            value={formik.values.province}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={formik.isSubmitting}
          />
        </div>
      </div>

      {/* Alamat lengkap */}
      <div className="space-y-1.5">
        <Label htmlFor="address">
          Complete Address <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="address"
          name="address"
          placeholder="e.g., Jl. Senopati No. 87, Kebayoran Baru"
          value={formik.values.address}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={formik.isSubmitting}
          rows={3}
          className={cn(
            formik.touched.address && formik.errors.address && "border-red-500",
          )}
        />
        <ErrorMessage field="address" />
      </div>

      {/*MAP PICKER */}
      <div className="space-y-2">
        {/* Header row: label + tombol "Use My Location" */}
        <div className="flex items-end justify-between">
          <div>
            <Label className="text-sm">
              Pin Location on Map <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs text-slate-400 mt-0.5">
              Click the map to set the outlet's exact coordinate.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGetCurrentLocation}
            disabled={isLocating || formik.isSubmitting}
            className="gap-1.5 text-xs shrink-0"
          >
            <Navigation
              className={cn("h-3.5 w-3.5", isLocating && "animate-pulse")}
            />
            {isLocating ? "Detecting..." : "Use My Location"}
          </Button>
        </div>

        {/* Kotak peta — border merah jika belum dipilih & sudah "touched" */}
        <div
          className={cn(
            "border rounded-xl overflow-hidden",
            hasMapError
              ? "border-red-500 ring-2 ring-red-500/20"
              : "border-slate-200",
          )}
        >
          <MapPicker
            lat={formik.values.latitude ?? 0}
            lng={formik.values.longitude ?? 0}
            onChange={handleMapChange}
            height="300px"
          />
        </div>

        {/* Pesan error map */}
        {hasMapError && (
          <p className="text-xs text-red-500 font-medium">
            Please click on the map to set the outlet location.
          </p>
        )}

        {/* Koordinat info box — tampil setelah marker dipilih */}
        {formik.values.latitude !== null &&
          formik.values.longitude !== null && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              <MapPin className="h-4 w-4 text-green-600 shrink-0" />
              <div className="flex gap-3 text-xs text-green-800 font-mono">
                <span>Lat: {formik.values.latitude.toFixed(6)}</span>
                <span>Lng: {formik.values.longitude.toFixed(6)}</span>
              </div>
              <span className="ml-auto text-xs text-green-600 font-medium">
                ✓ Location set
              </span>
            </div>
          )}
      </div>
    </div>
  );
}
