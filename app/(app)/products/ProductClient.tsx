"use client";
import { useState } from "react";
import { toast } from "sonner";
import { createProduct, updateProduct, deleteProduct } from "./actions";
import { productSchema } from "@/lib/validations";

type Product = { id: string; name: string; price: number; stock: number; unit?: string; type?: string; trackStock?: boolean; isActive?: boolean; description?: string | null };

export function ProductModal({ product, onClose }: { product?: Product; onClose: () => void }) {
  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const [stock, setStock] = useState(String(product?.stock ?? "0"));
  const [unit, setUnit] = useState(product?.unit ?? "pcs");
  const [type, setType] = useState(product?.type ?? "BARANG");
  const [trackStock, setTrackStock] = useState(product?.trackStock ?? true);
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [description, setDescription] = useState(product?.description ?? "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    // ensure boolean values sent as string
    fd.set("trackStock", String(trackStock));
    fd.set("isActive", String(isActive));
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
            <select name="type" value={type} onChange={(e) => { setType(e.target.value); if(e.target.value==="JASA"){ setTrackStock(false); } }} className="w-full rounded border px-3 py-2 text-sm">
              <option value="BARANG">BARANG</option>
              <option value="JASA">JASA</option>
              <option value="SEWA">SEWA</option>
            </select>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={trackStock} onChange={(e) => setTrackStock(e.target.checked)} />
              Kelola stok
            </label>
          </div>
          {trackStock && <input name="stock" type="number" placeholder="Stok" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full rounded border px-3 py-2 text-sm" required />}
          {!trackStock && <p className="text-xs text-slate-500">Jasa/SEWA: stok tidak diperlukan</p>}
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            Aktif
          </label>
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
      await deleteProduct(id);
      toast.success("Produk dihapus");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal hapus produk");
    }
  }
  return <button onClick={handleDelete} className="rounded border px-2 py-1 text-xs text-red-600">Hapus</button>;
}
