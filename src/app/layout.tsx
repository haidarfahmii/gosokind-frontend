import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import NextAuthProvider from "@/providers/NextAuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gosokind | Aplikasi Penjadwalan Laundry & Setrika Terpercaya",
  description:
    "Gosokind adalah solusi modern untuk kebutuhan cuci dan setrika Anda. Jadwalkan layanan antar jemput laundry dengan mudah, biarkan pakaian Anda rapi tanpa repot.",
  keywords: [
    "Gosokind",
    "aplikasi laundry",
    "laundry antar jemput",
    "jasa setrika",
    "cuci lipat",
    "laundry terdekat",
    "jadwal laundry",
    "setrika pakaian",
    "laundry profesional",
  ],
  openGraph: {
    title: "Gosokind | Solusi Pakaian Rapi Tanpa Repot",
    description:
      "Serahkan urusan setrika dan cuci pakaian Anda kepada ahlinya. Jadwalkan penjemputan dan pengantaran laundry Anda dengan mudah melalui Gosokind sekarang juga!",
    url: "https://gosokind-frontend.vercel.app/", // Hapus komentar ini jika Anda sudah memiliki domain
    siteName: "Gosokind",
    images: [
      {
        url: "/images/gosokind-logo.png", // Pastikan Anda memiliki gambar ini di folder public/images/
        width: 1200,
        height: 630,
        alt: "Aplikasi Laundry Gosokind",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gosokind | Penjadwalan Laundry & Setrika",
    description:
      "Jadwalkan layanan laundry dan setrika Anda dengan fleksibel melalui Gosokind. Pakaian Anda dijamin bersih, rapi, dan wangi tahan lama.",
    // images: ["https://gosokind.com/images/gosokind-banner.jpg"], // Hapus komentar jika sudah ada URL aktif
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthProvider>
          {children}
          <ToastContainer position="bottom-right" />
        </NextAuthProvider>
      </body>
    </html>
  );
}
