import { GlobeIcon, OrdersIcon, PackageIcon, TrendIcon } from "./icons";

const features = [
  {
    icon: OrdersIcon,
    title: "Pesanan lebih rapi",
    desc: "Semua pesanan tersusun dengan status yang jelas, dari Baru sampai Selesai — tidak ada yang tercecer.",
    chip: "Baru → Diproses → Selesai",
  },
  {
    icon: PackageIcon,
    title: "Produk, jasa, dan sewa",
    desc: "Satu katalog untuk barang, layanan jasa, dan rental harian, lengkap dengan stok dan tanggal sewa.",
    chip: "BARANG · JASA · SEWA",
  },
  {
    icon: GlobeIcon,
    title: "Pelanggan bisa order sendiri",
    desc: "Bagikan satu link katalog. Pelanggan pilih produk, isi WhatsApp, dan checkout sendiri tanpa login.",
    chip: "Tanpa login",
  },
  {
    icon: TrendIcon,
    title: "Pantau proses sampai selesai",
    desc: "Ikuti progres tiap pesanan secara real-time dan lihat ringkasan penjualan kapan pun kamu butuh.",
    chip: "Laporan 7 hari terakhir",
  },
];

export function FeatureBlocks() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((f) => (
        <div
          key={f.title}
          className="group rounded-[16px] border border-[#E2E8F0] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#BFDBFE] hover:shadow-[0_18px_40px_-28px_rgba(37,99,235,0.6)]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#EFF6FF] text-[#2563EB] transition-colors duration-300 group-hover:bg-[#2563EB] group-hover:text-white">
            <f.icon className="h-5 w-5" />
          </span>
          <h3 className="mt-4 text-[15px] font-bold tracking-tight text-[#0F172A]">{f.title}</h3>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">{f.desc}</p>
          <span className="mt-4 inline-flex rounded-[8px] bg-[#F8FAFC] px-2.5 py-1 text-[11px] font-semibold text-[#64748B] ring-1 ring-[#E2E8F0]">
            {f.chip}
          </span>
        </div>
      ))}
    </div>
  );
}
