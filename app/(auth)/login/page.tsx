import Link from "next/link";
import { loginSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  async function login(formData: FormData) {
    "use server";
    const data = loginSchema.parse(Object.fromEntries(formData));
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !(await verifyPassword(data.password, user.password))) redirect("/login?error=Email%20atau%20password%20salah");
    await createSession(user.id);
    redirect("/dashboard");
  }
  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      <header className="border-b border-slate-200">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-[15px] font-semibold tracking-tight text-slate-900">
            UMKM Order
          </Link>
          <Link href="/register" className="text-sm text-slate-500 hover:text-slate-900">
            Daftar
          </Link>
        </div>
      </header>
      <div className="mx-auto flex max-w-5xl flex-1 flex-col md:flex-row">
        {/* Kiri - hide di mobile */}
        <div className="hidden flex-1 flex-col justify-center bg-slate-50 px-10 py-16 md:flex">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Kelola bisnis lebih mudah.</h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">Semua pesanan, pelanggan, dan produk dalam satu tempat.</p>
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-slate-900">Pesanan terbaru</p>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span className="text-slate-900">ORD-001 • Budi</span>
                <span className="text-[#D97706]">Diproses</span>
              </div>
              <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span className="text-slate-900">ORD-002 • Siti</span>
                <span className="text-[#16A34A]">Selesai</span>
              </div>
            </div>
          </div>
        </div>
        {/* Kanan - form */}
        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            <Link href="/" className="text-sm font-semibold text-slate-900 md:hidden">
              UMKM Order
            </Link>
            <h2 className="mt-6 text-xl font-semibold tracking-tight text-slate-900 md:mt-0">Selamat datang kembali</h2>
            <p className="mt-1 text-sm text-slate-500">Masuk untuk melanjutkan ke dashboard.</p>
            {error && <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-[#DC2626]">{error}</p>}
            <form action={login} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-900">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="nama@email.com"
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-900">Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <button type="submit" className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-full bg-[#2563EB] text-sm font-medium text-white hover:bg-[#1D4ED8]">
                Masuk
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-500">
              Belum punya akun?{" "}
              <Link href="/register" className="font-medium text-[#2563EB] hover:text-[#1D4ED8]">
                Daftar
              </Link>
            </p>
            <p className="mt-4 text-center text-xs text-slate-500">Demo: admin@gmail.com / 123456</p>
          </div>
        </div>
      </div>
    </div>
  );
}
