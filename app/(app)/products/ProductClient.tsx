"use client";
import { useState } from "react";
import { toast } from "sonner";
import { createProduct, updateProduct, deleteProduct } from "./actions";
import { productSchema } from "@/lib/validations";
import { Input, Select, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Product = { id: string; name: string; price: number; stock: number; unit?: string; type?: string; trackStock?: boolean; isActive?: boolean; description?: string | null };

function getInitialAvailability(p?: Product): "selalu" | "stok" | "tidak" {
  if (p?.isActive === false) return "tidak";
  if (p?.trackStock === false) return "selalu";
  return "stok";
}

export function ProductModal({ product, onClose }: { product?: Product; onClose: () => void }) {
  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const [stock, setStock] = useState(String(product?.stock ?? "0"));
  const [unit, setUnit] = useState(product?.unit ?? "pcs");
  const [type, setType] = useState(product?.type ?? "BARANG");
  const [availability, setAvailability] = useState<"selalu" | "stok" | "tidak">(getInitialAvailability(product));
  const [description, setDescription] = useState(product?.description ?? "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const map = {
      selalu: { trackStock: false, isActive: true },
      stok: { trackStock: true, isActive: true },
      tidak: { trackStock: false, isActive: false },
    }[availability];
    fd.set("trackStock", String(map.trackStock));
    fd.set("isActive", String(map.isActive));
    const parsed = productSchema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      toast.error(parsed.error.issues.map((i) => i.message).join(", "));
      return;
    }
    try {
      if (product) await updateProduct(product.id, fd);
      else await createProduct(fd);
      toast.success(product ? "Produk diperbarui" : "Produk ditambahkan");
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan produk");
    }
  }

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="product-modal-title" className="fixed inset-0 z-50 overflow-y-auto bg-[#0F172A]/40 p-3 sm:p-4">
      <div className="flex min-h-full items-center justify-center">
      <Card className="max-h-[calc(100dvh-1.5rem)] w-full max-w-xl overflow-y-auto p-5 sm:max-h-[calc(100dvh-2rem)] sm:p-6">
        <h2 id="product-modal-title" className="text-lg font-bold tracking-tight text-[#0F172A]">{product ? "Edit Produk / Layanan" : "Tambah Produk / Layanan"}</h2>
        <p className="mt-1 text-sm text-[#64748B]">Lengkapi informasi produk dan ketersediaannya.</p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <Label>Nama</Label>
            <Input name="name" placeholder="Nama produk" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <Label>Deskripsi (opsional)</Label>
            <Textarea name="description" placeholder="Deskripsi singkat" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Harga</Label>
              <Input name="price" type="number" placeholder="0" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div>
              <Label>Satuan</Label>
              <Input name="unit" placeholder="pcs / kg / hari" value={unit} onChange={(e) => setUnit(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Tipe</Label>
              <Select name="type" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="BARANG">BARANG</option>
                <option value="JASA">JASA</option>
                <option value="SEWA">SEWA</option>
              </Select>
            </div>
            <div>
              <Label>Ketersediaan</Label>
              <Select value={availability} onChange={(e) => setAvailability(e.target.value as any)}>
                <option value="selalu">Selalu tersedia</option>
                <option value="stok">Menggunakan stok</option>
                <option value="tidak">Tidak tersedia</option>
              </Select>
            </div>
          </div>
          {availability === "stok" && (
            <div>
              <Label>Stok tersedia</Label>
              <Input name="stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
            </div>
          )}
          {availability === "selalu" && <p className="rounded-[12px] bg-[#F8FAFC] px-3 py-2 text-xs text-[#64748B]">Selalu tersedia — stok tidak diperlukan, bisa dipesan kapan saja.</p>}
          {availability === "tidak" && <p className="rounded-[12px] bg-amber-50 px-3 py-2 text-xs text-[#D97706]">Tidak tersedia — tidak muncul di Katalog dan tidak bisa dipesan.</p>}
          <div className="flex justify-end gap-2 border-t border-[#E2E8F0] pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">{product ? "Update" : "Simpan"}</Button>
          </div>
        </form>
      </Card>
      </div>
    </div>
  );
}

export function ProductActions({ product }: { product: Product }) {
  const [edit, setEdit] = useState(false);
  return (
    <>
      <div className="flex shrink-0 gap-2">
      <Button variant="secondary" size="sm" onClick={() => setEdit(true)} className="h-9 rounded-[10px]">
        Edit
      </Button>
      <DeleteButton id={product.id} />
      </div>
      {edit && <ProductModal product={product} onClose={() => setEdit(false)} />}
    </>
  );
}

export function CreateProductButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} className="h-10 gap-2 rounded-[12px] px-4">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Tambah Produk
      </Button>
      {open && <ProductModal onClose={() => setOpen(false)} />}
    </>
  );
}

function DeleteButton({ id }: { id: string }) {
  async function handleDelete() {
    if (!confirm("Hapus produk ini?")) return;
    try {
      const res = (await deleteProduct(id)) as unknown as { soft?: boolean } | undefined;
      if (res?.soft) {
        toast.success("Produk sudah digunakan dalam pesanan, jadi dinonaktifkan agar histori tetap aman.");
      } else {
        toast.success("Produk dihapus");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal hapus produk");
    }
  }
  return (
    <Button variant="secondary" size="sm" onClick={handleDelete} className="h-9 rounded-[10px] text-[#DC2626] hover:bg-red-50">
      Hapus
    </Button>
  );
}
