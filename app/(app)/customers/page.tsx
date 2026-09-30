import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CreateCustomerButton, CustomerActions } from "./CustomerClient";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
      <PageHeader title="Pelanggan" description="Kelola data pelanggan seperti CRM ringan." action={<CreateCustomerButton />} />
      <Card className="p-4">
        <form method="GET" className="flex gap-2">
          <Input name="q" defaultValue={query} placeholder="Cari nama atau WA..." className="max-w-xs" />
          <Button variant="secondary" type="submit">
            Cari
          </Button>
        </form>
      </Card>
      <Card className="mt-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F8FAFC] text-xs text-[#64748B]">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Nama</th>
                <th className="px-4 py-3 text-left font-medium">WA</th>
                <th className="px-4 py-3 text-left font-medium">Alamat</th>
                <th className="px-4 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center">
                    <p className="text-sm font-medium text-[#0F172A]">Belum ada pelanggan</p>
                    <p className="mt-1 text-sm text-[#64748B]">Tambah pelanggan pertama untuk mulai mencatat pesanan.</p>
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F8FAFC]/50">
                    <td className="px-4 py-3 font-medium text-[#0F172A]">{c.name}</td>
                    <td className="px-4 py-3 text-[#64748B]">{c.wa}</td>
                    <td className="px-4 py-3 text-[#64748B]">{c.address ?? "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <CustomerActions customer={c} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="mt-4 flex items-center justify-between text-sm text-[#64748B]">
        <span>
          Total {total} • Halaman {pageNum} / {totalPages}
        </span>
        <div className="flex gap-2">
          {pageNum > 1 && (
            <Link href={`/customers?q=${encodeURIComponent(query)}&page=${pageNum - 1}`}>
              <Button variant="secondary" size="sm">
                Prev
              </Button>
            </Link>
          )}
          {pageNum < totalPages && (
            <Link href={`/customers?q=${encodeURIComponent(query)}&page=${pageNum + 1}`}>
              <Button variant="secondary" size="sm">
                Next
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
