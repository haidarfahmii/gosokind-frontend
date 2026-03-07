import RegisterForm from "@/features/auth/components/RegisterForm";
import AuthLayout from "@/features/auth/components/AuthLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Daftar - GOSOKIND",
    description: "Buat akun GOSOKIND baru.",
};

export default function RegisterPage() {
    return (
        <AuthLayout
            title="Buat Akun Baru"
            subtitle="Cukup masukkan email untuk mulai menggunakan layanan GOSOKIND."
            linkText="Sudah punya akun?"
            linkUrl="/auth/login"
            linkLabel="Masuk disini"
        >
            <RegisterForm />
        </AuthLayout>
    );
}