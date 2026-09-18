import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    <main className="p-8">
      <h1 className="mb-8 text-3xl font-bold">Dashboard Order Management</h1>
      <p className="mb-4 text-sm text-gray-600">Selamat datang, {user.name}</p>
      <div className="grid grid-cols-5 gap-4">
        <div className="rounded-lg border p-4"><p>Total Order</p><strong className="text-2xl">{total}</strong></div>
        <div className="rounded-lg border p-4"><p>Order Baru</p><strong className="text-2xl">{counts["BARU"] ?? 0}</strong></div>
        <div className="rounded-lg border p-4"><p>Diproses</p><strong className="text-2xl">{counts["DIPROSES"] ?? 0}</strong></div>
        <div className="rounded-lg border p-4"><p>Dikirim</p><strong className="text-2xl">{counts["DIKIRIM"] ?? 0}</strong></div>
        <div className="rounded-lg border p-4"><p>Selesai</p><strong className="text-2xl">{counts["SELESAI"] ?? 0}</strong></div>
      </div>
      <h2 className="mt-8 mb-4 text-xl font-bold">Pesanan Terbaru</h2>
      <div className="space-y-2">
        {recent.length === 0 ? <p className="text-sm text-gray-500">Belum ada pesanan</p> : recent.map((order) => (
          <div key={order.id} className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-4">
              <p className="font-bold">{order.id.slice(0,8)}</p>
              <p>{order.customer?.name ?? order.user?.name ?? "-"}</p>
              <span className="rounded-full border px-3 py-1 text-sm">{order.status}</span>
              <p className="font-semibold">Rp {order.total.toLocaleString("id-ID")}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
