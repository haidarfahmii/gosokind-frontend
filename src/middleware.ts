import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    // 1. Ambil token session dari cookies
    // Pastikan NEXTAUTH_SECRET di .env sudah diisi sama dengan yang di route.ts
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
    });

    const { pathname } = req.nextUrl;

    // 2. Cek apakah user sudah login (token ada) DAN sedang mengakses halaman /auth
    if (token && pathname.startsWith("/auth")) {
        // Jika ya, tendang mereka ke halaman Home ("/")
        return NextResponse.redirect(new URL("/", req.url));
    }

    // Lanjutkan request jika tidak memenuhi kondisi di atas
    return NextResponse.next();
}

// 3. Konfigurasi Matcher: Tentukan route mana saja yang akan dipantau oleh middleware ini
export const config = {
    matcher: [
        // Pantau semua route di dalam /auth (login, register, verify, dll)
        "/auth/:path*",

        // (Opsional) Jika kamu ingin memprotect dashboard juga, tambahkan disini:
        // "/member/:path*", 
    ],
};