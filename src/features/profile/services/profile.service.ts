import axiosInstance from "@/utils/axiosInstance";

export const updateProfileData = async (data: { fullName: string; email: string }) => {
    try {
        const response = await axiosInstance.patch("/profile/update", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateProfileAvatar = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append("avatar", file); // Key harus "avatar" sesuai middleware multer di backend

        const response = await axiosInstance.patch("/profile/avatar", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const changePassword = async (data: { currentPassword: string; newPassword: string }) => {
    try {
        const response = await axiosInstance.patch("/profile/change-password", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};