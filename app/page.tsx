import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      {/* Navbar - clean tidak tinggi */}
      <header className="border-b border-slate-200">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-[15px] font-semibold tracking-tight text-slate-900">
            UMKM Order
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-slate-500 sm:flex">
            <a href="#beranda" className="hover:text-slate-900">
              Beranda
            </a>
            <a href="#fitur" className="hover:text-slate-900">
              Fitur
            </a>
            <a href="#contoh" className="hover:text-slate-900">
              Contoh Bisnis
            </a>
          </nav>
          <div className="flex items-center gap-1 text-sm">
            <Link href="/login" className="px-3 py-2 font-medium text-slate-500 hover:text-slate-900">
              Masuk
            </Link>
            <Link href="/register" className="rounded-full bg-[#2563EB] px-4 py-2 font-medium text-white hover:bg-[#1D4ED8]">
              Daftar
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="beranda" className="mx-auto max-w-5xl px-6 pb-16 pt-16 md:pb-20 md:pt-24">
        <div className="max-w-2xl">
          <h1 className="text-[34px] font-semibold leading-[1.1] tracking-tight text-slate-900 md:text-[44px]">
            Kelola Pesanan UMKM
            <br />
            Lebih Mudah.
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-7 text-slate-500">
            Kelola produk, pelanggan, dan pesanan bisnis Anda dalam satu tempat.
          </p>
          <div className="mt-7 flex gap-3">
            <Link href="/login" className="inline-flex h-10 items-center justify-center rounded-full bg-[#2563EB] px-6 text-sm font-medium text-white hover:bg-[#1D4ED8]">
              Mulai Sekarang
            </Link>
            <a href="#fitur" className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 px-6 text-sm font-medium text-slate-900 hover:bg-slate-50">
              Lihat Fitur
            </a>
          </div>
        </div>

        {/* Mockup - bg #F8FAFC border #E2E8F0 shadow halus */}
        <div className="mt-12 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
          <div className="border-b border-slate-200 bg-white px-5 py-3">
            <p className="text-sm font-medium text-slate-900">Pesanan Terbaru</p>
            <p className="text-xs text-slate-500">data dummy ilustrasi</p>
          </div>
          <div className="bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-medium text-slate-500">
                    <th className="px-5 py-3 font-medium">Order</th>
                    <th className="px-5 py-3 font-medium">Pelanggan</th>
                    <th className="px-5 py-3 font-medium">Produk</th>
                    <th className="px-5 py-3 font-medium">Total</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-900">ORD-001</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">Budi Santoso</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">Laundry</td>
                    <td className="px-5 py-3.5 text-sm text-slate-900">Rp35.000</td>
                    <td className="px-5 py-3.5">
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-[#D97706]">Diproses</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-900">ORD-002</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">Siti</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">Nasi Ayam</td>
                    <td className="px-5 py-3.5 text-sm text-slate-900">Rp50.000</td>
                    <td className="px-5 py-3.5">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-[#16A34A]">Selesai</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-900">ORD-003</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">Andi</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">Kaos Basic</td>
                    <td className="px-5 py-3.5 text-sm text-slate-900">Rp150.000</td>
                    <td className="px-5 py-3.5">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">Menunggu</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Contoh Bisnis */}
      <section id="contoh" className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">Untuk berbagai jenis usaha</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm font-medium text-slate-900">Laundry</p>
              <p className="mt-1 text-sm leading-6 text-slate-500">Kelola order cucian dan pelanggan.</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Kuliner</p>
              <p className="mt-1 text-sm leading-6 text-slate-500">Catat pesanan dan transaksi.</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Fashion</p>
              <p className="mt-1 text-sm leading-6 text-slate-500">Kelola produk dan pesanan.</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Jasa</p>
              <p className="mt-1 text-sm leading-6 text-slate-500">Pantau order dan status pekerjaan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Fitur */}
      <section id="fitur" className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">Semua yang Anda butuhkan.</h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm text-slate-900">◧</div>
            <p className="mt-3 text-sm font-medium text-slate-900">Produk</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">Kelola daftar produk dengan mudah.</p>
          </div>
          <div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm text-slate-900">◎</div>
            <p className="mt-3 text-sm font-medium text-slate-900">Pelanggan</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">Simpan data pelanggan dengan rapi.</p>
          </div>
          <div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm text-slate-900">☰</div>
            <p className="mt-3 text-sm font-medium text-slate-900">Pesanan</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">Pantau pesanan dari awal hingga selesai.</p>
          </div>
          <div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm text-slate-900">▦</div>
            <p className="mt-3 text-sm font-medium text-slate-900">Laporan</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">Lihat ringkasan transaksi bisnis.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-y border-slate-200">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Mulai kelola pesanan bisnis Anda.</h2>
          <Link href="/login" className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-[#2563EB] px-6 text-sm font-medium text-white hover:bg-[#1D4ED8]">
            Mulai Sekarang
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">UMKM Order</p>
            <p className="mt-1 text-sm text-slate-500">Kelola bisnis lebih mudah.</p>
          </div>
          <nav className="flex gap-4 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-900">
              Beranda
            </a>
            <a href="#fitur" className="hover:text-slate-900">
              Fitur
            </a>
            <Link href="/login" className="hover:text-slate-900">
              Masuk
            </Link>
            <Link href="/register" className="hover:text-slate-900">
              Daftar
            </Link>
          </nav>
        </div>
        <p className="mt-6 text-xs text-slate-500">© 2026 UMKM Order</p>
      </footer>
    </div>
  );
}
