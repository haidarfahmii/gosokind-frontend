"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { getMenuByRole, SidebarGroup, SidebarItem } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { formatRole } from "@/utils/formatters";

const SidebarItemComponent = ({
  item,
  isActive,
}: {
  item: SidebarItem;
  isActive: boolean;
}) => {
  return (
    <Link href={item.href}>
      <div
        className={cn(
          "flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-colors",
          isActive
            ? "bg-blue-600 text-white"
            : "text-slate-500 hover:bg-slate-100",
        )}
      >
        <div className="flex items-center gap-3">
          <item.icon size={20} />
          <span className="font-medium text-sm">{item.label}</span>
        </div>
        {item.alert && (
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        )}
      </div>
    </Link>
  );
};

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Ambil role user dari session
  const userRole = session?.user?.role || "";
  const menuGroups: SidebarGroup[] = getMenuByRole(userRole);

  return (
    <aside className="w-64 bg-white border-r hidden lg:flex flex-col fixed h-full z-20">
      {/* Logo Header */}
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">G</span>
        </div>
        <span className="text-xl font-bold text-slate-800">Gosokind</span>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            {/* Label Group */}
            {group.group && (
              <h3 className="mb-2 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {group.group}
              </h3>
            )}

            <div className="space-y-1">
              {group.items.map((item, itemIndex) => {
                // Logic active state: exact match atau startsWith untuk sub-menu
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <SidebarItemComponent
                    key={itemIndex}
                    item={item}
                    isActive={isActive}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Info / Bottom Section */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500">
            Logged in as:{" "}
            <span className="font-semibold text-slate-700">
              {formatRole(userRole)}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
