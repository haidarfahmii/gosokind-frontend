"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { outletSchema } from "../schemas/outletValidationSchema";
import { outletService } from "../services/outlet.service";
import {
  Outlet,
  OutletFormValues,
  CheckLocationResult,
  OutletStatus,
} from "../types";

interface UseOutletFormProps {
  onSuccess: () => void;
  initialData?: Outlet | null;
}

export type UseOutletFormReturn = {
  formik: ReturnType<typeof useFormik<OutletFormValues>>;
  locationPreview: CheckLocationResult | null;
  isCheckingLocation: boolean;
  showMapPreview: boolean;
  handleCheckLocation: () => Promise<void>;
  handleClearPreview: () => void;
  handleAddressChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleCoordinatesChange: (
    field: "latitude" | "longitude",
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const useOutletForm = ({
  onSuccess,
  initialData,
}: UseOutletFormProps): UseOutletFormReturn => {
  // State untuk location preview
  const [locationPreview, setLocationPreview] =
    useState<CheckLocationResult | null>(null);
  const [isCheckingLocation, setIsCheckingLocation] = useState(false);
  const [showMapPreview, setShowMapPreview] = useState(false);

  const formik = useFormik<OutletFormValues>({
    enableReinitialize: true,
    initialValues: {
      name: initialData?.name || "",
      province: initialData?.province || "",
      city: initialData?.city || "",
      status: initialData?.status || "AVAILABLE",
      address: initialData?.address || "",
      latitude: initialData?.latitude || "",
      longitude: initialData?.longitude || "",
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
          latitude: values.latitude ? Number(values.latitude) : undefined,
          longitude: values.longitude ? Number(values.longitude) : undefined,
        };

        if (initialData?.id) {
          // Update mode
          await outletService.updateOutlet(initialData.id, {
            id: initialData.id,
            ...payload,
          });
          toast.success("Outlet updated successfully");
        } else {
          // Create mode
          await outletService.createOutlet(payload);
          toast.success("Outlet created successfully");
        }

        // Reset states
        setLocationPreview(null);
        setShowMapPreview(false);
        formik.resetForm();
        onSuccess();
      } catch (error: any) {
        console.error("Form submit error:", error);
        const errorMessage =
          error.response?.data?.message || "Failed to save outlet";
        toast.error(errorMessage);
      }
    },
  });

  const handleCheckLocation = async () => {
    try {
      setIsCheckingLocation(true);

      // Validasi field yang diperlukan
      const hasManualCoordinates =
        formik.values.latitude && formik.values.longitude;
      const hasAddress = formik.values.address.length >= 10;

      if (!hasAddress) {
        toast.error("Please enter a complete address (minimum 10 characters)");
        return;
      }

      if (
        !hasManualCoordinates &&
        (!formik.values.province || !formik.values.city)
      ) {
        toast.error(
          "Province and City are required when coordinates are not provided",
        );
        return;
      }

      // Call check-location endpoint
      const response = await outletService.checkLocation({
        province: formik.values.province || undefined,
        city: formik.values.city || undefined,
        address: formik.values.address,
        latitude: formik.values.latitude
          ? Number(formik.values.latitude)
          : undefined,
        longitude: formik.values.longitude
          ? Number(formik.values.longitude)
          : undefined,
      });

      if (response.success) {
        setLocationPreview(response.data);
        setShowMapPreview(true);

        // Update form values dengan hasil geocoding
        formik.setFieldValue("latitude", response.data.latitude);
        formik.setFieldValue("longitude", response.data.longitude);
        formik.setFieldValue("address", response.data.formattedAddress);

        toast.success("Location verified successfully");
      }
    } catch (error: any) {
      console.error("Check location error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to check location";
      toast.error(errorMessage);
    } finally {
      setIsCheckingLocation(false);
    }
  };

  const handleClearPreview = () => {
    setLocationPreview(null);
    setShowMapPreview(false);
  };

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    formik.handleChange(e);
    // Reset preview jika address berubah
    if (showMapPreview) {
      setShowMapPreview(false);
      setLocationPreview(null);
    }
  };

  const handleCoordinatesChange =
    (field: "latitude" | "longitude") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      formik.handleChange(e);
      // Reset preview jika coordinates berubah
      if (showMapPreview) {
        setShowMapPreview(false);
        setLocationPreview(null);
      }
    };

  return {
    formik,
    locationPreview,
    isCheckingLocation,
    showMapPreview,
    handleCheckLocation,
    handleClearPreview,
    handleAddressChange,
    handleCoordinatesChange,
  };
};
