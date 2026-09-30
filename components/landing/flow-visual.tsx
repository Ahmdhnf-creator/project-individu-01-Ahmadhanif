import Image from "next/image";
import flowImage from "@/public/image/landing/flow-checkout.png";

const steps = [
  {
    n: "1",
    title: "Katalog",
    desc: "Pelanggan buka link katalog dan memilih produk, jasa, atau sewa.",
  },
  {
    n: "2",
    title: "Checkout",
    desc: "Isi nama, WhatsApp, alamat, lalu pilih metode pembayaran.",
  },
  {
    n: "3",
    title: "Pesanan diproses",
    desc: "Pesanan masuk dashboard, status diperbarui Baru → Diproses → Selesai.",
  },
  {
    n: "4",
    title: "Selesai",
    desc: "Pesanan beres, pelanggan langsung tahu tanpa perlu ditanya-tanya.",
  },
];

export function FlowVisual() {
  return (
    <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-12">
      <ol className="space-y-3">
        {steps.map((s) => (
          <li
            key={s.n}
            className="flex gap-3.5 rounded-[16px] border border-white/80 bg-white p-4 shadow-[0_10px_28px_-22px_rgba(15,23,42,0.5)] transition-transform duration-300 hover:-translate-y-0.5"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-xs font-bold text-white">
              {s.n}
            </span>
            <span>
              <span className="block text-sm font-bold text-[#0F172A]">{s.title}</span>
              <span className="mt-0.5 block text-[13px] leading-5 text-[#64748B]">{s.desc}</span>
            </span>
          </li>
        ))}
      </ol>

      <figure className="overflow-hidden rounded-[20px] border border-[#BFDBFE] bg-white p-3 shadow-[0_24px_64px_-44px_rgba(15,23,42,0.5)] sm:p-4">
        <Image
          src={flowImage}
          alt="Alur pesanan OrderKu: katalog, checkout, detail pesanan, sampai pesanan berhasil"
          className="h-auto w-full rounded-[14px]"
        />
        <figcaption className="px-1 pt-3 text-center text-[11px] text-[#94A3B8]">
          Katalog → Checkout → Status pesanan → Pesanan berhasil
        </figcaption>
      </figure>
    </div>
  );
}
