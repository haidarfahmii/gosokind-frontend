import AuthLayout from "@/features/auth/components/AuthLayout";
import { Metadata } from "next";
import ResetPasswordForm from "@/features/auth/components/ResetPasswordForm";

export const metadata: Metadata = {
    title: "Reset Password - GOSOKIND",
    description: "Buat password baru GOSOKIND.",
};

interface PageProps {
    params: Promise<{ token: string }>;
}

export default async function ResetPasswordPage({ params }: PageProps) {
    const { token } = await params;
    return (
        <AuthLayout
            title="Buat Password Baru"
            subtitle="Masukkan password yang baru untuk mulai menggunakan layanan GOSOKIND."
            linkText="Sudah punya akun?"
            linkUrl="/auth/login"
            linkLabel="Masuk disini"
        >
            <ResetPasswordForm token={token}/>
        </AuthLayout>
    );
}