// src/middleware.ts (sebelumnya src/proxy.ts)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
    // 1. Ambil token session dari cookies
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
    });

    const { pathname } = req.nextUrl;

    // 2. Jika user SUDAH login dan mencoba mengakses halaman auth (login/register)
    if (token && pathname.startsWith("/auth")) {
        // Tendang mereka ke halaman /home
        return NextResponse.redirect(new URL("/home", req.url));
    }

    // 3. Daftar route yang memerlukan autentikasi (Protected Routes)
    const isProtectedRoute =
        pathname.startsWith("/home") ||
        pathname.startsWith("/profile") ||
        pathname.startsWith("/orders");

    // 4. Jika user BELUM login (tidak ada token) dan mengakses halaman protected
    if (!token && isProtectedRoute) {

        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Lanjutkan request jika aman
    return NextResponse.next();
}

// 5. Konfigurasi Matcher: Tentukan route mana saja yang dipantau oleh middleware
export const config = {
    matcher: [
        "/auth/:path*",
        "/home/:path*",
        "/profile/:path*",
        "/orders/:path*"
    ],
};