import SidebarLayout from "@/components/admin/SidebarLayout";
import { OutletFilterProvider } from "@/contexts/OutletFilterContext";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OutletFilterProvider>
      <SidebarLayout>{children}</SidebarLayout>
    </OutletFilterProvider>
  );
}
