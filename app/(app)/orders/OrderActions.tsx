"use client";
import { useState } from "react";
import { toast } from "sonner";
import { updateOrderStatus, deleteOrder } from "./actions";
import { getNextStatuses } from "@/lib/order";
import type { OrderStatus } from "@/lib/order";
import { useRouter } from "next/navigation";

export function StatusButtons({ orderId, status, isPelanggan }: { orderId: string; status: OrderStatus; isPelanggan: boolean }){
  const router = useRouter();
  if(isPelanggan) return null;
  const next = getNextStatuses(status);
  if(next.length===0) return null;
  async function handle(s: OrderStatus){
    if(!confirm(`Ubah status ke ${s}?`)) return;
    try{
      await updateOrderStatus(orderId, s);
      toast.success(`Status diubah ke ${s}`);
      router.refresh();
    }catch(e:unknown){
      toast.error(e instanceof Error ? e.message : "Gagal ubah status");
    }
  }
  return (
    <div className="flex gap-2">
      {next.map(s=>(
        <button key={s} onClick={()=>handle(s)} className="rounded bg-black px-3 py-1 text-sm text-white">{s}</button>
      ))}
    </div>
  );
}

export function DeleteOrderButton({ orderId, status, isOwner }: { orderId: string; status: string; isOwner: boolean }){
  const router = useRouter();
  if(status==="SELESAI") return null;
  // PELANGGAN only if owner, STAFF/ADMIN allowed
  async function handle(){
    if(!confirm("Hapus pesanan ini?")) return;
    try{
      await deleteOrder(orderId);
      toast.success("Pesanan dihapus");
      router.push("/orders");
    }catch(e:unknown){
      toast.error(e instanceof Error ? e.message : "Gagal hapus");
    }
  }
  return <button onClick={handle} className="rounded border px-3 py-1 text-sm text-red-600">Hapus</button>;
}
