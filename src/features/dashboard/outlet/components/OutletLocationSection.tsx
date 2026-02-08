import { Globe, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { UseOutletFormReturn } from "../hooks/useOutletForm";
import { LocationPreview } from "./LocationPreview";

interface OutletLocationSectionProps {
  formContext: UseOutletFormReturn;
}

export function OutletLocationSection({
  formContext,
}: OutletLocationSectionProps) {
  const {
    formik,
    locationPreview,
    isCheckingLocation,
    showMapPreview,
    handleCheckLocation,
    handleAddressChange,
    handleCoordinatesChange,
  } = formContext;

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
    <div className="space-y-3">
      <Label className="text-base font-semibold flex items-center gap-2">
        <Globe className="h-4 w-4" />
        Location Information
      </Label>

      {/* Province & City */}
      <div className="grid grid-cols-2 gap-3">
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

      {/* Manual Coordinates */}
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

      {/* Render Location Preview Component */}
      {showMapPreview && <LocationPreview locationPreview={locationPreview} />}
    </div>
  );
}
