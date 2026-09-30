"use client";
import { useState } from "react";
import { toast } from "sonner";
import { getRentalDaysInclusive } from "@/lib/order";
import { createOrder, createGuestOrder } from "@/app/(app)/orders/actions";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select, Label } from "@/components/ui/input";

type Product = { id: string; name: string; price: number; stock: number; unit?: string; type?: string; trackStock?: boolean; description?: string | null };
type CartItem = { productId: string; name: string; price: number; qty: number; type?: string; unit?: string; startDate?: string; endDate?: string };

const typeStyles: Record<string, string> = {
  BARANG: "bg-[#EFF6FF] text-[#2563EB]",
  JASA: "bg-[#ECFDF5] text-[#10B981]",
  SEWA: "bg-[#FFF7ED] text-[#D97706]",
};

export default function CatalogClient({ products, customers, isPelanggan, isGuest }: { products: Product[]; customers: { id:string; name:string }[]; isPelanggan: boolean; isGuest?: boolean }) {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"TRANSFER"|"COD"|"TUNAI"|"QRIS">("COD");
  const [customerId, setCustomerId] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestWa, setGuestWa] = useState("");
  const [guestAddress, setGuestAddress] = useState("");

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
    for(const c of cart){
      if(c.type === "SEWA"){
        if(!c.startDate || !c.endDate){ toast.error(`Tanggal sewa wajib untuk ${c.name}`); return; }
        if(new Date(c.startDate).getTime() > new Date(c.endDate).getTime()){ toast.error(`Tanggal mulai tidak boleh setelah kembali untuk ${c.name}`); return; }
      }
    }
    if(isGuest){
      if(!guestName.trim() || guestName.trim().length < 2){ toast.error("Nama wajib minimal 2 karakter"); return; }
      if(!guestWa.trim() || guestWa.trim().length < 8){ toast.error("WhatsApp wajib minimal 8 karakter"); return; }
      const fd = new FormData();
      fd.set("guestName", guestName.trim());
      fd.set("guestWa", guestWa.trim());
      if(guestAddress.trim()) fd.set("guestAddress", guestAddress.trim());
      fd.set("paymentMethod", paymentMethod);
      fd.set("items", JSON.stringify(cart.map(c=>({ productId:c.productId, qty:c.qty, startDate: c.startDate, endDate: c.endDate }))));
      try{
        const orderId = await createGuestOrder(fd);
        toast.success("Pesanan berhasil dibuat");
        setCart([]);
        router.push(`/order/success/${orderId}`);
      }catch(e:unknown){
        toast.error(e instanceof Error ? e.message : "Gagal buat pesanan");
      }
      return;
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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] lg:gap-8">
      <div className="min-w-0">
        <div className="mb-6 flex items-end justify-between gap-3 md:mb-8">
          <div>
            <h2 className="text-[20px] font-bold tracking-tight text-[#0F172A] md:text-[22px]">Produk &amp; Layanan</h2>
            <p className="mt-1 text-sm text-[#64748B]">Pilih yang kamu butuhkan, lalu tambahkan ke keranjang.</p>
          </div>
          <span className="hidden shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#64748B] ring-1 ring-[#E2E8F0] sm:inline-flex">
            {products.length} produk
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {products.map(p => {
            const available = p.trackStock === false || p.stock > 0;
            return (
              <div
                key={p.id}
                className="flex flex-col rounded-[16px] border border-[#E2E8F0] bg-white p-5 transition-shadow duration-300 hover:shadow-[0_18px_44px_-30px_rgba(15,23,42,0.55)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[15px] font-bold leading-snug text-[#0F172A]">{p.name}</h3>
                  <span
                    className={`shrink-0 rounded-[8px] px-2 py-0.5 text-[10px] font-bold ${typeStyles[p.type ?? "BARANG"] ?? typeStyles.BARANG}`}
                  >
                    {p.type ?? "BARANG"}
                  </span>
                </div>
                {p.description && (
                  <p className="mt-2 line-clamp-2 text-[13px] leading-5 text-[#64748B]">{p.description}</p>
                )}
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-[17px] font-extrabold tracking-tight text-[#0F172A]">
                    Rp {p.price.toLocaleString("id-ID")}
                  </span>
                  <span className="text-[13px] text-[#64748B]">/ {p.unit ?? "pcs"}</span>
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                  <span className={`h-1.5 w-1.5 rounded-full ${available ? "bg-[#10B981]" : "bg-[#DC2626]"}`} />
                  <span className={available ? "font-medium text-[#64748B]" : "font-semibold text-[#DC2626]"}>
                    {p.trackStock === false ? "Selalu tersedia" : `Stok: ${p.stock}`}
                  </span>
                </div>
                <div className="mt-auto pt-4">
                  <Button onClick={() => addToCart(p)} size="sm" className="w-full">
                    Tambah
                  </Button>
                </div>
              </div>
            );
          })}
          {products.length === 0 && (
            <div className="col-span-full rounded-[16px] border border-dashed border-[#E2E8F0] bg-white p-10 text-center">
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                  <path d="M6 7.5h12l-1 12.2a1.5 1.5 0 0 1-1.5 1.3H8.5A1.5 1.5 0 0 1 7 19.7Z" />
                  <path d="M9 9.5V7a3 3 0 0 1 6 0v2.5" />
                </svg>
              </span>
              <p className="mt-3 text-sm font-semibold text-[#0F172A]">Belum ada produk</p>
              <p className="mt-1 text-sm text-[#64748B]">Produk akan muncul di sini setelah ditambahkan.</p>
            </div>
          )}
        </div>
      </div>

      <div className="min-w-0 lg:sticky lg:top-6 lg:self-start">
        <Card className="p-5 shadow-[0_18px_48px_-34px_rgba(15,23,42,0.5)] md:p-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-[15px] font-bold text-[#0F172A]">Keranjang</h2>
            <span className="shrink-0 rounded-full bg-[#F8FAFC] px-2.5 py-1 text-[11px] font-semibold text-[#64748B] ring-1 ring-[#E2E8F0]">
              {cart.reduce((sum, c) => sum + c.qty, 0)} item
            </span>
          </div>
          {cart.length === 0 ? (
            <div className="py-8 text-center">
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#F8FAFC] text-[#94A3B8] ring-1 ring-[#E2E8F0]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                  <path d="M6 7.5h12l-1 12.2a1.5 1.5 0 0 1-1.5 1.3H8.5A1.5 1.5 0 0 1 7 19.7Z" />
                  <path d="M9 9.5V7a3 3 0 0 1 6 0v2.5" />
                </svg>
              </span>
              <p className="mt-3 text-sm font-semibold text-[#0F172A]">Keranjang kamu masih kosong.</p>
              <p className="mt-1 text-xs leading-5 text-[#64748B]">Pilih produk untuk memulai pesanan.</p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {cart.map(c=>(
                <div key={c.productId} className="rounded-[12px] border border-[#E2E8F0] bg-white p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="min-w-0 truncate text-sm font-medium text-[#0F172A]">{c.name}</span>
                    <div className="flex shrink-0 items-center gap-1">
                      <button onClick={()=>updateQty(c.productId, c.qty-1)} aria-label={`Kurangi ${c.name}`} className="flex h-7 w-7 items-center justify-center rounded-[10px] border border-[#E2E8F0] bg-white text-sm hover:bg-[#F8FAFC]">-</button>
                      <span className="w-6 text-center text-sm font-medium">{c.qty}</span>
                      <button onClick={()=>updateQty(c.productId, c.qty+1)} aria-label={`Tambah ${c.name}`} className="flex h-7 w-7 items-center justify-center rounded-[10px] border border-[#E2E8F0] bg-white text-sm hover:bg-[#F8FAFC]">+</button>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-[#64748B]">Rp {c.price.toLocaleString("id-ID")} / {c.unit ?? "pcs"}</p>
                  {c.type === "SEWA" && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Tanggal mulai</Label>
                        <Input type="date" value={c.startDate ?? ""} onChange={e=>updateDates(c.productId, "startDate", e.target.value)} className="text-xs" />
                      </div>
                      <div>
                        <Label className="text-xs">Tanggal kembali</Label>
                        <Input type="date" value={c.endDate ?? ""} onChange={e=>updateDates(c.productId, "endDate", e.target.value)} className="text-xs" />
                      </div>
                      {c.startDate && c.endDate && <p className="col-span-2 text-xs font-medium text-[#2563EB]">{getRentalDaysInclusive(c.startDate, c.endDate)} hari • Rp {(c.price * getRentalDaysInclusive(c.startDate, c.endDate) * c.qty).toLocaleString("id-ID")}</p>}
                    </div>
                  )}
                </div>
              ))}
              <div className="flex justify-between border-t border-[#E2E8F0] pt-3 text-sm font-semibold text-[#0F172A]">
                <span>Total</span>
                <span>Rp {total.toLocaleString("id-ID")}</span>
              </div>
              <div className="space-y-2 pt-1">
                <div>
                  <Label>Nama Anda</Label>
                  <Input value={guestName} onChange={e=>setGuestName(e.target.value)} placeholder="Nama lengkap" />
                </div>
                <div>
                  <Label>WhatsApp</Label>
                  <Input value={guestWa} onChange={e=>setGuestWa(e.target.value)} placeholder="08..." />
                </div>
                <div>
                  <Label>Alamat (opsional)</Label>
                  <Input value={guestAddress} onChange={e=>setGuestAddress(e.target.value)} placeholder="Alamat" />
                </div>
              </div>
              <div>
                <Label>Metode Bayar</Label>
                <Select value={paymentMethod} onChange={e=>setPaymentMethod(e.target.value as any)}>
                  <option value="COD">COD</option>
                  <option value="TRANSFER">TRANSFER</option>
                  <option value="TUNAI">TUNAI</option>
                  <option value="QRIS">QRIS</option>
                </Select>
              </div>
              <Button onClick={handleCheckout} className="h-11 w-full">
                Checkout
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
