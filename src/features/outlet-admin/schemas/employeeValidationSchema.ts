import * as Yup from "yup";
import { EmployeeRole } from "../types/employee.types";

export const createEmployeeSchema = Yup.object().shape({
  fullName: Yup.string()
    .required("Full name is required")
    .min(3, "Full name must be at least 3 characters")
    .max(100, "Full name must not exceed 100 characters"),

  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format")
    .max(100, "Email must not exceed 100 characters"),

  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must not exceed 50 characters"),

  role: Yup.string()
    .required("Role is required")
    .oneOf(
      [
        EmployeeRole.WORKER_WASHING,
        EmployeeRole.WORKER_IRONING,
        EmployeeRole.WORKER_PACKING,
        EmployeeRole.DRIVER,
      ],
      "Invalid role selected",
    ),

  phoneNumber: Yup.string()
    .nullable()
    .matches(
      /^(\+62|62|0)[0-9]{9,12}$/,
      "Invalid Indonesian phone number format",
    ),
});

export const updateEmployeeSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(3, "Full name must be at least 3 characters")
    .max(100, "Full name must not exceed 100 characters"),

  email: Yup.string()
    .email("Invalid email format")
    .max(100, "Email must not exceed 100 characters"),

  role: Yup.string().oneOf(
    [
      EmployeeRole.WORKER_WASHING,
      EmployeeRole.WORKER_IRONING,
      EmployeeRole.WORKER_PACKING,
      EmployeeRole.DRIVER,
    ],
    "Invalid role selected",
  ),

  phoneNumber: Yup.string()
    .nullable()
    .matches(
      /^(\+62|62|0)[0-9]{9,12}$/,
      "Invalid Indonesian phone number format",
    ),

  status: Yup.string().oneOf(["ACTIVE", "INACTIVE"], "Invalid status"),
});

export type CreateEmployeeFormValues = Yup.InferType<
  typeof createEmployeeSchema
>;
export type UpdateEmployeeFormValues = Yup.InferType<
  typeof updateEmployeeSchema
>;
