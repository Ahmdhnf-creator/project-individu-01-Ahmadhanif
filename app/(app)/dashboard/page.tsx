import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const statusVariant: Record<string, string> = {
  BARU: "baru",
  DIPROSES: "diproses",
  DIKIRIM: "dikirim",
  SELESAI: "selesai",
  BATAL: "batal",
};

function formatCurrency(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function formatOrderDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function Dashboard() {
  const user = await requireUser();
  const isPelanggan = user.role === "PELANGGAN";
  const where = isPelanggan ? { userId: user.id } : {};
  const revenueWhere = { ...where, paymentStatus: "LUNAS" as const, status: { not: "BATAL" as const } };
  const [total, group, recent, revenue, customerCount, productCount] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.groupBy({ by: ["status"], where, _count: true }),
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { customer: true, user: true, items: { include: { product: true } } },
    }),
    prisma.order.aggregate({ where: revenueWhere, _sum: { total: true } }),
    isPelanggan ? null : prisma.customer.count(),
    isPelanggan ? null : prisma.product.count({ where: { isActive: true } }),
  ]);
  const counts: Record<string, number> = {};
  for (const status of group) counts[status.status] = status._count;

  const internalStats = [
    { label: "Total Pendapatan", value: formatCurrency(revenue._sum.total ?? 0), detail: "Dari pesanan lunas", accent: "text-[#059669]" },
    { label: "Pesanan", value: total.toLocaleString("id-ID"), detail: "Semua status" },
    { label: "Pelanggan", value: (customerCount ?? 0).toLocaleString("id-ID"), detail: "Tersimpan di bisnis" },
    { label: "Produk/Layanan", value: (productCount ?? 0).toLocaleString("id-ID"), detail: "Produk aktif" },
  ];
  const customerStats = [
    { label: "Pesanan Saya", value: total.toLocaleString("id-ID"), detail: "Semua pesanan" },
    { label: "Baru", value: (counts.BARU ?? 0).toLocaleString("id-ID"), detail: "Menunggu diproses" },
    { label: "Diproses", value: (counts.DIPROSES ?? 0).toLocaleString("id-ID"), detail: "Sedang dikerjakan" },
    { label: "Selesai", value: (counts.SELESAI ?? 0).toLocaleString("id-ID"), detail: "Pesanan tuntas" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8 md:space-y-10">
      <header className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2563EB]">OrderKu</p>
          <h1 className="mt-2 truncate text-2xl font-bold tracking-tight text-[#0F172A] md:text-[30px]">Halo, {user.name}</h1>
          <p className="mt-1 text-sm text-[#64748B]">Ringkasan aktivitas bisnismu.</p>
        </div>
        <div aria-label={`Profil ${user.name}`} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#DBEAFE] text-sm font-semibold text-[#1D4ED8] ring-4 ring-white">
          {user.name.slice(0, 1).toUpperCase()}
        </div>
      </header>

      <section aria-label="Ringkasan" className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {(isPelanggan ? customerStats : internalStats).map((stat) => (
          <Card key={stat.label} className="min-w-0 p-4 sm:p-5">
            <p className="text-xs font-medium text-[#64748B] sm:text-sm">{stat.label}</p>
            <p className={`mt-3 truncate text-xl font-bold tracking-tight text-[#0F172A] sm:text-2xl ${"accent" in stat ? stat.accent : ""}`}>{stat.value}</p>
            <p className="mt-1 text-[11px] leading-4 text-[#94A3B8] sm:text-xs">{stat.detail}</p>
          </Card>
        ))}
      </section>

      <section aria-labelledby="quick-actions-heading">
        <div className="mb-3">
          <h2 id="quick-actions-heading" className="text-base font-semibold text-[#0F172A]">Aksi Cepat</h2>
          <p className="mt-1 text-sm text-[#64748B]">Lanjutkan pekerjaan yang paling sering dilakukan.</p>
        </div>
        <div className={`grid gap-3 ${isPelanggan ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-3"}`}>
          <Link href="/catalog" className="block">
            <Button className="h-11 w-full justify-start gap-2 rounded-[12px] px-4">
              <span aria-hidden="true" className="text-base leading-none">+</span>
              Buat Pesanan
            </Button>
          </Link>
          {!isPelanggan && (
            <Link href="/products" className="block">
              <Button variant="secondary" className="h-11 w-full justify-start rounded-[12px] px-4">Tambah Produk</Button>
            </Link>
          )}
          <Link href="/orders" className="block">
            <Button variant="secondary" className="h-11 w-full justify-start rounded-[12px] px-4">Lihat Pesanan</Button>
          </Link>
        </div>
      </section>

      <section aria-labelledby="recent-orders-heading">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 id="recent-orders-heading" className="text-base font-semibold text-[#0F172A]">Pesanan Terbaru</h2>
            <p className="mt-1 text-sm text-[#64748B]">Lima pesanan terakhir yang tercatat.</p>
          </div>
          <Link href="/orders" className="shrink-0 text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8]">Lihat semua</Link>
        </div>

        <Card className="overflow-hidden">
          {recent.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-sm font-medium text-[#0F172A]">Belum ada pesanan</p>
              <p className="mt-1 text-sm text-[#64748B]">Pesanan terbaru akan muncul di sini.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#E2E8F0]">
              {recent.map((order) => {
                const customerName = order.customer?.name ?? order.user?.name ?? "Pelanggan";
                const itemSummary = order.items.slice(0, 2).map((item) => `${item.product.name} ×${item.qty}`).join(", ");
                const extraItems = order.items.length > 2 ? ` +${order.items.length - 2} lainnya` : "";

                return (
                  <Link key={order.id} href={`/orders/${order.id}`} className="block px-4 py-4 transition-colors hover:bg-[#F8FAFC] sm:px-5">
                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="truncate text-sm font-semibold text-[#0F172A]">ORD-{order.id.slice(-6).toUpperCase()}</span>
                        <Badge variant={statusVariant[order.status] ?? "default"}>{order.status}</Badge>
                      </div>
                      <span className="text-xs text-[#64748B]">{formatOrderDate(order.createdAt)}</span>
                    </div>
                    <div className="mt-2 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[#334155]">{customerName}</p>
                        <p className="mt-0.5 truncate text-xs text-[#64748B]">{itemSummary ? `${itemSummary}${extraItems}` : "Tidak ada item"}</p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold text-[#0F172A]">{formatCurrency(order.total)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
