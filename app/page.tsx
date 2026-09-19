import Link from "next/link";

function DashboardMockup() {
  return (
    <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="flex items-center gap-1.5 border-b bg-zinc-50 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400" />
        <span className="h-3 w-3 rounded-full bg-yellow-400" />
        <span className="h-3 w-3 rounded-full bg-green-400" />
        <span className="ml-3 text-xs font-medium text-zinc-500">dashboard.umkm-order.id</span>
      </div>
      <div className="flex">
        <div className="hidden w-36 border-r bg-zinc-50 p-3 sm:block">
          <div className="mb-4 text-[10px] font-semibold tracking-widest text-zinc-400">MENU</div>
          <div className="space-y-1">
            <div className="rounded-lg bg-blue-600 px-2 py-1.5 text-xs font-medium text-white">Dashboard</div>
            <div className="rounded-lg px-2 py-1.5 text-xs text-zinc-600">Pesanan</div>
            <div className="rounded-lg px-2 py-1.5 text-xs text-zinc-600">Produk</div>
            <div className="rounded-lg px-2 py-1.5 text-xs text-zinc-600">Pelanggan</div>
            <div className="rounded-lg px-2 py-1.5 text-xs text-zinc-600">Laporan</div>
          </div>
        </div>
        <div className="flex-1 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold text-zinc-700">Ringkasan Pesanan</p>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">Hari ini</span>
          </div>
          <div className="mb-4 grid grid-cols-3 gap-2">
            <div className="rounded-xl border bg-white p-2.5">
              <p className="text-[10px] text-zinc-500">Baru</p>
              <p className="text-sm font-bold">12</p>
              <div className="mt-1 h-1 rounded-full bg-zinc-100"><div className="h-1 w-2/3 rounded-full bg-blue-600" /></div>
            </div>
            <div className="rounded-xl border bg-white p-2.5">
              <p className="text-[10px] text-zinc-500">Diproses</p>
              <p className="text-sm font-bold">8</p>
              <div className="mt-1 h-1 rounded-full bg-zinc-100"><div className="h-1 w-1/2 rounded-full bg-amber-500" /></div>
            </div>
            <div className="rounded-xl border bg-white p-2.5">
              <p className="text-[10px] text-zinc-500">Selesai</p>
              <p className="text-sm font-bold">24</p>
              <div className="mt-1 h-1 rounded-full bg-zinc-100"><div className="h-1 w-4/5 rounded-full bg-emerald-500" /></div>
            </div>
          </div>
          <div className="rounded-xl border p-3">
            <p className="mb-2 text-xs font-medium text-zinc-700">Pesanan terbaru</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2">
                <div><p className="text-xs font-medium">#ORD-124</p><p className="text-[10px] text-zinc-500">Budi • 3 item</p></div>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">Diproses</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2">
                <div><p className="text-xs font-medium">#ORD-123</p><p className="text-[10px] text-zinc-500">Siti • 2 item</p></div>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">Baru</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2">
                <div><p className="text-xs font-medium">#ORD-122</p><p className="text-[10px] text-zinc-500">Andi • 1 item</p></div>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">Selesai</span>
              </div>
            </div>
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
            <a href="#tentang" className="hover:text-zinc-900">Tentang</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="rounded-full px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
              Masuk
            </Link>
            <Link href="/register" className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Daftar
            </Link>
          </div>
        </div>
        {/* mobile menu */}
        <div className="flex items-center justify-center gap-6 border-t bg-white px-6 py-2 text-sm font-medium text-zinc-600 md:hidden">
          <a href="#beranda" className="hover:text-zinc-900">Beranda</a>
          <a href="#fitur" className="hover:text-zinc-900">Fitur</a>
          <a href="#tentang" className="hover:text-zinc-900">Tentang</a>
        </div>
      </header>

      {/* Hero */}
      <section id="beranda" className="mx-auto max-w-6xl px-6 py-12 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="mb-3 inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              Aplikasi SaaS untuk UMKM Indonesia
            </p>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl md:leading-[1.1]">
              Kelola Pesanan UMKM,<br />
              <span className="text-blue-600">Mudah & Efisien</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-zinc-600">
              Aplikasi Order Management untuk membantu UMKM mengelola produk, pelanggan, pesanan, dan laporan dalam satu
              dashboard.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/login" className="inline-flex h-11 items-center justify-center rounded-full bg-blue-600 px-7 text-sm font-semibold text-white hover:bg-blue-700">
                Mulai Sekarang
              </Link>
              <a href="#fitur" className="inline-flex h-11 items-center justify-center rounded-full border px-7 text-sm font-semibold hover:bg-zinc-50">
                Lihat Fitur
              </a>
            </div>
            <p className="mt-3 text-xs text-zinc-500">Gratis untuk MVP • Tidak perlu kartu kredit</p>
          </div>
          <div className="relative">
            <DashboardMockup />
            <div className="pointer-events-none absolute -bottom-4 -left-4 hidden rounded-xl border bg-white p-3 shadow-sm md:block">
              <p className="text-xs font-medium">Omzet hari ini</p>
              <p className="text-lg font-bold text-blue-600">Rp 4.520.000</p>
              <p className="text-[10px] text-emerald-600">▲ 12% dari kemarin</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 5 cards */}
      <section id="fitur" className="border-y bg-zinc-50/50">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Fitur utama untuk UMKM</h2>
            <p className="mt-2 text-sm text-zinc-600">Dirancang sederhana, fokus pada yang paling dibutuhkan bisnis harian.</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { title: "Manajemen Produk", desc: "Tambah, ubah stok dan harga produk dengan validasi dan pencarian cepat.", icon: "◧" },
              { title: "Data Pelanggan", desc: "Simpan nama, WA, alamat pelanggan dan riwayat pesanannya.", icon: "◎" },
              { title: "Kelola Pesanan", desc: "Buat pesanan multi-item, atur status Baru → Diproses → Dikirim → Selesai.", icon: "☰" },
              { title: "Laporan Lengkap", desc: "Omzet harian/mingguan/bulanan, per pelanggan, plus export CSV.", icon: "▦" },
              { title: "Aman & Terpercaya", desc: "Role ADMIN/STAFF/PELANGGAN, session aman, stok tidak pernah minus.", icon: "⬢" },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border bg-white p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">{f.icon}</div>
                <h3 className="mt-3 text-sm font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm leading-6 text-zinc-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Semua kebutuhan */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Semua kebutuhan bisnis dalam satu tempat</h2>
          <p className="mt-2 text-sm text-zinc-600">Satu dashboard untuk operasional harian.</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {[
            { k: "Produk", d: "Kelola harga & stok, cegah stok minus saat pesanan selesai.", n: "248" },
            { k: "Pelanggan", d: "Data terpusat, mudah dicari dan dipakai ulang saat order.", n: "98" },
            { k: "Pesanan", d: "Multi-item, Transfer/COD, upload bukti & verifikasi.", n: "152" },
            { k: "Laporan", d: "Chart omzet & tabel per pelanggan untuk pantau bisnis.", n: "4.5jt" },
          ].map((c) => (
            <div key={c.k} className="rounded-2xl border p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{c.k}</p>
                <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-xs font-medium text-white">{c.n}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{c.d}</p>
              <div className="mt-4 h-1.5 rounded-full bg-zinc-100"><div className="h-1.5 w-2/3 rounded-full bg-blue-600" /></div>
            </div>
          ))}
        </div>
      </section>

      {/* Alasan */}
      <section id="tentang" className="bg-zinc-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Jadikan Bisnis Anda Lebih Mudah</h2>
              <p className="mt-2 text-sm text-zinc-400">Alasan UMKM memilih UMKM Order.</p>
            </div>
            <div className="grid gap-4">
              {[
                { t: "Mudah digunakan", d: "UI sederhana, tanpa training lama. Staff baru langsung bisa pakai." },
                { t: "Data bisnis lebih terorganisir", d: "Produk, pelanggan, pesanan rapi dan mudah dicari." },
                { t: "Proses pesanan lebih cepat", d: "Dari katalog ke pesanan selesai hanya beberapa klik." },
                { t: "Laporan membantu memantau bisnis", d: "Omzet jelas, keputusan berbasis data bukan tebakan." },
              ].map((p) => (
                <div key={p.t} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                  <p className="text-sm font-semibold">{p.t}</p>
                  <p className="mt-1 text-sm leading-6 text-zinc-400">{p.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="rounded-3xl border bg-white p-6 md:p-8">
          <div className="grid gap-6 text-center md:grid-cols-4">
            <div><p className="text-3xl font-bold text-blue-600">248+</p><p className="text-sm font-medium">Produk</p><p className="text-xs text-zinc-500">contoh visual</p></div>
            <div><p className="text-3xl font-bold text-blue-600">98+</p><p className="text-sm font-medium">Pelanggan</p><p className="text-xs text-zinc-500">contoh visual</p></div>
            <div><p className="text-3xl font-bold text-blue-600">152+</p><p className="text-sm font-medium">Pesanan</p><p className="text-xs text-zinc-500">contoh visual</p></div>
            <div><p className="text-3xl font-bold text-blue-600">4.520.000+</p><p className="text-sm font-medium">Pendapatan</p><p className="text-xs text-zinc-500">contoh visual (Rp)</p></div>
          </div>
          <p className="mt-6 text-center text-xs text-zinc-500">* Angka di atas adalah contoh ilustrasi untuk tampilan, bukan data nyata.</p>
        </div>
      </section>

      {/* CTA akhir */}
      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="rounded-3xl bg-blue-600 px-6 py-10 text-center text-white md:px-12 md:py-14">
          <h2 className="text-2xl font-bold md:text-3xl">Siap mengelola pesanan dengan lebih mudah?</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-blue-100">Mulai sekarang, kelola UMKM Anda dalam satu dashboard yang rapi dan aman.</p>
          <Link href="/login" className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-blue-600 hover:bg-zinc-100">
            Mulai Sekarang
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <p className="text-sm font-bold">UMKM Order</p>
              <p className="mt-2 text-sm leading-6 text-zinc-600">Order Management untuk UMKM Indonesia — produk, pelanggan, pesanan, dan laporan dalam satu tempat.</p>
            </div>
            <div className="flex gap-8 text-sm">
              <div className="space-y-2">
                <p className="font-semibold">Navigasi</p>
                <a href="#beranda" className="block text-zinc-600 hover:text-zinc-900">Beranda</a>
                <a href="#fitur" className="block text-zinc-600 hover:text-zinc-900">Fitur</a>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Akun</p>
                <Link href="/login" className="block text-zinc-600 hover:text-zinc-900">Masuk</Link>
                <Link href="/register" className="block text-zinc-600 hover:text-zinc-900">Daftar</Link>
              </div>
            </div>
            <div className="text-sm text-zinc-500 md:text-right">© 2026 UMKM Order. Dibuat untuk presentasi project.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
