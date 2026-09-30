"use server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { customerSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
export async function createCustomer(formData: FormData){
  await requireRole("STAFF");
  const data = customerSchema.parse(Object.fromEntries(formData));
  await prisma.customer.create({ data });
  revalidatePath("/customers");
}
export async function updateCustomer(id: string, formData: FormData){
  await requireRole("STAFF");
  const data = customerSchema.parse(Object.fromEntries(formData));
  await prisma.customer.update({ where:{id}, data });
  revalidatePath("/customers");
}
export async function deleteCustomer(id: string){
  await requireRole("STAFF");
  const count = await prisma.order.count({ where:{ customerId:id }});
  if(count>0) throw new Error("Pelanggan masih ada pesanan");
  await prisma.customer.delete({ where:{id}});
  revalidatePath("/customers");
}
