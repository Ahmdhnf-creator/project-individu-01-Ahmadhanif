"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { uploadProof, updatePaymentStatus } from "./actions";

export function PaymentActions({ orderId, paymentMethod, paymentStatus, proofUrl }: { orderId: string; paymentMethod: string; paymentStatus: string; proofUrl: string | null }){
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);

  async function handleUpload(){
    if(!file) { toast.error("Pilih file dulu"); return; }
    const fd = new FormData();
    fd.set("proof", file);
    try{
      await uploadProof(orderId, fd);
      toast.success("Bukti diupload");
      router.refresh();
    }catch(e:unknown){
      toast.error(e instanceof Error ? e.message : "Gagal upload");
    }
  }

  async function handleMarkPaid(){
    try{
      await updatePaymentStatus(orderId, "LUNAS");
      toast.success("Pembayaran LUNAS");
      router.refresh();
    }catch(e:unknown){
      toast.error(e instanceof Error ? e.message : "Gagal update");
    }
  }

  return (
    <div className="mt-4 rounded border p-3">
      {proofUrl ? (
        <a href={proofUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 underline">Lihat bukti: {proofUrl}</a>
      ) : (
        <p className="text-sm text-gray-500">Belum ada bukti</p>
      )}
      {paymentMethod==="TRANSFER" && paymentStatus!=="LUNAS" && (
        <div className="mt-2 flex gap-2 items-center">
          <input type="file" accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf" onChange={e=>setFile(e.target.files?.[0] ?? null)} className="text-sm" />
          <button onClick={handleUpload} className="rounded bg-black px-3 py-1 text-sm text-white">Upload</button>
        </div>
      )}
      {paymentStatus!=="LUNAS" && (
        <button onClick={handleMarkPaid} className="mt-2 rounded bg-green-600 px-3 py-1 text-sm text-white">Tandai Lunas</button>
      )}
    </div>
  );
}
