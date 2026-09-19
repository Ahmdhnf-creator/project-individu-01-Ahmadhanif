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
    <div className="flex min-h-screen bg-white text-slate-900 antialiased">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="px-6 py-5">
          <Link href="/dashboard" className="text-[15px] font-semibold tracking-tight text-slate-900">
            UMKM Order
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          <Link href="/dashboard" className="block rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-[#2563EB]">
            Dashboard
          </Link>
          <Link href="/catalog" className="block rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900">
            Catalog
          </Link>
          {!isPelanggan && (
            <>
              <Link href="/products" className="block rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900">
                Products
              </Link>
              <Link href="/customers" className="block rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900">
                Customers
              </Link>
            </>
          )}
          <Link href="/orders" className="block rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900">
            Orders
          </Link>
          {!isPelanggan && (
            <Link href="/reports" className="block rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900">
              Reports
            </Link>
          )}
          {isAdmin && (
            <Link href="/users" className="block rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900">
              Users
            </Link>
          )}
        </nav>
        <div className="border-t border-slate-200 p-4">
          <p className="text-sm font-medium text-slate-900">{user.name}</p>
          <p className="truncate text-xs text-slate-500">{user.email}</p>
          <form action={logout} className="mt-3">
            <button type="submit" className="w-full rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-900 hover:bg-slate-50">
              Logout
            </button>
          </form>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <Link href="/dashboard" className="text-sm font-semibold text-slate-900 md:hidden">
            UMKM Order
          </Link>
          <div className="hidden text-sm md:block">
            <span className="font-medium text-slate-900">{user.name}</span>
            <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{user.role}</span>
          </div>
          <form action={logout} className="md:hidden">
            <button type="submit" className="rounded-full border border-slate-200 px-4 py-1.5 text-sm font-medium hover:bg-slate-50">
              Keluar
            </button>
          </form>
          <div className="hidden md:block">
            <form action={logout}>
              <button type="submit" className="rounded-full border border-slate-200 px-4 py-1.5 text-sm font-medium hover:bg-slate-50">
                Keluar
              </button>
            </form>
          </div>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-white px-3 py-2 text-sm md:hidden">
          <Link href="/dashboard" className="whitespace-nowrap rounded-full bg-[#2563EB] px-3 py-1.5 text-white">
            Dashboard
          </Link>
          <Link href="/catalog" className="whitespace-nowrap rounded-full border border-slate-200 px-3 py-1.5 text-slate-500">
            Catalog
          </Link>
          <Link href="/orders" className="whitespace-nowrap rounded-full border border-slate-200 px-3 py-1.5 text-slate-500">
            Orders
          </Link>
          {!isPelanggan && (
            <>
              <Link href="/products" className="whitespace-nowrap rounded-full border border-slate-200 px-3 py-1.5 text-slate-500">
                Products
              </Link>
              <Link href="/customers" className="whitespace-nowrap rounded-full border border-slate-200 px-3 py-1.5 text-slate-500">
                Customers
              </Link>
              <Link href="/reports" className="whitespace-nowrap rounded-full border border-slate-200 px-3 py-1.5 text-slate-500">
                Reports
              </Link>
            </>
          )}
        </nav>
        <main className="flex-1 bg-slate-50 p-6 md:p-8">{children}</main>
        <Toaster richColors />
      </div>
    </div>
  );
}
