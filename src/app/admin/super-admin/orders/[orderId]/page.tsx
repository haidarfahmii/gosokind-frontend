import { OrderDetailPageContent } from "@/features/order/components/order-detail/OrderDetailPageContent";

interface SuperAdminOrderDetailPageProps {
  params: Promise<{ orderId: string }>;
}

/**
 * Halaman Order Detail untuk Super Admin
 * Route: /admin/super-admin/orders/[orderId]
 */
export default async function SuperAdminOrderDetailPage({
  params,
}: SuperAdminOrderDetailPageProps) {
  const { orderId } = await params;

  return (
    <OrderDetailPageContent
      orderId={orderId}
      backHref="/admin/super-admin/orders"
      roleLabel="Super Admin"
    />
  );
}
