import type { Metadata } from "next";
import Link from "next/link";
import laundryImage from "@/public/image/landing/laundry.jpeg";
import cameraImage from "@/public/image/landing/camera-rental.jpeg";
import cakeImage from "@/public/image/landing/cake-preorder.jpeg";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Reveal } from "@/components/landing/reveal";
import { Eyebrow, SectionHeading } from "@/components/landing/section-heading";
import { Pricing } from "@/components/landing/pricing";
import { HeroVisual } from "@/components/landing/hero-visual";
import { BusinessCard } from "@/components/landing/business-card";
import { FlowVisual } from "@/components/landing/flow-visual";
import { CustomerExperience } from "@/components/landing/customer-experience";
import { DashboardShowcase } from "@/components/landing/dashboard";
import { FeatureBlocks } from "@/components/landing/features";
import { BeforeAfter } from "@/components/landing/before-after";
import {
  ArrowRightIcon,
  CakeIcon,
  CameraIcon,
  HeadsetIcon,
  ShieldIcon,
  SparklesIcon,
  WasherIcon,
} from "@/components/landing/icons";

export const metadata: Metadata = {
  title: "OrderKu — Kelola pesanan, produk, dan pelanggan UMKM",
  description:
    "OrderKu membantu usaha kecil mengelola pesanan, produk, pembayaran, dan pelanggan dalam satu tempat. Pelanggan bisa order langsung dari link katalog tanpa login.",
};

const trustPoints = [
  { icon: SparklesIcon, label: "Mudah digunakan" },
  { icon: ShieldIcon, label: "Aman & terpercaya" },
  { icon: HeadsetIcon, label: "Support aktif" },
];

const businesses = [
  {
    image: laundryImage,
    imageAlt: "Tumpukan pakaian bersih di depan mesin cuci laundry",
    icon: <WasherIcon className="h-5 w-5" />,
    title: "Laundry",
    description:
      "Terima pesanan, cek status cucian, dan beri tahu pelanggan saat siap diambil.",
    badgeLabel: "Pesanan Baru",
    badgeValue: "#ORD-0012 · Rp 45.000",
  },
  {
    image: cameraImage,
    imageAlt: "Kamera dan lensa rental tersusun rapi",
    icon: <CameraIcon className="h-5 w-5" />,
    title: "Rental Kamera",
    description:
      "Atur tanggal sewa, pelanggan, pembayaran, dan pengembalian dengan lebih rapi.",
    badgeLabel: "Sewa Alat",
    badgeValue: "#SEW-0034 · 3 hari lagi",
  },
  {
    image: cakeImage,
    imageAlt: "Berbagai kue dan tart di etalase toko",
    icon: <CakeIcon className="h-5 w-5" />,
    title: "Cake & Preorder",
    description:
      "Catat pesanan, tanggal pengambilan, pembayaran, dan progres produksi.",
    badgeLabel: "Pesanan Baru",
    badgeValue: "#ORD-0056 · Rp 250.000",
  },
];


export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] antialiased">
      <Navbar />

      <main>
        {/* HERO */}
        <section id="beranda" className="scroll-mt-16">
          <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-5 pb-16 pt-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-8 lg:pb-24 lg:pt-16">
            <Reveal>
              <Eyebrow>Solusi digital untuk UMKM</Eyebrow>
              <h1 className="mt-5 text-[36px] font-extrabold leading-[1.06] tracking-[-0.03em] text-[#0F172A] sm:text-[46px] lg:text-[54px]">
                Biar usaha jalan,
                <br />
                tanpa bikin kamu{" "}
                <span className="text-[#2563EB]">kewalahan.</span>
              </h1>
              <p className="mt-5 max-w-xl text-[16px] leading-7 text-[#64748B]">
                Pesanan, produk, pembayaran, dan pelanggan ada dalam satu tempat.
                Pelanggan juga bisa order langsung dari link usahamu.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex h-12 items-center justify-center rounded-[12px] bg-[#2563EB] px-7 text-[15px] font-bold text-white shadow-[0_14px_30px_-14px_rgba(37,99,235,0.9)] transition-colors hover:bg-[#1D4ED8]"
                >
                  Mulai Gratis
                </Link>
                <Link
                  href="/login"
                  className="inline-flex h-12 items-center justify-center rounded-[12px] border border-[#E2E8F0] bg-white px-7 text-[15px] font-bold text-[#0F172A] transition-colors hover:bg-[#F8FAFC]"
                >
                  Masuk
                </Link>
              </div>

              <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
                {trustPoints.map((t) => (
                  <li key={t.label} className="flex items-center gap-2 text-[13px] font-semibold text-[#64748B]">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ECFDF5] text-[#16A34A]">
                      <t.icon className="h-3 w-3" />
                    </span>
                    {t.label}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={120}>
              <HeroVisual />
            </Reveal>
          </div>
        </section>

        {/* USE CASE */}
        <section id="untuk-usaha" className="scroll-mt-16 border-y border-[#E2E8F0] bg-white py-16 md:py-20">
          <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
            <Reveal>
              <SectionHeading
                eyebrow="Untuk berbagai bisnis"
                title="Usaha apa pun, cara kelolanya tetap simpel."
                description="OrderKu membantu berbagai jenis usaha mengatur pesanan, produk, layanan, dan pelanggan dari satu tempat."
                action={
                  <a
                    href="#fitur"
                    className="inline-flex h-11 items-center gap-2 rounded-[12px] border border-[#E2E8F0] bg-white px-5 text-sm font-bold text-[#0F172A] transition-colors hover:bg-[#F8FAFC]"
                  >
                    Lihat Fitur
                    <ArrowRightIcon className="h-4 w-4 text-[#2563EB]" />
                  </a>
                }
              />
            </Reveal>

            <div className="mt-10 grid gap-6 md:grid-cols-3 md:gap-7">
              {businesses.map((b, i) => (
                <Reveal key={b.title} delay={i * 90}>
                  <BusinessCard {...b} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* PRODUCT FLOW */}
        <section id="cara-kerja" className="scroll-mt-16 bg-[#EFF6FF] py-16 md:py-20">
          <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
            <Reveal>
              <SectionHeading
                align="center"
                eyebrow="Cara kerja"
                title="Dari pelanggan order sampai pesanan selesai. Semuanya kelihatan."
                description="Pelanggan pilih dan checkout sendiri, pesanan langsung masuk dashboard, kamu tinggal proses sampai selesai."
              />
            </Reveal>
            <div className="mt-10">
              <Reveal delay={100}>
                <FlowVisual />
              </Reveal>
            </div>
          </div>
        </section>

        {/* CUSTOMER EXPERIENCE */}
        <section id="pengalaman-pelanggan" className="scroll-mt-16 border-b border-[#E2E8F0] bg-white py-16 md:py-20">
          <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
            <Reveal>
              <SectionHeading
                eyebrow="Pengalaman pelanggan"
                title="Pelanggan bisa order sendiri dari link."
                description="Bagikan satu link katalog. Pelanggan pilih produk, isi nama & WhatsApp, pilih pembayaran, lalu pesanan langsung tercatat — tanpa perlu daftar akun."
              />
            </Reveal>
            <div className="mt-8">
              <Reveal delay={100}>
                <CustomerExperience />
              </Reveal>
            </div>
          </div>
        </section>

        {/* PRODUCT SHOWCASE */}
        <section id="fitur" className="scroll-mt-16 py-16 md:py-20">
          <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
            <Reveal>
              <SectionHeading
                align="center"
                eyebrow="Fitur unggulan"
                title="Satu tempat untuk mengelola semuanya."
                description="Dashboard, pesanan, produk & layanan, pelanggan, dan laporan — saling terhubung dalam satu tampilan yang rapi."
              />
            </Reveal>
            <div className="mt-10">
              <Reveal delay={80}>
                <DashboardShowcase />
              </Reveal>
            </div>
            <div className="mt-12">
              <Reveal delay={60}>
                <FeatureBlocks />
              </Reveal>
            </div>
          </div>
        </section>

        {/* BEFORE vs AFTER */}
        <section className="border-y border-[#E2E8F0] bg-white py-16 md:py-20">
          <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
            <Reveal>
              <SectionHeading
                eyebrow="Kenapa OrderKu?"
                title="Dari ribet jadi praktis."
                description="Dulu semua serba manual — pesanan numpuk di chat, catatan berserakan. Sekarang semua lebih mudah dalam satu platform."
              />
            </Reveal>
            <div className="mt-10">
              <Reveal delay={100}>
                <BeforeAfter />
              </Reveal>
            </div>
          </div>
        </section>

        {/* HARGA */}
        <section id="harga" className="scroll-mt-16 py-16 md:py-20">
          <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
            <Reveal>
              <SectionHeading
                align="center"
                eyebrow="Harga"
                title="Mulai gratis, kembangkan kapan saja."
                description="Coba dulu semua fitur inti OrderKu untuk usahamu. Tidak ada biaya di awal — naik kelas saat usahamu siap berkembang."
              />
            </Reveal>
            <Pricing />
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="border-t border-[#E2E8F0] bg-white py-16 md:py-20">
          <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
            <Reveal>
              <div className="relative overflow-hidden rounded-[24px] bg-[#2563EB] px-6 py-14 text-center md:px-14 md:py-16">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-white/[0.07]"
                />

                <span className="relative inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
                  Siap memulai?
                </span>
                <h2 className="relative mx-auto mt-4 max-w-2xl text-balance text-[30px] font-extrabold leading-[1.12] tracking-[-0.02em] text-white md:text-[38px]">
                  Siap bikin usaha terasa lebih ringan?
                </h2>
                <p className="relative mx-auto mt-3 max-w-xl text-[15px] leading-7 text-white/80">
                  Mulai kelola pesanan, produk, dan pelanggan dari satu tempat.
                </p>

                <div className="relative mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link
                    href="/register"
                    className="inline-flex h-12 items-center justify-center rounded-[12px] bg-white px-7 text-[15px] font-bold text-[#2563EB] transition-colors hover:bg-[#F8FAFC]"
                  >
                    Mulai Gratis
                  </Link>
                  <a
                    href="#cara-kerja"
                    className="inline-flex h-12 items-center justify-center rounded-[12px] border border-white/30 px-7 text-[15px] font-bold text-white transition-colors hover:bg-white/10"
                  >
                    Lihat Cara Kerja
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
