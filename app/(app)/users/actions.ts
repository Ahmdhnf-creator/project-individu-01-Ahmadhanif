"use server";
import { prisma } from "@/lib/prisma";
import { requireRole, hashPassword } from "@/lib/auth";
import { createUserSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createUser(formData: FormData){
  await requireRole("ADMIN");
  const data = createUserSchema.parse(Object.fromEntries(formData));
  const hash = await hashPassword(data.password);
  await prisma.user.create({ data:{ name: data.name, email: data.email, password: hash, role: data.role as any, wa: data.wa, address: data.address }});
  revalidatePath("/users");
}
export async function updateUser(id: string, formData: FormData){
  await requireRole("ADMIN");
  const raw = Object.fromEntries(formData);
  // password optional on update
  const schema = createUserSchema.partial({ password: true });
  const data = schema.parse(raw);
  const update: any = { name: data.name, email: data.email, role: data.role, wa: data.wa, address: data.address };
  if (data.password) update.password = await hashPassword(data.password);
  // remove undefined
  Object.keys(update).forEach(k => update[k] === undefined && delete update[k]);
  await prisma.user.update({ where:{id}, data: update });
  revalidatePath("/users");
}
export async function deleteUser(id: string){
  const admin = await requireRole("ADMIN");
  if(id===admin.id) throw new Error("Tidak boleh hapus diri sendiri");
  await prisma.user.delete({where:{id}});
  revalidatePath("/users");
}
