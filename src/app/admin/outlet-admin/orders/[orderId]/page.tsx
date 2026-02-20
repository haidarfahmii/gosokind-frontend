import { OrderDetailPageContent } from "@/features/order/components/order-detail/OrderDetailPageContent";

interface OutletAdminOrderDetailPageProps {
  params: Promise<{ orderId: string }>;
}

/**
 * Halaman Order Detail untuk Outlet Admin
 * Route: /admin/outlet-admin/orders/[orderId]
 */
export default async function OutletAdminOrderDetailPage({
  params,
}: OutletAdminOrderDetailPageProps) {
  const { orderId } = await params;

  return (
    <OrderDetailPageContent
      orderId={orderId}
      backHref="/admin/outlet-admin/orders"
      roleLabel="Outlet Admin"
    />
  );
}
