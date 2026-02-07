"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Bell, User, LogOut, ChevronDown } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMenuByRole } from "@/config/navigation";
import { usePathname } from "next/navigation";
import { useOutletFilter } from "@/hooks/useOutletFilter";
import { EmployeeRole } from "@/@types/employee.types";

export default function DashboardHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // State untuk outlet selection
  const { selectedOutletId, setSelectedOutletId, outlets, loadingOutlets } =
    useOutletFilter();

  // State untuk user menu dropdown
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);

  const user = session?.user;
  const role = session?.user?.role;
  const menuGroups = role ? getMenuByRole(role) : [];
  const isSuperAdmin = role === EmployeeRole.SUPER_ADMIN;

  return (
    <header className="h-20 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
      {/* Left Section: Outlet Switcher */}
      <div className="flex items-center gap-4">
        {(isSuperAdmin || role === EmployeeRole.OUTLET_ADMIN) && (
          <>
            <div className="hidden md:flex flex-col">
              <span className="text-xs text-slate-500 font-medium">
                {isSuperAdmin
                  ? "Global Outlet Filter (All Dashboards)"
                  : "Current Outlet"}
              </span>
              <Select
                value={selectedOutletId}
                onValueChange={setSelectedOutletId}
                disabled={loadingOutlets}
              >
                <SelectTrigger className="w-56 border-none shadow-none font-bold text-slate-800 p-0 h-auto focus:ring-0">
                  <SelectValue placeholder="Loading outlets..." />
                </SelectTrigger>
                <SelectContent>
                  {isSuperAdmin && (
                    <SelectItem value="all">
                      <span className="font-semibold text-blue-600">
                        🌐 All Outlets (Global View)
                      </span>
                    </SelectItem>
                  )}
                  {outlets.map((outlet) => (
                    <SelectItem key={outlet.id} value={outlet.id}>
                      📍 {outlet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="h-8 w-px bg-slate-200 hidden md:block mx-2"></div>
            <div className="flex items-center gap-2 text-slate-400">
              <Search className="w-4 h-4" />
              <Input
                placeholder="Global Search..."
                className="border-none shadow-none focus-visible:ring-0 w-64 bg-transparent placeholder:text-slate-400"
              />
            </div>
          </>
        )}
      </div>

      {/* Right Section: Notification & Profile with Dropdown */}
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
              <p className="text-xs text-slate-500">
                {user?.role || "Visitor"}
              </p>
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
                        {user?.role}
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
                    onClick={() => signOut({ callbackUrl: "/login" })}
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
