import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseOutletFormReturn } from "../hooks/useOutletForm";

interface OutletBasicInfoProps {
  formik: UseOutletFormReturn["formik"];
}

export function OutletBasicInfo({ formik }: OutletBasicInfoProps) {
  // Helper Error Message Lokal
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

      {/* Status */}
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
    </div>
  );
}
