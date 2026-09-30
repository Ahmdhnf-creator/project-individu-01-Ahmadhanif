import Image from "next/image";
import ownerBefore from "@/public/image/landing/owner-before.png";
import { Badge } from "@/components/ui/badge";
import { CheckCircleIcon, MessageIcon, NoteIcon, CalculatorIcon, XCircleIcon, CheckIcon } from "./icons";

const beforeItems = [
  "Pesan dari WhatsApp tercecer di banyak chat",
  "Catatan manual di buku & sticky notes",
  "Pembayaran dicek satu-satu",
];

const afterItems = [
  "Semua pesanan tersusun dalam satu tempat",
  "Status jelas dari Baru sampai Selesai",
  "Katalog & laporan penjualan otomatis",
];

const statusSummary = [
  { label: "Baru", value: "5", className: "bg-slate-100 text-[#64748B]" },
  { label: "Diproses", value: "8", className: "bg-amber-50 text-[#D97706]" },
  { label: "Dikirim", value: "3", className: "bg-blue-50 text-[#2563EB]" },
  { label: "Selesai", value: "24", className: "bg-emerald-50 text-[#16A34A]" },
];

const orderRows = [
  { id: "#ORD-0066", item: "Cuci Kering ×2", status: "Baru", variant: "baru" },
  { id: "#ORD-0065", item: "Sewa Kamera · 3 hari", status: "Diproses", variant: "diproses" },
  { id: "#ORD-0063", item: "Kue Lapis ×2", status: "Selesai", variant: "selesai" },
];

export function BeforeAfter() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <article className="overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white">
        <div className="relative">
          <Image
            src={ownerBefore}
            alt="Pemilik usaha kewalahan menghadapi pesanan manual di depan laptop"
            className="aspect-[16/9] w-full object-cover grayscale"
          />
          <div className="pointer-events-none absolute inset-0 bg-[#0F172A]/25" />
          <div className="absolute bottom-3 left-3 right-3 space-y-1.5">
            <div className="max-w-[80%] rounded-[12px] rounded-bl-[4px] bg-white px-3 py-2 shadow-[0_8px_20px_-10px_rgba(15,23,42,0.5)]">
              <p className="flex items-center gap-1.5 text-[10px] font-bold text-[#64748B]">
                <MessageIcon className="h-3 w-3" /> WhatsApp
              </p>
              <p className="mt-0.5 text-[11px] leading-4 text-[#0F172A]">
                “Kak, pesanan aku masih diproses gak?”
              </p>
            </div>
            <div className="ml-auto max-w-[80%] rounded-[12px] rounded-br-[4px] bg-white px-3 py-2 shadow-[0_8px_20px_-10px_rgba(15,23,42,0.5)]">
              <p className="flex items-center gap-1.5 text-[10px] font-bold text-[#64748B]">
                <MessageIcon className="h-3 w-3" /> WhatsApp
              </p>
              <p className="mt-0.5 text-[11px] leading-4 text-[#0F172A]">
                “Barangnya ready gak, kak? Sama kemarin transfer udah masuk?”
              </p>
            </div>
          </div>
        </div>

        <div className="p-5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#DC2626]">
            Sebelum
          </span>
          <p className="mt-3 text-[15px] font-bold leading-6 text-[#0F172A]">
            Pesanan dari WhatsApp. Catatan di buku. Pembayaran dicek satu-satu.
          </p>
          <ul className="mt-4 space-y-2.5">
            {beforeItems.map((t) => (
              <li key={t} className="flex items-start gap-2.5 text-sm leading-6 text-[#64748B]">
                <XCircleIcon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#DC2626]" />
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-2 border-t border-[#E2E8F0] pt-4 text-[#94A3B8]">
            <NoteIcon className="h-5 w-5" />
            <CalculatorIcon className="h-5 w-5" />
            <MessageIcon className="h-5 w-5" />
          </div>
        </div>
      </article>

      <article className="overflow-hidden rounded-[20px] border border-[#BFDBFE] bg-[#F8FBFF]">
        <div className="p-5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2563EB] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white">
            Dengan Bulan-01
          </span>
          <p className="mt-3 text-[15px] font-bold leading-6 text-[#0F172A]">
            Semua pesanan tersusun dalam satu tempat.
          </p>
          <ul className="mt-4 space-y-2.5">
            {afterItems.map((t) => (
              <li key={t} className="flex items-start gap-2.5 text-sm leading-6 text-[#64748B]">
                <CheckCircleIcon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#16A34A]" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="px-5 pb-5">
          <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.5)]">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-bold text-[#0F172A]">Pesanan hari ini</p>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-[#16A34A]">
                <CheckIcon className="h-3.5 w-3.5" /> Tersinkron
              </span>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-1.5">
              {statusSummary.map((s) => (
                <div key={s.label} className={`rounded-[10px] px-1.5 py-2 text-center ${s.className}`}>
                  <p className="text-[15px] font-extrabold leading-none">{s.value}</p>
                  <p className="mt-1 text-[9px] font-semibold">{s.label}</p>
                </div>
              ))}
            </div>

            <ul className="mt-3 space-y-2">
              {orderRows.map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-2 rounded-[10px] bg-[#F8FAFC] px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-bold text-[#0F172A]">{o.id}</p>
                    <p className="truncate text-[10px] text-[#64748B]">{o.item}</p>
                  </div>
                  <Badge variant={o.variant} className="shrink-0 px-2 py-0.5 text-[10px]">
                    {o.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>
    </div>
  );
}
