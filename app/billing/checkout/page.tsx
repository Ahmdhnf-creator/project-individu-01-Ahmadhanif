import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import {
  PLANS,
  formatRupiah,
  getActivePlan,
  isBillingPlan,
  type PlanKey,
} from "@/lib/billing";
import { activateFreePlan } from "./actions";
import { PayButton } from "@/components/billing/pay-button";

export default async function BillingCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string | string[] }>;
}) {
  const raw = (await searchParams).plan;
  const planParam = Array.isArray(raw) ? raw[0] : raw;
  if (!isBillingPlan(planParam)) redirect("/");
  const plan: PlanKey = planParam;
  const user = await getCurrentUser();
  if (!user) redirect(`/login?plan=${plan}`);

  const info = PLANS[plan];
  const activePlan = await getActivePlan(user.id);

  const isProd = process.env.MIDTRANS_IS_PRODUCTION === "true";
  const clientKey = process.env.MIDTRANS_CLIENT_KEY ?? "";
  const snapOrigin = isProd ? "https://app.midtrans.com" : "https://app.sandbox.midtrans.com";
  const snapSrc = `${snapOrigin}/snap/snap.js${clientKey ? `?clientKey=${encodeURIComponent(clientKey)}` : ""}`;

  if (plan === "FREE" && activePlan !== "FREE") {
    return (
      <BillingShell>
        <p className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#64748B]">
          Paket Anda
        </p>
        <h1 className="mt-3 text-xl font-semibold tracking-tight text-[#0F172A]">
          Anda sudah berlangganan {activePlan}
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#64748B]">
          Paket {activePlan} Anda masih aktif. Tidak perlu ganti ke FREE.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-[12px] bg-[#2563EB] text-[15px] font-bold text-white hover:bg-[#1D4ED8]"
        >
          Ke Dashboard
        </Link>
      </BillingShell>
    );
  }

  return (
    <BillingShell>
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#64748B]">
          Paket Anda
        </p>
        <span className="rounded-full bg-[#EFF6FF] px-2.5 py-1 text-xs font-semibold text-[#2563EB]">
          {info.label}
        </span>
      </div>

      <p className="mt-4 flex items-baseline gap-1.5">
        <span className="text-[34px] font-extrabold leading-none tracking-tight text-[#0F172A]">
          {formatRupiah(info.amount)}
        </span>
        <span className="text-[13px] font-medium text-[#64748B]">/ bulan</span>
      </p>
      <p className="mt-2 text-sm leading-6 text-[#64748B]">{info.tagline}</p>

      <dl className="mt-6 space-y-3 border-t border-[#E2E8F0] pt-5 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-[#64748B]">Masa berlaku</dt>
          <dd className="font-medium text-[#0F172A]">1 bulan</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-[#64748B]">Total hari ini</dt>
          <dd className="font-semibold text-[#0F172A]">{formatRupiah(info.amount)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-[#64748B]">Paket saat ini</dt>
          <dd className="font-medium text-[#0F172A]">{activePlan}</dd>
        </div>
      </dl>

      <div className="mt-6">
        {plan === "FREE" ? (
          <form action={activateFreePlan}>
            <input type="hidden" name="plan" value="FREE" />
            <button
              type="submit"
              className="inline-flex h-12 w-full items-center justify-center rounded-[12px] bg-[#2563EB] text-[15px] font-bold text-white transition-colors hover:bg-[#1D4ED8]"
            >
              Aktifkan Gratis
            </button>
          </form>
        ) : (
          <PayButton plan={plan} snapSrc={snapSrc} />
        )}
      </div>

      <p className="mt-4 text-center text-xs leading-5 text-[#64748B]">
        {plan === "FREE"
          ? "Tanpa kartu kredit. Bisa upgrade kapan saja."
          : "Pembayaran diproses oleh Midtrans. Paket aktif otomatis setelah pembayaran dikonfirmasi."}
      </p>
      <p className="mt-3 text-center text-sm">
        <Link href="/#harga" className="font-medium text-[#2563EB] hover:text-[#1D4ED8]">
          Lihat paket lain
        </Link>
      </p>
    </BillingShell>
  );
}

function BillingShell({ children }: { children: React.ReactNode }) {
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
          {children}
        </div>
      </main>
    </div>
  );
}
