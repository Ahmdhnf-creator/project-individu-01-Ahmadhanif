import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-lg font-bold tracking-tight">Order Management UMKM</span>
          <Link href="/login" className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-800">
            Masuk
          </Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <section className="mx-auto flex max-w-6xl flex-1 flex-col items-center gap-8 px-6 py-16 text-center md:py-24">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-zinc-600">
            Dibuat untuk UMKM Indonesia
          </div>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            Kelola pesanan pelanggan <span className="text-zinc-500">dari masuk sampai selesai</span>
          </h1>
          <p className="max-w-2xl text-lg leading-7 text-zinc-600">
            Aplikasi Order Management UMKM membantu pemilik, kasir, dan pelanggan mengelola pesanan, stok, pembayaran
            Transfer/COD, dan laporan omzet dalam satu dashboard yang sederhana.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-8 text-base font-medium text-white hover:bg-zinc-800"
            >
              Mulai Sekarang
            </Link>
            <span className="text-sm text-zinc-500">Gratis untuk MVP • Login dengan akun terdaftar</span>
          </div>

          <div className="mt-8 grid w-full max-w-4xl grid-cols-1 gap-4 text-left sm:grid-cols-3">
            <div className="rounded-2xl border p-5">
              <p className="text-sm font-semibold">Pesanan Hybrid</p>
              <p className="mt-1 text-sm text-zinc-600">Pelanggan pesan via katalog, admin/staff juga bisa input manual.</p>
            </div>
            <div className="rounded-2xl border p-5">
              <p className="text-sm font-semibold">Stok Aman</p>
              <p className="mt-1 text-sm text-zinc-600">Stok berkurang hanya saat selesai, tidak pernah minus.</p>
            </div>
            <div className="rounded-2xl border p-5">
              <p className="text-sm font-semibold">Laporan Omzet</p>
              <p className="mt-1 text-sm text-zinc-600">Harian, mingguan, bulanan + per pelanggan & export CSV.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 text-center text-sm text-zinc-500">© 2026 Order Management UMKM</footer>
    </div>
  );
}
