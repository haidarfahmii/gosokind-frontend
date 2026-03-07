import EmployeeLoginForm from "@/features/auth/components/EmployeeLoginForm";
import AuthLayout from "@/features/auth/components/AuthLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk - GOSOKIND",
  description: "Employee portal.",
};

export default function EmployeeLoginPage() {
  return (
    <AuthLayout
      title="Employee Portal"
      subtitle="Masuk untuk mengakses dashboard operasional GOSOKIND."
      showBackArrow={false}
    >
      <EmployeeLoginForm />
    </AuthLayout>
  );
}
