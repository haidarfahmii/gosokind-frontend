import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getDefaultDashboard } from "@/config/navigation";

const WORKER_ROLES = ["WORKER_WASHING", "WORKER_IRONING", "WORKER_PACKING"];
const EMPLOYEE_ROLES = [...WORKER_ROLES, "DRIVER"];
const ADMIN_ROLES = ["SUPER_ADMIN", "OUTLET_ADMIN"];
const ALL_STAFF_ROLES = [...ADMIN_ROLES, ...EMPLOYEE_ROLES];

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const role = token?.role as string | undefined;

    // customer login page
    if (path === "/auth/login" && token && role) {
      return NextResponse.redirect(new URL(getDefaultDashboard(role), req.url));
    }

    // employee login page
    if (path === "/auth/employee/login") {
      if (token && role) {
        // If a CUSTOMER lands here after login, send them to customer home
        if (role === "CUSTOMER") {
          return NextResponse.redirect(new URL("/", req.url));
        }
        // Staff members go to their own dashboard
        if (ALL_STAFF_ROLES.includes(role)) {
          return NextResponse.redirect(
            new URL(getDefaultDashboard(role), req.url),
          );
        }
      }
      // Unauthenticated users are allowed through (they need to log in)
      return NextResponse.next();
    }

    // Super Admin route guard
    if (path.startsWith("/admin/super-admin")) {
      if (role !== "SUPER_ADMIN") {
        if (role === "OUTLET_ADMIN")
          return NextResponse.redirect(
            new URL("/admin/outlet-admin/dashboard", req.url),
          );
        if (role && EMPLOYEE_ROLES.includes(role)) {
          return NextResponse.redirect(new URL("/employee/dashboard", req.url));
        }
        return NextResponse.redirect(new URL("/auth/employee/login", req.url));
      }
    }

    // Outlet Admin route guard
    if (path.startsWith("/admin/outlet-admin")) {
      if (role !== "OUTLET_ADMIN") {
        if (role === "SUPER_ADMIN")
          return NextResponse.redirect(
            new URL("/admin/super-admin/dashboard", req.url),
          );
        if (role && EMPLOYEE_ROLES.includes(role)) {
          return NextResponse.redirect(new URL("/employee/dashboard", req.url));
        }
        return NextResponse.redirect(new URL("/auth/employee/login", req.url));
      }
    }

    // Employee (Worker / Driver) route guard
    if (path.startsWith("/employee")) {
      if (!role || !EMPLOYEE_ROLES.includes(role)) {
        if (role === "SUPER_ADMIN") {
          return NextResponse.redirect(
            new URL("/admin/super-admin/dashboard", req.url),
          );
        }
        if (role === "OUTLET_ADMIN") {
          return NextResponse.redirect(
            new URL("/admin/outlet-admin/dashboard", req.url),
          );
        }
        return NextResponse.redirect(new URL("/auth/employee/login", req.url));
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
        if (
          path === "/auth/login" ||
          path === "/auth/employee/login" ||
          path.startsWith("/auth/register") ||
          path.startsWith("/auth/verify-email") ||
          path.startsWith("/auth/forgot-password") ||
          path.startsWith("/auth/reset-password")
        ) {
          return true;
        }
        if (path.startsWith("/admin") || path.startsWith("/employee")) {
          return !!token;
        }
        return true;
      },
    },
  },
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/employee/:path*",
    "/auth/login",
    "/auth/employee/login",
  ],
};
