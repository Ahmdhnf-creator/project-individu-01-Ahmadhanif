"use client";

import * as React from "react";
import Link from "next/link";
import { Logo } from "./logo";
import { CloseIcon, MenuIcon } from "./icons";

const links = [
  { href: "#beranda", label: "Beranda" },
  { href: "#fitur", label: "Fitur" },
  { href: "#cara-kerja", label: "Cara Kerja" },
  { href: "#untuk-usaha", label: "Untuk Usaha" },
  { href: "#harga", label: "Harga" },
];

export function Navbar() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-white/90 backdrop-blur-md">
      <div className="relative mx-auto flex h-14 max-w-[1280px] items-center justify-between px-5 lg:h-16 lg:px-8">
        <Logo />

        <nav aria-label="Navigasi utama" className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-[10px] px-3 py-2 text-sm font-medium text-[#64748B] transition-colors hover:bg-[#F8FAFC] hover:text-[#0F172A]"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/login"
            className="rounded-[12px] border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-semibold text-[#0F172A] transition-colors hover:bg-[#F8FAFC]"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="rounded-[12px] bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8]"
          >
            Mulai Gratis
          </Link>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#E2E8F0] bg-white text-[#0F172A] lg:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div id="menu-mobile" className="border-t border-[#E2E8F0] bg-white lg:hidden">
          <nav aria-label="Navigasi mobile" className="mx-auto max-w-[1280px] px-5 py-4">
            <ul className="space-y-1">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-[12px] px-3 py-2.5 text-sm font-medium text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#E2E8F0] pt-4">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 items-center justify-center rounded-[12px] border border-[#E2E8F0] bg-white text-sm font-semibold text-[#0F172A] hover:bg-[#F8FAFC]"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 items-center justify-center rounded-[12px] bg-[#2563EB] text-sm font-semibold text-white hover:bg-[#1D4ED8]"
              >
                Mulai Gratis
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
