import * as Yup from "yup";
import { EmployeeRole } from "@/@types/employee.types";

export const employeeValidationSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .required("Full name is required"),

  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),

  role: Yup.string()
    .oneOf(
      [
        "SUPER_ADMIN",
        "OUTLET_ADMIN",
        "WORKER_WASHING",
        "WORKER_IRONING",
        "WORKER_PACKING",
        "DRIVER",
      ],
      "Invalid role selected",
    )
    .required("Role is required"),

  outletId: Yup.string().when("role", ([role], schema) => {
    return role !== "SUPER_ADMIN"
      ? schema.required("Outlet is required for non-Super Admin roles")
      : schema.notRequired();
  }),

  password: Yup.string()
    .transform((curr, orig) => (orig === "" ? undefined : curr))
    .min(6, "Password must be at least 6 characters")
    .optional(),
});

export interface EmployeeFormValues {
  fullName: string;
  email: string;
  role: EmployeeRole;
  outletId: string;
  password?: string;
}
