import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Weight } from "lucide-react";

interface TotalWeightFieldProps {
  value: number;
  touched?: boolean;
  error?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
}

// Field input untuk Total Weight beserta label dan pesan error
export function TotalWeightField({
  value,
  touched,
  error,
  onChange,
  onBlur,
}: TotalWeightFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="totalWeight" className="flex items-center gap-2">
        <Weight className="w-4 h-4" />
        Total Weight (kg) <span className="text-red-500">*</span>
      </Label>
      <Input
        id="totalWeight"
        name="totalWeight"
        type="number"
        step="0.1"
        min="0.1"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder="e.g., 5.5"
        className={touched && error ? "border-red-500" : ""}
      />
      {touched && error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
