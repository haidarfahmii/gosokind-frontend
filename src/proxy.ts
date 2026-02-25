import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getDefaultDashboard } from "@/config/navigation";

const WORKER_ROLES = ["WORKER_WASHING", "WORKER_IRONING", "WORKER_PACKING"];
const EMPLOYEE_ROLES = [...WORKER_ROLES, "DRIVER"];

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const role = token?.role as string | undefined;

    if (path === "/auth/login" && token && role) {
      return NextResponse.redirect(new URL(getDefaultDashboard(role), req.url));
    }

    // Super Admin route guard
    if (path.startsWith("/admin/super-admin")) {
      if (role !== "SUPER_ADMIN") {
        if (role === "OUTLET_ADMIN")
          return NextResponse.redirect(
            new URL("/admin/outlet-admin/dashboard", req.url),
          );
        if (role && EMPLOYEE_ROLES.includes(role))
          return NextResponse.redirect(new URL("/employee/dashboard", req.url));
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
    }

    // Outlet Admin route guard
    if (path.startsWith("/admin/outlet-admin")) {
      if (role !== "OUTLET_ADMIN") {
        if (role === "SUPER_ADMIN")
          return NextResponse.redirect(
            new URL("/admin/super-admin/dashboard", req.url),
          );
        if (role && EMPLOYEE_ROLES.includes(role))
          return NextResponse.redirect(new URL("/employee/dashboard", req.url));
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
    }

    // Employee (Worker / Driver) route guard
    if (path.startsWith("/employee")) {
      if (!role || !EMPLOYEE_ROLES.includes(role)) {
        if (role === "SUPER_ADMIN")
          return NextResponse.redirect(
            new URL("/admin/super-admin/dashboard", req.url),
          );
        if (role === "OUTLET_ADMIN")
          return NextResponse.redirect(
            new URL("/admin/outlet-admin/dashboard", req.url),
          );
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
    }

    // Generic /admin redirect
    if (path === "/admin" && token && role) {
      return NextResponse.redirect(new URL(getDefaultDashboard(role), req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname;
        if (path === "/auth/login") return true;
        if (path.startsWith("/admin") || path.startsWith("/employee"))
          return !!token;
        return true;
      },
    },
  },
);

export const config = {
  matcher: ["/admin/:path*", "/employee/:path*", "/auth/login"],
};
