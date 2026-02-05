// Pastikan Anda sudah punya axiosInstance, jika belum buat di src/lib/axios.ts
import axiosInstance from "@/utils/axiosInstance";
import { RegisterFormValues, VerifyFormValues } from "@/@types";

export const authService = {
    async register(data: RegisterFormValues) {
        // Sesuai controller backend Gosokind yang hanya menerima email
        const response = await axiosInstance.post("/auth/register", {
            email: data.email,
        });
        return response.data;
    },

    async verify(data: VerifyFormValues) {
        const { token, ...body } = data;
        // Backend mengharapkan body: { fullName, password } Dan Header: Authorization: Bearer <token>
        const response = await axiosInstance.post("/auth/verify", body, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    async checkVerifyToken(token: string) {
        const response = await axiosInstance.get("/auth/verify-token", {
            headers: {
                Authorization: `Bearer ${token}` // Kirim token via header
            },
            skipAuthRedirect: true,
        } as any);
        return response.data;
    }
};