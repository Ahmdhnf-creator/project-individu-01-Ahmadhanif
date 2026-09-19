import Link from "next/link";

function HeroMockup() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="flex items-center gap-1.5 border-b bg-zinc-50 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400" />
        <span className="h-3 w-3 rounded-full bg-yellow-400" />
        <span className="h-3 w-3 rounded-full bg-green-400" />
        <span className="ml-3 hidden text-xs font-medium text-zinc-500 sm:block">dashboard.umkm-order.id</span>
      </div>
      <div className="flex">
        <div className="hidden w-32 border-r bg-zinc-50 p-3 sm:block">
          <p className="mb-3 text-[10px] font-semibold tracking-widest text-zinc-400">MENU</p>
          <div className="space-y-1 text-xs">
            <div className="rounded-lg bg-blue-600 px-2 py-1.5 font-medium text-white">Dashboard</div>
            <div className="rounded-lg px-2 py-1.5 text-zinc-600">Pesanan</div>
            <div className="rounded-lg px-2 py-1.5 text-zinc-600">Produk</div>
            <div className="rounded-lg px-2 py-1.5 text-zinc-600">Pelanggan</div>
            <div className="rounded-lg px-2 py-1.5 text-zinc-600">Laporan</div>
          </div>
        </div>
        <div className="flex-1 p-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl border p-3">
              <p className="text-[10px] text-zinc-500">Total Pesanan</p>
              <p className="text-lg font-bold">42</p>
              <p className="text-[10px] text-emerald-600">▲ 8 hari ini</p>
            </div>
            <div className="rounded-xl border p-3">
              <p className="text-[10px] text-zinc-500">Pendapatan</p>
              <p className="text-sm font-bold text-blue-600">Rp 4.520.000</p>
              <p className="text-[10px] text-zinc-500">contoh</p>
            </div>
            <div className="rounded-xl border p-3">
              <p className="text-[10px] text-zinc-500">Pelanggan</p>
              <p className="text-lg font-bold">98</p>
              <p className="text-[10px] text-zinc-500">aktif</p>
            </div>
          </div>
          <div className="mt-3 rounded-xl border p-3">
            <p className="mb-2 text-xs font-semibold">Status pesanan</p>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2"><span>Baru: 5</span><span className="h-1.5 w-16 rounded-full bg-amber-200"><span className="block h-1.5 w-2/3 rounded-full bg-amber-500" /></span></div>
              <div className="flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2"><span>Diproses: 8</span><span className="h-1.5 w-16 rounded-full bg-blue-200"><span className="block h-1.5 w-1/2 rounded-full bg-blue-600" /></span></div>
              <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2"><span>Selesai: 24</span><span className="h-1.5 w-16 rounded-full bg-emerald-200"><span className="block h-1.5 w-5/6 rounded-full bg-emerald-600" /></span></div>
            </div>
            <p className="mt-2 text-center text-[10px] text-zinc-400">data dummy ilustrasi</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 antialiased">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">U</span>
            <span className="text-base font-bold tracking-tight">UMKM Order</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-600 md:flex">
            <a href="#beranda" className="hover:text-zinc-900">Beranda</a>
            <a href="#fitur" className="hover:text-zinc-900">Fitur</a>
            <a href="#contoh-bisnis" className="hover:text-zinc-900">Contoh Bisnis</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="rounded-full px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">Masuk</Link>
            <Link href="/register" className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700">Daftar</Link>
          </div>
        </div>
        <div className="flex items-center justify-center gap-6 border-t bg-white px-6 py-2 text-sm font-medium text-zinc-600 md:hidden">
          <a href="#beranda" className="hover:text-zinc-900">Beranda</a>
          <a href="#fitur" className="hover:text-zinc-900">Fitur</a>
          <a href="#contoh-bisnis" className="hover:text-zinc-900">Contoh Bisnis</a>
        </div>
      </header>

      {/* Hero */}
      <section id="beranda" className="mx-auto max-w-6xl px-6 py-12 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="mb-3 inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">Untuk Laundry • Kuliner • Fashion • Jasa</p>
            <h1 className="text-4xl font-bold tracking-tight md:text-[42px] md:leading-[1.1]">
              Kelola Pesanan UMKM<br />
              <span className="text-blue-600">Lebih Mudah & Terorganisir</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-zinc-600">Satu aplikasi untuk mengelola produk, pelanggan, pesanan, dan laporan bisnis Anda.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/login" className="inline-flex h-11 items-center justify-center rounded-full bg-blue-600 px-7 text-sm font-semibold text-white hover:bg-blue-700">Mulai Sekarang</Link>
              <a href="#contoh-bisnis" className="inline-flex h-11 items-center justify-center rounded-full border px-7 text-sm font-semibold hover:bg-zinc-50">Lihat Contoh</a>
            </div>
          </div>
          <HeroMockup />
        </div>
      </section>

      {/* Contoh Bisnis */}
      <section id="contoh-bisnis" className="border-y bg-zinc-50/60">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Satu Aplikasi, Berbagai Jenis Bisnis</h2>
            <p className="mt-2 text-sm text-zinc-600">UMKM Order dapat membantu berbagai jenis usaha mengelola pesanan dengan lebih rapi.</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border bg-white p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M7 10V7a5 5 0 0 1 10 0v3" /><rect x="5" y="10" width="14" height="9" rx="2" /><path d="M9 14h.01M12 14h.01M15 14h.01" /></svg>
              </div>
              <h3 className="mt-3 text-sm font-semibold">Laundry</h3>
              <div className="mt-2 rounded-xl bg-zinc-50 p-3 text-xs leading-5 text-zinc-700">
                <p>Cuci + Setrika</p><p>5 Kg × Rp7.000</p><p className="font-semibold">Total Rp35.000</p><p className="mt-1 inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">Status: Diproses</p>
              </div>
              <p className="mt-3 text-xs leading-5 text-zinc-600">Kelola order laundry, pelanggan, berat cucian, status pengerjaan, dan pembayaran.</p>
            </div>
            <div className="rounded-2xl border bg-white p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 11h18" /><path d="M5 11V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4" /><path d="M7 15h.01M12 15h.01M17 15h.01" /><path d="M6 19h12" /></svg>
              </div>
              <h3 className="mt-3 text-sm font-semibold">Kuliner</h3>
              <div className="mt-2 rounded-xl bg-zinc-50 p-3 text-xs leading-5 text-zinc-700">
                <p>Nasi Ayam × 2</p><p>Es Teh × 2</p><p className="font-semibold">Total Rp50.000</p><p className="mt-1 inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">Status: Selesai</p>
              </div>
              <p className="mt-3 text-xs leading-5 text-zinc-600">Catat pesanan makanan, produk, pelanggan, dan transaksi dengan lebih mudah.</p>
            </div>
            <div className="rounded-2xl border bg-white p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 7l-5-3 5-2 5 2-5 3z" /><path d="M7 4v10l5 3 5-3V4" /><path d="M7 14l5 3 5-3" /></svg>
              </div>
              <h3 className="mt-3 text-sm font-semibold">Fashion</h3>
              <div className="mt-2 rounded-xl bg-zinc-50 p-3 text-xs leading-5 text-zinc-700">
                <p>Kaos Basic × 3</p><p className="font-semibold">Total Rp150.000</p><p className="mt-1 inline-flex rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-medium text-zinc-700">Status: Menunggu</p>
              </div>
              <p className="mt-3 text-xs leading-5 text-zinc-600">Kelola produk fashion, stok, pelanggan, dan pesanan dalam satu tempat.</p>
            </div>
            <div className="rounded-2xl border bg-white p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a4 4 0 0 1 8 0v2" /><path d="M12 12h.01" /></svg>
              </div>
              <h3 className="mt-3 text-sm font-semibold">Jasa</h3>
              <div className="mt-2 rounded-xl bg-zinc-50 p-3 text-xs leading-5 text-zinc-700">
                <p>Desain Logo</p><p className="font-semibold">Total Rp250.000</p><p className="mt-1 inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">Status: Diproses</p>
              </div>
              <p className="mt-3 text-xs leading-5 text-zinc-600">Kelola order jasa dan pantau status pekerjaan setiap pelanggan.</p>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-zinc-500">* Semua data di section ini adalah data dummy untuk demo, tidak dari database.</p>
        </div>
      </section>

      {/* Preview Order Table */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Pantau Pesanan Bisnis Anda</h2>
          <p className="mt-2 text-sm text-zinc-600">Mockup tabel order management modern — bukan data nyata.</p>
        </div>
        <div className="mt-8 overflow-hidden rounded-2xl border bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 text-left text-xs font-semibold text-zinc-500">
                <tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Pelanggan</th><th className="px-4 py-3">Produk</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Status</th></tr>
              </thead>
              <tbody className="divide-y">
                <tr><td className="px-4 py-3 font-medium">ORD-001</td><td className="px-4 py-3">Budi Santoso</td><td className="px-4 py-3">Laundry</td><td className="px-4 py-3">Rp35.000</td><td className="px-4 py-3"><span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">Diproses</span></td></tr>
                <tr><td className="px-4 py-3 font-medium">ORD-002</td><td className="px-4 py-3">Siti</td><td className="px-4 py-3">Nasi Ayam</td><td className="px-4 py-3">Rp50.000</td><td className="px-4 py-3"><span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">Selesai</span></td></tr>
                <tr><td className="px-4 py-3 font-medium">ORD-003</td><td className="px-4 py-3">Andi</td><td className="px-4 py-3">Kaos Basic</td><td className="px-4 py-3">Rp150.000</td><td className="px-4 py-3"><span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">Menunggu</span></td></tr>
                <tr><td className="px-4 py-3 font-medium">ORD-004</td><td className="px-4 py-3">Rina</td><td className="px-4 py-3">Desain Logo</td><td className="px-4 py-3">Rp250.000</td><td className="px-4 py-3"><span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">Diproses</span></td></tr>
              </tbody>
            </table>
          </div>
          <p className="border-t bg-zinc-50 px-4 py-2 text-center text-xs text-zinc-500">Visual mockup — tidak terhubung ke database.</p>
        </div>
      </section>

      {/* Fitur */}
      <section id="fitur" className="border-y bg-zinc-50/50">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Semua yang Dibutuhkan untuk Mengelola Pesanan</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {[
              { t: "Manajemen Produk", d: "Kelola daftar produk dan informasi bisnis.", i: "◧" },
              { t: "Pelanggan", d: "Simpan dan kelola data pelanggan.", i: "◎" },
              { t: "Pesanan", d: "Pantau pesanan dari dibuat hingga selesai.", i: "☰" },
              { t: "Laporan", d: "Lihat ringkasan aktivitas dan transaksi bisnis.", i: "▦" },
              { t: "Dashboard", d: "Pantau kondisi bisnis dari satu halaman.", i: "⬢" },
            ].map((f) => (
              <div key={f.t} className="rounded-2xl border bg-white p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">{f.i}</div>
                <h3 className="mt-3 text-sm font-semibold">{f.t}</h3>
                <p className="mt-1 text-sm leading-6 text-zinc-600">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kenapa */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Bisnis Lebih Rapi, Pengelolaan Lebih Mudah</h2>
            <ul className="mt-6 space-y-3 text-sm">
              {["Pesanan lebih terorganisir", "Data pelanggan tersimpan dengan rapi", "Produk lebih mudah dikelola", "Status pesanan mudah dipantau", "Informasi bisnis tersedia dalam satu dashboard"].map((p) => (
                <li key={p} className="flex gap-3">
                  <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-blue-600 text-xs text-white">✓</span>
                  <span className="text-zinc-700">{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold">Ringkasan cepat</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-xl border bg-zinc-50 p-4"><p className="text-xs text-zinc-500">Pesanan aktif</p><p className="text-xl font-bold">13</p></div>
              <div className="rounded-xl border bg-zinc-50 p-4"><p className="text-xs text-zinc-500">Pelanggan</p><p className="text-xl font-bold">98</p></div>
              <div className="rounded-xl border bg-zinc-50 p-4"><p className="text-xs text-zinc-500">Produk</p><p className="text-xl font-bold">42</p></div>
              <div className="rounded-xl border bg-blue-600 p-4 text-white"><p className="text-xs text-blue-100">Omzet</p><p className="text-xl font-bold">Rp 4.5jt</p></div>
            </div>
            <p className="mt-3 text-center text-xs text-zinc-400">mockup visual — dummy</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="rounded-3xl bg-blue-600 px-6 py-10 text-center text-white md:px-12 md:py-14">
          <h2 className="text-2xl font-bold md:text-3xl">Siap Mengelola Pesanan dengan Lebih Mudah?</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-blue-100">Mulai kelola produk, pelanggan, dan pesanan bisnis Anda dalam satu aplikasi.</p>
          <Link href="/login" className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-blue-600 hover:bg-zinc-100">Mulai Sekarang</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <p className="text-sm font-bold">UMKM Order</p>
              <p className="mt-2 text-sm leading-6 text-zinc-600">Aplikasi sederhana untuk membantu UMKM mengelola pesanan dan bisnis dengan lebih terorganisir.</p>
            </div>
            <div className="flex gap-8 text-sm">
              <div className="space-y-2">
                <p className="font-semibold">Navigasi</p>
                <a href="#beranda" className="block text-zinc-600 hover:text-zinc-900">Beranda</a>
                <a href="#fitur" className="block text-zinc-600 hover:text-zinc-900">Fitur</a>
                <a href="#contoh-bisnis" className="block text-zinc-600 hover:text-zinc-900">Contoh Bisnis</a>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Akun</p>
                <Link href="/login" className="block text-zinc-600 hover:text-zinc-900">Masuk</Link>
                <Link href="/register" className="block text-zinc-600 hover:text-zinc-900">Daftar</Link>
              </div>
            </div>
            <div className="text-sm text-zinc-500 md:text-right">© 2026 UMKM Order</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
