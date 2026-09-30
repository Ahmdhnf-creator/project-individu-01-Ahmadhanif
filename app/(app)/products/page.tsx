import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CreateProductButton, ProductActions } from "./ProductClient";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function formatPrice(price: number) {
  return `Rp ${price.toLocaleString("id-ID")}`;
}

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

  const pageStats = [
    { label: "Stok tersedia", value: products.filter((p) => p.isActive && p.trackStock && p.stock > 0).length, detail: "Produk aktif dengan stok" },
    { label: "Stok menipis", value: products.filter((p) => p.isActive && p.trackStock && p.stock === 0).length, detail: "Stok habis pada daftar ini", valueClass: "text-[#D97706]" },
    { label: "Tidak aktif", value: products.filter((p) => !p.isActive).length, detail: "Tidak ditampilkan di katalog", valueClass: "text-[#DC2626]" },
  ];

  return (
    <div>
      <PageHeader
        title="Produk & Layanan"
        description="Kelola produk, layanan, dan sewa yang tersedia untuk pelanggan."
        action={<CreateProductButton />}
      />

      <section aria-label="Ringkasan produk" className="mb-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-[#0F172A]">Ringkasan</h2>
          <span className="text-[11px] text-[#64748B]">Status dari daftar produk di halaman ini</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Card className="p-4 sm:p-5">
            <p className="text-xs font-medium text-[#64748B]">Total Produk/Layanan</p>
            <p className="mt-3 text-2xl font-bold tracking-tight text-[#0F172A]">{total.toLocaleString("id-ID")}</p>
            <p className="mt-1 text-[11px] text-[#94A3B8]">Sesuai pencarian</p>
          </Card>
          {pageStats.map((stat) => (
            <Card key={stat.label} className="p-4 sm:p-5">
              <p className="text-xs font-medium text-[#64748B]">{stat.label}</p>
              <p className={`mt-3 text-2xl font-bold tracking-tight ${stat.valueClass ?? "text-[#0F172A]"}`}>{stat.value.toLocaleString("id-ID")}</p>
              <p className="mt-1 text-[11px] text-[#94A3B8]">{stat.detail}</p>
            </Card>
          ))}
        </div>
      </section>

      <Card className="p-3 sm:p-4">
        <form method="GET" className="flex flex-col gap-2 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#94A3B8]">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
            <Input name="q" defaultValue={query} placeholder="Cari produk..." aria-label="Cari produk" className="h-11 rounded-[12px] pl-10" />
          </div>
          <Button variant="secondary" type="submit" className="h-11 rounded-[12px] px-5">Cari</Button>
        </form>
      </Card>

      <div className="mb-3 mt-6 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-[#0F172A]">Daftar Produk</h2>
        <span className="text-xs text-[#64748B]">{total} produk</span>
      </div>

      {products.length === 0 ? (
        <Card className="px-5 py-12 text-center">
          <p className="text-sm font-semibold text-[#0F172A]">{query ? "Tidak ada produk yang cocok" : "Belum ada produk atau layanan"}</p>
          <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-[#64748B]">
            {query ? "Coba kata pencarian lain." : "Tambahkan produk atau layanan pertama kamu untuk mulai menerima pesanan."}
          </p>
          {!query && <div className="mt-5 inline-block"><CreateProductButton /></div>}
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          {products.map((product) => {
            const availability = !product.isActive
              ? { label: "Tidak tersedia", className: "bg-red-50 text-[#DC2626]" }
              : !product.trackStock
                ? { label: "Selalu tersedia", className: "bg-emerald-50 text-[#16A34A]" }
                : { label: "Menggunakan stok", className: "bg-blue-50 text-[#2563EB]" };

            return (
              <Card key={product.id} className="min-w-0 p-4 transition-colors hover:border-[#CBD5E1] sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-[15px] font-semibold text-[#0F172A]">{product.name}</h3>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-[8px] bg-slate-100 px-2 py-1 text-[10px] font-semibold tracking-wide text-[#475569]">{product.type}</span>
                      <span className="text-xs text-[#64748B]">{product.unit}</span>
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-[9px] px-2.5 py-1 text-[11px] font-semibold ${availability.className}`}>
                    {availability.label}
                  </span>
                </div>

                {product.description && <p className="mt-3 line-clamp-2 text-xs leading-5 text-[#64748B]">{product.description}</p>}

                <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-[#F1F5F9] pt-3">
                  <div>
                    <p className="text-base font-bold tracking-tight text-[#0F172A]">{formatPrice(product.price)} <span className="text-xs font-normal text-[#64748B]">/ {product.unit}</span></p>
                    {product.isActive && product.trackStock && (
                      <p className={`mt-1 text-xs ${product.stock === 0 ? "font-medium text-[#D97706]" : "text-[#64748B]"}`}>
                        Stok: {product.stock} {product.stock === 0 ? "· habis" : "tersedia"}
                      </p>
                    )}
                    {!product.isActive && <p className="mt-1 text-xs text-[#64748B]">Produk dinonaktifkan</p>}
                    {product.isActive && !product.trackStock && <p className="mt-1 text-xs text-[#64748B]">Dapat dipesan kapan saja</p>}
                  </div>
                  <ProductActions product={product} />
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-[#64748B]">
          <span>Halaman {pageNum} dari {totalPages}</span>
          <div className="flex gap-2">
            {pageNum > 1 && (
              <Link href={`/products?q=${encodeURIComponent(query)}&page=${pageNum - 1}`}>
                <Button variant="secondary" size="sm" className="rounded-[10px]">Sebelumnya</Button>
              </Link>
            )}
            {pageNum < totalPages && (
              <Link href={`/products?q=${encodeURIComponent(query)}&page=${pageNum + 1}`}>
                <Button variant="secondary" size="sm" className="rounded-[10px]">Berikutnya</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
