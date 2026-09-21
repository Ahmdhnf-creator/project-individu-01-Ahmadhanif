"use client";
import { useState } from "react";
import { toast } from "sonner";
import { calculateTotal } from "@/lib/order";
import { createOrder } from "../orders/actions";

type Product = { id: string; name: string; price: number; stock: number; unit?: string; type?: string; trackStock?: boolean; description?: string | null };
type CartItem = { productId: string; name: string; price: number; qty: number };

export default function CatalogClient({ products, customers, isPelanggan }: { products: Product[]; customers: { id:string; name:string }[]; isPelanggan: boolean }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"TRANSFER"|"COD"|"TUNAI"|"QRIS">("COD");
  const [customerId, setCustomerId] = useState("");

  function addToCart(p: Product){
    setCart(prev=>{
      const ex = prev.find(c=>c.productId===p.id);
      if(ex) return prev.map(c=>c.productId===p.id?{...c, qty:c.qty+1}:c);
      return [...prev, { productId:p.id, name:p.name, price:p.price, qty:1 }];
    });
  }
  function updateQty(id:string, qty:number){
    if(qty<=0) setCart(prev=>prev.filter(c=>c.productId!==id));
    else setCart(prev=>prev.map(c=>c.productId===id?{...c, qty}:c));
  }
  const total = calculateTotal(cart);

  async function handleCheckout(){
    if(cart.length===0){ toast.error("Keranjang kosong"); return; }
    const fd = new FormData();
    fd.set("paymentMethod", paymentMethod);
    if(!isPelanggan && customerId) fd.set("customerId", customerId);
    fd.set("items", JSON.stringify(cart.map(c=>({ productId:c.productId, qty:c.qty }))));
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
              <div key={c.productId} className="flex items-center justify-between text-sm">
                <span>{c.name} (Rp {c.price.toLocaleString("id-ID")})</span>
                <div className="flex items-center gap-1">
                  <button onClick={()=>updateQty(c.productId, c.qty-1)} className="rounded border px-2 py-0.5">-</button>
                  <span className="w-6 text-center">{c.qty}</span>
                  <button onClick={()=>updateQty(c.productId, c.qty+1)} className="rounded border px-2 py-0.5">+</button>
                </div>
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
