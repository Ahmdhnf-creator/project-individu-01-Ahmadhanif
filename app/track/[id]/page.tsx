export default async function TrackPlaceholder({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-16">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-lg font-semibold text-slate-900">Tracking Pesanan</h1>
        <p className="mt-2 font-mono text-sm text-slate-900">{id}</p>
        <p className="mt-4 text-sm text-slate-500">Detail tracking akan tersedia pada tahap berikutnya.</p>
        <a href="/catalog" className="mt-6 inline-block text-sm text-[#2563EB] hover:text-[#1D4ED8]">Kembali ke Katalog</a>
      </div>
    </div>
  );
}
