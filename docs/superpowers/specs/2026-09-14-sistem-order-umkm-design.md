# Sistem Order UMKM — Design Spec

**Tanggal:** 2026-09-14
**Status:** Approved
**Stack:** Next.js 16.3.4 (App Router), React 19, Tailwind 4, TypeScript, bun, Prisma + SQLite (dev) → Postgres (prod), bcryptjs, zod, Recharts, sonner
**Repo:** `project-bulan-01` — Order Management UMKM

## 1. Ringkasan & Tujuan

Mengubah prototype mock (`localStorage.isLoggedIn`, data hardcoded di `app/dashboard/page.tsx:11`, `app/login/page.tsx:39`) menjadi **sistem order layak pakai** untuk UMKM kecil dengan role **ADMIN + STAFF/KASIR**, alur pesanan lengkap, stok, pembayaran Transfer+COD, upload bukti, dan laporan omzet per pelanggan (harian/mingguan/bulanan).

**Kriteria layak pakai:** multi-user aman (session cookie httpOnly, bukan localStorage), CRUD produk/pelanggan/pesanan multi-item, stok tidak boleh minus (decrement saat SELESAI), pembayaran terverifikasi, laporan akurat, UI usable, dan migrasi mudah ke Postgres free-tier.

## 2. Arsitektur

### 2.1 Struktur App Router
```
app/
  layout.tsx
  page.tsx                    // landing UMKM
  (auth)/login/page.tsx       // Server Action login
  (app)/
    layout.tsx                // sidebar + guard
    dashboard/page.tsx        // ringkasan + pesanan terbaru
    products/page.tsx         // CRUD produk
    customers/page.tsx        // CRUD pelanggan
    orders/page.tsx           // list + filter
    orders/[id]/page.tsx      // detail + transisi status
    reports/page.tsx          // laporan + chart
    users/page.tsx            // CRUD user (ADMIN only)
  api/uploads/route.ts        // fallback jika butuh direct upload (opsional)
lib/
  prisma.ts                   // PrismaClient singleton
  auth.ts                     // session, hash, requireRole
  storage.ts                  // abstraction saveFile/getUrl
  validations.ts              // zod schemas share client/server
  utils.ts
prisma/
  schema.prisma
  seed.ts
middleware.ts                 // guard cookie session
public/uploads/               // storage lokal (gitignore)
```

### 2.2 Pola Data
- **Server Components** untuk read (list/detail/laporan).
- **Server Actions** untuk mutasi (create/update/delete, transisi status, login/logout, upload).
- Validasi `zod` di Server Action (source of truth) + reuse di client untuk UX.
- `revalidatePath` setelah mutasi.

### 2.3 Middleware Guard
- `middleware.ts` cek cookie `session` → redirect `/login` jika tidak ada/expired.
- Blok `/users` jika `role !== ADMIN`.
- Helper `requireUser()` dan `requireRole('ADMIN')` di tiap Server Action/Page sebagai defense-in-depth.

### 2.4 Storage Abstraction
```ts
// lib/storage.ts
export async function saveFile(file: File): Promise<string> // return /uploads/<uuid>-<name>
export function getUrl(path: string): string
```
Implementasi awal: `fs.writeFile` ke `public/uploads`. Siap ganti ke Cloudinary/S3 tanpa ubah caller.

## 3. Data Model (Prisma)

**Provider:** `sqlite` (file `prisma/dev.db`), siap ganti `postgresql` dengan ubah `provider` + `DATABASE_URL`.

```prisma
datasource db { provider = "sqlite"; url = env("DATABASE_URL") }
generator client { provider = "prisma-client-js" }

enum Role { ADMIN STAFF }
enum OrderStatus { BARU DIPROSES DIKIRIM SELESAI BATAL }
enum PaymentMethod { TRANSFER COD }
enum PaymentStatus { BELUM_BAYAR LUNAS }

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // bcrypt hash
  name      String
  role      Role     @default(STAFF)
  sessions  Session[]
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
  sku         String      @unique
  price       Int         // rupiah, integer
  stock       Int         @default(0)
  description String?
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
  customerId    String
  customer      Customer      @relation(fields: [customerId], references: [id])
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

**Aturan bisnis DB:**
- `total` dihitung server = sum `OrderItem.subtotal`, tidak dipercaya dari client.
- `OrderItem.price` snapshot dari `Product.price` saat create.
- Stok hanya berubah pada transisi `→ SELESAI` (lihat §5).
- `proofUrl` wajib jika `paymentMethod=TRANSFER` dan ingin `paymentStatus=LUNAS` (validasi Server Action).

## 4. Auth & Role

### 4.1 Login/Logout
- `app/(auth)/login/page.tsx` form email+password → Server Action `login()` → `bcrypt.compare` → `prisma.session.create` (expires 7 hari) → `cookies().set('session', session.id, {httpOnly, secure, sameSite:'lax'})` → redirect `/dashboard`.
- Logout → `prisma.session.delete` + `cookies().delete('session')`.
- Hapus semua `localStorage.isLoggedIn` legacy di `app/dashboard/page.tsx:5`.

### 4.2 Registrasi
- **Hanya ADMIN** bisa buat user via `/users` (form: name, email, password, role). Tidak ada registrasi publik.
- Seed: `prisma/seed.ts` buat `admin@gmail.com / 123456` (hash bcrypt) role ADMIN agar kompatibel dengan kredensial lama.

### 4.3 Otorisasi
- `lib/auth.ts`: `getCurrentUser()`, `requireUser()`, `requireRole(Role)`.
- Matrix:
  | Resource | ADMIN | STAFF |
  |---|---|---|
  | Kelola User | CRUD | No |
  | Produk | CRUD | CRU (tidak boleh hapus jika ada order aktif terkait?) |
  | Pelanggan | CRUD | CRUD |
  | Pesanan | CRUD + transisi | CRU + transisi (tidak boleh hapus pesanan SELESAI?) |
  | Laporan | Read | Read |
  | Dashboard | Read | Read |

## 5. Alur Pesanan & Stok

### 5.1 Create Order
1. Pilih Customer (dropdown + create inline modal).
2. Tambah item: pilih Product → input qty → validasi stok (read-only check, tampil sisa stok) → hitung subtotal client (preview) + total.
3. Pilih `paymentMethod` TRANSFER/COD.
4. Submit → Server Action `createOrder()` → validasi zod → hitung total server → `prisma.$transaction(async (tx) => tx.order.create + tx.orderItem.createMany)` → `status=BARU`, `paymentStatus=BELUM_BAYAR`.

### 5.2 Transisi Status
- State machine: `BARU → DIPROSES → DIKIRIM → SELESAI`; `BARU|DIPROSES → BATAL`. Tidak ada lompatan (mis. BARU→DIKIRIM ditolak).
- Endpoint: `updateOrderStatus(orderId, nextStatus)` → validasi transisi → jika `nextStatus===SELESAI` jalankan transaction stok (lihat 5.3), else update biasa.
- UI: tombol aksi kondisional di `orders/[id]` dengan confirm dialog; badge warna: BARU (abu), DIPROSES (biru), DIKIRIM (kuning), SELESAI (hijau), BATAL (merah).

### 5.3 Stok
- **Kapan berkurang:** hanya saat transisi `→ SELESAI`, dalam `prisma.$transaction`:
  ```ts
  for (item of order.items) {
    const product = await tx.product.findUnique(...)
    if (product.stock < item.qty) throw new Error(`Stok ${product.name} tidak cukup`)
    await tx.product.update({ where:{id}, data:{stock:{decrement: item.qty}}})
  }
  await tx.order.update({ where:{id: orderId}, data:{status:'SELESAI'}})
  ```
- Tidak boleh minus: validasi + DB tidak ada constraint negatif, jadi guard di aplikasi + cek `stock < qty`.
- `BATAL` tidak mengembalikan stok (karena stok belum berkurang). Jika diperlukan, bisa tambah logika return stok jika batal setelah SELESAI — ditolak di MVP.

### 5.4 Pembayaran & Upload
- `paymentMethod=TRANSFER`: wajib upload `proofUrl` (png/jpg/pdf, max 5MB) sebelum bisa `paymentStatus=LUNAS`. Validasi di `updatePaymentStatus`.
- `paymentMethod=COD`: bisa langsung `LUNAS` tanpa bukti.
- Upload: input file → Server Action `uploadProof(formData)` → `saveFile()` → simpan path ke `Order.proofUrl`.

## 6. Laporan

### 6.1 Filter
- Query params: `?range=harian|mingguan|bulanan&from=YYYY-MM-DD&to=YYYY-MM-DD`
- Default: bulan ini.

### 6.2 Agregasi
- Base: `Order where status=SELESAI` (hanya pesanan selesai yang hitung omzet).
- Rangkuman: `count` pesanan, `sum(total)` omzet per rentang (harian: group by date, mingguan: group by week, bulanan: group by month).
- Per pelanggan: `groupBy customerId` → `sum(total)`, `count`, tampil TOP pelanggan.
- Prisma: `groupBy` + `aggregate`; untuk harian/mingguan/bulanan gunakan `where createdAt between` + grouping di JS (atau raw query jika Postgres nanti).

### 6.3 UI
- Kartu ringkasan: Total Omzet, Total Pesanan Selesai, Rata-rata per hari.
- Chart: Recharts `BarChart` omzet per hari/minggu/bulan.
- Tabel per pelanggan: Nama | WA | Jumlah Pesanan | Total Omzet.
- Export CSV: tombol `Export` → generate CSV dari data agregasi.

## 7. UI/UX

- **Layout (app):** sidebar navigasi: Dashboard, Produk, Pelanggan, Pesanan, Laporan, User (Admin only) + header user info + logout.
- **Dashboard:** kartu statistik (Total Order, Baru, Diproses, Dikirim, Selesai — update dari DB), tabel pesanan terbaru (5 terbaru).
- **Produk/Pelanggan/Pesanan:** tabel dengan search, filter status, pagination sederhana (10 per page), modal form (create/edit), delete confirm.
- **Validasi UX:** zod + tampil error per field, toast success/error via `sonner`.
- **Styling:** Tailwind 4, tetap minimal seperti sekarang tapi konsisten (border, rounded, spacing), tambah chart.

## 8. Error Handling & Edge Cases

- Stok tidak cukup saat SELESAI → toast error, transaksi rollback, status tidak berubah.
- Upload proof melebihi 5MB / tipe salah → error validasi.
- Transisi status ilegal → error 400.
- Session expired → middleware redirect login.
- Pelanggan/produk dihapus yang masih ada order terkait → tolak (restrict) atau soft handling: produk tidak boleh dihapus jika ada OrderItem, pelanggan tidak boleh dihapus jika ada Order.

## 9. Testing

- **Unit:** `lib/validations.test.ts`, `lib/utils.test.ts` (hitung total, transisi state machine, stok check).
- **Integration (opsional):** Prisma transaction stok (dengan DB test SQLite).
- **Manual:** checklist flow: login ADMIN→buat STAFF→login STAFF→buat produk→buat pelanggan→buat order→transisi sampai SELESAI→cek stok→laporan→upload bukti.

## 10. Keamanan

- Password hash `bcryptjs` (10 rounds).
- Session httpOnly, secure di production, sameSite lax.
- CSRF: Server Actions Next.js sudah proteksi, tidak perlu token manual.
- Validasi server-side selalu (jangan percaya client).

## 11. Fase Implementasi

**Fase 1 — Foundation:** Prisma setup + schema + seed + lib/prisma + lib/auth + middleware + login baru + layout app + hapus localStorage legacy.
**Fase 2 — Produk & Pelanggan:** CRUD produk & pelanggan (Server Actions + tabel + modal + validasi).
**Fase 3 — Pesanan Multi-Item:** Create order multi-item + detail + transisi status + stok transaction.
**Fase 4 — Pembayaran & Upload:** proof upload + payment status + validasi TRANSFER.
**Fase 5 — Laporan & Polish:** Laporan agregasi + chart + export CSV + dashboard real data + polish UI + seed data.

## 12. Rencana Migrasi

- Ganti `DATABASE_URL` ke Postgres (Neon/Supabase) + `provider = "postgresql"` → `prisma migrate deploy`.
- Ganti `lib/storage.ts` ke S3/Cloudinary tanpa ubah caller.

## 13. Self-Review

- [x] Tidak ada placeholder TBD/TODO.
- [x] Konsistensi: role, status, stok, pembayaran selaras di semua section.
- [x] Scope: Fase 1-5 dalam satu spec, tapi implementasi berfase agar tidak sekaligus.
- [x] Tidak ada ambiguitas: stok kapan berkurang, proof kapan wajib, laporan hanya SELESAI.
