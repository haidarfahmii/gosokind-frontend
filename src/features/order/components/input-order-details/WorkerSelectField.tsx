import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, User } from "lucide-react";
import { WorkerOption } from "../../hooks/useWorkers";

interface WorkerSelectFieldProps {
  value: string;
  touched?: boolean;
  error?: string;
  workers: WorkerOption[];
  loadingWorkers: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}

/**
 * Field select untuk memilih worker yang akan di-assign ke order.
 * Menampilkan daftar worker aktif (WORKER_WASHING) dari outlet terkait.
 *
 */
export function WorkerSelectField({
  value,
  touched,
  error,
  workers,
  loadingWorkers,
  onChange,
  onBlur,
}: WorkerSelectFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="workerId" className="flex items-center gap-2">
        <User className="w-4 h-4" />
        Assign Washing Worker <span className="text-red-500">*</span>
      </Label>

      {loadingWorkers ? (
        <div className="flex items-center gap-2 text-sm text-slate-500 py-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading workers...
        </div>
      ) : (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger
            id="workerId"
            className={touched && error ? "border-red-500" : ""}
            onBlur={onBlur}
          >
            <SelectValue placeholder="Select a worker..." />
          </SelectTrigger>
          <SelectContent>
            {workers.length === 0 ? (
              <div className="px-3 py-2 text-sm text-slate-400 text-center">
                No active workers available
              </div>
            ) : (
              workers.map((worker) => (
                <SelectItem key={worker.id} value={worker.id}>
                  {worker.fullName}
                  <span className="text-slate-400 ml-2 text-xs">
                    ({worker.role.replace(/_/g, " ")})
                  </span>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      )}

      {touched && error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
