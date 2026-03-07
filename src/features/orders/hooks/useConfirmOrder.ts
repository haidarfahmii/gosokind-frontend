import { useState } from "react";
import { toast } from "react-toastify";
import { confirmOrderService } from "../services/order.service";

interface UseConfirmOrderProps {
    onSuccess?: () => void;
}

export const useConfirmOrder = ({ onSuccess }: UseConfirmOrderProps = {}) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirmOrder = async (orderId: string) => {
        // Konfirmasi dialog sederhana browser (opsional)
        if (!confirm("Apakah Anda yakin pesanan sudah diterima dan sesuai?")) return;

        setIsLoading(true);
        try {
            await confirmOrderService.confirmDelivery(orderId);

            toast.success("Pesanan berhasil diselesaikan! Terima kasih.");

            if (onSuccess) {
                onSuccess();
            }
        } catch (error: any) {
            console.error("Confirm Order Error:", error);
            const errorMessage = error?.response?.data?.message || "Gagal mengonfirmasi pesanan";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        handleConfirmOrder,
        isLoading,
    };
};