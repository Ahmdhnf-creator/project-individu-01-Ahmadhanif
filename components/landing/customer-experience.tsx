import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon, ChevronDownIcon, LinkIcon, CheckIcon } from "./icons";

const catalogProducts = [
  { name: "Kaos Polo", type: "BARANG", price: "Rp 75.000", unit: "pcs", stock: "Stok: 24" },
  { name: "Cuci Kering", type: "JASA", price: "Rp 5.000", unit: "kg", stock: "Selalu tersedia" },
  { name: "Sewa Kamera", type: "SEWA", price: "Rp 150.000", unit: "hari", stock: "Selalu tersedia" },
  { name: "Kue Lapis", type: "BARANG", price: "Rp 35.000", unit: "box", stock: "Stok: 8" },
];

function CatalogMockup() {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-[0_20px_56px_-40px_rgba(15,23,42,0.5)] sm:p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-[#0F172A]">Katalog</p>
          <p className="mt-0.5 text-[11px] text-[#64748B]">Pilih produk, jasa, atau sewa</p>
        </div>
        <span className="rounded-full bg-[#F8FAFC] px-2.5 py-1 text-[10px] font-semibold text-[#64748B] ring-1 ring-[#E2E8F0]">
          Tanpa login
        </span>
      </div>

      <div className="mt-3.5 grid grid-cols-2 gap-2.5">
        {catalogProducts.map((p) => (
          <div key={p.name} className="rounded-[12px] border border-[#E2E8F0] bg-white p-3">
            <p className="truncate text-[12px] font-bold text-[#0F172A]">{p.name}</p>
            <div className="mt-1 flex items-center gap-1.5">
              <Badge className="px-1.5 py-0.5 text-[9px]">{p.type}</Badge>
              <span className="text-[10px] text-[#64748B]">/ {p.unit}</span>
            </div>
            <p className="mt-1.5 text-[12px] font-bold text-[#0F172A]">
              {p.price} <span className="font-normal text-[#64748B]">/ {p.unit}</span>
            </p>
            <p className="mt-0.5 text-[10px] text-[#64748B]">{p.stock}</p>
            <button
              type="button"
              tabIndex={-1}
              className="mt-2 h-7 w-full rounded-[8px] bg-[#2563EB] text-[11px] font-semibold text-white"
            >
              Tambah
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CheckoutMockup() {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-[0_20px_56px_-40px_rgba(15,23,42,0.5)] sm:p-5">
      <p className="text-sm font-bold text-[#0F172A]">Keranjang</p>

      <div className="mt-3 rounded-[12px] border border-[#E2E8F0] p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[12px] font-semibold text-[#0F172A]">Cuci Kering</span>
          <span className="flex shrink-0 items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-[6px] border border-[#E2E8F0] text-[10px] text-[#64748B]">
              −
            </span>
            <span className="text-[11px] font-semibold">2</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-[6px] border border-[#E2E8F0] text-[10px] text-[#64748B]">
              +
            </span>
          </span>
        </div>
        <p className="mt-1 text-[10px] text-[#64748B]">Rp 5.000 / kg</p>
      </div>

      <div className="mt-2.5 flex items-center justify-between border-t border-[#E2E8F0] pt-2.5 text-[12px] font-bold text-[#0F172A]">
        <span>Total</span>
        <span>Rp 10.000</span>
      </div>

      <div className="mt-3 space-y-2">
        <div>
          <p className="text-[10px] font-semibold text-[#64748B]">Nama Anda</p>
          <div className="mt-1 rounded-[10px] border border-[#E2E8F0] bg-white px-2.5 py-1.5 text-[11px] text-[#0F172A]">
            Budi Santoso
          </div>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-[#64748B]">WhatsApp</p>
          <div className="mt-1 rounded-[10px] border border-[#E2E8F0] bg-white px-2.5 py-1.5 text-[11px] text-[#0F172A]">
            0812 3456 7890
          </div>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-[#64748B]">Alamat (opsional)</p>
          <div className="mt-1 rounded-[10px] border border-[#E2E8F0] bg-white px-2.5 py-1.5 text-[11px] text-[#64748B]">
            Jl. Melati No. 12, Bandung
          </div>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-[#64748B]">Metode Bayar</p>
          <div className="mt-1 flex items-center justify-between rounded-[10px] border border-[#E2E8F0] bg-white px-2.5 py-1.5 text-[11px] text-[#0F172A]">
            <span>QRIS</span>
            <ChevronDownIcon className="h-3.5 w-3.5 text-[#64748B]" />
          </div>
        </div>
      </div>

      <button
        type="button"
        tabIndex={-1}
        className="mt-3 h-9 w-full rounded-[12px] bg-[#2563EB] text-[12px] font-semibold text-white"
      >
        Checkout
      </button>
    </div>
  );
}

export function CustomerExperience() {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#BBF7D0] bg-[#ECFDF5] px-3 py-1 text-[11px] font-bold text-[#16A34A]">
          <CheckIcon className="h-3.5 w-3.5" />
          Tanpa login & tanpa install aplikasi
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1 text-[11px] font-semibold text-[#64748B]">
          <LinkIcon className="h-3.5 w-3.5 text-[#2563EB]" />
          orderku.app/toko-sari
        </span>
      </div>

      <div className="relative mt-5 grid gap-4 md:grid-cols-2 md:gap-5">
        <CatalogMockup />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#2563EB] shadow-[0_8px_20px_-8px_rgba(15,23,42,0.3)] md:flex"
        >
          <ArrowRightIcon className="h-4 w-4" />
        </div>
        <CheckoutMockup />
      </div>
    </div>
  );
}
