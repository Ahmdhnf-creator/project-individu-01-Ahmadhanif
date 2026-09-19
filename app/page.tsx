import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 antialiased">
      {/* Navbar - sangat sederhana */}
      <header className="border-b border-zinc-100">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-[15px] font-semibold tracking-tight">
            UMKM Order
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-zinc-600 sm:flex">
            <a href="#fitur" className="hover:text-zinc-900">
              Fitur
            </a>
            <a href="#contoh" className="hover:text-zinc-900">
              Contoh Bisnis
            </a>
          </nav>
          <div className="flex items-center gap-1 text-sm">
            <Link href="/login" className="px-3 py-2 font-medium text-zinc-600 hover:text-zinc-900">
              Masuk
            </Link>
            <Link href="/register" className="rounded-full bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-800">
              Daftar
            </Link>
          </div>
        </div>
      </header>

      {/* Hero - clean fokus utama */}
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-16 md:pb-20 md:pt-24">
        <div className="max-w-2xl">
          <h1 className="text-[34px] font-semibold leading-[1.1] tracking-tight md:text-[44px]">
            Kelola Pesanan UMKM
            <br />
            Lebih Mudah.
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-7 text-zinc-600">
            Kelola produk, pelanggan, dan pesanan bisnis Anda dalam satu tempat.
          </p>
          <div className="mt-7 flex gap-3">
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-full bg-blue-600 px-6 text-sm font-medium text-white hover:bg-blue-700"
            >
              Mulai Sekarang
            </Link>
            <a
              href="#fitur"
              className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 px-6 text-sm font-medium hover:bg-zinc-50"
            >
              Lihat Fitur
            </a>
          </div>
        </div>

        {/* Satu mockup tabel minimal */}
        <div className="mt-12 overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div className="border-b border-zinc-100 px-5 py-3">
            <p className="text-sm font-medium">Pesanan Terbaru</p>
            <p className="text-xs text-zinc-500">data dummy ilustrasi</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-100 text-xs font-medium text-zinc-500">
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Pelanggan</th>
                  <th className="px-5 py-3 font-medium">Produk</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <tr className="text-sm">
                  <td className="px-5 py-3.5 font-medium">ORD-001</td>
                  <td className="px-5 py-3.5 text-zinc-600">Budi Santoso</td>
                  <td className="px-5 py-3.5 text-zinc-600">Laundry</td>
                  <td className="px-5 py-3.5">Rp35.000</td>
                  <td className="px-5 py-3.5">
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">Diproses</span>
                  </td>
                </tr>
                <tr className="text-sm">
                  <td className="px-5 py-3.5 font-medium">ORD-002</td>
                  <td className="px-5 py-3.5 text-zinc-600">Siti</td>
                  <td className="px-5 py-3.5 text-zinc-600">Nasi Ayam</td>
                  <td className="px-5 py-3.5">Rp50.000</td>
                  <td className="px-5 py-3.5">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">Selesai</span>
                  </td>
                </tr>
                <tr className="text-sm">
                  <td className="px-5 py-3.5 font-medium">ORD-003</td>
                  <td className="px-5 py-3.5 text-zinc-600">Andi</td>
                  <td className="px-5 py-3.5 text-zinc-600">Kaos Basic</td>
                  <td className="px-5 py-3.5">Rp150.000</td>
                  <td className="px-5 py-3.5">
                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">Menunggu</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Contoh Bisnis - kecil sederhana */}
      <section id="contoh" className="border-y border-zinc-100 bg-zinc-50/40">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-lg font-semibold tracking-tight">Untuk berbagai jenis usaha</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm font-medium">Laundry</p>
              <p className="mt-1 text-sm leading-6 text-zinc-600">Kelola order cucian dan pelanggan.</p>
            </div>
            <div>
              <p className="text-sm font-medium">Kuliner</p>
              <p className="mt-1 text-sm leading-6 text-zinc-600">Catat pesanan dan transaksi.</p>
            </div>
            <div>
              <p className="text-sm font-medium">Fashion</p>
              <p className="mt-1 text-sm leading-6 text-zinc-600">Kelola produk dan pesanan.</p>
            </div>
            <div>
              <p className="text-sm font-medium">Jasa</p>
              <p className="mt-1 text-sm leading-6 text-zinc-600">Pantau order dan status pekerjaan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Fitur - sederhana */}
      <section id="fitur" className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-lg font-semibold tracking-tight">Semua yang Anda butuhkan.</h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-sm text-zinc-700">◧</div>
            <p className="mt-3 text-sm font-medium">Produk</p>
            <p className="mt-1 text-sm leading-6 text-zinc-600">Kelola daftar produk dengan mudah.</p>
          </div>
          <div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-sm text-zinc-700">◎</div>
            <p className="mt-3 text-sm font-medium">Pelanggan</p>
            <p className="mt-1 text-sm leading-6 text-zinc-600">Simpan data pelanggan dengan rapi.</p>
          </div>
          <div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-sm text-zinc-700">☰</div>
            <p className="mt-3 text-sm font-medium">Pesanan</p>
            <p className="mt-1 text-sm leading-6 text-zinc-600">Pantau pesanan dari awal hingga selesai.</p>
          </div>
          <div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-sm text-zinc-700">▦</div>
            <p className="mt-3 text-sm font-medium">Laporan</p>
            <p className="mt-1 text-sm leading-6 text-zinc-600">Lihat ringkasan transaksi bisnis.</p>
          </div>
        </div>
      </section>

      {/* CTA - sangat sederhana */}
      <section className="border-y border-zinc-100">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <h2 className="text-xl font-semibold tracking-tight">Mulai kelola pesanan bisnis Anda.</h2>
          <Link
            href="/login"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-blue-600 px-6 text-sm font-medium text-white hover:bg-blue-700"
          >
            Mulai Sekarang
          </Link>
        </div>
      </section>

      {/* Footer - minimal */}
      <footer className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">UMKM Order</p>
            <p className="mt-1 text-sm text-zinc-600">Kelola bisnis lebih mudah.</p>
          </div>
          <nav className="flex gap-4 text-sm text-zinc-600">
            <a href="#" className="hover:text-zinc-900">
              Beranda
            </a>
            <a href="#fitur" className="hover:text-zinc-900">
              Fitur
            </a>
            <Link href="/login" className="hover:text-zinc-900">
              Masuk
            </Link>
            <Link href="/register" className="hover:text-zinc-900">
              Daftar
            </Link>
          </nav>
        </div>
        <p className="mt-6 text-xs text-zinc-500">© 2026 UMKM Order</p>
      </footer>
    </div>
  );
}
