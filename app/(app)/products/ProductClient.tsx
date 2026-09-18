"use client";
import { useState } from "react";
import { toast } from "sonner";
import { createProduct, updateProduct, deleteProduct } from "./actions";
import { productSchema } from "@/lib/validations";

type Product = { id: string; name: string; price: number; stock: number };

export function ProductModal({ product, onClose }: { product?: Product; onClose: () => void }) {
  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const [stock, setStock] = useState(String(product?.stock ?? ""));

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
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
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">{product ? "Edit Produk" : "Tambah Produk"}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="name" placeholder="Nama" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded border px-3 py-2" required />
          <input name="price" type="number" placeholder="Harga" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded border px-3 py-2" required />
          <input name="stock" type="number" placeholder="Stok" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full rounded border px-3 py-2" required />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded border px-3 py-1">Batal</button>
            <button type="submit" className="rounded bg-black px-3 py-1 text-white">{product ? "Update" : "Simpan"}</button>
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
      <button onClick={() => setEdit(true)} className="rounded border px-2 py-1 text-sm">Edit</button>
      <DeleteButton id={product.id} />
      {edit && <ProductModal product={product} onClose={() => setEdit(false)} />}
    </>
  );
}

export function CreateProductButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="rounded bg-black px-4 py-2 text-sm text-white">Tambah Produk</button>
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
  return <button onClick={handleDelete} className="rounded border px-2 py-1 text-sm text-red-600">Hapus</button>;
}
