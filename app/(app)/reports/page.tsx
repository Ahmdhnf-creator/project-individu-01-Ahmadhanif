import { getReport } from "@/lib/reports";
import { requireRole } from "@/lib/auth";
import ReportsClient from "./ReportsClient";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Input, Select, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ range?: string; from?: string; to?: string }> }) {
  await requireRole("STAFF");
  const params = await searchParams;
  const range = (params.range === "harian" || params.range === "mingguan" || params.range === "bulanan" ? params.range : "bulanan") as
    | "harian"
    | "mingguan"
    | "bulanan";
  const now = new Date();
  const defaultFrom = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const defaultTo = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
  const fromStr = params.from || defaultFrom;
  const toStr = params.to || defaultTo;
  const from = new Date(fromStr);
  const to = new Date(toStr);
  to.setHours(23, 59, 59, 999);
  const report = await getReport(range, from, to);
  const avg = report.perPeriod.length ? Math.round(report.totalOmzet / report.perPeriod.length) : 0;

  return (
    <div>
      <PageHeader title="Laporan" description="Ringkasan omzet dan aktivitas bisnis dari transaksi selesai." />

      <Card className="p-4">
        <form method="GET" className="flex flex-wrap items-end gap-3">
          <div>
            <Label>Range</Label>
            <Select name="range" defaultValue={range}>
              <option value="harian">Harian</option>
              <option value="mingguan">Mingguan</option>
              <option value="bulanan">Bulanan</option>
            </Select>
          </div>
          <div>
            <Label>Dari</Label>
            <Input type="date" name="from" defaultValue={fromStr} />
          </div>
          <div>
            <Label>Sampai</Label>
            <Input type="date" name="to" defaultValue={toStr} />
          </div>
          <Button type="submit">Filter</Button>
        </form>
      </Card>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs text-[#64748B]">Total Omzet</p>
          <p className="mt-2 text-xl font-semibold text-[#0F172A]">Rp {report.totalOmzet.toLocaleString("id-ID")}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-[#64748B]">Total Pesanan</p>
          <p className="mt-2 text-xl font-semibold text-[#0F172A]">{report.totalOrders}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-[#64748B]">Rata-rata</p>
          <p className="mt-2 text-xl font-semibold text-[#0F172A]">Rp {avg.toLocaleString("id-ID")}</p>
        </Card>
      </div>

      <Card className="mt-6 p-5">
        <ReportsClient perPeriod={report.perPeriod} perCustomer={report.perCustomer} totalOmzet={report.totalOmzet} totalOrders={report.totalOrders} />
      </Card>

      <div className="mt-6">
        <h2 className="text-sm font-semibold text-[#0F172A]">Per Pelanggan</h2>
        <Card className="mt-3 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F8FAFC] text-xs text-[#64748B]">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Nama</th>
                  <th className="px-4 py-3 text-left font-medium">WA</th>
                  <th className="px-4 py-3 text-right font-medium">Jumlah</th>
                  <th className="px-4 py-3 text-right font-medium">Total Omzet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {report.perCustomer.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-[#64748B]">
                      Tidak ada data
                    </td>
                  </tr>
                ) : (
                  report.perCustomer.map((c) => (
                    <tr key={c.customerId} className="hover:bg-[#F8FAFC]/50">
                      <td className="px-4 py-3 font-medium text-[#0F172A]">{c.name}</td>
                      <td className="px-4 py-3 text-[#64748B]">{c.wa}</td>
                      <td className="px-4 py-3 text-right text-[#0F172A]">{c.count}</td>
                      <td className="px-4 py-3 text-right font-medium text-[#0F172A]">Rp {c.total.toLocaleString("id-ID")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
