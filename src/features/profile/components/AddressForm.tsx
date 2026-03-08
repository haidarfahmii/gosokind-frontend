"use client";

import { useEffect, useState } from "react";
import { FiSave, FiX, FiMapPin, FiNavigation } from "react-icons/fi";
import { Button } from "@/features/auth/components/ui/button";
import { Input } from "@/features/auth/components/ui/input";
import { Label } from "@/features/auth/components/ui/label";
import { Checkbox } from "@/features/auth/components/ui/checkbox";
import { useAddressForm } from "../hooks/useAddressForm";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("@/components/shared/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-75 w-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400">
      Memuat Peta...
    </div>
  ),
});

interface AddressFormProps {
  initialData?: any;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddressForm({
  initialData,
  onClose,
  onSuccess,
}: AddressFormProps) {
  const { formik, isLoading, isEditMode } = useAddressForm({
    initialData,
    onClose,
    onSuccess,
  });

  const [isLocating, setIsLocating] = useState(false);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung fitur lokasi.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        formik.setFieldValue("latitude", position.coords.latitude);
        formik.setFieldValue("longitude", position.coords.longitude);
        setIsLocating(false);
      },
      (error) => {
        console.error("Error mengambil lokasi:", error);
        setIsLocating(false);
      },
      { enableHighAccuracy: true },
    );
  };

  useEffect(() => {
    if (!isEditMode) {
      handleGetCurrentLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode]);

  const handleMapChange = (lat: number, lng: number) => {
    formik.setFieldValue("latitude", lat);
    formik.setFieldValue("longitude", lng);
  };

  // Mengecek apakah ada error pada koordinat (jika mandatory tapi kosong)
  const hasLocationError =
    (formik.touched.latitude && formik.errors.latitude) ||
    (formik.touched.longitude && formik.errors.longitude);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 border-b border-slate-50 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              {isEditMode ? (
                <FiMapPin className="text-blue-600" />
              ) : (
                <FiMapPin className="text-green-600" />
              )}
              {isEditMode ? "Ubah Alamat" : "Tambah Alamat Baru"}
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              {isEditMode
                ? "Perbarui detail lokasi pengiriman."
                : "Pastikan alamat yang Anda masukkan akurat."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500 transition"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="label">Label Alamat</Label>
            <Input
              id="label"
              placeholder="Contoh: Rumah, Kantor, Kos"
              {...formik.getFieldProps("label")}
              className={cn(
                formik.touched.label && formik.errors.label && "border-red-500",
              )}
            />
            {formik.touched.label && formik.errors.label && (
              <p className="text-xs text-red-500">
                {formik.errors.label as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullAddress">Alamat Lengkap</Label>
            <textarea
              id="fullAddress"
              rows={3}
              className={cn(
                "w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none text-sm font-sans",
                formik.touched.fullAddress &&
                  formik.errors.fullAddress &&
                  "border-red-500",
              )}
              placeholder="Jl. Nama Jalan, No. Rumah, RT/RW, Kecamatan..."
              {...formik.getFieldProps("fullAddress")}
            />
            {formik.touched.fullAddress && formik.errors.fullAddress && (
              <p className="text-xs text-red-500">
                {formik.errors.fullAddress as string}
              </p>
            )}
          </div>

          {/* --- AREA PETA UPDATE --- */}
          <div className="space-y-2">
            <div className="flex justify-between items-end mb-2">
              <div>
                <Label>Titik Lokasi (Pinpoint Peta)</Label>
                <p className="text-xs text-slate-400">
                  Klik peta untuk menyesuaikan titik koordinat.
                </p>
              </div>
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={isLocating}
                className="text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition disabled:opacity-50"
              >
                <FiNavigation className={isLocating ? "animate-pulse" : ""} />
                {isLocating ? "Mencari..." : "Lokasi Saya"}
              </button>
            </div>

            {/* Wrapper map dengan indikator error visual (border merah) jika lat/lng kosong */}
            <div
              className={cn(
                "border rounded-xl overflow-hidden relative",
                hasLocationError
                  ? "border-red-500 ring-2 ring-red-500/20"
                  : "border-slate-200",
              )}
            >
              <MapPicker
                lat={Number(formik.values.latitude) ?? 0}
                lng={Number(formik.values.longitude) ?? 0}
                onChange={handleMapChange}
              />
            </div>

            {/* Pesan Error Validasi Formik untuk Peta */}
            {hasLocationError && (
              <p className="text-xs text-red-500 font-medium">
                Silakan tentukan titik lokasi pada peta.
              </p>
            )}
          </div>

          {/* Checkbox Primary */}
          <div className="flex items-start space-x-3 py-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <Checkbox
              id="isPrimary"
              checked={formik.values.isPrimary}
              onCheckedChange={(checked) =>
                formik.setFieldValue("isPrimary", checked)
              }
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="isPrimary"
                className="cursor-pointer font-semibold text-slate-700"
              >
                Jadikan Alamat Utama
              </Label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-2">
            <Button
              type="submit"
              className="w-full h-12 text-base rounded-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                "Menyimpan..."
              ) : (
                <>
                  <FiSave className="mr-2" />{" "}
                  {isEditMode ? "Simpan Perubahan" : "Simpan Alamat"}
                </>
              )}
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="w-full mt-3 py-3 text-slate-400 font-semibold text-sm hover:text-slate-600 transition"
              disabled={isLoading}
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
