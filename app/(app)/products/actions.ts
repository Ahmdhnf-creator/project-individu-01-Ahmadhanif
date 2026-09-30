"use server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { productSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
export async function createProduct(formData: FormData){
  await requireRole("STAFF");
  const raw = Object.fromEntries(formData) as Record<string, string>;
  // checkbox handling: trackStock/isActive dari form bisa "on"/"true"
  const normalized = {
    ...raw,
    trackStock: raw.trackStock === "false" ? false : raw.trackStock === "true" || raw.trackStock === "on" ? true : raw.trackStock ? true : false,
    isActive: raw.isActive === "false" ? false : true,
  };
  const data = productSchema.parse(normalized);
  const toCreate = { ...data, stock: data.trackStock ? data.stock : 0 };
  await prisma.product.create({ data: toCreate });
  revalidatePath("/products");
}
export async function updateProduct(id: string, formData: FormData){
  await requireRole("STAFF");
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const normalized = {
    ...raw,
    trackStock: raw.trackStock === "false" ? false : raw.trackStock === "true" || raw.trackStock === "on" ? true : false,
    isActive: raw.isActive === "false" ? false : true,
  };
  const data = productSchema.parse(normalized);
  const toUpdate = { ...data, stock: data.trackStock ? data.stock : 0 };
  await prisma.product.update({ where:{id}, data: toUpdate });
  revalidatePath("/products");
}
export async function deleteProduct(id: string){
  await requireRole("STAFF");
  const count = await prisma.orderItem.count({ where:{ productId:id }});
  if(count>0){
    await prisma.product.update({ where:{id}, data:{ isActive: false }});
    revalidatePath("/products");
    revalidatePath("/catalog");
    return { soft: true } as const;
  }
  await prisma.product.delete({ where:{id}});
  revalidatePath("/products");
  revalidatePath("/catalog");
  return { soft: false } as const;
}
