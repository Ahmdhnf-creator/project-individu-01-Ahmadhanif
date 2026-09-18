import { registerSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function RegisterPage({ searchParams }: { searchParams: { error?: string } }) {
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
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg border p-8">
        <h1 className="mb-6 text-2xl font-bold">Daftar</h1>
        {searchParams.error && <p className="mb-4 rounded bg-red-100 p-2 text-sm text-red-600">{searchParams.error}</p>}
        <form action={register} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nama</label>
            <input name="name" type="text" placeholder="Nama lengkap" required className="w-full rounded-lg border p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input name="email" type="email" placeholder="Masukkan email" required className="w-full rounded-lg border p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input name="password" type="password" placeholder="Minimal 6 karakter" required className="w-full rounded-lg border p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">WA</label>
            <input name="wa" type="text" placeholder="08123456789" required className="w-full rounded-lg border p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Alamat (opsional)</label>
            <input name="address" type="text" placeholder="Alamat" className="w-full rounded-lg border p-2" />
          </div>
          <button type="submit" className="w-full rounded-lg bg-black p-2 text-white">
            Daftar
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Sudah punya akun? <a href="/login" className="underline">Login</a>
        </p>
      </div>
    </main>
  );
}
