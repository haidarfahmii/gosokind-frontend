"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Bell, Menu, LogOut, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { outletService } from "@/features/super-admin/outlet/services/outlet.service";
import { toast } from "react-toastify";

interface OutletInfo {
  id: string;
  name: string;
  city?: string | null;
  province?: string | null;
}

export default function OutletAdminDashboardHeader() {
  const { data: session } = useSession();
  const [outletInfo, setOutletInfo] = useState<OutletInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch outlet info dari backend
  useEffect(() => {
    const fetchOutletInfo = async () => {
      try {
        setLoading(true);

        // Backend akan otomatis return outlet sesuai outletId dari token
        // Karena outlet admin hanya punya 1 outlet
        const response = await outletService.getAllOutlets();

        if (response.success && response.data && response.data.length > 0) {
          // Outlet admin seharusnya hanya dapat 1 outlet
          setOutletInfo(response.data[0]);
        }
      } catch (error: any) {
        console.error("Failed to fetch outlet info:", error);
        toast.error("Failed to load outlet information");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.role === "OUTLET_ADMIN") {
      fetchOutletInfo();
    }
  }, [session]);

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/auth/login" });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 md:h-20 border-b bg-white flex items-center justify-between px-4 md:px-8">
      {/* Left Section - Outlet Info */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>

        {/* Outlet Info */}
        <div>
          <h2 className="text-sm md:text-base font-semibold text-slate-800">
            {loading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              outletInfo?.name || "Outlet"
            )}
          </h2>
          {!loading && outletInfo && (
            <p className="text-xs text-slate-500">
              {outletInfo.city && outletInfo.province
                ? `${outletInfo.city}, ${outletInfo.province}`
                : "Location not set"}
            </p>
          )}
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-slate-100"
            >
              <Bell className="h-5 w-5 text-slate-600" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-96 overflow-y-auto">
              <div className="p-4 hover:bg-slate-50 cursor-pointer">
                <p className="text-sm font-medium">New Order #1234</p>
                <p className="text-xs text-slate-500 mt-1">
                  Customer: John Doe - 5 items
                </p>
                <p className="text-xs text-blue-600 mt-1">2 minutes ago</p>
              </div>
              <DropdownMenuSeparator />
              <div className="p-4 hover:bg-slate-50 cursor-pointer">
                <p className="text-sm font-medium">Employee Request</p>
                <p className="text-xs text-slate-500 mt-1">
                  Sarah needs approval for overtime
                </p>
                <p className="text-xs text-blue-600 mt-1">1 hour ago</p>
              </div>
              <DropdownMenuSeparator />
              <div className="p-4 hover:bg-slate-50 cursor-pointer">
                <p className="text-sm font-medium">Low Stock Alert</p>
                <p className="text-xs text-slate-500 mt-1">
                  Detergent stock is running low
                </p>
                <p className="text-xs text-blue-600 mt-1">3 hours ago</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-blue-600 font-medium">
              View All Notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {session?.user?.name?.charAt(0).toUpperCase() || "O"}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-slate-700">
                  {session?.user?.name || "Outlet Admin"}
                </p>
                <p className="text-xs text-slate-500">Outlet Admin</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 focus:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
