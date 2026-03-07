import { useFormik } from "formik";
import {
  OutletEmployee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeStatus,
} from "../types/employee.types";
import {
  createEmployeeSchema,
  updateEmployeeSchema,
} from "../schemas/employeeValidationSchema";

interface UseEmployeeFormProps {
  employee?: OutletEmployee | null;
  onSubmit: (data: CreateEmployeeDto | UpdateEmployeeDto) => Promise<void>;
  onClose: () => void;
}

export function useEmployeeForm({
  employee,
  onSubmit,
  onClose,
}: UseEmployeeFormProps) {
  const isEdit = !!employee;

  const formik = useFormik({
    initialValues: isEdit
      ? {
          fullName: employee.fullName,
          email: employee.email,
          role: employee.role,
          phoneNumber: employee.phoneNumber || "",
          status: employee.isActive
            ? EmployeeStatus.ACTIVE
            : EmployeeStatus.INACTIVE,
        }
      : {
          fullName: "",
          email: "",
          password: "",
          role: "",
          phoneNumber: "",
          status: EmployeeStatus.ACTIVE,
        },
    validationSchema: isEdit ? updateEmployeeSchema : createEmployeeSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { status, ...restValues } = values;

        const employeeData = {
          ...restValues,
          isActive: status === EmployeeStatus.ACTIVE,
        };

        if (isEdit) {
          await onSubmit(employeeData as UpdateEmployeeDto);
        } else {
          await onSubmit(employeeData as CreateEmployeeDto);
        }

        onClose();
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setSubmitting(false);
      }
    },
    enableReinitialize: true,
  });

  return {
    formik,
    isEdit,
  };
}
