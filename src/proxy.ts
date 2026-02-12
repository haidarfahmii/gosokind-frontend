import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    console.log("🔐 Middleware - Path:", path, "Role:", token?.role);

    if (path === "/login" && token) {
      if (token.role === "SUPER_ADMIN") {
        console.log("✅ Redirecting Super Admin to dashboard");
        return NextResponse.redirect(
          new URL("/admin/super-admin/dashboard", req.url),
        );
      } else if (token.role === "OUTLET_ADMIN") {
        console.log("✅ Redirecting Outlet Admin to dashboard");
        return NextResponse.redirect(
          new URL("/admin/outlet-admin/dashboard", req.url),
        );
      }
    }

    if (path.startsWith("/admin/super-admin")) {
      if (token?.role !== "SUPER_ADMIN") {
        console.log("❌ Unauthorized access to Super Admin route");
        // Redirect non-super-admin to their own dashboard
        if (token?.role === "OUTLET_ADMIN") {
          return NextResponse.redirect(
            new URL("/admin/outlet-admin/dashboard", req.url),
          );
        }
        // For other roles, redirect to login
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    if (path.startsWith("/admin/outlet-admin")) {
      if (token?.role !== "OUTLET_ADMIN") {
        console.log("❌ Unauthorized access to Outlet Admin route");
        if (token?.role === "SUPER_ADMIN") {
          return NextResponse.redirect(
            new URL("/admin/super-admin/dashboard", req.url),
          );
        }
        // For other roles, redirect to login
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    // If someone accesses /admin directly, redirect based on role
    if (path === "/admin" && token) {
      if (token.role === "SUPER_ADMIN") {
        return NextResponse.redirect(
          new URL("/admin/super-admin/dashboard", req.url),
        );
      } else if (token.role === "OUTLET_ADMIN") {
        return NextResponse.redirect(
          new URL("/admin/outlet-admin/dashboard", req.url),
        );
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname;

        // Allow access to login page without token
        if (path === "/auth/login") {
          return true;
        }

        // Protect all admin routes - require authentication
        if (path.startsWith("/admin")) {
          return !!token;
        }

        // Allow public routes
        return true;
      },
    },
  },
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/auth/login",
    // Add other protected routes here
  ],
};
