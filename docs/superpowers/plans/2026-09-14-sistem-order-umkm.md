# Sistem Order UMKM Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun sistem order UMKM layak pakai multi-role (ADMIN/STAFF) dengan produk, pelanggan, pesanan multi-item, alur Baru→Diproses→Dikirim→Selesai+Batal, stok decrement saat Selesai (tidak boleh minus), pembayaran Transfer+COD + upload bukti, dan laporan omzet per pelanggan harian/mingguan/bulanan.

**Architecture:** Monolith Next.js 16 App Router + Server Actions + Server Components + Prisma SQLite (file dev.db, migrasi siap Postgres) + cookie session httpOnly + storage abstraction lokal. Middleware guard + requireRole di Server Action. Fase bertahap agar tiap task menghasilkan software testable.

**Tech Stack:** Next.js 16.3.4, React 19, Tailwind 4, TypeScript, Prisma 6, SQLite, bcryptjs 2.4.3, zod 3.23, Recharts 2.12, sonner 1.5

**Spec:** `docs/superpowers/specs/2026-09-14-sistem-order-umkm-design.md`

## Global Constraints

- Next.js 16.3.4 — patuh `node_modules/next/dist/docs/` (AGENTS.md), jangan hapus block AGENTS.md.
- Prisma provider `sqlite` dan `DATABASE_URL="file:./dev.db"` untuk dev; siap ganti ke postgresql tanpa refactor.
- Password hash bcryptjs 10 rounds, session cookie httpOnly, SameSite Lax, Secure di production.
- Stok hanya decrement saat transisi →SELESAI dalam transaction, validasi tidak boleh minus.
- TRANSFER wajib proofUrl sebelum LUNAS; COD bisa langsung LUNAS.
- Laporan hanya hitung Order status=SELESAI.
- Bahasa UI Indonesia (Baru/Diproses/Dikirim/Selesai/Batal, Rp).

---

### Task 1: Foundation — Prisma, Auth, Middleware, Layout App

**Files:**
- Create: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Create: `lib/prisma.ts`
- Create: `lib/auth.ts`
- Create: `lib/validations.ts`
- Create: `middleware.ts`
- Create: `app/(auth)/login/page.tsx` (ganti existing `app/login/page.tsx` — pindah route)
- Create: `app/(app)/layout.tsx`
- Modify: `app/dashboard/page.tsx` — hapus localStorage logic, ganti ke Server Component real data (sementara placeholder)
- Modify: `package.json` — tambah deps
- Modify: `.gitignore` — ignore `prisma/dev.db`, `public/uploads/*`
- Test: `tests/foundation.test.ts` (vitest)

**Interfaces:**
- Consumes: Next.js cookies(), PrismaClient
- Produces:
  - `lib/prisma.ts: prisma: PrismaClient` (singleton)
  - `lib/auth.ts: getCurrentUser(): Promise<User|null>, requireUser(): Promise<User>, requireRole(role: Role): Promise<User>, hashPassword(p: string): Promise<string>, verifyPassword(p: string, hash: string): Promise<boolean>, createSession(userId: string): Promise<string>, deleteSession(sessionId: string): Promise<void>`
  - `lib/validations.ts: loginSchema, createUserSchema`
  - `middleware.ts: middleware(req: NextRequest)`

- [ ] **Step 1: Tambah deps dan setup Prisma**

```bash
bun add prisma @prisma/client bcryptjs zod
bun add -d @types/bcryptjs vitest tsx
bunx prisma init --datasource-provider sqlite
```

Edit `prisma/schema.prisma` sesuai Spec §3 (User, Session, Product, Customer, Order, OrderItem, enums). Set `DATABASE_URL="file:./dev.db"` di `.env`.

- [ ] **Step 2: Write failing test untuk auth utils**

```ts
// tests/foundation.test.ts
import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../lib/auth";
import { loginSchema } from "../lib/validations";

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
  (await cookies()).set("session", id, { httpOnly:true, sameSite:"lax", path:"/", maxAge:60*60*24*7 });
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
export async function requireRole(role: "ADMIN"|"STAFF"){ const u=await requireUser(); if(u.role!==role && u.role!=="ADMIN") throw new Error("Forbidden"); return u; }
export async function deleteSession(id:string){ await prisma.session.delete({where:{id}}); (await cookies()).delete("session"); }

// lib/validations.ts
import { z } from "zod";
export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });
export const createUserSchema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(6), role: z.enum(["ADMIN","STAFF"]) });
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
  const isAuth = req.nextUrl.pathname.startsWith("/login");
  const isApp = req.nextUrl.pathname.startsWith("/dashboard") || req.nextUrl.pathname.startsWith("/products") || req.nextUrl.pathname.startsWith("/customers") || req.nextUrl.pathname.startsWith("/orders") || req.nextUrl.pathname.startsWith("/reports") || req.nextUrl.pathname.startsWith("/users");
  if(isApp && !session) return NextResponse.redirect(new URL("/login", req.url));
  if(isAuth && session) return NextResponse.redirect(new URL("/dashboard", req.url));
  return NextResponse.next();
}
export const config = { matcher: ["/dashboard/:path*", "/products/:path*", "/customers/:path*", "/orders/:path*", "/reports/:path*", "/users/:path*", "/login"] };
```

- [ ] **Step 7: Implement prisma/seed.ts + .env + migrate**

```ts
// prisma/seed.ts
import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/auth";
async function main(){
  const hash = await hashPassword("123456");
  await prisma.user.upsert({ where:{email:"admin@gmail.com"}, update:{}, create:{ email:"admin@gmail.com", password: hash, name:"Admin", role:"ADMIN"} });
}
main();
```

Run: `bunx prisma migrate dev --name init && bunx prisma db seed` (set `prisma.seed = "tsx prisma/seed.ts"` di package.json)

- [ ] **Step 8: Implement app/(auth)/login/page.tsx Server Action**

Ganti `app/login/page.tsx` lama (localStorage) → Server Action `login` yang pakai `loginSchema`, `verifyPassword`, `createSession`. Hapus `app/login` lama, buat `(auth)/login`. Redirect ke `/dashboard` on success, tampil error via searchParams.

- [ ] **Step 9: Implement app/(app)/layout.tsx (sidebar) + hapus localStorage di dashboard**

Sidebar link sesuai Spec §7. Dashboard sementara tampil placeholder stats (real data di Task 6). Pastikan `app/dashboard/page.tsx:5` localStorage dihapus, jadi Server Component dengan `requireUser()`.

- [ ] **Step 10: Commit**

```bash
git add prisma/ lib/ middleware.ts app/ package.json .env .gitignore
git commit -m "feat: foundation prisma auth middleware (task 1)"
```

---

### Task 2: Produk CRUD

**Files:**
- Create: `app/(app)/products/page.tsx`
- Create: `app/(app)/products/actions.ts`
- Modify: `lib/validations.ts` — tambah `productSchema`
- Test: `tests/products.test.ts`

**Interfaces:**
- Consumes: `prisma` (Task 1), `requireUser()` (Task 1), `productSchema`
- Produces:
  - `app/(app)/products/actions.ts: createProduct(formData: FormData), updateProduct(id: string, formData: FormData), deleteProduct(id: string)`

- [ ] **Step 1: Write failing test**

```ts
// tests/products.test.ts
import { productSchema } from "../lib/validations";
import { it, expect } from "vitest";
it("productSchema validasi", () => {
  expect(productSchema.safeParse({name:"Kopi", sku:"SKU-1", price:15000, stock:10}).success).toBe(true);
  expect(productSchema.safeParse({name:"", sku:"", price:-1, stock:-1}).success).toBe(false);
});
```

- [ ] **Step 2: Run test — FAIL**

Run: `bunx vitest run tests/products.test.ts -v` → FAIL `productSchema not defined`

- [ ] **Step 3: Implement productSchema + actions**

```ts
// lib/validations.ts tambah
export const productSchema = z.object({ name: z.string().min(2), sku: z.string().min(2), price: z.coerce.number().int().min(0), stock: z.coerce.number().int().min(0), description: z.string().optional() });

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
export async function updateProduct(id: string, formData: FormData){ /* similar */ }
export async function deleteProduct(id: string){
  await requireUser();
  const count = await prisma.orderItem.count({ where:{ productId:id }});
  if(count>0) throw new Error("Produk masih dipakai di pesanan");
  await prisma.product.delete({ where:{id}});
  revalidatePath("/products");
}
```

- [ ] **Step 4: Run test — PASS**

Run: `bunx vitest run tests/products.test.ts -v` → PASS

- [ ] **Step 5: Implement UI page.tsx**

Tabel: `prisma.product.findMany()` + search `?q=` + pagination 10. Modal (client component) untuk create/edit dengan `productSchema` client-side preview + call Server Action. Delete confirm + toast sonner. Proteksi: tombol delete disable jika dipakai.

- [ ] **Step 6: Commit**

```bash
git add app/\(app\)/products lib/validations.ts tests/products.test.ts
git commit -m "feat: produk CRUD (task 2)"
```

---

### Task 3: Pelanggan CRUD

**Files:**
- Create: `app/(app)/customers/page.tsx`
- Create: `app/(app)/customers/actions.ts`
- Modify: `lib/validations.ts` — tambah `customerSchema`
- Test: `tests/customers.test.ts`

**Interfaces:**
- Consumes: `prisma`, `requireUser()`
- Produces:
  - `app/(app)/customers/actions.ts: createCustomer(formData), updateCustomer(id, formData), deleteCustomer(id)`

- [ ] **Step 1: Write failing test**

```ts
// tests/customers.test.ts
import { customerSchema } from "../lib/validations";
import { it, expect } from "vitest";
it("customer valid", () => {
  expect(customerSchema.safeParse({name:"Budi", wa:"0812", address:"Jl"}).success).toBe(true);
  expect(customerSchema.safeParse({name:"", wa:""}).success).toBe(false);
});
```

- [ ] **Step 2: Run test — FAIL**

Run: `bunx vitest run tests/customers.test.ts -v` → FAIL

- [ ] **Step 3: Implement**

```ts
export const customerSchema = z.object({ name: z.string().min(2), wa: z.string().min(8), address: z.string().optional() });
// actions.ts mirip Task 2, delete cek: if(await prisma.order.count({where:{customerId:id}})>0) throw Error("Pelanggan masih ada pesanan")
```

- [ ] **Step 4: Run test — PASS**

Run: `bunx vitest run tests/customers.test.ts -v` → PASS

- [ ] **Step 5: Implement UI**

Tabel pelanggan + search + modal create/edit + delete confirm. Sama pattern Task 2.

- [ ] **Step 6: Commit**

```bash
git add app/\(app\)/customers lib/validations.ts tests/customers.test.ts
git commit -m "feat: pelanggan CRUD (task 3)"
```

---

### Task 4: Pesanan Multi-Item + State Machine + Stok Transaction

**Files:**
- Create: `app/(app)/orders/page.tsx`
- Create: `app/(app)/orders/[id]/page.tsx`
- Create: `app/(app)/orders/actions.ts`
- Create: `lib/order.ts` — state machine + hitung total
- Modify: `lib/validations.ts` — tambah `createOrderSchema`, `updateStatusSchema`
- Test: `tests/orders.test.ts`

**Interfaces:**
- Consumes: `prisma`, `requireUser()`, Product & Customer
- Produces:
  - `lib/order.ts: canTransition(from: OrderStatus, to: OrderStatus): boolean, calculateTotal(items: {price:number, qty:number}[]): number, getNextStatuses(status: OrderStatus): OrderStatus[]`
  - `app/(app)/orders/actions.ts: createOrder(data), updateOrderStatus(id, nextStatus), deleteOrder(id), updatePaymentStatus(id, status)`

- [ ] **Step 1: Write failing test**

```ts
// tests/orders.test.ts
import { canTransition, calculateTotal } from "../lib/order";
import { it, expect } from "vitest";
it("canTransition", () => {
  expect(canTransition("BARU","DIPROSES")).toBe(true);
  expect(canTransition("BARU","DIKIRIM")).toBe(false);
  expect(canTransition("DIPROSES","DIKIRIM")).toBe(true);
  expect(canTransition("DIKIRIM","SELESAI")).toBe(true);
  expect(canTransition("SELESAI","BATAL")).toBe(false);
});
it("calculateTotal", () => {
  expect(calculateTotal([{price:10000,qty:2},{price:5000,qty:3}])).toBe(35000);
});
```

- [ ] **Step 2: Run test — FAIL**

Run: `bunx vitest run tests/orders.test.ts -v` → FAIL

- [ ] **Step 3: Implement lib/order.ts + validations**

```ts
// lib/order.ts
export type OrderStatus = "BARU"|"DIPROSES"|"DIKIRIM"|"SELESAI"|"BATAL";
const transitions: Record<OrderStatus, OrderStatus[]> = { BARU:["DIPROSES","BATAL"], DIPROSES:["DIKIRIM","BATAL"], DIKIRIM:["SELESAI"], SELESAI:[], BATAL:[] };
export function canTransition(from: OrderStatus, to: OrderStatus){ return transitions[from].includes(to); }
export function getNextStatuses(s: OrderStatus){ return transitions[s]; }
export function calculateTotal(items: {price:number, qty:number}[]){ return items.reduce((a,b)=>a+b.price*b.qty,0); }

// lib/validations.ts
export const createOrderSchema = z.object({ customerId: z.string().cuid(), paymentMethod: z.enum(["TRANSFER","COD"]), items: z.array(z.object({ productId: z.string(), qty: z.coerce.number().int().min(1) })).min(1) });
export const updateStatusSchema = z.object({ status: z.enum(["BARU","DIPROSES","DIKIRIM","SELESAI","BATAL"]) });
```

- [ ] **Step 4: Run test — PASS**

Run: `bunx vitest run tests/orders.test.ts -v` → PASS

- [ ] **Step 5: Implement actions.ts (stok transaction)**

```ts
"use server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { canTransition, calculateTotal } from "@/lib/order";
import { revalidatePath } from "next/cache";
export async function createOrder(formData: FormData){
  await requireUser();
  // parse items JSON, validasi, hitung total server dari Product.price
  // tx: order.create + orderItem.createMany
}
export async function updateOrderStatus(id: string, next: OrderStatus){
  await requireUser();
  const order = await prisma.order.findUnique({ include:{items:true}, where:{id}});
  if(!canTransition(order.status as OrderStatus, next)) throw new Error("Transisi tidak valid");
  if(next==="SELESAI"){
    await prisma.$transaction(async (tx)=>{
      for(const item of order.items){
        const p = await tx.product.findUnique({where:{id:item.productId}});
        if(p.stock < item.qty) throw new Error(`Stok ${p.name} tidak cukup`);
        await tx.product.update({ where:{id:p.id}, data:{ stock:{ decrement: item.qty }}});
      }
      await tx.order.update({ where:{id}, data:{ status: next }});
    });
  } else {
    await prisma.order.update({ where:{id}, data:{ status: next }});
  }
  revalidatePath("/orders");
}
```

- [ ] **Step 6: Implement UI**

- `orders/page.tsx`: Server Component list `prisma.order.findMany({include:{customer, items}})` + filter status + search customer. Link ke detail.
- `orders/[id]/page.tsx`: detail order (customer, items, total, status badge, payment), tombol transisi kondisional (`getNextStatuses`), delete (hanya jika BARU/BATAL), confirm dialog.
- Create modal: pilih customer (dropdown), tambah baris product+qty (dynamic), preview total via `calculateTotal`, submit ke `createOrder`.

- [ ] **Step 7: Commit**

```bash
git add lib/order.ts app/\(app\)/orders tests/orders.test.ts lib/validations.ts
git commit -m "feat: pesanan multi-item + state machine + stok tx (task 4)"
```

---

### Task 5: Pembayaran + Upload Bukti

**Files:**
- Create: `lib/storage.ts`
- Create: `app/(app)/orders/[id]/upload-actions.ts` (atau gabung actions.ts)
- Modify: `app/(app)/orders/actions.ts` — tambah `uploadProof` dan `updatePaymentStatus`
- Modify: `app/(app)/orders/[id]/page.tsx` — tambah UI upload & badge bayar
- Test: `tests/storage.test.ts`

**Interfaces:**
- Consumes: `prisma`, `requireUser()`
- Produces:
  - `lib/storage.ts: saveFile(file: File): Promise<string>, getUrl(path: string): string`
  - `uploadProof(orderId: string, formData: FormData): Promise<string>`
  - `updatePaymentStatus(orderId: string, status: PaymentStatus)`

- [ ] **Step 1: Write failing test**

```ts
// tests/storage.test.ts
import { getUrl } from "../lib/storage";
import { it, expect } from "vitest";
it("getUrl", () => {
  expect(getUrl("/uploads/abc.jpg")).toBe("/uploads/abc.jpg");
});
```

- [ ] **Step 2: Run test — FAIL**

Run: `bunx vitest run tests/storage.test.ts -v` → FAIL

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
export async function uploadProof(orderId: string, formData: FormData){
  await requireUser();
  const file = formData.get("proof") as File;
  validateFile(file);
  const url = await saveFile(file);
  await prisma.order.update({ where:{id:orderId}, data:{ proofUrl: url }});
  revalidatePath(`/orders/${orderId}`);
  return url;
}
export async function updatePaymentStatus(orderId: string, status: "BELUM_BAYAR"|"LUNAS"){
  await requireUser();
  const order = await prisma.order.findUnique({where:{id:orderId}});
  if(order.paymentMethod==="TRANSFER" && status==="LUNAS" && !order.proofUrl) throw new Error("Upload bukti transfer dulu");
  await prisma.order.update({ where:{id:orderId}, data:{ paymentStatus: status }});
  revalidatePath(`/orders/${orderId}`);
}
```

- [ ] **Step 6: Implement UI**

Di `orders/[id]/page.tsx`: tampil proof image/pdf link, input file + button Upload (hanya jika TRANSFER), button Tandai Lunas (validasi proof). Badge paymentStatus.

- [ ] **Step 7: Commit**

```bash
git add lib/storage.ts app/\(app\)/orders tests/storage.test.ts
git commit -m "feat: pembayaran + upload bukti (task 5)"
```

---

### Task 6: Laporan + Dashboard Real Data + User Management + Polish

**Files:**
- Create: `app/(app)/reports/page.tsx`
- Create: `app/(app)/reports/actions.ts` (agregasi)
- Create: `app/(app)/users/page.tsx`
- Create: `app/(app)/users/actions.ts`
- Create: `lib/reports.ts`
- Modify: `app/(app)/dashboard/page.tsx` — ganti mock ke real query
- Modify: `app/layout.tsx` metadata
- Test: `tests/reports.test.ts`

**Interfaces:**
- Consumes: `prisma`, `requireUser()`, `requireRole('ADMIN')`
- Produces:
  - `lib/reports.ts: getReport(range: 'harian'|'mingguan'|'bulanan', from: Date, to: Date): Promise<{totalOmzet:number, totalOrders:number, perCustomer: {customerId, name, total, count}[], perPeriod: {label:string, total:number}[]}>`
  - `app/(app)/users/actions.ts: createUser, updateUser, deleteUser (ADMIN only)`

- [ ] **Step 1: Write failing test**

```ts
// tests/reports.test.ts
import { groupByPeriod } from "../lib/reports";
import { it, expect } from "vitest";
it("groupByPeriod harian", () => {
  const data = [{total:10000, createdAt:new Date("2026-09-10")},{total:20000, createdAt:new Date("2026-09-10")},{total:5000, createdAt:new Date("2026-09-11")}];
  const res = groupByPeriod(data, "harian");
  expect(res.find(r=>r.label==="2026-09-10")?.total).toBe(30000);
});
```

- [ ] **Step 2: Run test — FAIL**

Run: `bunx vitest run tests/reports.test.ts -v` → FAIL

- [ ] **Step 3: Implement lib/reports.ts**

```ts
export function groupByPeriod(orders: {total:number, createdAt:Date}[], range: string){
  // harian: YYYY-MM-DD, mingguan: YYYY-Www (ISO week), bulanan: YYYY-MM
  // return array sorted
}
export async function getReport(range: "harian"|"mingguan"|"bulanan", from: Date, to: Date){
  const orders = await prisma.order.findMany({ where:{ status:"SELESAI", createdAt:{ gte:from, lte:to }}, include:{customer:true}});
  const totalOmzet = orders.reduce((a,b)=>a+b.total,0);
  const perCustomerMap = new Map();
  // aggregate, return perPeriod via groupByPeriod
}
```

- [ ] **Step 4: Run test — PASS**

Run: `bunx vitest run tests/reports.test.ts -v` → PASS

- [ ] **Step 5: Implement reports/page.tsx**

Filter: select range + date from/to (default bulan ini). Tampilkan kartu Total Omzet, Total Pesanan, Rata-rata. Recharts BarChart `perPeriod`. Tabel per pelanggan (nama, WA, jumlah pesanan, total omzet). Tombol Export CSV (client generate dari data).

- [ ] **Step 6: Implement users/page.tsx (ADMIN only)**

`requireRole('ADMIN')` di page. Tabel user + modal create/edit (name, email, password, role) + delete. Error jika hapus diri sendiri.

- [ ] **Step 7: Implement dashboard real data**

Ganti mock `app/dashboard/page.tsx:11` → `prisma.order.groupBy` + `count` untuk kartu (Total, Baru, Diproses, Dikirim, Selesai) + `findMany` order terbaru 5 dengan `include customer`.

- [ ] **Step 8: Polish**

- Tambah `sonner` Toaster di `app/(app)/layout.tsx`.
- Tambah `next.config.ts` image config jika perlu.
- Update `.gitignore` untuk `public/uploads/*` kecuali `.gitkeep`.

- [ ] **Step 9: Commit**

```bash
git add app/\(app\)/reports app/\(app\)/users lib/reports.ts app/\(app\)/dashboard tests/reports.test.ts
git commit -m "feat: laporan + dashboard real + user management (task 6)"
```

---

## Self-Review

- Spec §1-13 tercover: Task 1 (foundation), Task 2-3 (produk/pelanggan), Task 4 (pesanan+stok), Task 5 (pembayaran+upload), Task 6 (laporan+dashboard+user).
- Tidak ada placeholder TBD — semua test & implementasi ada code block konkret.
- Type consistency: `OrderStatus`, `PaymentMethod`, `Role` konsisten di semua task; `prisma` singleton reuse; `saveFile` return string path dipakai di `uploadProof`.
- Stok decrement transaction hanya di Task 4, tidak duplikat.
- Laporan hanya hitung SELESAI (sesuai spec).

