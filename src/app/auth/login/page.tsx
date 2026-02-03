import LoginForm from "@/features/auth/components/LoginForm";
import AuthLayout from "@/features/auth/components/AuthLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Masuk - GOSOKIND",
    description: "Masuk untuk mengelola pesanan setrika Anda.",
};

export default function LoginPage() {
    return (
        <AuthLayout
            title="Selamat Datang"
            subtitle="Masuk untuk mengelola pesanan setrika Anda."
            linkText="Belum punya akun?"
            linkUrl="/auth/register"
            linkLabel="Daftar disini"
        >
            <LoginForm />
        </AuthLayout>
    );
}