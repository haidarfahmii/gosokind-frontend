import AuthLayout from "@/features/auth/components/AuthLayout";
import { Metadata } from "next";
import VerifyEmailForm from "@/features/auth/components/VerifyEmailForm";

export const metadata: Metadata = {
    title: "Verifikasi Akun - GOSOKIND",
    description: "Lengkapi data diri Anda untuk menyelesaikan pendaftaran.",
};

interface PageProps {
    params: Promise<{ token: string }>;
}

export default async function VerifyEmailPage({ params }: PageProps) {
    // Pada Next.js 15, params adalah Promise yang harus di-await
    const { token } = await params;

    return (
        <AuthLayout
            title="Verifikasi Akun"
            subtitle="Buat password dan lengkapi profil Anda."
            linkText="Sudah punya akun?"
            linkUrl="/auth/login"
            linkLabel="Masuk disini"
        >
            <VerifyEmailForm token={token} />
        </AuthLayout>
    );
}