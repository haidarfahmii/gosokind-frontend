import { cn } from "@/lib/utils";

interface OrderStatusBadgeProps {
    status: string;
    className?: string;
}

// Export fungsi helper jika sewaktu-waktu dibutuhkan di luar komponen
export const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
        WAITING_FOR_PICKUP: "Menunggu Kurir",
        PICKUP_ON_THE_WAY: "Kurir Menuju Lokasi",
        ARRIVED_AT_OUTLET: "Sampai di Outlet",
        WASHING: "Sedang Dicuci",
        IRONING: "Sedang Disetrika",
        PACKING: "Sedang Dipacking",
        WAITING_FOR_PAYMENT: "Menunggu Pembayaran",
        READY_FOR_DELIVERY: "Siap Dikirim",
        DELIVERY_ON_THE_WAY: "Kurir Mengirim Balik",
        RECEIVED_BY_CUSTOMER: "Diterima Pelanggan",
        COMPLETED: "Selesai",
    };
    return statusMap[status] || status;
};

export const getStatusColor = (status: string) => {
    switch (status) {
        case "WAITING_FOR_PICKUP":
        case "PICKUP_ON_THE_WAY":
        case "WAITING_FOR_PAYMENT":
            return "bg-orange-100 text-orange-700";
        case "ARRIVED_AT_OUTLET":
        case "WASHING":
        case "IRONING":
        case "PACKING":
            return "bg-blue-100 text-blue-700";
        case "READY_FOR_DELIVERY":
        case "DELIVERY_ON_THE_WAY":
            return "bg-indigo-100 text-indigo-700";
        case "RECEIVED_BY_CUSTOMER":
        case "COMPLETED":
            return "bg-green-100 text-green-700";
        default:
            return "bg-slate-100 text-slate-700";
    }
};

export default function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
    return (
        <span
            className={cn(
                "text-[10px] px-2.5 py-1 rounded-full font-bold w-fit",
                getStatusColor(status),
                className
            )}
        >
            {getStatusLabel(status)}
        </span>
    );
}