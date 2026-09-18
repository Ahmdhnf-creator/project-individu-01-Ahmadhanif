import { requireUser } from "@/lib/auth";

export default async function Dashboard() {
  const user = await requireUser();
  const orders: { id: string; customer: string; status: string; total: number }[] = [];
  return (
    <main className="p-8">
      <h1 className="mb-8 text-3xl font-bold">Dashboard Order Management</h1>
      <p className="mb-4 text-sm text-gray-600">Selamat datang, {user.name}</p>
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg border p-4"><p>Total Order</p><strong className="text-2xl">0</strong></div>
        <div className="rounded-lg border p-4"><p>Order Baru</p><strong className="text-2xl">0</strong></div>
        <div className="rounded-lg border p-4"><p>Diproses</p><strong className="text-2xl">0</strong></div>
        <div className="rounded-lg border p-4"><p>Selesai</p><strong className="text-2xl">0</strong></div>
      </div>
      <h2 className="mt-8 mb-4 text-xl font-bold">Pesanan Terbaru</h2>
      <div className="space-y-2">
        {orders.length === 0 ? <p className="text-sm text-gray-500">Belum ada pesanan</p> : orders.map((order) => (
          <div key={order.id} className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-4">
              <p className="font-bold">{order.id}</p>
              <p>{order.customer}</p>
              <span className="rounded-full border px-3 py-1 text-sm">{order.status}</span>
              <p className="font-semibold">Rp {order.total.toLocaleString("id-ID")}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
