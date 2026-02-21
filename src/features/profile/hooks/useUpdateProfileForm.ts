import { useFormik } from "formik";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect, ChangeEvent } from "react";
import { toast } from "react-toastify"; // Asumsi pakai react-toastify, sesuaikan jika pakai lain
import { updateProfileSchema } from "../schemas/update-profile.schema";
import { updateProfileAvatar, updateProfileData } from "../services/profile.service";

export const useUpdateProfileForm = () => {
    const { data: session, update: updateSession } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

    const formik = useFormik({
        initialValues: {
            fullName: "",
            email: "",
            avatar: null as File | null,
        },
        validationSchema: updateProfileSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                let newAvatarUrl = session?.user?.avatarUrl;
                const isEmailChanged = values.email !== session?.user?.email;

                if (
                    values.fullName !== session?.user?.name ||
                    values.email !== session?.user?.email
                ) {
                    await updateProfileData({
                        fullName: values.fullName,
                        email: values.email,
                    });
                }

                if (values.avatar) {
                    const res = await updateProfileAvatar(values.avatar);
                    newAvatarUrl = res.data.avatarUrl || res.data.user.avatarUrl;
                }

                if (isEmailChanged) {
                    // SKENARIO A: Email Berubah -> Logout
                    toast.success("Email updated! Please verify your new email. Logging out...");

                    // Beri jeda sedikit agar user bisa membaca pesan toast sebelum redirect
                    setTimeout(async () => {
                        await signOut({
                            callbackUrl: "/auth/login", // Redirect ke login setelah logout
                            redirect: true
                        });
                    }, 2000);

                } else {
                    // SKENARIO B: Hanya Nama/Avatar Berubah -> Update Session di tempat
                    await updateSession({
                        name: values.fullName,
                        avatarUrl: newAvatarUrl,
                    });

                    toast.success("Profil berhasil diperbarui!");
                }

            } catch (error: any) {
                console.error(error);
                toast.error(error?.response?.data?.message || "Gagal memperbarui profil");
            } finally {
                setIsLoading(false);
            }
        },
    });

    // Isi form saat session data tersedia
    useEffect(() => {
        if (session?.user) {
            formik.setValues({
                fullName: session.user.name || "",
                email: session.user.email || "",
                avatar: null,
            });
            // Set preview awal dari session (avatarUrl)
            // Asumsi session.user.image menyimpan URL avatar
            setPreviewAvatar(session.user.avatarUrl || null);
        }
    }, [session]);

    // Handler khusus untuk perubahan input file
    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            formik.setFieldValue("avatar", file);
            // Buat preview lokal
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return {
        formik,
        isLoading,
        previewAvatar,
        handleAvatarChange,
    };
};