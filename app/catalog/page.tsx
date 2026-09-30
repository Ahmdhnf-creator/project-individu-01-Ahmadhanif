import Image from "next/image";
import { prisma } from "@/lib/prisma";
import flowCheckout from "@/public/image/landing/flow-checkout.png";
import CatalogClient from "./CatalogClient";

const trustChips = ["Tanpa login", "Pembayaran fleksibel", "Pesanan dipantau real-time"];

export default async function CatalogPage() {
  const products = await prisma.product.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } });
  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8 lg:px-12">
      {/* HERO / HEADER STOREFRONT */}
      <section className="grid grid-cols-1 items-center gap-8 py-12 md:py-14 lg:grid-cols-[3fr_2fr] lg:gap-12 lg:py-16">
        <div>
          <span className="inline-flex items-center rounded-full border border-[#2563EB]/15 bg-[#2563EB]/[0.06] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#2563EB]">
            Katalog Online
          </span>
          <h1 className="mt-4 text-[32px] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#0F172A] md:text-[40px]">
            Temukan yang kamu butuhkan.
          </h1>
          <p className="mt-3 max-w-xl text-[16px] leading-7 text-[#64748B]">
            Pesan produk, layanan, atau rental dengan mudah.
          </p>
          <p className="mt-1.5 max-w-xl text-sm leading-6 text-[#64748B]">
            Belanja sebagai tamu — cukup isi nama &amp; WhatsApp saat checkout.
          </p>

          <ul className="mt-6 flex flex-wrap gap-2.5">
            {trustChips.map((c) => (
              <li
                key={c}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#64748B] shadow-[0_6px_16px_-12px_rgba(15,23,42,0.5)]"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {c}
              </li>
            ))}
          </ul>
        </div>

        {/* Area mockup dekoratif */}
        <div className="relative">
          <div className="overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white shadow-[0_28px_64px_-40px_rgba(15,23,42,0.5)]">
            <div className="flex items-center gap-1.5 border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FCA5A5]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FCD34D]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#6EE7B7]" />
              <span className="ml-2 truncate rounded-[8px] bg-white px-2.5 py-1 text-[11px] text-[#94A3B8] ring-1 ring-[#E2E8F0]">
                toko-kamu.bulan-01.app
              </span>
            </div>
            <div className="p-3 sm:p-4">
              <Image
                src={flowCheckout}
                alt=""
                className="h-auto w-full rounded-[14px]"
              />
            </div>
          </div>

          <span className="absolute -bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-[#BBF7D0] bg-white px-3 py-1.5 text-xs font-bold text-[#16A34A] shadow-[0_12px_28px_-16px_rgba(15,23,42,0.5)] sm:left-6">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            Checkout tanpa login
          </span>
        </div>
      </section>

      {/* PRODUK + CART */}
      <div className="pb-16 md:pb-20">
        <CatalogClient products={products} customers={[]} isPelanggan={false} isGuest={true} />
      </div>
    </div>
  );
}
