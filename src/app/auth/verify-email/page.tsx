import AuthLayout from "@/features/auth/components/AuthLayout";
import { Metadata } from "next";
import VerifyEmailForm from "@/features/auth/components/VerifyEmailForm";

export const metadata: Metadata = {
    title: "Masuk - GOSOKIND",
    description: "Masuk untuk mengelola pesanan setrika Anda.",
};

export default function VerifyEmailPage() {
    return (
        <AuthLayout
            title="Selamat Datang"
            subtitle="Masuk untuk mengelola pesanan setrika Anda."
            linkText="Belum punya akun?"
            linkUrl="/auth/register"
            linkLabel="Daftar disini"
        >
            <VerifyEmailForm />
        </AuthLayout>
    );
}