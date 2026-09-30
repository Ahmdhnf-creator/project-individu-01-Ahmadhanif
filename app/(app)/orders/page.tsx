import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const statuses = [
  { value: "BARU", label: "Baru", className: "bg-blue-50 text-[#2563EB]" },
  { value: "DIPROSES", label: "Diproses", className: "bg-amber-50 text-[#D97706]" },
  { value: "DIKIRIM", label: "Dikirim", className: "bg-blue-50 text-[#2563EB]" },
  { value: "SELESAI", label: "Selesai", className: "bg-emerald-50 text-[#16A34A]" },
  { value: "BATAL", label: "Batal", className: "bg-red-50 text-[#DC2626]" },
];

const statusStyle = Object.fromEntries(statuses.map((status) => [status.value, status.className]));

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const { status, q } = await searchParams;
  const where: any = {};
  if (user.role === "PELANGGAN") where.userId = user.id;
  if (status) where.status = status;
  if (q) {
    where.OR = [{ customer: { name: { contains: q } } }, { user: { name: { contains: q } } }, { id: { contains: q } }];
  }
  const orders = await prisma.order.findMany({
    where,
    include: { customer: true, user: true, items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <PageHeader
        title="Pesanan"
        description="Kelola pesanan pelanggan dan pantau statusnya."
        action={
          <Link href="/catalog" className="block">
            <Button className="h-10 w-full gap-2 rounded-[12px] px-4 sm:w-auto">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Buat Pesanan
            </Button>
          </Link>
        }
      />

      <Card className="p-3 sm:p-4">
        <form method="GET" className="flex flex-col gap-2.5 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#94A3B8]">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
            <Input
              name="q"
              defaultValue={q ?? ""}
              placeholder="Cari pesanan..."
              aria-label="Cari pesanan"
              className="h-11 rounded-[12px] pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select name="status" defaultValue={status ?? ""} aria-label="Filter status" className="h-11 min-w-0 flex-1 rounded-[12px] sm:w-[180px] sm:flex-none">
              <option value="">Semua</option>
              {statuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </Select>
            <Button variant="secondary" type="submit" className="h-11 rounded-[12px] px-4">Filter</Button>
          </div>
        </form>
      </Card>

      <div className="mt-5 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[#0F172A]">Daftar Pesanan</h2>
        <span className="text-xs text-[#64748B]">{orders.length} pesanan</span>
      </div>

      {orders.length === 0 ? (
        <Card className="mt-3 px-5 py-12 text-center">
          <p className="text-sm font-semibold text-[#0F172A]">Belum ada pesanan</p>
          <p className="mt-1 text-sm text-[#64748B]">Pesanan yang masuk akan muncul di sini.</p>
          <Link href="/catalog" className="mt-5 inline-block">
            <Button className="h-10 rounded-[12px] px-4">Buat Pesanan</Button>
          </Link>
        </Card>
      ) : (
        <div className="mt-3 space-y-3">
          {orders.map((order) => {
            const customerName = order.customer?.name ?? order.user?.name ?? "Pelanggan";
            const leadItem = order.items[0]?.product.name;
            const remainingItems = order.items.length - 1;

            return (
              <Card key={order.id} className="p-4 transition-colors hover:border-[#CBD5E1] sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <p className="truncate text-sm font-semibold tracking-tight text-[#0F172A]">ORD-{order.id.slice(-6).toUpperCase()}</p>
                    <span className={`inline-flex shrink-0 items-center rounded-[9px] px-2 py-1 text-[11px] font-semibold ${statusStyle[order.status] ?? "bg-slate-100 text-[#64748B]"}`}>
                      {order.status}
                    </span>
                  </div>
                  <time dateTime={order.createdAt.toISOString()} className="text-xs text-[#64748B]">{formatDate(order.createdAt)}</time>
                </div>

                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#334155]">{customerName}</p>
                    <p className="mt-1 truncate text-xs text-[#64748B]">
                      {order.items.length} item
                      {leadItem ? ` · ${leadItem}${remainingItems > 0 ? ` +${remainingItems} lainnya` : ""}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <p className="text-sm font-bold text-[#0F172A]">Rp {order.total.toLocaleString("id-ID")}</p>
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="secondary" size="sm" className="h-9 rounded-[10px] px-3">Lihat Detail</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
