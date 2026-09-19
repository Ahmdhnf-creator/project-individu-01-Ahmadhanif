import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { Toaster } from "sonner";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const isAdmin = user.role === "ADMIN";
  const isPelanggan = user.role === "PELANGGAN";

  async function logout() {
    "use server";
    const sid = (await cookies()).get("session")?.value;
    if (sid) await prisma.session.delete({ where: { id: sid } }).catch(() => {});
    (await cookies()).delete("session");
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-white text-zinc-900 antialiased">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-zinc-100 bg-white md:flex">
        <div className="px-6 py-5">
          <Link href="/dashboard" className="text-[15px] font-semibold tracking-tight">
            UMKM Order
          </Link>
          <p className="mt-1 text-xs text-zinc-500">Order Management</p>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          <Link href="/dashboard" className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-zinc-50">
            Dashboard
          </Link>
          <Link href="/catalog" className="block rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900">
            Katalog
          </Link>
          {!isPelanggan && (
            <>
              <Link href="/products" className="block rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900">
                Produk
              </Link>
              <Link href="/customers" className="block rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900">
                Pelanggan
              </Link>
            </>
          )}
          <Link href="/orders" className="block rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900">
            Pesanan
          </Link>
          {!isPelanggan && (
            <Link href="/reports" className="block rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900">
              Laporan
            </Link>
          )}
          {isAdmin && (
            <Link href="/users" className="block rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900">
              Users
            </Link>
          )}
        </nav>
        <div className="border-t border-zinc-100 p-4">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-zinc-500">{user.role}</p>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-zinc-100 bg-white px-6 py-4">
          <div className="md:hidden">
            <Link href="/dashboard" className="text-sm font-semibold">
              UMKM Order
            </Link>
          </div>
          <div className="hidden text-sm md:block">
            <span className="font-medium">{user.name}</span>
            <span className="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">{user.role}</span>
          </div>
          <form action={logout}>
            <button type="submit" className="rounded-full border border-zinc-200 px-4 py-1.5 text-sm font-medium hover:bg-zinc-50">
              Keluar
            </button>
          </form>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-zinc-100 bg-white px-3 py-2 text-sm md:hidden">
          <Link href="/dashboard" className="whitespace-nowrap rounded-full bg-zinc-900 px-3 py-1.5 text-white">
            Dashboard
          </Link>
          <Link href="/catalog" className="whitespace-nowrap rounded-full border border-zinc-200 px-3 py-1.5">
            Katalog
          </Link>
          <Link href="/orders" className="whitespace-nowrap rounded-full border border-zinc-200 px-3 py-1.5">
            Pesanan
          </Link>
          {!isPelanggan && (
            <>
              <Link href="/products" className="whitespace-nowrap rounded-full border border-zinc-200 px-3 py-1.5">
                Produk
              </Link>
              <Link href="/customers" className="whitespace-nowrap rounded-full border border-zinc-200 px-3 py-1.5">
                Pelanggan
              </Link>
              <Link href="/reports" className="whitespace-nowrap rounded-full border border-zinc-200 px-3 py-1.5">
                Laporan
              </Link>
            </>
          )}
        </nav>
        <main className="flex-1 bg-zinc-50/40 p-6 md:p-8">{children}</main>
        <Toaster richColors />
      </div>
    </div>
  );
}
