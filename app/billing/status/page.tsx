import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLANS, formatRupiah, type PlanKey } from "@/lib/billing";

type TxStatus = "PENDING" | "SUCCESS" | "FAILED" | "EXPIRED";

const statusMeta: Record<
  TxStatus,
  { title: string; desc: string; tone: string; chip: string }
> = {
  SUCCESS: {
    title: "Pembayaran berhasil",
    desc: "Paket Anda sudah aktif.",
    tone: "text-[#16A34A]",
    chip: "bg-[#ECFDF5] text-[#16A34A]",
  },
  PENDING: {
    title: "Menunggu pembayaran",
    desc: "Status akan diperbarui otomatis setelah pembayaran dikonfirmasi. Anda bisa memeriksa lagi.",
    tone: "text-[#D97706]",
    chip: "bg-[#FFFBEB] text-[#D97706]",
  },
  FAILED: {
    title: "Pembayaran gagal",
    desc: "Pembayaran tidak dapat diproses. Anda bisa mencoba lagi.",
    tone: "text-[#DC2626]",
    chip: "bg-[#FEF2F2] text-[#DC2626]",
  },
  EXPIRED: {
    title: "Pembayaran kedaluwarsa",
    desc: "Waktu pembayaran habis. Anda bisa mencoba lagi.",
    tone: "text-[#DC2626]",
    chip: "bg-[#FEF2F2] text-[#DC2626]",
  },
};

export default async function BillingStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string | string[] }>;
}) {
  const raw = (await searchParams).order_id;
  const orderId = Array.isArray(raw) ? raw[0] : raw;
  if (!orderId) redirect("/");
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const tx = await prisma.billingTransaction.findUnique({
    where: { midtransOrderId: orderId },
  });
  if (!tx || tx.userId !== user.id) redirect("/");

  const info = PLANS[tx.plan as PlanKey];
  const status = (tx.status as TxStatus) in statusMeta ? (tx.status as TxStatus) : "PENDING";
  const meta = statusMeta[status];

  const sub =
    status === "SUCCESS"
      ? await prisma.subscription.findFirst({
          where: { userId: user.id, plan: tx.plan, status: "ACTIVE" },
          orderBy: { startAt: "desc" },
        })
      : null;

  const formatDate = (d: Date) =>
    d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      <header className="border-b border-slate-200">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-[15px] font-semibold tracking-tight text-slate-900">
            OrderKu
          </Link>
          <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-900">
            Dashboard
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-md px-6 py-12">
        <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.5)] sm:p-7">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${meta.chip}`}
          >
            {status}
          </span>
          <h1 className={`mt-4 text-xl font-semibold tracking-tight ${meta.tone}`}>
            {meta.title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">{meta.desc}</p>
          {sub && (
            <p className="mt-1 text-sm leading-6 text-[#64748B]">
              Aktif hingga {formatDate(sub.endAt)}.
            </p>
          )}

          <dl className="mt-6 space-y-3 border-t border-[#E2E8F0] pt-5 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[#64748B]">Paket</dt>
              <dd className="font-medium text-[#0F172A]">{info.label}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[#64748B]">Jumlah</dt>
              <dd className="font-semibold text-[#0F172A]">{formatRupiah(tx.amount)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[#64748B]">Order ID</dt>
              <dd className="truncate font-mono text-xs text-[#0F172A]">{tx.midtransOrderId}</dd>
            </div>
          </dl>

          <div className="mt-6 space-y-3">
            {status === "SUCCESS" ? (
              <Link
                href="/dashboard"
                className="inline-flex h-12 w-full items-center justify-center rounded-[12px] bg-[#2563EB] text-[15px] font-bold text-white hover:bg-[#1D4ED8]"
              >
                Ke Dashboard
              </Link>
            ) : status === "PENDING" ? (
              <>
                <a
                  href={`/billing/status?order_id=${encodeURIComponent(tx.midtransOrderId)}`}
                  className="inline-flex h-12 w-full items-center justify-center rounded-[12px] bg-[#2563EB] text-[15px] font-bold text-white hover:bg-[#1D4ED8]"
                >
                  Periksa Lagi
                </a>
                <Link
                  href="/dashboard"
                  className="inline-flex h-11 w-full items-center justify-center rounded-[12px] border border-[#E2E8F0] bg-white text-sm font-medium text-[#0F172A] hover:bg-[#F8FAFC]"
                >
                  Ke Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={`/billing/checkout?plan=${info.label}`}
                  className="inline-flex h-12 w-full items-center justify-center rounded-[12px] bg-[#2563EB] text-[15px] font-bold text-white hover:bg-[#1D4ED8]"
                >
                  Coba Lagi
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex h-11 w-full items-center justify-center rounded-[12px] border border-[#E2E8F0] bg-white text-sm font-medium text-[#0F172A] hover:bg-[#F8FAFC]"
                >
                  Ke Dashboard
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
