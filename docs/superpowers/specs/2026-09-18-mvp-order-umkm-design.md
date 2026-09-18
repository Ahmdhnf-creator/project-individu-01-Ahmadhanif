# MVP Order Management UMKM — Design Spec

**Tanggal:** 2026-09-18
**Status:** Draft — menunggu approval
**Stack:** Next.js 16.3.4 (App Router), React 19, Tailwind 4, TypeScript, bun, Prisma + SQLite (dev) → Postgres (prod), bcryptjs, zod, Recharts, sonner
**Repo:** project-bulan-01

## 1. Ringkasan & Tujuan

Mengubah prototype mock (`localStorage.isLoggedIn` di `app/login/page.tsx:39`, data hardcoded `app/dashboard/page.tsx:11`) menjadi MVP siap pakai untuk UMKM: pemilik (ADMIN), staff/kasir (STAFF), dan pelanggan (PELANGGAN) dapat mengelola pesanan dari masuk sampai selesai. Kriteria MVP siap pakai: auth aman (cookie httpOnly), produk sederhana, pesanan hybrid (pelanggan order via katalog + admin/staff input manual), status jelas, stok tidak minus, pembayaran Transfer+COD dengan upload bukti, dashboard & laporan omzet.

Scope dibatasi YAGNI — tanpa varian produk, promo, notifikasi WA/email, lupa password di MVP.

## 2. Pengguna & Role

| Role | Cara dibuat | Akses |
|------|-------------|-------|
| ADMIN (pemilik) | Seed awal `admin@gmail.com / 123456` (hash bcrypt), selanjutnya ADMIN bisa buat user lain | Semua: kelola User, Produk, Pelanggan, Pesanan, Laporan, Dashboard |
| STAFF (kasir) | Dibuat ADMIN via `/users` | Produk (CRU, tidak hapus jika ada OrderItem), Pelanggan CRUD, Pesanan CRU + transisi (tidak hapus jika SELESAI), Laporan read |
| PELANGGAN | Registrasi publik via `/register` (role otomatis PELANGGAN) | Katalog, keranjang, buat pesanan untuk dirinya sendiri, lihat pesanan miliknya, upload bukti miliknya |

Registrasi publik hanya menghasilkan PELANGGAN. Pembuatan STAFF/ADMIN hanya via `/users` oleh ADMIN. Tidak ada lupa-password di MVP.

## 3. Arsitektur

### 3.1 Struktur App Router
```
app/
  layout.tsx
  page.tsx                    // landing
  (auth)/
    login/page.tsx            // Server Action login
    register/page.tsx         // registrasi pelanggan
  (app)/
    layout.tsx                // sidebar + guard + Toaster
    dashboard/page.tsx        // ringkasan + pesanan terbaru
    catalog/page.tsx          // katalog untuk pelanggan (list produk + keranjang)
    products/page.tsx         // CRUD produk (ADMIN/STAFF)
    customers/page.tsx        // CRUD pelanggan (ADMIN/STAFF)
    orders/page.tsx           // list + filter (scope by role)
    orders/[id]/page.tsx      // detail + transisi + pembayaran + upload
    reports/page.tsx          // laporan + chart (ADMIN/STAFF)
    users/page.tsx            // CRUD user (ADMIN only)
lib/
  prisma.ts                   // PrismaClient singleton
  auth.ts                     // session, hash, requireUser/requireRole/getCurrentUser
  storage.ts                  // saveFile/getUrl abstraction
  validations.ts              // zod schemas share client/server
  order.ts                    // state machine + calculateTotal
  reports.ts                  // groupByPeriod + getReport
prisma/
  schema.prisma
  seed.ts
middleware.ts                 // guard cookie session
public/uploads/               // storage lokal (gitignore)
```

### 3.2 Pola Data
- Server Components untuk read (list/detail/laporan/katalog).
- Server Actions untuk mutasi (create/update/delete, transisi status, login/logout/register, upload).
- Validasi `zod` di Server Action (source of truth) + reuse di client untuk UX.
- `revalidatePath` setelah mutasi.

### 3.3 Middleware Guard
- Cek cookie `session` → redirect `/login` jika tidak ada/expired.
- Blok `/users` jika `role !== ADMIN`, blok `/products`, `/customers`, `/reports` jika `role === PELANGGAN` (pelanggan hanya boleh `/catalog`, `/orders` miliknya, `/dashboard` sederhana).
- Helper `requireUser()`, `requireRole('ADMIN')` di tiap Server Action/Page sebagai defense-in-depth.

### 3.4 Storage Abstraction
```ts
// lib/storage.ts
export async function saveFile(file: File): Promise<string> // return /uploads/<uuid>-<name>
export function getUrl(path: string): string
export function validateFile(file: File): void // tipe jpg/png/pdf, max 5MB
```
Awal: `fs.writeFile` ke `public/uploads`. Siap ganti ke Cloudinary/S3 tanpa ubah caller.

## 4. Data Model (Prisma)

**Provider:** `sqlite` (file `prisma/dev.db`), siap ganti `postgresql` dengan ubah `provider` + `DATABASE_URL`.

```prisma
datasource db { provider = "sqlite"; url = env("DATABASE_URL") }
generator client { provider = "prisma-client-js" }

enum Role { ADMIN STAFF PELANGGAN }
enum OrderStatus { BARU DIPROSES DIKIRIM SELESAI BATAL }
enum PaymentMethod { TRANSFER COD }
enum PaymentStatus { BELUM_BAYAR LUNAS }

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // bcrypt hash
  name      String
  role      Role     @default(PELANGGAN)
  wa        String?
  address   String?
  sessions  Session[]
  orders    Order[]  // untuk PELANGGAN: pesanan miliknya (via userId)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())
}

model Product {
  id          String      @id @default(cuid())
  name        String
  price       Int         // rupiah integer
  stock       Int         @default(0)
  orderItems  OrderItem[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

model Customer {
  id        String   @id @default(cuid())
  name      String
  wa        String
  address   String?
  orders    Order[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Order {
  id            String        @id @default(cuid())
  customerId    String?       // nullable: jika pelanggan order, link ke User; jika admin input, link ke Customer
  customer      Customer?     @relation(fields: [customerId], references: [id])
  userId        String?       // untuk pesanan oleh PELANGGAN login
  user          User?         @relation(fields: [userId], references: [id])
  status        OrderStatus   @default(BARU)
  paymentMethod PaymentMethod
  paymentStatus PaymentStatus @default(BELUM_BAYAR)
  proofUrl      String?       // /uploads/...
  total         Int           @default(0)
  items         OrderItem[]
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId String
  product   Product @relation(fields: [productId], references: [id])
  qty       Int
  price     Int     // snapshot harga saat order
  subtotal  Int     // qty * price
  @@unique([orderId, productId])
}
```

**Alternatif sederhana:** MVP boleh tanpa model `Customer` terpisah — gunakan `User` (role PELANGGAN) + field `wa/address` di User. Jika butuh pelanggan manual (tanpa akun), tetap pakai `Customer`. Spec ini mendukung keduanya: `Order` bisa link ke `Customer` (admin input) atau `User` (pelanggan login). Minimal implementasi: prioritaskan `User` + `Customer` opsional.

**Aturan bisnis DB:**
- `total` dihitung server = sum `OrderItem.subtotal`, tidak dipercaya dari client.
- `OrderItem.price` snapshot dari `Product.price` saat create.
- Stok hanya berubah pada transisi `→ SELESAI` (lihat §5.3).
- `proofUrl` wajib jika `paymentMethod=TRANSFER` dan ingin `paymentStatus=LUNAS`.

## 5. Alur Pesanan, Status & Stok

### 5.1 User Flow Utama
- **Pelanggan:** Register/Login → `/catalog` lihat produk → tambah keranjang → checkout pilih Transfer/COD → create Order (BARU, BELUM_BAYAR) → jika Transfer upload bukti → lihat pesanan di `/orders` (filter miliknya) → tracking status.
- **Staff/Admin:** Login → Dashboard → Kelola Produk/Pelanggan → Buat Order untuk pelanggan (pilih customer dari dropdown atau create inline) → tambah item (pilih produk + qty, validasi stok preview, preview total) → pilih paymentMethod → submit → di detail `/orders/[id]` lakukan transisi status & verifikasi pembayaran.

### 5.2 Create Order
1. Pilih customer (dropdown + create inline modal) — untuk pelanggan login, otomatis dirinya.
2. Tambah item: pilih Product → qty → validasi stok (read-only check tampil sisa) → hitung subtotal/total preview via `calculateTotal`.
3. Pilih paymentMethod TRANSFER/COD.
4. Submit → Server Action `createOrder()` → validasi zod → hitung total server dari `Product.price` → `prisma.$transaction(order.create + orderItem.createMany)` → status BARU, paymentStatus BELUM_BAYAR.

### 5.3 Transisi Status
- State machine: `BARU → DIPROSES → DIKIRIM → SELESAI`; `BARU|DIPROSES → BATAL`. Tidak ada lompatan (BARU→DIKIRIM ditolak).
- Helper `lib/order.ts`: `canTransition(from,to)`, `getNextStatuses(status)`.
- Server Action `updateOrderStatus(orderId, nextStatus)` → validasi transisi → jika `nextStatus===SELESAI` jalankan transaction stok, else update biasa.
- UI: tombol aksi kondisional di `orders/[id]` dengan confirm dialog; badge warna: BARU abu, DIPROSES biru, DIKIRIM kuning, SELESAI hijau, BATAL merah.
- Scope: PELANGGAN tidak boleh transisi status (read only), STAFF/ADMIN boleh.

### 5.4 Stok
Hanya saat `→ SELESAI` dalam transaction:
```ts
for (item of order.items) {
  const product = await tx.product.findUnique({where:{id:item.productId}})
  if (product.stock < item.qty) throw new Error(`Stok ${product.name} tidak cukup`)
  await tx.product.update({ where:{id: product.id}, data:{stock:{decrement: item.qty}}})
}
await tx.order.update({ where:{id: orderId}, data:{status:'SELESAI'}})
```
Tidak boleh minus. `BATAL` tidak mengembalikan stok (karena belum berkurang). Tolak `SELESAI` jika stok tidak cukup — rollback penuh.

### 5.5 Pembayaran & Upload
- TRANSFER: wajib upload `proofUrl` (jpg/png/pdf max 5MB) sebelum `paymentStatus=LUNAS`. Validasi di `updatePaymentStatus`.
- COD: bisa langsung LUNAS tanpa bukti.
- Upload via Server Action `uploadProof(orderId, formData)` → `validateFile()` → `saveFile()` → simpan path.

## 6. Auth

- Login: form email+password → Server Action `login()` → `bcrypt.compare` → `prisma.session.create` (expires 7 hari) → `cookies().set('session', id, {httpOnly, secure prod, sameSite:'lax'})` → redirect `/dashboard`.
- Register: form name+email+password+wa → `register()` → hash → create User role PELANGGAN → auto login (create session) → redirect `/catalog`.
- Logout: `prisma.session.delete` + `cookies().delete('session')`.
- Hapus `localStorage.isLoggedIn` legacy.
- Seed: `prisma/seed.ts` buat `admin@gmail.com / 123456` role ADMIN (hash bcrypt) agar kompatibel kredensial lama.

## 7. Laporan & Dashboard

### 7.1 Dashboard
Kartu: Total Order, Baru, Diproses, Dikirim, Selesai (query `groupBy status` real), tabel 5 pesanan terbaru (role-aware: pelanggan hanya miliknya). Data real ganti mock `app/dashboard/page.tsx:11`.

### 7.2 Laporan (ADMIN/STAFF only)
- Filter: `?range=harian|mingguan|bulanan&from=YYYY-MM-DD&to=YYYY-MM-DD` default bulan ini.
- Base: `Order where status=SELESAI` (hanya selesai hitung omzet).
- Agregasi: count pesanan, sum(total) per rentang (harian group by date, mingguan by ISO week, bulanan by month), group per pelanggan/user.
- UI: Kartu Total Omzet, Total Pesanan Selesai, Rata-rata per hari, Recharts BarChart per period, tabel per pelanggan (Nama | WA | Jumlah Pesanan | Total Omzet), tombol Export CSV.

## 8. UI/UX

- Layout: sidebar (Dashboard, Katalog, Produk, Pelanggan, Pesanan, Laporan, Users) — menu disesuaikan role (pelanggan tidak lihat Produk/Users/Laporan), header user info + logout.
- Styling Tailwind 4 minimal konsisten (border, rounded, spacing), tambah chart.
- Tabel: search `?q=`, filter status, pagination 10.
- Form: modal create/edit, validasi zod per field, toast success/error via `sonner` (Toaster di `(app)/layout.tsx`).
- Keranjang pelanggan: state client (useState) + preview total.

## 9. Validasi

- `lib/validations.ts`: `loginSchema`, `registerSchema`, `productSchema` (name min2, price int min0, stock int min0), `customerSchema` (name min2, wa min8), `createOrderSchema` (customerId/userId, paymentMethod, items min1 qty min1), `updateStatusSchema`.
- Validasi server-side selalu (jangan percaya client).

## 10. Error Handling & Edge Cases

- Stok tidak cukup saat SELESAI → toast error, rollback, status tetap.
- Upload >5MB / tipe salah → error validasi.
- Transisi ilegal → 400.
- Session expired → middleware redirect login.
- Produk/pelanggan masih dipakai Order → tolak hapus (restrict).
- Pelanggan coba akses order orang lain → 403.
- Pelanggan coba akses `/users` atau `/reports` → redirect/403.

## 11. Testing

- Unit (vitest): `lib/validations.test.ts`, `lib/order.test.ts` (canTransition, calculateTotal), `lib/reports.test.ts` (groupByPeriod), `lib/storage.test.ts` (getUrl).
- Integration opsional: Prisma transaction stok dengan DB test SQLite.
- Manual checklist: register pelanggan → login admin → buat staff → buat produk → pelanggan order via katalog → admin buat order manual → transisi sampai Selesai → cek stok → upload bukti → laporan → export CSV.

## 12. Keamanan

- Password hash bcryptjs 10 rounds.
- Session httpOnly, secure di production, sameSite lax.
- Server Actions sudah proteksi CSRF.
- Validasi server-side selalu.

## 13. Deployment & Migrasi

- Dev: `DATABASE_URL="file:./dev.db"` SQLite.
- Prod: ganti `DATABASE_URL` ke Postgres (Neon/Supabase) + `provider="postgresql"` → `prisma migrate deploy`.
- Storage: ganti `lib/storage.ts` ke S3/Cloudinary tanpa ubah caller.
- Vercel deploy, `public/uploads/*` gitignore kecuali `.gitkeep`.

## 14. Fase Implementasi (ringkas)

Fase 1 Foundation: Prisma + Auth + Middleware + Layout + Login/Register baru + hapus localStorage.
Fase 2 Produk & Pelanggan: CRUD sederhana + validasi.
Fase 3 Katalog & Pesanan: katalog pelanggan + keranjang + create multi-item + detail + state machine + stok transaction.
Fase 4 Pembayaran & Upload: proof upload + payment status.
Fase 5 Laporan & Dashboard Real + User Management + Polish.

## 15. Self-Review

- [x] Tidak ada placeholder TBD/TODO.
- [x] Konsistensi role/status/stok/pembayaran selaras.
- [x] Scope MVP fokus, fitur non-MVP eksplisit di luar.
- [x] Hybrid order (pelanggan + admin input) tercakup di data model & flow.
- [x] Produk sederhana sesuai permintaan (tanpa SKU).
