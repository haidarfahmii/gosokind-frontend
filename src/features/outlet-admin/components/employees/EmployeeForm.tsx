"use client";

import { Form, Field, ErrorMessage, FormikProvider } from "formik";
import { Loader2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  OutletEmployee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeStatus,
  EmployeeRole,
} from "../../types/employee.types";
import { useEmployeeForm } from "../../hooks/useEmployeeForm";

interface EmployeeFormProps {
  open: boolean;
  onClose: () => void;
  employee?: OutletEmployee | null;
  onSubmit: (data: CreateEmployeeDto | UpdateEmployeeDto) => Promise<void>;
}

export function EmployeeForm({
  open,
  onClose,
  employee,
  onSubmit,
}: EmployeeFormProps) {
  const { formik, isEdit } = useEmployeeForm({
    employee,
    onSubmit,
    onClose,
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Employee" : "Add New Employee"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update employee information."
              : "Create a new employee account for your outlet."}
          </DialogDescription>
        </DialogHeader>

        <FormikProvider value={formik}>
          <Form className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Field
                as={Input}
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                disabled={formik.isSubmitting}
                className={
                  formik.errors.fullName && formik.touched.fullName
                    ? "border-red-500"
                    : ""
                }
              />
              <ErrorMessage
                name="fullName"
                component="p"
                className="text-sm text-red-500"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Field
                as={Input}
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                disabled={formik.isSubmitting}
                className={
                  formik.errors.email && formik.touched.email
                    ? "border-red-500"
                    : ""
                }
              />
              <ErrorMessage
                name="email"
                component="p"
                className="text-sm text-red-500"
              />
            </div>

            {/* Password - Only for Create */}
            {!isEdit && (
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password <span className="text-red-500">*</span>
                </Label>
                <Field
                  as={Input}
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Min. 6 characters"
                  disabled={formik.isSubmitting}
                  className={
                    formik.errors.password && formik.touched.password
                      ? "border-red-500"
                      : ""
                  }
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-sm text-red-500"
                />
              </div>
            )}

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Field
                as={Input}
                id="phoneNumber"
                name="phoneNumber"
                placeholder="08123456789"
                disabled={formik.isSubmitting}
                className={
                  formik.errors.phoneNumber && formik.touched.phoneNumber
                    ? "border-red-500"
                    : ""
                }
              />
              <ErrorMessage
                name="phoneNumber"
                component="p"
                className="text-sm text-red-500"
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">
                Role <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formik.values.role}
                onValueChange={(value) => formik.setFieldValue("role", value)}
                disabled={formik.isSubmitting}
              >
                <SelectTrigger
                  className={
                    formik.errors.role && formik.touched.role
                      ? "border-red-500"
                      : ""
                  }
                >
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EmployeeRole.WORKER_WASHING}>
                    Washing Worker
                  </SelectItem>
                  <SelectItem value={EmployeeRole.WORKER_IRONING}>
                    Ironing Worker
                  </SelectItem>
                  <SelectItem value={EmployeeRole.WORKER_PACKING}>
                    Packing Worker
                  </SelectItem>
                  <SelectItem value={EmployeeRole.DRIVER}>Driver</SelectItem>
                </SelectContent>
              </Select>
              <ErrorMessage
                name="role"
                component="p"
                className="text-sm text-red-500"
              />
            </div>

            {/* Status - Only for Edit */}
            {isEdit && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formik.values.status}
                  onValueChange={(value) =>
                    formik.setFieldValue("status", value)
                  }
                  disabled={formik.isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={EmployeeStatus.ACTIVE}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        Active
                      </div>
                    </SelectItem>
                    <SelectItem value={EmployeeStatus.INACTIVE}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        Inactive
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={formik.isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEdit ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </Form>
        </FormikProvider>
      </DialogContent>
    </Dialog>
  );
}
