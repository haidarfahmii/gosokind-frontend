import axiosInstance from "@/utils/axiosInstance";

// Tipe data untuk payload berdasarkan backend Anda
export interface AddressPayload {
    label: string;
    address: string;
    latitude: number;
    longitude: number;
    isPrimary?: boolean;
}

export const addressService = {
    // Ambil semua alamat
    getAll: async () => {
        const response = await axiosInstance.get("/addresses");
        return response.data;
    },

    // Ambil detail satu alamat
    getOne: async (id: string) => {
        const response = await axiosInstance.get(`/addresses/${id}`);
        return response.data;
    },

    // Buat alamat baru
    create: async (data: AddressPayload) => {
        const response = await axiosInstance.post("/addresses", data);
        return response.data;
    },

    // Update alamat
    update: async (id: string, data: Partial<AddressPayload>) => {
        const response = await axiosInstance.patch(`/addresses/${id}`, data);
        return response.data;
    },

    // Set alamat jadi primary (shortcut)
    setPrimary: async (id: string) => {
        const response = await axiosInstance.patch(`/addresses/${id}/primary`);
        return response.data;
    },

    // Hapus alamat
    delete: async (id: string) => {
        const response = await axiosInstance.delete(`/addresses/${id}`);
        return response.data;
    },
};