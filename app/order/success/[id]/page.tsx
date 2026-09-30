import Link from "next/link";

export default async function OrderSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-16">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Pesanan berhasil dibuat</h1>
        <p className="mt-2 text-sm text-slate-500">Simpan nomor pesanan Anda untuk tracking.</p>
        <p className="mt-4 rounded-lg bg-slate-50 px-4 py-3 font-mono text-sm font-medium text-slate-900">{id}</p>
        <Link href={`/track/${id}`} className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-[#2563EB] px-6 text-sm font-medium text-white hover:bg-[#1D4ED8]">
          Lihat status pesanan
        </Link>
        <p className="mt-3 text-xs text-slate-500">Tracking detail akan tersedia segera.</p>
        <div className="mt-6 flex justify-center gap-4 text-sm">
          <Link href="/catalog" className="text-slate-500 hover:text-slate-900">
            Kembali ke Katalog
          </Link>
          <Link href="/" className="text-slate-500 hover:text-slate-900">
            Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
