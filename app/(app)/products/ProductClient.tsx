"use client";
import { useState } from "react";
import { toast } from "sonner";
import { createProduct, updateProduct, deleteProduct } from "./actions";
import { productSchema } from "@/lib/validations";

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
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">{product ? "Edit Produk / Layanan" : "Tambah Produk / Layanan"}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="name" placeholder="Nama" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded border px-3 py-2 text-sm" required />
          <textarea name="description" placeholder="Deskripsi (opsional)" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded border px-3 py-2 text-sm" rows={2} />
          <div className="grid grid-cols-2 gap-2">
            <input name="price" type="number" placeholder="Harga" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded border px-3 py-2 text-sm" required />
            <input name="unit" placeholder="Satuan (pcs/kg/hari)" value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full rounded border px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select name="type" value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded border px-3 py-2 text-sm">
              <option value="BARANG">BARANG</option>
              <option value="JASA">JASA</option>
              <option value="SEWA">SEWA</option>
            </select>
            <select value={availability} onChange={(e) => setAvailability(e.target.value as any)} className="w-full rounded border px-3 py-2 text-sm">
              <option value="selalu">Selalu tersedia</option>
              <option value="stok">Menggunakan stok</option>
              <option value="tidak">Tidak tersedia</option>
            </select>
          </div>
          {availability === "stok" && <input name="stock" type="number" placeholder="Stok tersedia" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full rounded border px-3 py-2 text-sm" required />}
          {availability === "selalu" && <p className="text-xs text-slate-500">Selalu tersedia — stok tidak diperlukan, bisa dipesan kapan saja.</p>}
          {availability === "tidak" && <p className="text-xs text-slate-500">Tidak tersedia — tidak muncul di Katalog dan tidak bisa dipesan.</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded border px-3 py-1.5 text-sm">Batal</button>
            <button type="submit" className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">{product ? "Update" : "Simpan"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ProductActions({ product }: { product: Product }) {
  const [edit, setEdit] = useState(false);
  return (
    <>
      <button onClick={() => setEdit(true)} className="rounded border px-2 py-1 text-xs">Edit</button>
      <DeleteButton id={product.id} />
      {edit && <ProductModal product={product} onClose={() => setEdit(false)} />}
    </>
  );
}

export function CreateProductButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Tambah Produk / Layanan</button>
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
  return <button onClick={handleDelete} className="rounded border px-2 py-1 text-xs text-red-600">Hapus</button>;
}
