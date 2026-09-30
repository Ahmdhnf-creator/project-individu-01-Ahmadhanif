import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { Toaster } from "sonner";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/catalog", label: "Katalog" },
  { href: "/products", label: "Produk" },
  { href: "/customers", label: "Pelanggan" },
  { href: "/orders", label: "Pesanan" },
  { href: "/reports", label: "Laporan" },
  { href: "/users", label: "Users", adminOnly: true },
];

const navIcons: Record<string, string> = {
  "/dashboard": "M3 10.5 12 3l9 7.5M5 9v11h14V9M9 20v-6h6v6",
  "/catalog": "M4 5h7v6H4zM13 5h7v6h-7zM4 13h7v6H4zM13 13h7v6h-7z",
  "/products": "m4 7 8-4 8 4v10l-8 4-8-4zM4 7l8 4 8-4M12 11v10",
  "/customers": "M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  "/orders": "M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h7",
  "/reports": "M4 20V10M10 20V4M16 20v-7M22 20H2",
  "/users": "M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M18 8h4M20 6v4",
};

function NavIcon({ href }: { href: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px] shrink-0">
      <path d={navIcons[href] ?? navIcons["/dashboard"]} />
    </svg>
  );
}

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

  const filteredNav = nav.filter((n) => {
    if (n.adminOnly && !isAdmin) return false;
    if ((n.href === "/products" || n.href === "/customers" || n.href === "/reports") && isPelanggan) return false;
    return true;
  });

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#0F172A] antialiased">
      <aside className="hidden w-[240px] shrink-0 flex-col border-r border-[#E2E8F0] bg-white md:flex">
        <div className="px-6 py-6">
          <Link href="/dashboard" className="text-[16px] font-bold tracking-tight text-[#0F172A]">
            OrderKu
          </Link>
          <p className="mt-1 text-xs text-[#64748B]">Order Management</p>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {filteredNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-[12px] px-3 py-2 text-sm font-medium text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-0" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-[#E2E8F0] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2563EB] text-xs font-semibold text-white">
              {user.name.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#0F172A]">{user.name}</p>
              <p className="truncate text-xs text-[#64748B]">{user.role}</p>
            </div>
          </div>
          <form action={logout} className="mt-3">
            <button type="submit" className="w-full rounded-[12px] border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-medium hover:bg-[#F8FAFC]">
              Keluar
            </button>
          </form>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[#E2E8F0] bg-white px-4 py-3 md:px-6 md:py-3.5">
          <Link href="/dashboard" className="text-sm font-bold text-[#0F172A] md:hidden">
            OrderKu
          </Link>
          <div className="hidden items-center gap-2 text-sm md:flex">
            <span className="font-medium">{user.name}</span>
            <span className="rounded-full bg-[#F8FAFC] px-2.5 py-1 text-xs font-medium text-[#64748B] ring-1 ring-[#E2E8F0]">{user.role}</span>
          </div>
          <form action={logout} className="md:hidden">
            <button type="submit" className="rounded-[10px] border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-medium text-[#334155]">
              Keluar
            </button>
          </form>
          <div className="hidden items-center gap-3 md:flex">
            <div aria-label={`Profil ${user.name}`} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DBEAFE] text-xs font-semibold text-[#1D4ED8]">
              {user.name.slice(0, 1).toUpperCase()}
            </div>
            <form action={logout}>
              <button type="submit" className="rounded-[12px] border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-medium hover:bg-[#F8FAFC]">
                Keluar
              </button>
            </form>
          </div>
        </header>

        <nav aria-label="Navigasi utama" className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E2E8F0] bg-white px-1 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] md:hidden">
          <div className="mx-auto flex max-w-xl items-stretch justify-around">
          {filteredNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[10px] px-0.5 py-1 text-[9px] font-medium leading-none text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#2563EB]"
            >
              <NavIcon href={item.href} />
              {item.label}
            </Link>
          ))}
          </div>
        </nav>

        <main className="flex-1">
          <div className="mx-auto max-w-5xl px-4 pt-6 pb-24 sm:px-6 md:px-8 md:py-8">{children}</div>
        </main>
        <Toaster richColors />
      </div>
    </div>
  );
}
