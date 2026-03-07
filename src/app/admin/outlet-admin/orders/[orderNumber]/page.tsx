import { OrderDetailPageContent } from "@/features/order/components/order-detail/OrderDetailPageContent";

interface OutletAdminOrderDetailPageProps {
  params: Promise<{ orderNumber: string }>;
}

/**
 * Halaman Order Detail untuk Outlet Admin
 * Route: /admin/outlet-admin/orders/[orderNumber]
 */
export default async function OutletAdminOrderDetailPage({
  params,
}: OutletAdminOrderDetailPageProps) {
  const { orderNumber } = await params;

  return (
    <OrderDetailPageContent
      orderNumber={orderNumber}
      backHref="/admin/outlet-admin/orders"
      roleLabel="Outlet Admin"
    />
  );
}
