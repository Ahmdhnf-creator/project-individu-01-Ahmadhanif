import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CreateCustomerButton, CustomerActions } from "./CustomerClient";

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role === "PELANGGAN") redirect("/dashboard");

  const { q, page } = await searchParams;
  const query = q?.trim() ?? "";
  const pageNum = Math.max(1, parseInt(page ?? "1", 10) || 1);
  const take = 10;
  const skip = (pageNum - 1) * take;

  const where = query ? { OR: [{ name: { contains: query } }, { wa: { contains: query } }] } : {};

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({ where, orderBy: { createdAt: "desc" }, skip, take }),
    prisma.customer.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / take));

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Pelanggan</h1>
        <CreateCustomerButton />
      </div>
      <form method="GET" className="mb-4 flex gap-2">
        <input name="q" defaultValue={query} placeholder="Cari pelanggan..." className="w-full max-w-xs rounded border px-3 py-2" />
        <button type="submit" className="rounded border px-3 py-2 text-sm">Cari</button>
      </form>
      <div className="overflow-x-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">Nama</th>
              <th className="px-3 py-2 text-left">WA</th>
              <th className="px-3 py-2 text-left">Alamat</th>
              <th className="px-3 py-2 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr><td colSpan={4} className="px-3 py-6 text-center text-gray-500">Tidak ada pelanggan</td></tr>
            ) : customers.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-3 py-2">{c.name}</td>
                <td className="px-3 py-2">{c.wa}</td>
                <td className="px-3 py-2">{c.address ?? "-"}</td>
                <td className="px-3 py-2 text-right space-x-1">
                  <CustomerActions customer={c} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span>Total {total} pelanggan — Halaman {pageNum} / {totalPages}</span>
        <div className="flex gap-2">
          {pageNum > 1 && <Link href={`/customers?q=${encodeURIComponent(query)}&page=${pageNum - 1}`} className="rounded border px-3 py-1">Prev</Link>}
          {pageNum < totalPages && <Link href={`/customers?q=${encodeURIComponent(query)}&page=${pageNum + 1}`} className="rounded border px-3 py-1">Next</Link>}
        </div>
      </div>
    </div>
  );
}
