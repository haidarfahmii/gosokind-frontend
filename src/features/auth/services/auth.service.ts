// Pastikan Anda sudah punya axiosInstance, jika belum buat di src/lib/axios.ts
import axiosInstance from "@/utils/axiosInstance";
import { RegisterFormValues } from "@/@types";

export const authService = {
    async register(data: RegisterFormValues) {
        // Sesuai controller backend Gosokind yang hanya menerima email
        const response = await axiosInstance.post("/auth/register", {
            email: data.email,
        });
        return response.data;
    },
};