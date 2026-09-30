import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OrderKu - Kelola Pesanan UMKM Lebih Mudah",
  description: "Order Management untuk UMKM Indonesia — produk, pelanggan, pesanan, dan laporan dalam satu dashboard.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${plusJakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F8FAFC] font-sans text-[#0F172A]">{children}</body>
    </html>
  );
}
