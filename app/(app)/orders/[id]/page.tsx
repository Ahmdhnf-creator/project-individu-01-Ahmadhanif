import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { StatusButtons, DeleteOrderButton } from "../OrderActions";

const statusColors: Record<string,string> = { BARU:"bg-gray-200", DIPROSES:"bg-blue-200", DIKIRIM:"bg-yellow-200", SELESAI:"bg-green-200", BATAL:"bg-red-200" };

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }){
  const user = await getCurrentUser();
  if(!user) redirect("/login");
  const { id } = await params;
  const order = await prisma.order.findUnique({ where:{id}, include:{ customer:true, user:true, items:{ include:{ product:true } } }});
  if(!order) notFound();
  if(user.role==="PELANGGAN" && order.userId !== user.id) redirect("/orders");
  const isPelanggan = user.role==="PELANGGAN";

  return (
    <div>
      <Link href="/orders" className="text-sm text-blue-600">← Kembali</Link>
      <h1 className="mt-2 text-xl font-bold">Pesanan {order.id.slice(0,8)}</h1>
      <div className="mt-2 flex gap-2 items-center">
        <span className={`rounded px-2 py-1 text-sm ${statusColors[order.status]}`}>{order.status}</span>
        <span className="text-sm">Bayar: {order.paymentMethod} — {order.paymentStatus}</span>
      </div>
      <div className="mt-2 text-sm">Pelanggan: {order.customer?.name ?? order.user?.name ?? "-"}</div>
      <div className="mt-4 rounded border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="px-3 py-2 text-left">Produk</th><th className="px-3 py-2 text-right">Harga</th><th className="px-3 py-2 text-right">Qty</th><th className="px-3 py-2 text-right">Subtotal</th></tr></thead>
          <tbody>
            {order.items.map(it=>(
              <tr key={it.id} className="border-t">
                <td className="px-3 py-2">{it.product.name}</td>
                <td className="px-3 py-2 text-right">{it.price}</td>
                <td className="px-3 py-2 text-right">{it.qty}</td>
                <td className="px-3 py-2 text-right">{it.subtotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t p-3 text-right font-semibold">Total: Rp {order.total.toLocaleString("id-ID")}</div>
      </div>
      <div className="mt-4 flex gap-2">
        <StatusButtons orderId={order.id} status={order.status as any} isPelanggan={isPelanggan} />
        <DeleteOrderButton orderId={order.id} status={order.status} isOwner={order.userId===user.id} />
      </div>
    </div>
  );
}
