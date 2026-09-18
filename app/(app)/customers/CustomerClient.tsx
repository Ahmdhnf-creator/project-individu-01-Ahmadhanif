"use client";
import { useState } from "react";
import { toast } from "sonner";
import { createCustomer, updateCustomer, deleteCustomer } from "./actions";
import { customerSchema } from "@/lib/validations";

type Customer = { id: string; name: string; wa: string; address: string | null };

export function CustomerModal({ customer, onClose }: { customer?: Customer; onClose: () => void }) {
  const [name, setName] = useState(customer?.name ?? "");
  const [wa, setWa] = useState(customer?.wa ?? "");
  const [address, setAddress] = useState(customer?.address ?? "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = customerSchema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      toast.error(parsed.error.issues.map((i) => i.message).join(", "));
      return;
    }
    try {
      if (customer) await updateCustomer(customer.id, fd);
      else await createCustomer(fd);
      toast.success(customer ? "Pelanggan diperbarui" : "Pelanggan ditambahkan");
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan pelanggan");
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">{customer ? "Edit Pelanggan" : "Tambah Pelanggan"}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="name" placeholder="Nama" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded border px-3 py-2" required />
          <input name="wa" placeholder="WA" value={wa} onChange={(e) => setWa(e.target.value)} className="w-full rounded border px-3 py-2" required />
          <input name="address" placeholder="Alamat (opsional)" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full rounded border px-3 py-2" />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded border px-3 py-1">Batal</button>
            <button type="submit" className="rounded bg-black px-3 py-1 text-white">{customer ? "Update" : "Simpan"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CustomerActions({ customer }: { customer: Customer }) {
  const [edit, setEdit] = useState(false);
  return (
    <>
      <button onClick={() => setEdit(true)} className="rounded border px-2 py-1 text-sm">Edit</button>
      <DeleteButton id={customer.id} />
      {edit && <CustomerModal customer={customer} onClose={() => setEdit(false)} />}
    </>
  );
}

export function CreateCustomerButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="rounded bg-black px-4 py-2 text-sm text-white">Tambah Pelanggan</button>
      {open && <CustomerModal onClose={() => setOpen(false)} />}
    </>
  );
}

function DeleteButton({ id }: { id: string }) {
  async function handleDelete() {
    if (!confirm("Hapus pelanggan ini?")) return;
    try {
      await deleteCustomer(id);
      toast.success("Pelanggan dihapus");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal hapus pelanggan");
    }
  }
  return <button onClick={handleDelete} className="rounded border px-2 py-1 text-sm text-red-600">Hapus</button>;
}
