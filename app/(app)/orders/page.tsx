import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

const statusColors: Record<string,string> = { BARU:"bg-gray-200", DIPROSES:"bg-blue-200", DIKIRIM:"bg-yellow-200", SELESAI:"bg-green-200", BATAL:"bg-red-200" };

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }){
  const user = await getCurrentUser();
  if(!user) redirect("/login");
  const { status, q } = await searchParams;
  const where: any = {};
  if(user.role==="PELANGGAN") where.userId = user.id;
  if(status) where.status = status;
  if(q){
    where.OR = [
      { customer: { name: { contains: q } } },
      { user: { name: { contains: q } } },
      { id: { contains: q } },
    ];
  }
  const orders = await prisma.order.findMany({ where, include:{ customer:true, user:true, items:{ include:{ product:true } } }, orderBy:{ createdAt:"desc" }, take:50 });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Pesanan</h1>
        <Link href="/catalog" className="rounded bg-black px-3 py-1 text-sm text-white">Buat Pesanan</Link>
      </div>
      <form method="GET" className="mb-4 flex gap-2">
        <input name="q" defaultValue={q ?? ""} placeholder="Cari..." className="rounded border px-3 py-2 text-sm" />
        <select name="status" defaultValue={status ?? ""} className="rounded border px-3 py-2 text-sm">
          <option value="">Semua Status</option>
          <option value="BARU">BARU</option>
          <option value="DIPROSES">DIPROSES</option>
          <option value="DIKIRIM">DIKIRIM</option>
          <option value="SELESAI">SELESAI</option>
          <option value="BATAL">BATAL</option>
        </select>
        <button type="submit" className="rounded border px-3 py-2 text-sm">Filter</button>
      </form>
      <div className="overflow-x-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr><th className="px-3 py-2 text-left">ID</th><th className="px-3 py-2 text-left">Pelanggan</th><th className="px-3 py-2 text-left">Status</th><th className="px-3 py-2 text-right">Total</th><th className="px-3 py-2 text-left">Aksi</th></tr>
          </thead>
          <tbody>
            {orders.length===0 ? <tr><td colSpan={5} className="px-3 py-6 text-center text-gray-500">Tidak ada pesanan</td></tr> :
            orders.map(o=>(
              <tr key={o.id} className="border-t">
                <td className="px-3 py-2 font-mono text-xs">{o.id.slice(0,8)}</td>
                <td className="px-3 py-2">{o.customer?.name ?? o.user?.name ?? "-"}</td>
                <td className="px-3 py-2"><span className={`rounded px-2 py-0.5 text-xs ${statusColors[o.status] ?? ""}`}>{o.status}</span></td>
                <td className="px-3 py-2 text-right">Rp {o.total.toLocaleString("id-ID")}</td>
                <td className="px-3 py-2"><Link href={`/orders/${o.id}`} className="rounded border px-2 py-1 text-xs">Detail</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
