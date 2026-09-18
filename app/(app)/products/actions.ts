"use server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { productSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
export async function createProduct(formData: FormData){
  await requireRole("STAFF");
  const data = productSchema.parse(Object.fromEntries(formData));
  await prisma.product.create({ data });
  revalidatePath("/products");
}
export async function updateProduct(id: string, formData: FormData){
  await requireRole("STAFF");
  const data = productSchema.parse(Object.fromEntries(formData));
  await prisma.product.update({ where:{id}, data });
  revalidatePath("/products");
}
export async function deleteProduct(id: string){
  await requireRole("STAFF");
  const count = await prisma.orderItem.count({ where:{ productId:id }});
  if(count>0) throw new Error("Produk masih dipakai di pesanan");
  await prisma.product.delete({ where:{id}});
  revalidatePath("/products");
}
