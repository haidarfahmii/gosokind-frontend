"use client";

import { MapPin, MapPinned, CheckCircle2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOutletForm } from "../hooks/useOutletForm";
import { Outlet } from "../types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface OutletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedOutlet?: Outlet | null;
  onSuccess: () => void;
}

export function OutletDialog({
  open,
  onOpenChange,
  selectedOutlet,
  onSuccess,
}: OutletDialogProps) {
  const {
    formik,
    locationPreview,
    isCheckingLocation,
    showMapPreview,
    handleCheckLocation,
    handleClearPreview,
    handleAddressChange,
    handleCoordinatesChange,
  } = useOutletForm({
    onSuccess: () => {
      onSuccess();
      onOpenChange(false);
    },
    initialData: selectedOutlet,
  });

  const isEditMode = !!selectedOutlet;

  // Helper untuk error message
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPinned className="h-5 w-5 text-blue-600" />
            {isEditMode ? "Edit Outlet" : "Add New Outlet"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update outlet information and location"
              : "Enter outlet details and verify location on map"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Outlet Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Outlet Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., Gosokind Senopati"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={formik.isSubmitting}
            />
            <ErrorMessage field="name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">
              Status <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formik.values.status}
              onValueChange={(value) => formik.setFieldValue("status", value)}
              disabled={formik.isSubmitting}
            >
              <SelectTrigger
                className={
                  formik.touched.status && formik.errors.status
                    ? "border-red-500"
                    : ""
                }
              >
                <SelectValue placeholder="Select outlet status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AVAILABLE">Available</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <ErrorMessage field="status" />
          </div>

          <Separator />

          {/* Location Section */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Location Information
            </Label>

            {/* Province & City */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="province">
                  Province
                  {!formik.values.latitude && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </Label>
                <Input
                  id="province"
                  name="province"
                  placeholder="e.g., DKI Jakarta"
                  value={formik.values.province}
                  onChange={handleAddressChange}
                  onBlur={formik.handleBlur}
                  disabled={formik.isSubmitting}
                />
                <ErrorMessage field="province" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">
                  City
                  {!formik.values.latitude && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="e.g., Jakarta Selatan"
                  value={formik.values.city}
                  onChange={handleAddressChange}
                  onBlur={formik.handleBlur}
                  disabled={formik.isSubmitting}
                />
                <ErrorMessage field="city" />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">
                Complete Address <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="address"
                name="address"
                placeholder="e.g., Jl. Senopati No. 87, Kebayoran Baru"
                value={formik.values.address}
                onChange={handleAddressChange}
                onBlur={formik.handleBlur}
                disabled={formik.isSubmitting}
                rows={3}
              />
              <ErrorMessage field="address" />
            </div>

            {/* Manual Coordinates (Optional) */}
            <div className="space-y-2">
              <Label className="text-sm text-slate-600 flex items-center gap-1">
                Manual Coordinates{" "}
                <span className="text-xs text-slate-400">(optional)</span>
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="latitude" className="text-xs text-slate-500">
                    Latitude
                  </Label>
                  <Input
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    placeholder="-6.2383"
                    value={formik.values.latitude}
                    onChange={handleCoordinatesChange("latitude")}
                    onBlur={formik.handleBlur}
                    disabled={formik.isSubmitting}
                  />
                  <ErrorMessage field="latitude" />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="longitude" className="text-xs text-slate-500">
                    Longitude
                  </Label>
                  <Input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    placeholder="106.8101"
                    value={formik.values.longitude}
                    onChange={handleCoordinatesChange("longitude")}
                    onBlur={formik.handleBlur}
                    disabled={formik.isSubmitting}
                  />
                  <ErrorMessage field="longitude" />
                </div>
              </div>
            </div>

            {/* Check Location Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={handleCheckLocation}
              disabled={isCheckingLocation || formik.isSubmitting}
            >
              {isCheckingLocation ? (
                <>
                  <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  Checking Location...
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4" />
                  {showMapPreview ? "Re-check Location" : "Verify Location"}
                </>
              )}
            </Button>
          </div>

          {/* Location Preview */}
          {showMapPreview && locationPreview && (
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

              {/* Placeholder untuk Google Maps - bisa diimplementasikan nanti */}
              <div className="bg-slate-200 rounded-lg h-48 flex items-center justify-center text-slate-500">
                <div className="text-center space-y-2">
                  <MapPinned className="h-8 w-8 mx-auto text-slate-400" />
                  <p className="text-sm">Map Preview</p>
                  <p className="text-xs">
                    Google Maps integration akan ditambahkan di sini
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={formik.isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={formik.isSubmitting || !formik.isValid}
            >
              {formik.isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : isEditMode ? (
                "Update Outlet"
              ) : (
                "Create Outlet"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
