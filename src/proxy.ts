import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getDefaultDashboard } from "@/config/navigation";

const WORKER_ROLES = ["WORKER_WASHING", "WORKER_IRONING", "WORKER_PACKING"];
const EMPLOYEE_ROLES = [...WORKER_ROLES, "DRIVER"];
const ADMIN_ROLES = ["SUPER_ADMIN", "OUTLET_ADMIN"];
const ALL_STAFF_ROLES = [...ADMIN_ROLES, ...EMPLOYEE_ROLES];

const CUSTOMER_PROTECTED_ROUTES = ["/home", "/profile", "/orders"];

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const role = token?.role as string | undefined;

    // employee login page
    if (path === "/auth/employee/login") {
      if (token && role) {
        // Customer yang nyasar ke sini → ke /home
        if (role === "CUSTOMER") {
          return NextResponse.redirect(new URL("/home", req.url));
        }
        // Staff → ke dashboard masing-masing
        if (ALL_STAFF_ROLES.includes(role)) {
          return NextResponse.redirect(
            new URL(getDefaultDashboard(role), req.url),
          );
        }
      }
      // Belum login → biarkan lewat (halaman login)
      return NextResponse.next();
    }

    // jika sudah login, redirect ke tempat yang sesuai
    if (path.startsWith("/auth") && token && role) {
      if (role === "CUSTOMER") {
        return NextResponse.redirect(new URL("/home", req.url));
      }
      if (ALL_STAFF_ROLES.includes(role)) {
        return NextResponse.redirect(
          new URL(getDefaultDashboard(role), req.url),
        );
      }
    }

    // Customer Protected Routes
    const isCustomerProtected = CUSTOMER_PROTECTED_ROUTES.some((route) =>
      path.startsWith(route),
    );

    if (isCustomerProtected) {
      // Belum login → redirect ke halaman login customer
      if (!token) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
      // Staff tidak boleh akses halaman customer → redirect ke dashboard mereka
      if (role && ALL_STAFF_ROLES.includes(role)) {
        return NextResponse.redirect(
          new URL(getDefaultDashboard(role), req.url),
        );
      }
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

    // Lanjutkan request jika aman
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname;
        // Semua halaman /auth selalu boleh diakses tanpa login
        if (path.startsWith("/auth")) return true;

        // Route staff wajib login; jika tidak ada token, next-auth otomatis
        // menolak dan memanggil halaman signIn
        if (path.startsWith("/admin") || path.startsWith("/employee")) {
          return !!token;
        }

        // Customer protected routes & semua route lain: biarkan lewat,
        // redirect diurus oleh fungsi proxy di atas
        return true;
      },
    },
  },
);

export const config = {
  matcher: [
    // Staff routes
    "/admin/:path*",
    "/employee/:path*",
    // Auth routes
    "/auth/login",
    "/auth/employee/login",
    "/auth/register/:path*",
    "/auth/verify-email/:path*",
    "/auth/forgot-password/:path*",
    "/auth/reset-password/:path*",
    // Customer protected routes
    "/home/:path*",
    "/profile/:path*",
    "/orders/:path*",
  ],
};
