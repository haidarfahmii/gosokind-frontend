import { ReactNode } from "react";
import Sidebar from "@/components/admin/Sidebar";
import OutletAdminDashboardHeader from "@/components/admin/outlet-admin/DashboardHeader";

export default function OutletAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50/50 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64 relative">
        <OutletAdminDashboardHeader />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto h-[calc(100vh-5rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
