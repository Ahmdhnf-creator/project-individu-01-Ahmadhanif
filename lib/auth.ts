import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
export async function hashPassword(p: string){ return bcrypt.hash(p, 10); }
export async function verifyPassword(p: string, h: string){ return bcrypt.compare(p, h); }
export async function createSession(userId: string){
  const id = crypto.randomUUID();
  await prisma.session.create({ data:{ id, userId, expiresAt: new Date(Date.now()+7*24*3600*1000)}});
  (await cookies()).set("session", id, { httpOnly:true, sameSite:"lax", path:"/", maxAge:60*60*24*7, secure: process.env.NODE_ENV==="production" });
  return id;
}
export async function getCurrentUser(){
  const sid = (await cookies()).get("session")?.value;
  if(!sid) return null;
  const s = await prisma.session.findUnique({ include:{user:true}, where:{id:sid}});
  if(!s || s.expiresAt < new Date()) return null;
  return s.user;
}
export async function requireUser(){ const u=await getCurrentUser(); if(!u) throw new Error("Unauthorized"); return u; }
export async function requireRole(role: "ADMIN"|"STAFF"|"PELANGGAN"){ const u=await requireUser(); if(u.role!==role && u.role!=="ADMIN") throw new Error("Forbidden"); return u; }
export async function deleteSession(id:string){ await prisma.session.delete({where:{id}}); (await cookies()).delete("session"); }
