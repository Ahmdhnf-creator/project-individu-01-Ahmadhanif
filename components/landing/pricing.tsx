import Link from "next/link";
import { CheckIcon } from "./icons";
import { Reveal } from "./reveal";

type Plan = {
  name: string;
  price: string;
  desc: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
};

const plans: Plan[] = [
  {
    name: "FREE",
    price: "Rp0",
    desc: "Untuk mencoba OrderKu",
    features: ["Maksimal 20 order/bulan"],
    cta: "Coba Gratis",
  },
  {
    name: "STARTER",
    price: "Rp39.000",
    desc: "Untuk UMKM yang mulai serius",
    features: ["Produk unlimited", "Customer", "Order", "Dashboard", "Laporan dasar"],
    cta: "Mulai Sekarang",
    highlighted: true,
  },
  {
    name: "PRO",
    price: "Rp79.000",
    desc: "Untuk usaha dengan order lebih ramai",
    features: ["Semua fitur Starter", "Laporan lebih lengkap", "Staff", "Fitur tambahan"],
    cta: "Mulai Sekarang",
  },
];

export function Pricing() {
  return (
    <div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {plans.map((p, i) => (
          <Reveal key={p.name} delay={i * 90} className="h-full">
            <div
              className={`relative flex h-full flex-col rounded-[20px] border bg-white p-6 text-left sm:p-7 ${
                p.highlighted
                  ? "border-[#2563EB] shadow-[0_28px_60px_-30px_rgba(37,99,235,0.55)] ring-1 ring-[#2563EB]/20 md:-translate-y-3"
                  : "border-[#E2E8F0] shadow-[0_24px_60px_-40px_rgba(15,23,42,0.5)]"
              }`}
            >
              {p.highlighted && (
                <span className="absolute -top-3 left-6 inline-flex items-center rounded-full bg-[#2563EB] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white shadow-[0_10px_24px_-12px_rgba(37,99,235,0.9)]">
                  Paling populer
                </span>
              )}

              <span
                className={`text-[13px] font-extrabold uppercase tracking-[0.12em] ${
                  p.highlighted ? "text-[#2563EB]" : "text-[#64748B]"
                }`}
              >
                {p.name}
              </span>

              <p className="mt-4 flex items-baseline gap-1.5">
                <span className="text-[34px] font-extrabold leading-none tracking-tight text-[#0F172A]">
                  {p.price}
                </span>
                <span className="text-[13px] font-medium text-[#64748B]">/ bulan</span>
              </p>

              <p className="mt-2 text-sm leading-6 text-[#64748B]">{p.desc}</p>

              <ul className="mt-5 space-y-3 border-t border-[#E2E8F0] pt-5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm leading-6 text-[#0F172A]">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ECFDF5] text-[#16A34A]">
                      <CheckIcon className="h-3 w-3" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={`/billing/checkout?plan=${p.name}`}
                className={`mt-6 inline-flex h-12 w-full items-center justify-center rounded-[12px] text-[15px] font-bold transition-colors ${
                  p.highlighted
                    ? "bg-[#2563EB] text-white shadow-[0_14px_30px_-14px_rgba(37,99,235,0.9)] hover:bg-[#1D4ED8]"
                    : "border border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAFC]"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          </Reveal>
        ))}
      </div>

      <p className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-[13px] text-[#64748B]">
        <span>Tanpa biaya setup</span>
        <span aria-hidden="true" className="hidden sm:inline">
          ·
        </span>
        <span>Bisa mulai dari paket gratis</span>
      </p>
    </div>
  );
}
