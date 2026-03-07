import AuthLayout from "@/features/auth/components/AuthLayout";
import { Metadata } from "next";
import ForgotPasswordForm from "@/features/auth/components/ForgotPasswordForm";

export const metadata: Metadata = {
    title: "Forgot Password - GOSOKIND",
    description: "Lupa password akun GOSOKIND.",
};

export default function ForgotPasswordPage() {
    return (
        <AuthLayout
            title="Forgot Password"
            subtitle="Cukup masukkan email untuk mulai menggunakan layanan GOSOKIND."
            linkText="Sudah punya akun?"
            linkUrl="/auth/login"
            linkLabel="Masuk disini"
        >
            <ForgotPasswordForm />
        </AuthLayout>
    );
}