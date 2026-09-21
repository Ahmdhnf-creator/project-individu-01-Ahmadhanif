"use server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { canTransition, calculateTotal } from "@/lib/order";
import type { OrderStatus } from "@/lib/order";
import { revalidatePath } from "next/cache";
import { createOrderSchema } from "@/lib/validations";
import { saveFile, validateFile } from "@/lib/storage";

export async function createOrder(formData: FormData){
  const user = await requireUser();
  const raw = {
    customerId: (formData.get("customerId") as string) || undefined,
    paymentMethod: formData.get("paymentMethod") as string,
    items: JSON.parse((formData.get("items") as string) || "[]"),
  };
  const parsed = createOrderSchema.parse(raw);
  const products = await prisma.product.findMany({ where:{ id:{ in: parsed.items.map(i=>i.productId)}}});
  if(products.length !== parsed.items.length) throw new Error("Produk tidak ditemukan");
  // validasi isActive & stok hanya jika trackStock
  for(const p of products){
    if(!p.isActive) throw new Error(`Produk ${p.name} tidak aktif`);
  }
  const itemsWithPrice = parsed.items.map(i=>{
    const p = products.find(x=>x.id===i.productId)!;
    if(p.trackStock && p.stock < i.qty) throw new Error(`Stok ${p.name} tidak cukup (sisa ${p.stock})`);
    return { productId:i.productId, qty:i.qty, unit: p.unit, price:p.price, subtotal:p.price*i.qty };
  });
  const total = calculateTotal(itemsWithPrice);
  await prisma.$transaction(async (tx)=>{
    const order = await tx.order.create({ data:{
      customerId: user.role==="PELANGGAN" ? null : (parsed.customerId || null),
      userId: user.role==="PELANGGAN" ? user.id : null,
      paymentMethod: parsed.paymentMethod as any,
      total,
      status: "BARU",
      note: parsed.note || null,
    }});
    await tx.orderItem.createMany({ data: itemsWithPrice.map(it=>({ orderId: order.id, ...it }))});
  });
  revalidatePath("/orders");
  revalidatePath("/catalog");
}

export async function updateOrderStatus(id: string, next: OrderStatus){
  const user = await requireUser();
  if(user.role==="PELANGGAN") throw new Error("Forbidden");
  const order = await prisma.order.findUnique({ include:{items:true}, where:{id}});
  if(!order) throw new Error("Order tidak ditemukan");
  if(!canTransition(order.status as OrderStatus, next as OrderStatus)) throw new Error("Transisi tidak valid");
  if(next==="SELESAI"){
    await prisma.$transaction(async (tx)=>{
      for(const item of order.items){
        const p = await tx.product.findUnique({where:{id:item.productId}});
        if(!p) throw new Error(`Produk ${item.productId} tidak ditemukan`);
        if(p.trackStock && p.stock < item.qty) throw new Error(`Stok ${p.name} tidak cukup (sisa ${p.stock})`);
        if(p.trackStock){
          await tx.product.update({ where:{id:p.id}, data:{ stock:{ decrement: item.qty }}});
        }
      }
      await tx.order.update({ where:{id}, data:{ status: next as any }});
    });
  } else {
    await prisma.order.update({ where:{id}, data:{ status: next as any }});
  }
  revalidatePath("/orders");
  revalidatePath(`/orders/${id}`);
}

export async function deleteOrder(id: string){
  const user = await requireUser();
  const order = await prisma.order.findUnique({where:{id}});
  if(!order) throw new Error("Not found");
  if(order.status==="SELESAI") throw new Error("Tidak boleh hapus pesanan selesai");
  if(user.role==="PELANGGAN" && order.userId!==user.id) throw new Error("Forbidden");
  await prisma.order.delete({where:{id}});
  revalidatePath("/orders");
}

export async function uploadProof(formData: FormData){
  const user = await requireUser();
  const orderId = formData.get("orderId") as string;
  if(!orderId) throw new Error("orderId wajib");
  const order = await prisma.order.findUnique({where:{id:orderId}});
  if(!order) throw new Error("Order tidak ditemukan");
  if(user.role==="PELANGGAN" && order.userId!==user.id) throw new Error("Forbidden");
  const file = formData.get("proof") as File;
  if(!file || file.size===0) throw new Error("File wajib");
  validateFile(file);
  const url = await saveFile(file);
  await prisma.order.update({ where:{id:orderId}, data:{ proofUrl: url }});
  revalidatePath(`/orders/${orderId}`);
  return url;
}
export async function updatePaymentStatus(orderId: string, status: "BELUM_BAYAR"|"LUNAS"){
  const user = await requireUser();
  if(user.role==="PELANGGAN") throw new Error("Forbidden: hanya STAFF/ADMIN yang bisa verifikasi pembayaran");
  const order = await prisma.order.findUnique({where:{id:orderId}});
  if(!order) throw new Error("Not found");
  if(order.paymentMethod==="TRANSFER" && status==="LUNAS" && !order.proofUrl) throw new Error("Upload bukti transfer dulu");
  await prisma.order.update({ where:{id:orderId}, data:{ paymentStatus: status as any }});
  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/orders");
}
