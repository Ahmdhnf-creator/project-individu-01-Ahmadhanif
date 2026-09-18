import { getReport } from "@/lib/reports";
import { requireRole } from "@/lib/auth";
import ReportsClient from "./ReportsClient";

export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ range?: string; from?: string; to?: string }> }) {
  await requireRole("STAFF");
  const params = await searchParams;
  const range = (params.range === "harian" || params.range === "mingguan" || params.range === "bulanan" ? params.range : "bulanan") as "harian" | "mingguan" | "bulanan";
  const now = new Date();
  const defaultFrom = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const defaultTo = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
  const fromStr = params.from || defaultFrom;
  const toStr = params.to || defaultTo;
  const from = new Date(fromStr);
  const to = new Date(toStr);
  // include end of day
  to.setHours(23, 59, 59, 999);
  const report = await getReport(range, from, to);
  const avg = report.perPeriod.length ? Math.round(report.totalOmzet / report.perPeriod.length) : 0;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Laporan</h1>
      <form method="GET" className="flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-sm">Range</label>
          <select name="range" defaultValue={range} className="rounded border px-2 py-1">
            <option value="harian">Harian</option>
            <option value="mingguan">Mingguan</option>
            <option value="bulanan">Bulanan</option>
          </select>
        </div>
        <div>
          <label className="block text-sm">From</label>
          <input type="date" name="from" defaultValue={fromStr} className="rounded border px-2 py-1" />
        </div>
        <div>
          <label className="block text-sm">To</label>
          <input type="date" name="to" defaultValue={toStr} className="rounded border px-2 py-1" />
        </div>
        <button type="submit" className="rounded bg-black px-4 py-1.5 text-white">Filter</button>
      </form>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded border p-4"><p className="text-sm text-gray-500">Total Omzet</p><p className="text-xl font-bold">Rp {report.totalOmzet.toLocaleString("id-ID")}</p></div>
        <div className="rounded border p-4"><p className="text-sm text-gray-500">Total Pesanan</p><p className="text-xl font-bold">{report.totalOrders}</p></div>
        <div className="rounded border p-4"><p className="text-sm text-gray-500">Rata-rata</p><p className="text-xl font-bold">Rp {avg.toLocaleString("id-ID")}</p></div>
      </div>

      <ReportsClient perPeriod={report.perPeriod} perCustomer={report.perCustomer} totalOmzet={report.totalOmzet} totalOrders={report.totalOrders} />

      <h2 className="text-lg font-semibold">Per Pelanggan</h2>
      <div className="overflow-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="p-2 text-left">Nama</th><th className="p-2 text-left">WA</th><th className="p-2 text-right">Jumlah Pesanan</th><th className="p-2 text-right">Total Omzet</th></tr></thead>
          <tbody>
            {report.perCustomer.length === 0 ? <tr><td colSpan={4} className="p-4 text-center text-gray-500">Tidak ada data</td></tr> : report.perCustomer.map(c => (
              <tr key={c.customerId} className="border-t"><td className="p-2">{c.name}</td><td className="p-2">{c.wa}</td><td className="p-2 text-right">{c.count}</td><td className="p-2 text-right">Rp {c.total.toLocaleString("id-ID")}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
