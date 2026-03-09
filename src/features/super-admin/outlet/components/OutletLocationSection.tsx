"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Globe, Keyboard, Map, MapPin, Navigation } from "lucide-react";
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

type LocationMode = "map" | "manual";

export function OutletLocationSection({
  formContext,
}: OutletLocationSectionProps) {
  const { formik, isLocating, handleGetCurrentLocation, handleMapChange } =
    formContext;

  // Toggle mode: "map" (default) atau "manual" (input lat/lng langsung)
  const [locationMode, setLocationMode] = useState<LocationMode>("map");

  // State sementara untuk input manual (string agar bisa validasi sendiri)
  const [manualLat, setManualLat] = useState<string>(
    formik.values.latitude !== null ? String(formik.values.latitude) : "",
  );
  const [manualLng, setManualLng] = useState<string>(
    formik.values.longitude !== null ? String(formik.values.longitude) : "",
  );

  // Error lokal untuk input manual
  const [manualError, setManualError] = useState<string | null>(null);

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

  /** Sinkronisasi input manual ke formik */
  const applyManualCoordinates = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);

    if (isNaN(lat) || isNaN(lng)) {
      setManualError("Latitude dan Longitude harus berupa angka valid.");
      return;
    }
    if (lat < -90 || lat > 90) {
      setManualError("Latitude harus berada di antara -90 dan 90.");
      return;
    }
    if (lng < -180 || lng > 180) {
      setManualError("Longitude harus berada di antara -180 dan 180.");
      return;
    }

    setManualError(null);
    formik.setFieldValue("latitude", lat);
    formik.setFieldValue("longitude", lng);
    formik.setFieldTouched("latitude", true, false);
    formik.setFieldTouched("longitude", true, false);
  };

  /** Saat switch ke mode map, sinkronkan nilai manual ke state sementara */
  const handleSwitchMode = (mode: LocationMode) => {
    if (mode === "manual") {
      // Pre-fill input manual dengan nilai formik saat ini (jika ada)
      setManualLat(
        formik.values.latitude !== null ? String(formik.values.latitude) : "",
      );
      setManualLng(
        formik.values.longitude !== null ? String(formik.values.longitude) : "",
      );
      setManualError(null);
    }
    setLocationMode(mode);
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

      {/* ── KOORDINAT SECTION ── */}
      <div className="space-y-3">
        {/* Header row: label + mode toggle */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm">
              Pin Location <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs text-slate-400 mt-0.5">
              {locationMode === "map"
                ? "Klik peta untuk menentukan koordinat outlet."
                : "Masukkan koordinat latitude dan longitude secara manual."}
            </p>
          </div>

          {/* Toggle Map / Manual */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => handleSwitchMode("map")}
              disabled={formik.isSubmitting}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                locationMode === "map"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700",
              )}
            >
              <Map className="h-3.5 w-3.5" />
              Map
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode("manual")}
              disabled={formik.isSubmitting}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                locationMode === "manual"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700",
              )}
            >
              <Keyboard className="h-3.5 w-3.5" />
              Manual
            </button>
          </div>
        </div>

        {/* ── MODE: MAP ── */}
        {locationMode === "map" && (
          <div className="space-y-2">
            {/* Tombol "Use My Location" */}
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGetCurrentLocation}
                disabled={isLocating || formik.isSubmitting}
                className="gap-1.5 text-xs"
              >
                <Navigation
                  className={cn("h-3.5 w-3.5", isLocating && "animate-pulse")}
                />
                {isLocating ? "Detecting..." : "Use My Location"}
              </Button>
            </div>

            {/* Map container */}
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

            {hasMapError && (
              <p className="text-xs text-red-500 font-medium">
                Please click on the map to set the outlet location.
              </p>
            )}
          </div>
        )}

        {/* ── MODE: MANUAL ── */}
        {locationMode === "manual" && (
          <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="grid grid-cols-2 gap-3">
              {/* Latitude */}
              <div className="space-y-1.5">
                <Label htmlFor="manualLat" className="text-sm">
                  Latitude <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="manualLat"
                  type="number"
                  step="any"
                  placeholder="e.g., -6.200000"
                  value={manualLat}
                  onChange={(e) => {
                    setManualLat(e.target.value);
                    setManualError(null);
                  }}
                  disabled={formik.isSubmitting}
                  className={cn(
                    "font-mono text-sm",
                    manualError && "border-red-500",
                  )}
                />
                <p className="text-[10px] text-slate-400">Range: -90 s/d 90</p>
              </div>

              {/* Longitude */}
              <div className="space-y-1.5">
                <Label htmlFor="manualLng" className="text-sm">
                  Longitude <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="manualLng"
                  type="number"
                  step="any"
                  placeholder="e.g., 106.816666"
                  value={manualLng}
                  onChange={(e) => {
                    setManualLng(e.target.value);
                    setManualError(null);
                  }}
                  disabled={formik.isSubmitting}
                  className={cn(
                    "font-mono text-sm",
                    manualError && "border-red-500",
                  )}
                />
                <p className="text-[10px] text-slate-400">
                  Range: -180 s/d 180
                </p>
              </div>
            </div>

            {/* Error manual */}
            {manualError && (
              <p className="text-xs text-red-500 font-medium">{manualError}</p>
            )}

            {/* Tombol Apply */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={applyManualCoordinates}
              disabled={
                formik.isSubmitting || !manualLat.trim() || !manualLng.trim()
              }
              className="w-full gap-2 border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              <MapPin className="h-3.5 w-3.5" />
              Apply Coordinates
            </Button>

            {/* Yup error fallback jika apply belum dipencet */}
            {formik.touched.latitude && formik.errors.latitude && (
              <p className="text-xs text-red-500">
                {formik.errors.latitude as string}
              </p>
            )}
          </div>
        )}

        {/* ── Koordinat info box (tampil di kedua mode setelah berhasil di-set) ── */}
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
