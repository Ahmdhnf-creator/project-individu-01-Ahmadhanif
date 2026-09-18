"use server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { canTransition, calculateTotal } from "@/lib/order";
import type { OrderStatus } from "@/lib/order";
import { revalidatePath } from "next/cache";
import { createOrderSchema } from "@/lib/validations";

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
  const itemsWithPrice = parsed.items.map(i=>{
    const p = products.find(x=>x.id===i.productId)!;
    return { productId:i.productId, qty:i.qty, price:p.price, subtotal:p.price*i.qty };
  });
  const total = calculateTotal(itemsWithPrice);
  await prisma.$transaction(async (tx)=>{
    const order = await tx.order.create({ data:{
      customerId: user.role==="PELANGGAN" ? null : (parsed.customerId || null),
      userId: user.role==="PELANGGAN" ? user.id : null,
      paymentMethod: parsed.paymentMethod as any,
      total,
      status: "BARU",
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
        if(!p || p.stock < item.qty) throw new Error(`Stok ${p?.name ?? item.productId} tidak cukup`);
        await tx.product.update({ where:{id:p.id}, data:{ stock:{ decrement: item.qty }}});
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
