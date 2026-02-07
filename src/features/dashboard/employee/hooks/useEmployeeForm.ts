"use client";

import { useFormik } from "formik";
import { toast } from "react-toastify";
import {
  employeeValidationSchema,
  EmployeeFormValues,
} from "../schemas/employeeValidationSchema";
import { employeeService } from "../services/employee.service";
import { Employee, EmployeeRole } from "@/@types/employee.types";

interface UseEmployeeFormProps {
  initialData?: Employee;
  onSuccess: (employee: Employee) => void;
  onClose: () => void;
  outlets: Array<{ id: string; name: string }>;
}

export const useEmployeeForm = ({
  initialData,
  onSuccess,
  onClose,
  outlets,
}: UseEmployeeFormProps) => {
  const isEditMode = !!initialData;

  const formik = useFormik<EmployeeFormValues>({
    initialValues: {
      fullName: initialData?.fullName || "",
      email: initialData?.email || "",
      role: initialData?.role || EmployeeRole.WORKER_WASHING,
      outletId: initialData?.outletId || "",
      password: "",
    },
    validationSchema: employeeValidationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        // Password validation for create mode
        if (!isEditMode && !values.password) {
          setErrors({ password: "Password is required for new employees" });
          setSubmitting(false);
          return;
        }

        if (isEditMode && initialData) {
          // Update existing employee
          const response = await employeeService.updateEmployee(
            initialData.id,
            {
              fullName: values.fullName,
              email: values.email,
              role: values.role,
              outletId:
                values.role === "SUPER_ADMIN" ? undefined : values.outletId,
              password: values.password || undefined,
            },
          );

          if (response.success) {
            toast.success("Employee updated successfully");
            onSuccess(response.data);
            onClose();
          }
        } else {
          // Create new employee
          const response = await employeeService.createEmployee({
            fullName: values.fullName,
            email: values.email,
            password: values.password!,
            role: values.role,
            outletId:
              values.role === "SUPER_ADMIN" ? undefined : values.outletId,
          });

          if (response.success) {
            toast.success("Employee created successfully");
            onSuccess(response.data);
            onClose();
          }
        }
      } catch (error: any) {
        console.error("Form submit error:", error);

        // Handle specific error messages
        const errorMessage =
          error.response?.data?.message || "Operation failed";
        toast.error(errorMessage);

        // Set form-level error if email already exists
        if (errorMessage.toLowerCase().includes("email")) {
          setErrors({ email: errorMessage });
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return { formik, isEditMode };
};
