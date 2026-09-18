import { loginSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  async function login(formData: FormData) {
    "use server";
    const data = loginSchema.parse(Object.fromEntries(formData));
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !(await verifyPassword(data.password, user.password))) redirect("/login?error=Email%20atau%20password%20salah");
    await createSession(user.id);
    redirect("/dashboard");
  }
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg border p-8">
        <h1 className="mb-6 text-2xl font-bold">Login</h1>
        {searchParams.error && <p className="mb-4 rounded bg-red-100 p-2 text-sm text-red-600">{searchParams.error}</p>}
        <form action={login} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input name="email" type="email" placeholder="Masukkan email" required className="w-full rounded-lg border p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input name="password" type="password" placeholder="Masukkan password" required className="w-full rounded-lg border p-2" />
          </div>
          <button type="submit" className="w-full rounded-lg bg-black p-2 text-white">
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Belum punya akun? <a href="/register" className="underline">Daftar</a>
        </p>
      </div>
    </main>
  );
}
