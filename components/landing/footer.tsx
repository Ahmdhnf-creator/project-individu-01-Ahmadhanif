import Link from "next/link";
import { Logo } from "./logo";

const navLinks = [
  { href: "#beranda", label: "Beranda" },
  { href: "#fitur", label: "Fitur" },
  { href: "#cara-kerja", label: "Cara Kerja" },
  { href: "#untuk-usaha", label: "Untuk Usaha" },
  { href: "#harga", label: "Harga" },
];

const businessLinks = [
  { href: "#untuk-usaha", label: "Laundry" },
  { href: "#untuk-usaha", label: "Rental Kamera" },
  { href: "#untuk-usaha", label: "Cake & Preorder" },
];

const accountLinks = [
  { href: "/login", label: "Masuk" },
  { href: "/register", label: "Daftar" },
  { href: "/catalog", label: "Lihat Katalog" },
];

export function Footer() {
  return (
    <footer className="border-t border-[#E2E8F0] bg-white">
      <div className="mx-auto max-w-[1280px] px-5 py-12 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm leading-6 text-[#64748B]">
              Solusi sederhana untuk mengelola usaha dengan lebih rapi.
            </p>
          </div>

          <nav aria-label="Navigasi footer">
            <p className="text-sm font-bold text-[#0F172A]">Navigasi</p>
            <ul className="mt-3 space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-[#64748B] transition-colors hover:text-[#0F172A]">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-sm font-bold text-[#0F172A]">Untuk Usaha</p>
            <ul className="mt-3 space-y-2.5">
              {businessLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-[#64748B] transition-colors hover:text-[#0F172A]">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Akun">
            <p className="text-sm font-bold text-[#0F172A]">Akun</p>
            <ul className="mt-3 space-y-2.5">
              {accountLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[#64748B] transition-colors hover:text-[#0F172A]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[#E2E8F0] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#64748B]">© 2026 OrderKu. Semua hak dilindungi.</p>
          <p className="text-xs text-[#64748B]">Dibuat untuk UMKM Indonesia.</p>
        </div>
      </div>
    </footer>
  );
}
