import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const statusStyle: Record<string, string> = {
  BARU: "bg-zinc-100 text-zinc-700",
  DIPROSES: "bg-amber-50 text-amber-700",
  DIKIRIM: "bg-blue-50 text-blue-700",
  SELESAI: "bg-emerald-50 text-emerald-700",
  BATAL: "bg-red-50 text-red-700",
};

export default async function Dashboard() {
  const user = await requireUser();
  const isPelanggan = user.role === "PELANGGAN";
  const where = isPelanggan ? { userId: user.id } : {};
  const [total, group, recent] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.groupBy({ by: ["status"], where, _count: true }),
    prisma.order.findMany({ where, orderBy: { createdAt: "desc" }, take: 5, include: { customer: true, user: true } }),
  ]);
  const counts: Record<string, number> = {};
  for (const g of group) counts[g.status] = g._count;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-600">Selamat datang, {user.name}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs text-zinc-500">Total Order</p>
          <p className="mt-2 text-2xl font-semibold">{total}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs text-zinc-500">Baru</p>
          <p className="mt-2 text-2xl font-semibold">{counts["BARU"] ?? 0}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs text-zinc-500">Diproses</p>
          <p className="mt-2 text-2xl font-semibold">{counts["DIPROSES"] ?? 0}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs text-zinc-500">Dikirim</p>
          <p className="mt-2 text-2xl font-semibold">{counts["DIKIRIM"] ?? 0}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs text-zinc-500">Selesai</p>
          <p className="mt-2 text-2xl font-semibold">{counts["SELESAI"] ?? 0}</p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
          <h2 className="text-sm font-medium">Pesanan Terbaru</h2>
          <Link href="/orders" className="text-xs font-medium text-blue-600 hover:text-blue-700">
            Lihat semua
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-zinc-500">Belum ada pesanan</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-100 text-xs text-zinc-500">
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Pelanggan</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {recent.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50/50">
                    <td className="px-5 py-3.5 font-medium">{order.id.slice(0, 8)}</td>
                    <td className="px-5 py-3.5 text-zinc-600">{order.customer?.name ?? order.user?.name ?? "-"}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle[order.status] ?? "bg-zinc-100 text-zinc-700"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium">Rp {order.total.toLocaleString("id-ID")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
