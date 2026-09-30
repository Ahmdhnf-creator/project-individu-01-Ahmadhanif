import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { StatusButtons, DeleteOrderButton } from "../OrderActions";
import { PaymentActions } from "../PaymentActions";
import { getUrl } from "@/lib/storage";
import { getRentalDaysInclusive } from "@/lib/order";
import type { OrderStatus } from "@/lib/order";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const orderStatuses: OrderStatus[] = ["BARU", "DIPROSES", "DIKIRIM", "SELESAI"];
const statusVariant: Record<string, string> = {
  BARU: "dikirim",
  DIPROSES: "diproses",
  DIKIRIM: "dikirim",
  SELESAI: "selesai",
  BATAL: "batal",
};

function formatOrderNumber(id: string, createdAt: Date) {
  const date = createdAt.toISOString().slice(0, 10).replaceAll("-", "");
  return `ORD-${date}-${id.slice(-6).toUpperCase()}`;
}

function formatDate(date: Date, includeTime = false) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(date);
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { customer: true, user: true, items: { include: { product: true } } } });
  if (!order) notFound();
  if (user.role === "PELANGGAN" && order.userId !== user.id) redirect("/orders");
  const isPelanggan = user.role === "PELANGGAN";
  const customerName = order.customer?.name ?? order.user?.name ?? "Pelanggan";
  const customerWa = order.customer?.wa ?? order.user?.wa;
  const customerAddress = order.customer?.address ?? order.user?.address;
  const whatsappNumber = customerWa?.replace(/\D/g, "");
  const orderNumber = formatOrderNumber(order.id, order.createdAt);
  const itemSubtotal = order.items.reduce((sum, item) => sum + item.subtotal, 0);
  const proofUrl = order.proofUrl ? getUrl(order.proofUrl) : null;
  const progressIndex = orderStatuses.indexOf(order.status as OrderStatus);

  return (
    <div className="mx-auto max-w-6xl">
      <Link href="/orders" className="inline-flex min-h-9 items-center gap-2 rounded-[10px] text-sm font-medium text-[#64748B] transition-colors hover:text-[#2563EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m15 18-6-6 6-6M9 12h12" /></svg>
        Kembali ke Pesanan
      </Link>

      <header className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[#64748B]">Detail Pesanan</p>
          <h1 className="mt-1 break-all text-2xl font-bold tracking-tight text-[#0F172A] sm:text-[28px]">#{orderNumber}</h1>
          <p className="mt-1 text-sm text-[#64748B]">Dibuat {formatDate(order.createdAt, true)}</p>
        </div>
        <Badge variant={statusVariant[order.status] ?? "default"} className="w-fit rounded-[9px] px-2.5 py-1.5 text-xs">{order.status}</Badge>
      </header>

      <Card className="mt-5 p-4 sm:p-5">
        {order.status === "BATAL" ? (
          <div className="flex items-center gap-3 rounded-[12px] bg-red-50 p-3.5 text-sm font-medium text-[#DC2626]">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-base" aria-hidden="true">×</span>
            Pesanan ini telah dibatalkan.
          </div>
        ) : (
          <div aria-label={`Progres pesanan: ${order.status}`}>
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-[#0F172A]">Progres Pesanan</h2>
              <p className="text-[11px] text-[#64748B]">Dapat selesai tanpa pengiriman</p>
            </div>
            <ol className="grid grid-cols-4">
              {orderStatuses.map((status, index) => {
                const isComplete = progressIndex >= 0 && index < progressIndex;
                const isCurrent = index === progressIndex;
                return (
                  <li key={status} className="relative flex min-w-0 flex-col items-center text-center">
                    {index < orderStatuses.length - 1 && <span aria-hidden="true" className={`absolute left-1/2 top-3 h-0.5 w-full ${isComplete ? "bg-[#10B981]" : "bg-[#E2E8F0]"}`} />}
                    <span className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] font-bold ${isComplete ? "border-[#10B981] bg-[#10B981] text-white" : isCurrent ? "border-[#2563EB] bg-white text-[#2563EB] ring-4 ring-blue-50" : "border-[#CBD5E1] bg-white text-[#94A3B8]"}`}>
                      {isComplete ? "✓" : index + 1}
                    </span>
                    <span className={`mt-2 px-0.5 text-[10px] font-medium leading-tight sm:text-xs ${isCurrent ? "text-[#2563EB]" : isComplete ? "text-[#059669]" : "text-[#94A3B8]"}`}>{status}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </Card>

      <div className="mt-5 grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.85fr)]">
        <div className="space-y-5">
          <Card className="overflow-hidden">
            <div className="border-b border-[#E2E8F0] px-4 py-4 sm:px-5">
              <h2 className="text-base font-semibold text-[#0F172A]">Item Pesanan</h2>
              <p className="mt-1 text-xs text-[#64748B]">{order.items.length} {order.items.length === 1 ? "baris item" : "baris item"}</p>
            </div>
            <div className="divide-y divide-[#E2E8F0]">
              {order.items.map((item) => {
                const rentalDays = item.startDate && item.endDate
                  ? getRentalDaysInclusive(item.startDate, item.endDate)
                  : null;
                return (
                  <div key={item.id} className="p-4 sm:p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-[#0F172A]">{item.product.name}</h3>
                          <span className="rounded-[8px] bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-[#475569]">{item.product.type}</span>
                        </div>
                        <p className="mt-1 text-xs text-[#64748B]">{item.qty} {item.unit}{item.qty !== 1 ? "" : ""}</p>
                        {rentalDays && item.startDate && item.endDate && (
                          <div className="mt-3 rounded-[10px] bg-[#F8FAFC] px-3 py-2 text-xs text-[#475569]">
                            <p>{formatDate(item.startDate)} - {formatDate(item.endDate)}</p>
                            <p className="mt-0.5 font-medium text-[#2563EB]">{rentalDays} hari sewa</p>
                          </div>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center justify-between gap-4 border-t border-[#F1F5F9] pt-3 sm:min-w-[150px] sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                        <span className="text-xs text-[#64748B]">{item.qty} × Rp {item.price.toLocaleString("id-ID")}</span>
                        <span className="text-sm font-semibold text-[#0F172A]">Rp {item.subtotal.toLocaleString("id-ID")}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {order.note && (
            <Card className="p-4 sm:p-5">
              <h2 className="text-sm font-semibold text-[#0F172A]">Catatan</h2>
              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-[#475569]">{order.note}</p>
            </Card>
          )}
        </div>

        <aside className="space-y-5">
          <Card className="p-4 sm:p-5">
            <h2 className="text-base font-semibold text-[#0F172A]">Informasi Pelanggan</h2>
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-[#94A3B8]">Nama</p>
                <p className="mt-1 break-words text-sm font-medium text-[#0F172A]">{customerName}</p>
              </div>
              {customerWa && (
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-[#94A3B8]">WhatsApp</p>
                  <p className="mt-1 text-sm text-[#334155]">{customerWa}</p>
                  {whatsappNumber && <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-10 items-center justify-center rounded-[10px] bg-emerald-50 px-3 text-xs font-semibold text-[#047857] transition-colors hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]">Hubungi via WhatsApp</a>}
                </div>
              )}
              {customerAddress && (
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-[#94A3B8]">Alamat</p>
                  <p className="mt-1 break-words text-sm leading-5 text-[#475569]">{customerAddress}</p>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-4 sm:p-5">
            <h2 className="text-base font-semibold text-[#0F172A]">Pembayaran</h2>
            <div className="mt-4 flex items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-[#94A3B8]">Metode</p>
                <p className="mt-1 text-sm font-semibold text-[#0F172A]">{order.paymentMethod}</p>
              </div>
              <Badge variant={order.paymentStatus === "LUNAS" ? "success" : "warning"} className="rounded-[9px]">{order.paymentStatus === "LUNAS" ? "LUNAS" : "BELUM BAYAR"}</Badge>
            </div>
            {proofUrl && <a href={proofUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-9 items-center text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8]">Lihat bukti pembayaran</a>}
            <PaymentActions orderId={order.id} paymentMethod={order.paymentMethod} paymentStatus={order.paymentStatus} proofUrl={null} />
          </Card>

          <Card className="p-4 sm:p-5">
            <h2 className="text-base font-semibold text-[#0F172A]">Ringkasan</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3 text-[#64748B]">
                <span>Subtotal item</span>
                <span className="font-medium text-[#334155]">Rp {itemSubtotal.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex items-end justify-between gap-3 border-t border-[#E2E8F0] pt-3">
                <span className="font-semibold text-[#0F172A]">Total</span>
                <span className="text-lg font-bold tracking-tight text-[#0F172A]">Rp {order.total.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </Card>

          {!isPelanggan && order.status !== "SELESAI" && order.status !== "BATAL" && (
            <Card className="p-4 sm:p-5">
              <h2 className="text-base font-semibold text-[#0F172A]">Tindakan</h2>
              <div className="mt-3 flex flex-col gap-2">
                <StatusButtons orderId={order.id} status={order.status as OrderStatus} isPelanggan={isPelanggan} />
                <DeleteOrderButton orderId={order.id} status={order.status} isOwner={order.userId === user.id} />
              </div>
            </Card>
          )}
          {order.status === "SELESAI" && (
            <div className="rounded-[12px] border border-emerald-100 bg-emerald-50 p-3 text-xs leading-5 text-[#047857]">
              Pesanan selesai dan tersimpan sebagai histori transaksi.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
