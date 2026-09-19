import Link from "next/link";
import { registerSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  async function register(formData: FormData) {
    "use server";
    const data = registerSchema.parse(Object.fromEntries(formData));
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) redirect("/register?error=Email%20sudah%20terdaftar");
    const hash = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, password: hash, wa: data.wa, address: data.address, role: "PELANGGAN" },
    });
    await createSession(user.id);
    redirect("/catalog");
  }
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <header className="border-b border-zinc-100">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-[15px] font-semibold tracking-tight">
            UMKM Order
          </Link>
          <Link href="/login" className="text-sm text-zinc-600 hover:text-zinc-900">
            Masuk
          </Link>
        </div>
      </header>
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-xl font-semibold tracking-tight">Daftar</h1>
          <p className="mt-1 text-sm text-zinc-600">Buat akun pelanggan untuk mulai memesan.</p>
          {error && <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <form action={register} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Nama</label>
              <input name="name" type="text" placeholder="Nama lengkap" required className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Email</label>
              <input name="email" type="email" placeholder="nama@email.com" required className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Password</label>
              <input name="password" type="password" placeholder="Minimal 6 karakter" required className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">WA</label>
              <input name="wa" type="text" placeholder="08123456789" required className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Alamat (opsional)</label>
              <input name="address" type="text" placeholder="Alamat" className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            </div>
            <button type="submit" className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white hover:bg-blue-700">
              Daftar
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-zinc-600">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-900">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
