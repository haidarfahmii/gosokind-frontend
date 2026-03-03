"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { outletSchema } from "@/features/super-admin/outlet/schemas/outletValidationSchema";
import { outletService } from "@/features/super-admin/outlet/services/outlet.service";
import {
  Outlet,
  OutletFormValues,
  OutletStatus,
} from "@/features/super-admin/outlet/types";

interface UseOutletFormProps {
  onSuccess: () => void;
  initialData?: Outlet | null;
}

export type UseOutletFormReturn = {
  formik: ReturnType<typeof useFormik<OutletFormValues>>;
  /** Apakah sedang mendeteksi lokasi lewat browser geolocation */
  isLocating: boolean;
  /** Pindahkan marker ke lokasi browser user */
  handleGetCurrentLocation: () => void;
  /** Dipanggil MapPicker saat user klik di peta */
  handleMapChange: (lat: number, lng: number) => void;
};

export const useOutletForm = ({
  onSuccess,
  initialData,
}: UseOutletFormProps): UseOutletFormReturn => {
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const formik = useFormik<OutletFormValues>({
    enableReinitialize: true,
    initialValues: {
      name: initialData?.name || "",
      province: initialData?.province || "",
      city: initialData?.city || "",
      status: initialData?.status || "AVAILABLE",
      address: initialData?.address || "",
      // Gunakan null jika tidak ada data awal (map wajib diklik sebelum submit)
      latitude: initialData?.latitude ?? null,
      longitude: initialData?.longitude ?? null,
    },
    validationSchema: outletSchema,
    onSubmit: async (values) => {
      try {
        const payload = {
          name: values.name,
          province: values.province || undefined,
          city: values.city || undefined,
          status: values.status as OutletStatus,
          address: values.address,
          // Sudah pasti bukan null karena Yup required memastikannya
          latitude: values.latitude as number,
          longitude: values.longitude as number,
        };

        if (initialData?.id) {
          await outletService.updateOutlet(initialData.id, {
            id: initialData.id,
            ...payload,
          });
          toast.success("Outlet updated successfully");
        } else {
          await outletService.createOutlet(payload);
          toast.success("Outlet created successfully");
        }

        formik.resetForm();
        onSuccess();
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Failed to save outlet";
        toast.error(errorMessage);
      }
    },
  });

  /** Update formik lat/lng ketika user klik di peta */
  const handleMapChange = (lat: number, lng: number) => {
    formik.setFieldValue("latitude", lat);
    formik.setFieldValue("longitude", lng);
    // Tandai field sudah "disentuh" agar validasi error muncul jika perlu
    formik.setFieldTouched("latitude", true, false);
    formik.setFieldTouched("longitude", true, false);
  };

  /** Gunakan Geolocation API browser untuk set posisi awal marker */
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Browser does not support geolocation");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        handleMapChange(position.coords.latitude, position.coords.longitude);
        setIsLocating(false);
        toast.success("Location detected successfully");
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Failed to detect location. Please click on the map.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return {
    formik,
    isLocating,
    handleGetCurrentLocation,
    handleMapChange,
  };
};
