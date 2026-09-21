import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CreateProductButton, ProductActions } from "./ProductClient";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role === "PELANGGAN") redirect("/dashboard");

  const { q, page } = await searchParams;
  const query = q?.trim() ?? "";
  const pageNum = Math.max(1, parseInt(page ?? "1", 10) || 1);
  const take = 10;
  const skip = (pageNum - 1) * take;

  const where = query ? { name: { contains: query } } : {};

  const [products, total] = await Promise.all([
    prisma.product.findMany({ where, orderBy: { createdAt: "desc" }, skip, take }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / take));

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Produk / Layanan</h1>
        <CreateProductButton />
      </div>
      <form method="GET" className="mb-4 flex gap-2">
        <input name="q" defaultValue={query} placeholder="Cari produk..." className="w-full max-w-xs rounded border px-3 py-2" />
        <button type="submit" className="rounded border px-3 py-2 text-sm">Cari</button>
      </form>
      <div className="overflow-x-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">Nama</th>
              <th className="px-3 py-2 text-left">Tipe</th>
              <th className="px-3 py-2 text-right">Harga</th>
              <th className="px-3 py-2 text-right">Stok</th>
              <th className="px-3 py-2 text-center">Ketersediaan</th>
              <th className="px-3 py-2 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-gray-500">Tidak ada produk</td></tr>
            ) : products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-3 py-2"><div className="font-medium">{p.name}</div><div className="text-xs text-gray-500">{(p as any).unit ?? "pcs"} • {(p as any).description ?? "-"}</div></td>
                <td className="px-3 py-2"><span className="rounded bg-slate-100 px-2 py-0.5 text-xs">{(p as any).type ?? "BARANG"}</span></td>
                <td className="px-3 py-2 text-right">Rp {p.price.toLocaleString("id-ID")}</td>
                <td className="px-3 py-2 text-right">{(p as any).trackStock === false ? "—" : p.stock}</td>
                <td className="px-3 py-2 text-center text-xs">
                  {(p as any).isActive === false ? <span className="rounded bg-red-50 px-2 py-0.5 text-red-700">Tidak tersedia</span> : (p as any).trackStock === false ? <span className="rounded bg-emerald-50 px-2 py-0.5 text-emerald-700">Selalu tersedia</span> : <span className="rounded bg-blue-50 px-2 py-0.5 text-blue-700">Menggunakan stok</span>}
                </td>
                <td className="px-3 py-2 text-right space-x-1">
                  <ProductActions product={p as any} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span>Total {total} produk — Halaman {pageNum} / {totalPages}</span>
        <div className="flex gap-2">
          {pageNum > 1 && <Link href={`/products?q=${encodeURIComponent(query)}&page=${pageNum - 1}`} className="rounded border px-3 py-1">Prev</Link>}
          {pageNum < totalPages && <Link href={`/products?q=${encodeURIComponent(query)}&page=${pageNum + 1}`} className="rounded border px-3 py-1">Next</Link>}
        </div>
      </div>
    </div>
  );
}
