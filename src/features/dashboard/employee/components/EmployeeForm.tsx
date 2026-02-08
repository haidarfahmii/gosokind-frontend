"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Employee, EmployeeRole } from "@/@types/employee.types";
import { useEmployeeForm } from "../hooks/useEmployeeForm";

interface EmployeeFormProps {
  initialData?: Employee;
  onSuccess: (employee: Employee) => void;
  onCancel: () => void;
  outlets: Array<{ id: string; name: string }>;
}

export function EmployeeForm({
  initialData,
  onSuccess,
  onCancel,
  outlets,
}: EmployeeFormProps) {
  const { formik, isEditMode } = useEmployeeForm({
    initialData,
    onSuccess,
    onClose: onCancel,
    outlets,
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          placeholder="John Doe"
          {...formik.getFieldProps("fullName")}
          disabled={formik.isSubmitting}
          className={
            formik.touched.fullName && formik.errors.fullName
              ? "border-red-500"
              : ""
          }
        />
        {formik.touched.fullName && formik.errors.fullName && (
          <p className="text-red-500 text-xs">{formik.errors.fullName}</p>
        )}
      </div>

      {/* Email & Password */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            {...formik.getFieldProps("email")}
            disabled={formik.isSubmitting}
            className={
              formik.touched.email && formik.errors.email
                ? "border-red-500"
                : ""
            }
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-xs">{formik.errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...formik.getFieldProps("password")}
            disabled={formik.isSubmitting}
            className={
              formik.touched.password && formik.errors.password
                ? "border-red-500"
                : ""
            }
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-xs">{formik.errors.password}</p>
          )}
        </div>

        {isEditMode && (
          <span className="text-xs text-slate-500">
            (biarkan password kosong untuk tidak mengubah)
          </span>
        )}
      </div>

      {/* Role & Outlet */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Role</Label>
          <Select
            value={formik.values.role}
            onValueChange={(val) => {
              formik.setFieldValue("role", val);
              // Clear outlet if Super Admin
              if (val === EmployeeRole.SUPER_ADMIN) {
                formik.setFieldValue("outletId", "");
              }
            }}
            disabled={formik.isSubmitting}
          >
            <SelectTrigger
              className={
                formik.touched.role && formik.errors.role
                  ? "border-red-500"
                  : ""
              }
            >
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
              <SelectItem value="OUTLET_ADMIN">Outlet Admin</SelectItem>
              <SelectItem value="WORKER_WASHING">Washing Worker</SelectItem>
              <SelectItem value="WORKER_IRONING">Ironing Worker</SelectItem>
              <SelectItem value="WORKER_PACKING">Packing Worker</SelectItem>
              <SelectItem value="DRIVER">Driver</SelectItem>
            </SelectContent>
          </Select>
          {formik.touched.role && formik.errors.role && (
            <p className="text-red-500 text-xs">{formik.errors.role}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Outlet</Label>
          <Select
            value={formik.values.outletId}
            onValueChange={(val) => formik.setFieldValue("outletId", val)}
            disabled={
              formik.isSubmitting ||
              formik.values.role === EmployeeRole.SUPER_ADMIN
            }
          >
            <SelectTrigger
              className={
                formik.touched.outletId && formik.errors.outletId
                  ? "border-red-500"
                  : ""
              }
            >
              <SelectValue placeholder="Select Outlet" />
            </SelectTrigger>
            <SelectContent>
              {outlets.map((outlet) => (
                <SelectItem key={outlet.id} value={outlet.id}>
                  {outlet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formik.touched.outletId && formik.errors.outletId && (
            <p className="text-red-500 text-xs">{formik.errors.outletId}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <Button
          variant="outline"
          type="button"
          onClick={onCancel}
          disabled={formik.isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting
            ? isEditMode
              ? "Updating..."
              : "Creating..."
            : isEditMode
              ? "Update"
              : "Create"}
        </Button>
      </div>
    </form>
  );
}
