import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const statusStyle: Record<string, string> = {
  BARU: "bg-slate-100 text-slate-500",
  DIPROSES: "bg-amber-50 text-[#D97706]",
  DIKIRIM: "bg-blue-50 text-[#2563EB]",
  SELESAI: "bg-emerald-50 text-[#16A34A]",
  BATAL: "bg-red-50 text-[#DC2626]",
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
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Selamat datang kembali, {user.name}.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs text-slate-500">Total Pesanan</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{total}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs text-slate-500">Baru</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{counts["BARU"] ?? 0}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs text-slate-500">Diproses</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{counts["DIPROSES"] ?? 0}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs text-slate-500">Selesai</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{counts["SELESAI"] ?? 0}</p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <h2 className="text-sm font-medium text-slate-900">Pesanan Terbaru</h2>
          <Link href="/orders" className="text-xs font-medium text-[#2563EB] hover:text-[#1D4ED8]">
            Lihat semua
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500">Belum ada pesanan</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500">
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Pelanggan</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {recent.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3.5 font-medium text-slate-900">{order.id.slice(0, 8)}</td>
                    <td className="px-5 py-3.5 text-slate-500">{order.customer?.name ?? order.user?.name ?? "-"}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle[order.status] ?? "bg-slate-100 text-slate-500"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium text-slate-900">Rp {order.total.toLocaleString("id-ID")}</td>
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
