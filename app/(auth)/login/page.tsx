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
    <main className="flex min-h-screen flex-col bg-white">
      <header className="border-b border-zinc-100">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-[15px] font-semibold tracking-tight">
            UMKM Order
          </Link>
          <Link href="/register" className="text-sm text-zinc-600 hover:text-zinc-900">
            Daftar
          </Link>
        </div>
      </header>
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-xl font-semibold tracking-tight">Masuk</h1>
          <p className="mt-1 text-sm text-zinc-600">Masuk untuk mengelola pesanan bisnis Anda.</p>
          {error && <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <form action={login} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Email</label>
              <input
                name="email"
                type="email"
                placeholder="nama@email.com"
                required
                className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Password</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <button type="submit" className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white hover:bg-blue-700">
              Masuk
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-zinc-600">
            Belum punya akun?{" "}
            <Link href="/register" className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-900">
              Daftar
            </Link>
          </p>
          <p className="mt-4 text-center text-xs text-zinc-500">Demo: admin@gmail.com / 123456</p>
        </div>
      </div>
    </main>
  );
}
