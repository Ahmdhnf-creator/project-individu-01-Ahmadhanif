import { Badge } from "@/components/ui/badge";
import { LogoMark } from "./logo";
import { ChartIcon, DashboardIcon, GlobeIcon, OrdersIcon, PackageIcon, UsersIcon } from "./icons";

const sidebarNav = [
  { label: "Dashboard", icon: DashboardIcon, active: true },
  { label: "Katalog", icon: GlobeIcon },
  { label: "Pesanan", icon: OrdersIcon },
  { label: "Produk", icon: PackageIcon },
  { label: "Pelanggan", icon: UsersIcon },
  { label: "Laporan", icon: ChartIcon },
];

const stats = [
  { label: "Total Pesanan", value: "128", delta: "↑ 12%", tint: "bg-[#EFF6FF] text-[#2563EB]" },
  { label: "Pendapatan", value: "Rp 8.450.000", delta: "↑ 16%", tint: "bg-[#ECFDF5] text-[#16A34A]" },
  { label: "Pelanggan Baru", value: "48", delta: "↑ 24%", tint: "bg-[#F5F3FF] text-[#7C3AED]" },
  { label: "Produk Terjual", value: "346", delta: "↑ 18%", tint: "bg-[#FFF7ED] text-[#D97706]" },
];

const orders = [
  { id: "#ORD-0066", name: "Dewi Lestari", amount: "Rp 156.000", status: "Baru", variant: "baru", time: "2 jam lalu" },
  { id: "#ORD-0065", name: "Budi Santoso", amount: "Rp 250.000", status: "Diproses", variant: "diproses", time: "4 jam lalu" },
  { id: "#ORD-0064", name: "Rina Anggraini", amount: "Rp 420.000", status: "Dikirim", variant: "dikirim", time: "6 jam lalu" },
  { id: "#ORD-0063", name: "Andi Pratama", amount: "Rp 180.000", status: "Selesai", variant: "selesai", time: "8 jam lalu" },
  { id: "#ORD-0062", name: "Siti Nurhaliza", amount: "Rp 480.000", status: "Diproses", variant: "diproses", time: "10 jam lalu" },
];

const chartPoints = [
  { x: 10, y: 118 },
  { x: 76, y: 96 },
  { x: 142, y: 104 },
  { x: 208, y: 74 },
  { x: 274, y: 78 },
  { x: 340, y: 48 },
  { x: 406, y: 22 },
];

function SalesChart() {
  const line = chartPoints.map((p) => `${p.x} ${p.y}`).join(" L ");
  const area = `${line} L 406 140 L 10 140 Z`;
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 md:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[13px] font-bold text-[#0F172A]">Penjualan & Pendapatan</p>
          <p className="mt-0.5 text-[11px] text-[#64748B]">Total pendapatan 7 hari terakhir</p>
        </div>
        <span className="rounded-[10px] border border-[#E2E8F0] bg-white px-2.5 py-1 text-[11px] font-medium text-[#64748B]">
          7 hari terakhir
        </span>
      </div>
      <p className="mt-3 text-[11px] text-[#64748B]">Total Pendapatan</p>
      <p className="flex items-baseline gap-2">
        <span className="text-[20px] font-extrabold tracking-tight text-[#0F172A]">Rp 8.450.000</span>
        <span className="text-[11px] font-semibold text-[#16A34A]">↑ 16%</span>
      </p>
      <svg viewBox="0 0 416 150" className="mt-2 h-36 w-full" role="img" aria-label="Grafik penjualan tujuh hari terakhir yang meningkat">
        <path d="M10 140 H406" stroke="#E2E8F0" strokeWidth="1" />
        <path d="M10 100 H406" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 5" />
        <path d="M10 60 H406" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 5" />
        <path d="M10 20 H406" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 5" />
        <path d={`${area}`} fill="#2563EB" fillOpacity="0.06" />
        <path d={`M ${line}`} fill="none" stroke="#2563EB" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        {chartPoints.map((p) => (
          <circle key={p.x} cx={p.x} cy={p.y} r="3.4" fill="white" stroke="#2563EB" strokeWidth="2" />
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-[#94A3B8]">
        {["10 Apr", "11 Apr", "12 Apr", "13 Apr", "14 Apr", "15 Apr", "16 Apr"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
    </div>
  );
}

function RecentOrders() {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 md:p-5">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-bold text-[#0F172A]">Pesanan Terbaru</p>
        <span className="text-[11px] font-semibold text-[#2563EB]">Lihat semua</span>
      </div>
      <ul className="mt-3 space-y-2">
        {orders.map((o) => (
          <li key={o.id} className="flex items-center justify-between gap-3 rounded-[12px] bg-[#F8FAFC] px-3 py-2.5">
            <div className="min-w-0">
              <p className="truncate text-[12px] font-semibold text-[#0F172A]">{o.id}</p>
              <p className="truncate text-[11px] text-[#64748B]">{o.name}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <div className="text-right">
                <p className="text-[12px] font-semibold text-[#0F172A]">{o.amount}</p>
                <p className="text-[10px] text-[#94A3B8]">{o.time}</p>
              </div>
              <Badge variant={o.variant} className="px-2 py-0.5 text-[10px]">
                {o.status}
              </Badge>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DashboardShowcase() {
  return (
    <div className="overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white shadow-[0_32px_80px_-40px_rgba(15,23,42,0.35)]">
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FCA5A5]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FCD34D]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#6EE7B7]" />
        <span className="ml-3 hidden rounded-[8px] bg-white px-3 py-1 text-[11px] text-[#94A3B8] ring-1 ring-[#E2E8F0] sm:inline">
          bulan-01.app/dashboard
        </span>
      </div>

      <div className="grid md:grid-cols-[210px_1fr]">
        <aside className="hidden border-r border-[#E2E8F0] bg-[#F8FAFC] p-4 md:flex md:flex-col">
          <span className="flex items-center gap-2 px-1">
            <LogoMark className="h-7 w-7" />
            <span className="text-[13px] font-extrabold text-[#0F172A]">Bulan-01</span>
          </span>
          <ul className="mt-5 space-y-1">
            {sidebarNav.map((item) => (
              <li
                key={item.label}
                className={`flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-[13px] font-medium ${
                  item.active
                    ? "bg-[#2563EB] text-white shadow-[0_6px_16px_-6px_rgba(37,99,235,0.7)]"
                    : "text-[#64748B]"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </li>
            ))}
          </ul>
          <div className="mt-auto rounded-[14px] bg-white p-3 ring-1 ring-[#E2E8F0]">
            <p className="text-[12px] font-bold text-[#0F172A]">Tingkatkan bisnismu</p>
            <p className="mt-0.5 text-[11px] leading-4 text-[#64748B]">
              Kelola pesanan, stok, dan pelanggan dengan lebih mudah.
            </p>
          </div>
        </aside>

        <div className="p-4 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[17px] font-extrabold tracking-tight text-[#0F172A]">Halo, Sari! 👋</p>
              <p className="mt-0.5 text-[12px] text-[#64748B]">
                Berikut ringkasan aktivitas bisnis kamu hari ini.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden rounded-[10px] border border-[#E2E8F0] bg-white px-3 py-1.5 text-[11px] font-medium text-[#64748B] sm:inline">
                7 hari terakhir
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DBEAFE] text-[12px] font-bold text-[#1D4ED8]">
                S
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-[16px] border border-[#E2E8F0] bg-white p-3.5">
                <div className={`flex h-8 w-8 items-center justify-center rounded-[10px] ${s.tint}`}>
                  <ChartIcon className="h-4 w-4" />
                </div>
                <p className="mt-2.5 text-[11px] font-medium text-[#64748B]">{s.label}</p>
                <p className="text-[18px] font-extrabold leading-tight tracking-tight text-[#0F172A]">
                  {s.value}
                </p>
                <p className="mt-0.5 text-[10px] font-semibold text-[#16A34A]">
                  {s.delta} <span className="font-normal text-[#94A3B8]">dari minggu lalu</span>
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <SalesChart />
            </div>
            <div className="lg:col-span-2">
              <RecentOrders />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
