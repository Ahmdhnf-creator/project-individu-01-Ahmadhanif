import Image from "next/image";
import heroOwner from "@/public/image/landing/hero-owner.png";
import { Badge } from "@/components/ui/badge";
import { LogoMark } from "./logo";

const recentOrders = [
  { id: "#ORD-0066", amount: "Rp 156.000", status: "Baru", variant: "baru" },
  { id: "#ORD-0065", amount: "Rp 250.000", status: "Diproses", variant: "diproses" },
  { id: "#ORD-0063", amount: "Rp 180.000", status: "Selesai", variant: "selesai" },
];

function Sparkline() {
  return (
    <svg viewBox="0 0 220 52" className="mt-3 h-12 w-full" role="img" aria-label="Grafik penjualan 7 hari terakhir">
      <path
        d="M6 42 L38 34 L70 37 L102 26 L134 28 L166 18 L198 8"
        fill="none"
        stroke="#2563EB"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 42 L38 34 L70 37 L102 26 L134 28 L166 18 L198 8 L198 52 L6 52 Z"
        fill="#2563EB"
        fillOpacity="0.07"
      />
      <circle cx="198" cy="8" r="3.5" fill="#2563EB" />
    </svg>
  );
}

function MiniDashboard() {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-[0_20px_56px_-16px_rgba(15,23,42,0.22)] sm:p-5">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          <LogoMark className="h-6 w-6" />
          <span className="text-xs font-extrabold text-[#0F172A]">OrderKu</span>
        </span>
        <span className="rounded-full bg-[#F8FAFC] px-2 py-0.5 text-[10px] font-semibold text-[#64748B] ring-1 ring-[#E2E8F0]">
          Dashboard
        </span>
      </div>

      <p className="mt-3.5 text-[13px] font-bold text-[#0F172A]">Halo, Sari! 👋</p>

      <div className="mt-2.5 grid grid-cols-2 gap-2">
        <div className="rounded-[12px] border border-[#E2E8F0] bg-white p-2.5">
          <p className="text-[10px] font-medium text-[#64748B]">Total Pesanan</p>
          <p className="text-[17px] font-extrabold leading-tight text-[#0F172A]">128</p>
          <p className="text-[10px] font-semibold text-[#16A34A]">↑ 12% minggu ini</p>
        </div>
        <div className="rounded-[12px] border border-[#E2E8F0] bg-white p-2.5">
          <p className="text-[10px] font-medium text-[#64748B]">Pendapatan</p>
          <p className="text-[15px] font-extrabold leading-tight text-[#0F172A]">Rp 8.450.000</p>
          <p className="text-[10px] font-semibold text-[#16A34A]">↑ 16% minggu ini</p>
        </div>
      </div>

      <Sparkline />

      <p className="mt-3 text-[11px] font-bold text-[#0F172A]">Pesanan terbaru</p>
      <ul className="mt-1.5 space-y-1.5">
        {recentOrders.map((o) => (
          <li
            key={o.id}
            className="flex items-center justify-between rounded-[10px] bg-[#F8FAFC] px-2.5 py-1.5"
          >
            <span className="text-[11px] font-semibold text-[#0F172A]">{o.id}</span>
            <span className="flex items-center gap-2">
              <span className="text-[11px] text-[#64748B]">{o.amount}</span>
              <Badge variant={o.variant} className="px-2 py-0.5 text-[10px]">
                {o.status}
              </Badge>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HeroVisual() {
  return (
    <div className="relative">
      <style>{`
        @keyframes bl-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .bl-float { animation: bl-float 7s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .bl-float { animation: none; }
        }
      `}</style>

      <div className="relative overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-[#E2E8F0] shadow-[0_24px_64px_-32px_rgba(15,23,42,0.35)]">
        <Image
          src={heroOwner}
          alt="Pemilik usaha kecil sedang mengelola pesanan di tablet"
          loading="eager"
          fetchPriority="high"
          className="aspect-[4/3] w-full object-cover object-center sm:aspect-[5/4] lg:aspect-[4/3]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0F172A]/20 via-transparent to-transparent" />
      </div>

      <div className="bl-float relative z-10 mx-auto -mt-14 w-full max-w-[330px] sm:-mt-16 lg:absolute lg:bottom-6 lg:left-6 lg:m-0 lg:w-[330px]">
        <MiniDashboard />
      </div>

      <div className="absolute -top-7 right-2 hidden items-start gap-2 xl:flex">
        <div className="max-w-[180px] rotate-2">
          <p className="text-xs font-semibold italic leading-5 text-[#64748B]">
            Dashboard lengkap untuk kontrol bisnis Anda
          </p>
        </div>
        <svg viewBox="0 0 60 44" className="h-11 w-14 text-[#94A3B8]" fill="none" aria-hidden="true">
          <path
            d="M6 4c14 2 34 10 44 30"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="3 4"
          />
          <path d="M43 33l7 3 1-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
