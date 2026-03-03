import axiosInstance from "@/utils/axiosInstance";

interface PaymentResponse {
    success: boolean;
    message: string;
    data: {
        orderId: string;
        paymentUrl: string;
    };
}

export const paymentService = {
    async createPayment(orderId: string): Promise<PaymentResponse> {
        const response = await axiosInstance.post(`/payment/${orderId}/pay`);
        return response.data;
    },
};