import { getCurrentUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

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
    <div className="flex min-h-screen">
      <aside className="w-64 border-r p-4">
        <h2 className="mb-6 text-lg font-bold">UMKM Order</h2>
        <nav className="space-y-2">
          <Link href="/dashboard" className="block rounded px-2 py-1 hover:bg-gray-100">Dashboard</Link>
          <Link href="/catalog" className="block rounded px-2 py-1 hover:bg-gray-100">Katalog</Link>
          {!isPelanggan && <Link href="/products" className="block rounded px-2 py-1 hover:bg-gray-100">Produk</Link>}
          {!isPelanggan && <Link href="/customers" className="block rounded px-2 py-1 hover:bg-gray-100">Pelanggan</Link>}
          <Link href="/orders" className="block rounded px-2 py-1 hover:bg-gray-100">Pesanan</Link>
          {!isPelanggan && <Link href="/reports" className="block rounded px-2 py-1 hover:bg-gray-100">Laporan</Link>}
          {isAdmin && <Link href="/users" className="block rounded px-2 py-1 hover:bg-gray-100">Users</Link>}
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b p-4">
          <span className="text-sm">{user.name} ({user.role})</span>
          <form action={logout}>
            <button type="submit" className="rounded border px-3 py-1 text-sm">Logout</button>
          </form>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
