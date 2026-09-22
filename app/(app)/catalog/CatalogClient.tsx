"use client";
import { useState } from "react";
import { toast } from "sonner";
import { calculateTotal, getRentalDaysInclusive } from "@/lib/order";
import { createOrder } from "../orders/actions";

type Product = { id: string; name: string; price: number; stock: number; unit?: string; type?: string; trackStock?: boolean; description?: string | null };
type CartItem = { productId: string; name: string; price: number; qty: number; type?: string; unit?: string; startDate?: string; endDate?: string };

export default function CatalogClient({ products, customers, isPelanggan }: { products: Product[]; customers: { id:string; name:string }[]; isPelanggan: boolean }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"TRANSFER"|"COD"|"TUNAI"|"QRIS">("COD");
  const [customerId, setCustomerId] = useState("");

  function addToCart(p: Product){
    setCart(prev=>{
      const ex = prev.find(c=>c.productId===p.id);
      if(ex) return prev.map(c=>c.productId===p.id?{...c, qty:c.qty+1}:c);
      return [...prev, { productId:p.id, name:p.name, price:p.price, qty:1, type: p.type, unit: p.unit }];
    });
  }
  function updateQty(id:string, qty:number){
    if(qty<=0) setCart(prev=>prev.filter(c=>c.productId!==id));
    else setCart(prev=>prev.map(c=>c.productId===id?{...c, qty}:c));
  }
  function updateDates(id: string, field: "startDate" | "endDate", value: string){
    setCart(prev=>prev.map(c=>c.productId===id?{...c, [field]: value}:c));
  }
  const total = cart.reduce((sum, c)=>{
    if(c.type === "SEWA" && c.startDate && c.endDate){
      try{ return sum + c.price * getRentalDaysInclusive(c.startDate, c.endDate) * c.qty; } catch{ return sum + c.price * c.qty; }
    }
    return sum + c.price * c.qty;
  }, 0);

  async function handleCheckout(){
    if(cart.length===0){ toast.error("Keranjang kosong"); return; }
    // validasi SEWA tanggal
    for(const c of cart){
      if(c.type === "SEWA"){
        if(!c.startDate || !c.endDate){ toast.error(`Tanggal sewa wajib untuk ${c.name}`); return; }
        if(new Date(c.startDate).getTime() > new Date(c.endDate).getTime()){ toast.error(`Tanggal mulai tidak boleh setelah kembali untuk ${c.name}`); return; }
      }
    }
    const fd = new FormData();
    fd.set("paymentMethod", paymentMethod);
    if(!isPelanggan && customerId) fd.set("customerId", customerId);
    fd.set("items", JSON.stringify(cart.map(c=>({ productId:c.productId, qty:c.qty, startDate: c.startDate, endDate: c.endDate }))));
    try{
      await createOrder(fd);
      toast.success("Pesanan dibuat");
      setCart([]);
    }catch(e:unknown){
      toast.error(e instanceof Error ? e.message : "Gagal buat pesanan");
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <h2 className="mb-3 font-semibold">Katalog Produk</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {products.map(p=>(
            <div key={p.id} className="rounded border p-4">
              <div className="font-medium">{p.name}</div>
              <div className="text-xs text-gray-500">{p.type ?? "BARANG"} • {p.unit ?? "pcs"}{p.description ? ` • ${p.description}` : ""}</div>
              <div className="text-sm text-gray-600">Rp {p.price.toLocaleString("id-ID")} / {p.unit ?? "pcs"} {p.trackStock === false ? "" : `— Stok: ${p.stock}`}</div>
              <button onClick={()=>addToCart(p)} className="mt-2 rounded bg-black px-3 py-1 text-sm text-white">Tambah</button>
            </div>
          ))}
          {products.length===0 && <p className="text-sm text-gray-500">Tidak ada produk</p>}
        </div>
      </div>
      <div className="rounded border p-4 h-fit">
        <h2 className="mb-3 font-semibold">Keranjang</h2>
        {cart.length===0 ? <p className="text-sm text-gray-500">Keranjang kosong</p> : (
          <div className="space-y-2">
            {cart.map(c=>(
              <div key={c.productId} className="space-y-1 rounded border px-2 py-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>{c.name} (Rp {c.price.toLocaleString("id-ID")} / {c.unit ?? "pcs"})</span>
                  <div className="flex items-center gap-1">
                    <button onClick={()=>updateQty(c.productId, c.qty-1)} className="rounded border px-2 py-0.5">-</button>
                    <span className="w-6 text-center">{c.qty}</span>
                    <button onClick={()=>updateQty(c.productId, c.qty+1)} className="rounded border px-2 py-0.5">+</button>
                  </div>
                </div>
                {c.type === "SEWA" && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="block text-xs text-gray-600">Tanggal mulai</label>
                      <input type="date" value={c.startDate ?? ""} onChange={e=>updateDates(c.productId, "startDate", e.target.value)} className="w-full rounded border px-2 py-1 text-xs" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600">Tanggal kembali</label>
                      <input type="date" value={c.endDate ?? ""} onChange={e=>updateDates(c.productId, "endDate", e.target.value)} className="w-full rounded border px-2 py-1 text-xs" />
                    </div>
                    {c.startDate && c.endDate && <p className="col-span-2 text-xs text-blue-600">{getRentalDaysInclusive(c.startDate, c.endDate)} hari • Rp {(c.price * getRentalDaysInclusive(c.startDate, c.endDate) * c.qty).toLocaleString("id-ID")}</p>}
                  </div>
                )}
              </div>
            ))}
            <div className="border-t pt-2 font-semibold">Total: Rp {total.toLocaleString("id-ID")}</div>
            {!isPelanggan && (
              <select value={customerId} onChange={e=>setCustomerId(e.target.value)} className="w-full rounded border px-2 py-2 text-sm">
                <option value="">-- Pilih Pelanggan (opsional) --</option>
                {customers.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            )}
            <select value={paymentMethod} onChange={e=>setPaymentMethod(e.target.value as any)} className="w-full rounded border px-2 py-2 text-sm">
              <option value="COD">COD</option>
              <option value="TRANSFER">TRANSFER</option>
              <option value="TUNAI">TUNAI</option>
              <option value="QRIS">QRIS</option>
            </select>
            <button onClick={handleCheckout} className="w-full rounded bg-black px-3 py-2 text-sm text-white">Checkout</button>
          </div>
        )}
      </div>
    </div>
  );
}
