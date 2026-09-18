"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function ReportsClient({ perPeriod, perCustomer, totalOmzet, totalOrders }: { perPeriod: { label: string; total: number }[]; perCustomer: { customerId: string; name: string; wa: string; total: number; count: number }[]; totalOmzet: number; totalOrders: number }) {
  function exportCSV() {
    const header = "label,total\n";
    const rows = perPeriod.map(r => `${r.label},${r.total}`).join("\n");
    const customerHeader = "\n\ncustomerId,name,wa,total,count\n";
    const customerRows = perCustomer.map(c => `${c.customerId},"${c.name}",${c.wa},${c.total},${c.count}`).join("\n");
    const csv = header + rows + customerHeader + customerRows;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "laporan.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div className="space-y-4">
      <div className="h-64 rounded border p-4">
        {perPeriod.length === 0 ? <p className="text-sm text-gray-500">Tidak ada data</p> : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={perPeriod}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#000" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      <button onClick={exportCSV} className="rounded border px-3 py-1 text-sm">Export CSV</button>
    </div>
  );
}
