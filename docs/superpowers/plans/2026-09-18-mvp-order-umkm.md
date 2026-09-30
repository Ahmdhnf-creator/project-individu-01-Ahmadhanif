# MVP Order Management UMKM Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun MVP Order Management UMKM siap pakai dengan 3 role (ADMIN/STAFF/PELANGGAN), katalog + keranjang, pesanan hybrid multi-item, status Baru→Diproses→Dikirim→Selesai+Batal, stok decrement transaksi saat Selesai, pembayaran Transfer+COD + upload bukti, dashboard & laporan omzet.

**Architecture:** Monolith Next.js 16 App Router + Server Actions + Server Components + Prisma SQLite (dev) → Postgres (prod) + cookie session httpOnly + storage abstraction lokal. Middleware guard + requireRole di Server Action. Tiap task menghasilkan software testable berurutan.

**Tech Stack:** Next.js 16.3.4, React 19, Tailwind 4, TypeScript, Prisma 6, SQLite, bcryptjs 2.4.3, zod 3.23, Recharts 2.12, sonner 1.5, vitest, tsx

**Spec:** `docs/superpowers/specs/2026-09-18-mvp-order-umkm-design.md`

## Global Constraints

- Next.js 16.3.4 — patuh `node_modules/next/dist/docs/` (AGENTS.md), jangan hapus block AGENTS.md.
- Prisma provider `sqlite` dan `DATABASE_URL="file:./dev.db"` untuk dev; siap ganti ke postgresql tanpa refactor.
- Password hash bcryptjs 10 rounds, session cookie httpOnly, SameSite Lax, Secure di production, expires 7 hari.
- Stok hanya decrement saat transisi →SELESAI dalam `prisma.$transaction`, validasi tidak boleh minus.
- TRANSFER wajib proofUrl sebelum LUNAS; COD bisa langsung LUNAS.
- Laporan hanya hitung Order status=SELESAI.
- Produk MVP sederhana: name, price (Int rupiah), stock (Int) — tanpa SKU/kategori.
- Bahasa UI Indonesia (Baru/Diproses/Dikirim/Selesai/Batal, Rp, Belum Bayar/Lunas).
- Validasi server-side zod adalah source of truth.

---

### Task 1: Foundation — Prisma, Auth, Middleware, Layout App, Login/Register

**Files:**
- Create: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Create: `lib/prisma.ts`
- Create: `lib/auth.ts`
- Create: `lib/validations.ts`
- Create: `middleware.ts`
- Create: `app/(auth)/login/page.tsx` (ganti existing `app/login/page.tsx` — pindah route, hapus localStorage)
- Create: `app/(auth)/register/page.tsx`
- Create: `app/(app)/layout.tsx`
- Modify: `app/dashboard/page.tsx` — hapus localStorage logic (`app/dashboard/page.tsx:5`), jadi Server Component dengan `requireUser()` sementara tampil placeholder stats
- Modify: `package.json` — tambah deps + prisma.seed
- Modify: `.gitignore` — ignore `prisma/dev.db`, `public/uploads/*`
- Modify: `.env` — tambah `DATABASE_URL="file:./dev.db"`
- Test: `tests/foundation.test.ts`

**Interfaces:**
- Consumes: Next.js `cookies()`, `PrismaClient`
- Produces:
  - `lib/prisma.ts: prisma: PrismaClient` (singleton)
  - `lib/auth.ts: hashPassword(p: string): Promise<string>, verifyPassword(p: string, hash: string): Promise<boolean>, createSession(userId: string): Promise<string>, getCurrentUser(): Promise<User|null>, requireUser(): Promise<User>, requireRole(role: Role): Promise<User>, deleteSession(sessionId: string): Promise<void>`
  - `lib/validations.ts: loginSchema, registerSchema, createUserSchema`
  - `middleware.ts: middleware(req: NextRequest)`

- [ ] **Step 1: Tambah deps dan setup Prisma**

```bash
bun add prisma @prisma/client bcryptjs zod
bun add -d @types/bcryptjs vitest tsx
bunx prisma init --datasource-provider sqlite
```

Edit `prisma/schema.prisma` sesuai Spec §4 (User dengan Role ADMIN/STAFF/PELANGGAN + wa/address, Session, Product sederhana, Customer opsional, Order dengan customerId+userId nullable, OrderItem). Set `DATABASE_URL="file:./dev.db"` di `.env`. Edit `package.json` tambah `"prisma": { "seed": "tsx prisma/seed.ts" }`.

- [ ] **Step 2: Write failing test untuk auth utils**

```ts
// tests/foundation.test.ts
import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../lib/auth";
import { loginSchema, registerSchema } from "../lib/validations";

describe("auth", () => {
  it("hash dan verify password", async () => {
    const h = await hashPassword("123456");
    expect(await verifyPassword("123456", h)).toBe(true);
    expect(await verifyPassword("wrong", h)).toBe(false);
  });
  it("loginSchema validasi", () => {
    expect(loginSchema.safeParse({email:"a@b.com", password:"123456"}).success).toBe(true);
    expect(loginSchema.safeParse({email:"invalid", password:"123"}).success).toBe(false);
  });
  it("registerSchema validasi", () => {
    expect(registerSchema.safeParse({name:"Budi", email:"budi@mail.com", password:"123456", wa:"08123456789"}).success).toBe(true);
    expect(registerSchema.safeParse({name:"", email:"bad", password:"123", wa:""}).success).toBe(false);
  });
});
```

- [ ] **Step 3: Run test — expect FAIL (file belum ada)**

Run: `bunx vitest run tests/foundation.test.ts -v`
Expected: FAIL `Cannot find module '../lib/auth'`

- [ ] **Step 4: Implement lib/prisma.ts, lib/auth.ts, lib/validations.ts**

```ts
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// lib/auth.ts
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

// lib/validations.ts
import { z } from "zod";
export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });
export const registerSchema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(6), wa: z.string().min(8), address: z.string().optional() });
export const createUserSchema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(6), role: z.enum(["ADMIN","STAFF","PELANGGAN"]), wa: z.string().optional(), address: z.string().optional() });
```

- [ ] **Step 5: Run test — expect PASS**

Run: `bunx vitest run tests/foundation.test.ts -v`
Expected: PASS

- [ ] **Step 6: Implement middleware.ts**

```ts
// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
export function middleware(req: NextRequest){
  const session = req.cookies.get("session")?.value;
  const path = req.nextUrl.pathname;
  const isAuth = path.startsWith("/login") || path.startsWith("/register");
  const isApp = path.startsWith("/dashboard") || path.startsWith("/products") || path.startsWith("/customers") || path.startsWith("/orders") || path.startsWith("/reports") || path.startsWith("/users") || path.startsWith("/catalog");
  if(isApp && !session) return NextResponse.redirect(new URL("/login", req.url));
  if(isAuth && session) return NextResponse.redirect(new URL("/dashboard", req.url));
  return NextResponse.next();
}
export const config = { matcher: ["/dashboard/:path*", "/products/:path*", "/customers/:path*", "/orders/:path*", "/reports/:path*", "/users/:path*", "/catalog/:path*", "/login", "/register"] };
```

- [ ] **Step 7: Implement prisma/seed.ts + migrate**

```ts
// prisma/seed.ts
import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/auth";
async function main(){
  const hash = await hashPassword("123456");
  await prisma.user.upsert({ where:{email:"admin@gmail.com"}, update:{}, create:{ email:"admin@gmail.com", password: hash, name:"Admin", role:"ADMIN", wa:"08123456789"} });
}
main().then(()=>process.exit(0));
```

Run: `bunx prisma migrate dev --name init && bunx prisma db seed`

- [ ] **Step 8: Implement app/(auth)/login/page.tsx Server Action**

Ganti `app/login/page.tsx` lama (localStorage) → Server Action `login` yang pakai `loginSchema`, `verifyPassword`, `createSession`. Hapus `app/login` lama, buat `(auth)/login` dan `(auth)/register`. Redirect ke `/dashboard` on success (login) atau `/catalog` untuk PELANGGAN register, tampil error via `searchParams`.

```ts
// app/(auth)/login/page.tsx (Server Component + Server Action)
import { loginSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  async function login(formData: FormData){
    "use server";
    const data = loginSchema.parse(Object.fromEntries(formData));
    const user = await prisma.user.findUnique({ where:{email: data.email}});
    if(!user || !await verifyPassword(data.password, user.password)) redirect("/login?error=Email%20atau%20password%20salah");
    await createSession(user.id);
    redirect("/dashboard");
  }
  return (<form action={login}>...email+password...+{searchParams.error && <p>{searchParams.error}</p>}<button>Login</button></form>);
}
```

Buat `app/(auth)/register/page.tsx` serupa dengan `registerSchema`, hash password, create User role PELANGGAN, createSession, redirect `/catalog`.

- [ ] **Step 9: Implement app/(app)/layout.tsx (sidebar) + hapus localStorage di dashboard**

Sidebar link sesuai Spec §8 (Dashboard, Katalog, Produk, Pelanggan, Pesanan, Laporan, Users) — filter by role dari `getCurrentUser()`. Tambah header user info + form logout Server Action (`deleteSession`). Dashboard sementara placeholder stats tapi sudah Server Component dengan `requireUser()`, hapus `app/dashboard/page.tsx:5` localStorage.

- [ ] **Step 10: Commit**

```bash
git add prisma/ lib/ middleware.ts app/ package.json .env .gitignore tests/foundation.test.ts
git commit -m "feat: foundation prisma auth middleware login/register (task 1)"
```

---

### Task 2: Produk & Pelanggan CRUD

**Files:**
- Create: `app/(app)/products/page.tsx`
- Create: `app/(app)/products/actions.ts`
- Create: `app/(app)/customers/page.tsx`
- Create: `app/(app)/customers/actions.ts`
- Modify: `lib/validations.ts` — tambah `productSchema`, `customerSchema`
- Test: `tests/products.test.ts`

**Interfaces:**
- Consumes: `prisma` (Task 1), `requireUser()` (Task 1), `productSchema`, `customerSchema`
- Produces:
  - `app/(app)/products/actions.ts: createProduct(formData: FormData), updateProduct(id: string, formData: FormData), deleteProduct(id: string)`
  - `app/(app)/customers/actions.ts: createCustomer(formData: FormData), updateCustomer(id: string, formData: FormData), deleteCustomer(id: string)`

- [ ] **Step 1: Write failing test**

```ts
// tests/products.test.ts
import { productSchema, customerSchema } from "../lib/validations";
import { describe, it, expect } from "vitest";
describe("product & customer", () => {
  it("productSchema validasi", () => {
    expect(productSchema.safeParse({name:"Kopi", price:15000, stock:10}).success).toBe(true);
    expect(productSchema.safeParse({name:"", price:-1, stock:-1}).success).toBe(false);
  });
  it("customerSchema validasi", () => {
    expect(customerSchema.safeParse({name:"Budi", wa:"08123456789", address:"Jl"}).success).toBe(true);
    expect(customerSchema.safeParse({name:"", wa:""}).success).toBe(false);
  });
});
```

- [ ] **Step 2: Run test — FAIL**

Run: `bunx vitest run tests/products.test.ts -v` → FAIL `productSchema not defined`

- [ ] **Step 3: Implement productSchema + customerSchema + actions**

```ts
// lib/validations.ts tambah
export const productSchema = z.object({ name: z.string().min(2), price: z.coerce.number().int().min(0), stock: z.coerce.number().int().min(0) });
export const customerSchema = z.object({ name: z.string().min(2), wa: z.string().min(8), address: z.string().optional() });

// app/(app)/products/actions.ts
"use server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { productSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
export async function createProduct(formData: FormData){
  await requireUser();
  const data = productSchema.parse(Object.fromEntries(formData));
  await prisma.product.create({ data });
  revalidatePath("/products");
}
export async function updateProduct(id: string, formData: FormData){
  await requireUser();
  const data = productSchema.parse(Object.fromEntries(formData));
  await prisma.product.update({ where:{id}, data });
  revalidatePath("/products");
}
export async function deleteProduct(id: string){
  await requireUser();
  const count = await prisma.orderItem.count({ where:{ productId:id }});
  if(count>0) throw new Error("Produk masih dipakai di pesanan");
  await prisma.product.delete({ where:{id}});
  revalidatePath("/products");
}

// app/(app)/customers/actions.ts — mirip
"use server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { customerSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
export async function createCustomer(formData: FormData){
  await requireUser();
  const data = customerSchema.parse(Object.fromEntries(formData));
  await prisma.customer.create({ data });
  revalidatePath("/customers");
}
export async function updateCustomer(id: string, formData: FormData){
  await requireUser();
  const data = customerSchema.parse(Object.fromEntries(formData));
  await prisma.customer.update({ where:{id}, data });
  revalidatePath("/customers");
}
export async function deleteCustomer(id: string){
  await requireUser();
  const count = await prisma.order.count({ where:{ customerId:id }});
  if(count>0) throw new Error("Pelanggan masih ada pesanan");
  await prisma.customer.delete({ where:{id}});
  revalidatePath("/customers");
}
```

- [ ] **Step 4: Run test — PASS**

Run: `bunx vitest run tests/products.test.ts -v` → PASS

- [ ] **Step 5: Implement UI page.tsx**

- `products/page.tsx`: Server Component `prisma.product.findMany()` + search `?q=` + pagination 10. Client modal untuk create/edit dengan `productSchema` preview + call Server Action. Delete confirm + sonner. Guard: STAFF/PELANGGAN check — PELANGGAN redirect, STAFF boleh CRU tapi delete tetap cek OrderItem.
- `customers/page.tsx`: Tabel pelanggan + search + modal create/edit + delete confirm. Sama pattern.

- [ ] **Step 6: Commit**

```bash
git add app/\(app\)/products app/\(app\)/customers lib/validations.ts tests/products.test.ts
git commit -m "feat: produk & pelanggan CRUD (task 2)"
```

---

### Task 3: Katalog + Pesanan Multi-Item + State Machine + Stok Transaction

**Files:**
- Create: `app/(app)/catalog/page.tsx`
- Create: `app/(app)/orders/page.tsx`
- Create: `app/(app)/orders/[id]/page.tsx`
- Create: `app/(app)/orders/actions.ts`
- Create: `lib/order.ts`
- Modify: `lib/validations.ts` — tambah `createOrderSchema`, `updateStatusSchema`
- Test: `tests/orders.test.ts`

**Interfaces:**
- Consumes: `prisma`, `requireUser()`, Product & Customer/User
- Produces:
  - `lib/order.ts: canTransition(from: OrderStatus, to: OrderStatus): boolean, calculateTotal(items: {price:number, qty:number}[]): number, getNextStatuses(status: OrderStatus): OrderStatus[]`
  - `app/(app)/orders/actions.ts: createOrder(formData: FormData), updateOrderStatus(id: string, nextStatus: OrderStatus), deleteOrder(id: string)`

- [ ] **Step 1: Write failing test**

```ts
// tests/orders.test.ts
import { canTransition, calculateTotal, getNextStatuses } from "../lib/order";
import { describe, it, expect } from "vitest";
describe("order state machine", () => {
  it("canTransition", () => {
    expect(canTransition("BARU","DIPROSES")).toBe(true);
    expect(canTransition("BARU","DIKIRIM")).toBe(false);
    expect(canTransition("DIPROSES","DIKIRIM")).toBe(true);
    expect(canTransition("DIKIRIM","SELESAI")).toBe(true);
    expect(canTransition("SELESAI","BATAL")).toBe(false);
    expect(canTransition("BARU","BATAL")).toBe(true);
    expect(canTransition("DIPROSES","BATAL")).toBe(true);
    expect(canTransition("DIKIRIM","BATAL")).toBe(false);
  });
  it("getNextStatuses", () => {
    expect(getNextStatuses("BARU")).toEqual(expect.arrayContaining(["DIPROSES","BATAL"]));
    expect(getNextStatuses("SELESAI")).toEqual([]);
  });
  it("calculateTotal", () => {
    expect(calculateTotal([{price:10000,qty:2},{price:5000,qty:3}])).toBe(35000);
    expect(calculateTotal([])).toBe(0);
  });
});
```

- [ ] **Step 2: Run test — FAIL**

Run: `bunx vitest run tests/orders.test.ts -v` → FAIL `Cannot find module '../lib/order'`

- [ ] **Step 3: Implement lib/order.ts + validations**

```ts
// lib/order.ts
export type OrderStatus = "BARU"|"DIPROSES"|"DIKIRIM"|"SELESAI"|"BATAL";
const transitions: Record<OrderStatus, OrderStatus[]> = { BARU:["DIPROSES","BATAL"], DIPROSES:["DIKIRIM","BATAL"], DIKIRIM:["SELESAI"], SELESAI:[], BATAL:[] };
export function canTransition(from: OrderStatus, to: OrderStatus){ return transitions[from].includes(to); }
export function getNextStatuses(s: OrderStatus){ return transitions[s]; }
export function calculateTotal(items: {price:number, qty:number}[]){ return items.reduce((a,b)=>a+b.price*b.qty,0); }

// lib/validations.ts tambah
export const createOrderSchema = z.object({ customerId: z.string().optional(), paymentMethod: z.enum(["TRANSFER","COD"]), items: z.array(z.object({ productId: z.string(), qty: z.coerce.number().int().min(1) })).min(1) });
export const updateStatusSchema = z.object({ status: z.enum(["BARU","DIPROSES","DIKIRIM","SELESAI","BATAL"]) });
```

- [ ] **Step 4: Run test — PASS**

Run: `bunx vitest run tests/orders.test.ts -v` → PASS

- [ ] **Step 5: Implement actions.ts (create + stok transaction)**

```ts
"use server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { canTransition, calculateTotal } from "@/lib/order";
import { revalidatePath } from "next/cache";
import { createOrderSchema } from "@/lib/validations";

export async function createOrder(formData: FormData){
  const user = await requireUser();
  const raw = {
    customerId: formData.get("customerId") as string || undefined,
    paymentMethod: formData.get("paymentMethod") as string,
    items: JSON.parse(formData.get("items") as string),
  };
  const parsed = createOrderSchema.parse(raw);
  // hitung total server dari Product.price
  const products = await prisma.product.findMany({ where:{ id:{ in: parsed.items.map(i=>i.productId)}}});
  const itemsWithPrice = parsed.items.map(i=>{
    const p = products.find(x=>x.id===i.productId)!;
    return { productId:i.productId, qty:i.qty, price:p.price, subtotal:p.price*i.qty };
  });
  const total = calculateTotal(itemsWithPrice);
  // jika user PELANGGAN, pakai userId; jika STAFF/ADMIN buat untuk customerId
  await prisma.$transaction(async (tx)=>{
    const order = await tx.order.create({ data:{
      customerId: parsed.customerId || null,
      userId: user.role==="PELANGGAN" ? user.id : null,
      paymentMethod: parsed.paymentMethod as any,
      total,
      status: "BARU",
    }});
    await tx.orderItem.createMany({ data: itemsWithPrice.map(it=>({ orderId: order.id, ...it }))});
  });
  revalidatePath("/orders");
}

export async function updateOrderStatus(id: string, next: OrderStatus){
  const user = await requireUser();
  if(user.role==="PELANGGAN") throw new Error("Forbidden");
  const order = await prisma.order.findUnique({ include:{items:true}, where:{id}});
  if(!order) throw new Error("Order tidak ditemukan");
  if(!canTransition(order.status as any, next as any)) throw new Error("Transisi tidak valid");
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
```

- [ ] **Step 6: Implement UI**

- `catalog/page.tsx`: Server Component list `prisma.product.findMany()` tampil katalog, client keranjang (useState) pilih qty, preview total via `calculateTotal`, checkout form pilih paymentMethod + customerId (hidden untuk pelanggan), submit ke `createOrder`, toast sonner.
- `orders/page.tsx`: Server Component list `prisma.order.findMany({include:{customer, user, items:{include:{product}}}})` — filter by role (PELANGGAN hanya `where userId = current.id`), filter status `?status=`, search customer. Link ke detail. Tombol Buat Pesanan (untuk ADMIN/STAFF modal sama seperti katalog).
- `orders/[id]/page.tsx`: detail order (customer, items, total, status badge, payment), tombol transisi kondisional (`getNextStatuses`) dengan confirm, delete (hanya jika BARU/BATAL), untuk PELANGGAN read-only.

- [ ] **Step 7: Commit**

```bash
git add lib/order.ts app/\(app\)/catalog app/\(app\)/orders tests/orders.test.ts lib/validations.ts
git commit -m "feat: katalog + pesanan multi-item + state machine + stok tx (task 3)"
```

---

### Task 4: Pembayaran + Upload Bukti

**Files:**
- Create: `lib/storage.ts`
- Modify: `app/(app)/orders/actions.ts` — tambah `uploadProof` dan `updatePaymentStatus`
- Modify: `app/(app)/orders/[id]/page.tsx` — tambah UI upload & badge bayar
- Test: `tests/storage.test.ts`

**Interfaces:**
- Consumes: `prisma`, `requireUser()`
- Produces:
  - `lib/storage.ts: saveFile(file: File): Promise<string>, getUrl(path: string): string, validateFile(file: File): void`
  - `uploadProof(orderId: string, formData: FormData): Promise<string>`
  - `updatePaymentStatus(orderId: string, status: PaymentStatus): Promise<void>`

- [ ] **Step 1: Write failing test**

```ts
// tests/storage.test.ts
import { getUrl, validateFile } from "../lib/storage";
import { describe, it, expect } from "vitest";
describe("storage", () => {
  it("getUrl", () => {
    expect(getUrl("/uploads/abc.jpg")).toBe("/uploads/abc.jpg");
  });
  it("validateFile menolak tipe salah", () => {
    const file = new File(["x"], "a.txt", { type:"text/plain" });
    Object.defineProperty(file, "size", { value: 1000 });
    expect(()=>validateFile(file)).toThrow("Tipe file");
  });
  it("validateFile menolak >5MB", () => {
    const file = new File(["x"], "a.jpg", { type:"image/jpeg" });
    Object.defineProperty(file, "size", { value: 6*1024*1024 });
    expect(()=>validateFile(file)).toThrow("Maks 5MB");
  });
});
```

- [ ] **Step 2: Run test — FAIL**

Run: `bunx vitest run tests/storage.test.ts -v` → FAIL `Cannot find module '../lib/storage'`

- [ ] **Step 3: Implement lib/storage.ts**

```ts
import { writeFile, mkdir } from "fs/promises";
import path from "path";
export async function saveFile(file: File){
  const bytes = await file.arrayBuffer();
  const ext = path.extname(file.name);
  const name = `${crypto.randomUUID()}${ext}`;
  const dir = path.join(process.cwd(), "public/uploads");
  await mkdir(dir, { recursive:true });
  await writeFile(path.join(dir, name), Buffer.from(bytes));
  return `/uploads/${name}`;
}
export function getUrl(p: string){ return p; }
export function validateFile(file: File){
  if(!["image/jpeg","image/png","application/pdf"].includes(file.type)) throw new Error("Tipe file harus jpg/png/pdf");
  if(file.size > 5*1024*1024) throw new Error("Maks 5MB");
}
```

- [ ] **Step 4: Run test — PASS**

Run: `bunx vitest run tests/storage.test.ts -v` → PASS

- [ ] **Step 5: Implement uploadProof + updatePaymentStatus**

```ts
// di app/(app)/orders/actions.ts tambah
import { saveFile, validateFile } from "@/lib/storage";
export async function uploadProof(orderId: string, formData: FormData){
  const user = await requireUser();
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
  await requireUser();
  const order = await prisma.order.findUnique({where:{id:orderId}});
  if(!order) throw new Error("Not found");
  if(order.paymentMethod==="TRANSFER" && status==="LUNAS" && !order.proofUrl) throw new Error("Upload bukti transfer dulu");
  await prisma.order.update({ where:{id:orderId}, data:{ paymentStatus: status as any }});
  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/orders");
}
```

- [ ] **Step 6: Implement UI di orders/[id]/page.tsx**

Tampil proof image/pdf link via `getUrl`, input file + button Upload (hanya jika TRANSFER dan belum LUNAS), button Tandai Lunas (validasi proof, panggil `updatePaymentStatus`), badge paymentStatus warna (BELUM_BAYAR kuning, LUNAS hijau).

- [ ] **Step 7: Commit**

```bash
git add lib/storage.ts app/\(app\)/orders tests/storage.test.ts
git commit -m "feat: pembayaran + upload bukti (task 4)"
```

---

### Task 5: Laporan + Dashboard Real + User Management + Polish

**Files:**
- Create: `app/(app)/reports/page.tsx`
- Create: `lib/reports.ts`
- Create: `app/(app)/users/page.tsx`
- Create: `app/(app)/users/actions.ts`
- Modify: `app/(app)/dashboard/page.tsx` — ganti mock ke real query
- Modify: `app/(app)/layout.tsx` — tambah Toaster sonner
- Modify: `app/layout.tsx` — metadata update
- Test: `tests/reports.test.ts`

**Interfaces:**
- Consumes: `prisma`, `requireUser()`, `requireRole('ADMIN')`
- Produces:
  - `lib/reports.ts: groupByPeriod(orders: {total:number, createdAt:Date}[], range: 'harian'|'mingguan'|'bulanan'): {label:string, total:number}[], getReport(range, from: Date, to: Date): Promise<{totalOmzet:number, totalOrders:number, perCustomer: {customerId:string, name:string, wa:string, total:number, count:number}[], perPeriod: {label:string, total:number}[]}>`
  - `app/(app)/users/actions.ts: createUser(formData), updateUser(id, formData), deleteUser(id)` (ADMIN only)

- [ ] **Step 1: Write failing test**

```ts
// tests/reports.test.ts
import { groupByPeriod } from "../lib/reports";
import { describe, it, expect } from "vitest";
describe("reports", () => {
  it("groupByPeriod harian", () => {
    const data = [{total:10000, createdAt:new Date("2026-09-10")},{total:20000, createdAt:new Date("2026-09-10")},{total:5000, createdAt:new Date("2026-09-11")}];
    const res = groupByPeriod(data, "harian");
    expect(res.find(r=>r.label==="2026-09-10")?.total).toBe(30000);
    expect(res.find(r=>r.label==="2026-09-11")?.total).toBe(5000);
  });
  it("groupByPeriod bulanan", () => {
    const data = [{total:10000, createdAt:new Date("2026-09-10")},{total:20000, createdAt:new Date("2026-10-01")}];
    const res = groupByPeriod(data, "bulanan");
    expect(res.find(r=>r.label==="2026-09")?.total).toBe(10000);
    expect(res.find(r=>r.label==="2026-10")?.total).toBe(20000);
  });
});
```

- [ ] **Step 2: Run test — FAIL**

Run: `bunx vitest run tests/reports.test.ts -v` → FAIL `Cannot find module '../lib/reports'`

- [ ] **Step 3: Implement lib/reports.ts**

```ts
export function groupByPeriod(orders: {total:number, createdAt:Date}[], range: "harian"|"mingguan"|"bulanan"){
  const map = new Map<string, number>();
  for(const o of orders){
    let label: string;
    if(range==="harian") label = o.createdAt.toISOString().slice(0,10);
    else if(range==="bulanan") label = o.createdAt.toISOString().slice(0,7);
    else {
      // mingguan: YYYY-Www ISO week
      const d = new Date(o.createdAt);
      const jan1 = new Date(d.getFullYear(),0,1);
      const week = Math.ceil(((d.getTime()-jan1.getTime())/86400000 + jan1.getDay()+1)/7);
      label = `${d.getFullYear()}-W${String(week).padStart(2,"0")}`;
    }
    map.set(label, (map.get(label)||0)+o.total);
  }
  return Array.from(map.entries()).map(([label,total])=>({label,total})).sort((a,b)=>a.label.localeCompare(b.label));
}
export async function getReport(range: "harian"|"mingguan"|"bulanan", from: Date, to: Date){
  const { prisma } = await import("./prisma");
  const orders = await prisma.order.findMany({ where:{ status:"SELESAI", createdAt:{ gte:from, lte:to }}, include:{customer:true, user:true}});
  const totalOmzet = orders.reduce((a,b)=>a+b.total,0);
  const perCustomerMap = new Map<string, {name:string, wa:string, total:number, count:number}>();
  for(const o of orders){
    const key = o.customerId ?? o.userId ?? "unknown";
    const name = o.customer?.name ?? o.user?.name ?? "Unknown";
    const wa = o.customer?.wa ?? o.user?.wa ?? "-";
    const cur = perCustomerMap.get(key) ?? {name, wa, total:0, count:0};
    cur.total += o.total; cur.count += 1;
    perCustomerMap.set(key, cur);
  }
  return {
    totalOmzet,
    totalOrders: orders.length,
    perCustomer: Array.from(perCustomerMap.entries()).map(([customerId, v])=>({customerId, ...v})),
    perPeriod: groupByPeriod(orders, range),
  };
}
```

- [ ] **Step 4: Run test — PASS**

Run: `bunx vitest run tests/reports.test.ts -v` → PASS

- [ ] **Step 5: Implement reports/page.tsx**

Filter: select range + date from/to (default bulan ini via `searchParams`). Call `getReport`. Tampilkan kartu Total Omzet, Total Pesanan, Rata-rata. Recharts BarChart `perPeriod`. Tabel per pelanggan (nama, WA, jumlah pesanan, total omzet). Tombol Export CSV (client generate dari data, `Blob` + `URL.createObjectURL`).

- [ ] **Step 6: Implement users/page.tsx (ADMIN only)**

`requireRole('ADMIN')` di page. Tabel user + modal create/edit (name, email, password, role, wa) + delete. Validasi `createUserSchema`. Error jika hapus diri sendiri (`if(id===currentUser.id) throw`). Server Actions di `app/(app)/users/actions.ts`.

```ts
// app/(app)/users/actions.ts
"use server";
import { prisma } from "@/lib/prisma";
import { requireRole, hashPassword } from "@/lib/auth";
import { createUserSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
export async function createUser(formData: FormData){
  await requireRole("ADMIN");
  const data = createUserSchema.parse(Object.fromEntries(formData));
  const hash = await hashPassword(data.password);
  await prisma.user.create({ data:{ ...data, password: hash }});
  revalidatePath("/users");
}
export async function deleteUser(id: string){
  const admin = await requireRole("ADMIN");
  if(id===admin.id) throw new Error("Tidak boleh hapus diri sendiri");
  await prisma.user.delete({where:{id}});
  revalidatePath("/users");
}
```

- [ ] **Step 7: Implement dashboard real data**

Ganti mock `app/dashboard/page.tsx:11` → `prisma.order.groupBy` + `count` untuk kartu (Total, Baru, Diproses, Dikirim, Selesai) + `findMany` order terbaru 5 dengan `include customer/user`. Untuk PELANGGAN, filter `where userId = current.id`.

- [ ] **Step 8: Polish**

- Tambah `sonner` Toaster di `app/(app)/layout.tsx`: `import { Toaster } from "sonner"; <Toaster />`
- Update `app/layout.tsx` metadata title/description "Order UMKM".
- Tambah `public/uploads/.gitkeep` dan `.gitignore` rule `public/uploads/*` `!public/uploads/.gitkeep`.
- Jalankan `bun run build` cek tidak ada type error.

- [ ] **Step 9: Commit**

```bash
git add app/\(app\)/reports app/\(app\)/users lib/reports.ts app/\(app\)/dashboard app/\(app\)/layout.tsx tests/reports.test.ts public/uploads/.gitkeep
git commit -m "feat: laporan + dashboard real + user management + polish (task 5)"
```

---

## Self-Review

- Spec §1-15 tercover: Task 1 (foundation + auth 3 role), Task 2 (produk sederhana + pelanggan), Task 3 (katalog pelanggan + pesanan hybrid + state machine + stok tx), Task 4 (pembayaran Transfer/COD + upload), Task 5 (laporan + dashboard real + users + polish).
- Tidak ada placeholder TBD — semua test & implementasi ada code block konkret.
- Type consistency: `OrderStatus`, `PaymentMethod`, `Role` konsisten di semua task; `prisma` singleton reuse; `saveFile` return string path dipakai di `uploadProof`; `calculateTotal` dipakai di katalog preview dan createOrder server.
- Stok decrement transaction hanya di Task 3, tidak duplikat.
- Laporan hanya hitung SELESAI (sesuai spec).
- PELANGGAN scope terisolasi: hanya lihat katalog & pesanan miliknya, tidak akses produk/users/reports.

