"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Home, LogOut, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

/**
 * Employee Layout — Feature 3
 *
 * Merged into Feature 2's project. Key change:
 * - Feature 3 used `localStorage.getItem("token")` for auth check.
 * - Now uses `useSession()` from NextAuth (Feature 2's auth system).
 * - Logout calls `signOut()` instead of `localStorage.removeItem`.
 */
export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // NextAuth handles redirect via proxy.ts middleware; show loader during check
  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleLogout = () => signOut({ callbackUrl: "/auth/employee/login" });

  const navItems = [
    { href: "/employee/dashboard", label: "Dashboard", icon: Home },
    { href: "/employee/workfloor", label: "Workfloor", icon: Briefcase },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r h-screen fixed left-0 top-0 z-10">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-primary">Gosokind</h1>
          <p className="text-xs text-gray-500 mt-1">
            {session?.user?.name || "Employee"}
          </p>
          <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-sm mt-1 inline-block font-medium">
            {session?.user?.role?.replace(/_/g, " ")}
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link key={href} href={href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b p-4 flex justify-between items-center sticky top-0 z-10">
        <div>
          <span className="font-bold text-lg">Gosokind</span>
          <span className="ml-2 text-xs text-gray-500">
            {session?.user?.role?.replace(/_/g, " ")}
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-5 w-5 text-red-500" />
        </Button>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 pb-24 md:p-8">{children}</main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3 z-10">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center space-y-1 ${
                isActive ? "text-primary" : "text-gray-500"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
