import { useState } from "react";
import { paymentService } from "../services/order.service";
import { toast } from "react-toastify";

export const usePayment = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handlePayment = async (orderId: string) => {
        try {
            setIsLoading(true);
            const response = await paymentService.createPayment(orderId);

            if (response.success && response.data.paymentUrl) {
                // Redirect user ke halaman Midtrans
                // window.location.href = response.data.paymentUrl;

                // Alternatif jika ingin buka di tab baru:
                window.open(response.data.paymentUrl, '_blank');
            }
        } catch (error: any) {
            console.error("Payment Error:", error);
            const errorMessage = error.response?.data?.message || "Gagal memproses pembayaran";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        handlePayment,
        isLoading,
    };
};