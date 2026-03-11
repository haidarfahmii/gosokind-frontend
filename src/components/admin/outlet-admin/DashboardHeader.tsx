"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Bell, Menu, LogOut, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { outletService } from "@/features/super-admin/outlet/services/outlet.service";
import { getMenuByRole } from "@/config/navigation";
import { formatRole } from "@/utils/formatters";
import { toast } from "react-toastify";

interface OutletInfo {
  id: string;
  name: string;
  city?: string | null;
  province?: string | null;
}

export default function OutletAdminDashboardHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // State untuk Outlet Info
  const [outletInfo, setOutletInfo] = useState<OutletInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // State untuk user menu dropdown (Sama seperti Super Admin)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);

  const user = session?.user;
  const role = session?.user?.role;
  const menuGroups = role ? getMenuByRole(role) : [];

  // Fetch outlet info dari backend
  useEffect(() => {
    const fetchOutletInfo = async () => {
      try {
        setLoading(true);
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

      {/* Right Section - Notifications & Profile */}
      <div className="flex items-center gap-6">
        {/* Notification */}
        <div className="relative cursor-pointer">
          <Bell className="w-5 h-5 text-slate-500 hover:text-indigo-600" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </div>

        {/* User Profile with Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-lg transition-all"
          >
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-slate-800">
                {user?.name || "Guest"}
              </p>
              <p className="text-xs text-slate-500">{formatRole(user?.role)}</p>
            </div>
            <Avatar>
              <AvatarImage
                src={user?.avatarUrl || "https://github.com/shadcn.png"}
              />
              <AvatarFallback className="bg-slate-200 text-slate-600">
                <User size={20} />
              </AvatarFallback>
            </Avatar>
            <ChevronDown
              size={14}
              className={`text-slate-400 transition-transform duration-200 hidden md:block ${
                isUserMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Content */}
          {isUserMenuOpen && (
            <>
              {/* Overlay to close dropdown */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsUserMenuOpen(false)}
              ></div>

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={user?.avatarUrl || "https://github.com/shadcn.png"}
                      />
                      <AvatarFallback className="bg-slate-200 text-slate-600">
                        <User size={20} />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {user?.email}
                      </p>
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-sm mt-1 inline-block font-medium">
                        {formatRole(user?.role)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu Items from Navigation Config */}
                <div className="py-2">
                  {menuGroups.map((group, groupIndex) => (
                    <div key={groupIndex}>
                      {/* Group Label */}
                      <div className="px-4 py-2">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          {group.group}
                        </h3>
                      </div>

                      {/* Group Items */}
                      <div className="px-2 space-y-1">
                        {group.items.map((item, itemIndex) => {
                          const Icon = item.icon;
                          const isActive =
                            pathname === item.href ||
                            pathname.startsWith(item.href + "/");

                          return (
                            <Link
                              key={itemIndex}
                              href={item.href}
                              className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all ${
                                isActive
                                  ? "bg-blue-50 text-blue-600 font-medium"
                                  : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                              }`}
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Icon size={16} className="shrink-0" />
                              <span className="truncate">{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>

                      {/* Separator between groups */}
                      {groupIndex < menuGroups.length - 1 && (
                        <div className="my-2 border-t border-slate-100"></div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Logout Button */}
                <div className="border-t border-slate-100 px-2 pt-2">
                  <button
                    onClick={() =>
                      signOut({ callbackUrl: "/auth/employee/login" })
                    }
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left font-medium"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
