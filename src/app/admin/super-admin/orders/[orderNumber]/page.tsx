import { OrderDetailPageContent } from "@/features/order/components/order-detail/OrderDetailPageContent";

interface SuperAdminOrderDetailPageProps {
  params: Promise<{ orderNumber: string }>;
}

/**
 * Halaman Order Detail untuk Super Admin
 * Route: /admin/super-admin/orders/[orderNumber]
 */
export default async function SuperAdminOrderDetailPage({
  params,
}: SuperAdminOrderDetailPageProps) {
  const { orderNumber } = await params;

  return (
    <OrderDetailPageContent
      orderNumber={orderNumber}
      backHref="/admin/super-admin/orders"
      roleLabel="Super Admin"
    />
  );
}
