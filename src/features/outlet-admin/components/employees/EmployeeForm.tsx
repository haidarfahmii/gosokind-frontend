"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
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
  createEmployeeSchema,
  updateEmployeeSchema,
} from "../../schemas/employeeValidationSchema";
import {
  OutletEmployee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from "../../types/employee.types";

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
  const isEdit = !!employee;

  const initialValues = isEdit
    ? {
        fullName: employee.fullName,
        email: employee.email,
        role: employee.role,
        phoneNumber: employee.phoneNumber || "",
        status: employee.status,
      }
    : {
        fullName: "",
        email: "",
        password: "",
        role: "",
        phoneNumber: "",
      };

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

        <Formik
          initialValues={initialValues}
          validationSchema={
            isEdit ? updateEmployeeSchema : createEmployeeSchema
          }
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await onSubmit(values as any);
              onClose();
            } catch (error) {
              // Error handled by hook
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, errors, touched, setFieldValue, isSubmitting }) => (
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
                  className={
                    errors.fullName && touched.fullName ? "border-red-500" : ""
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
                  className={
                    errors.email && touched.email ? "border-red-500" : ""
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
                    className={
                      errors.password && touched.password
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
                  className={
                    errors.phoneNumber && touched.phoneNumber
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
                  value={values.role}
                  onValueChange={(value) => setFieldValue("role", value)}
                >
                  <SelectTrigger
                    className={
                      errors.role && touched.role ? "border-red-500" : ""
                    }
                  >
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WORKER_WASHING">
                      Washing Worker
                    </SelectItem>
                    <SelectItem value="WORKER_IRONING">
                      Ironing Worker
                    </SelectItem>
                    <SelectItem value="WORKER_PACKING">
                      Packing Worker
                    </SelectItem>
                    <SelectItem value="DRIVER">Driver</SelectItem>
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
                    value={values.status}
                    onValueChange={(value) => setFieldValue("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isEdit ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
