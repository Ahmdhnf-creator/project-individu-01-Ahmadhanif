"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { startPayment } from "@/app/billing/checkout/actions";

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        callbacks: {
          onSuccess?: () => void;
          onPending?: () => void;
          onClose?: () => void;
          onError?: () => void;
        },
      ) => void;
    };
  }
}

function loadSnapScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.snap) return resolve();
    const existing = document.getElementById("midtrans-snap");
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Gagal memuat Midtrans Snap")));
      return;
    }
    const script = document.createElement("script");
    script.id = "midtrans-snap";
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Gagal memuat Midtrans Snap"));
    document.body.appendChild(script);
  });
}

export function PayButton({
  plan,
  snapSrc,
  children,
}: {
  plan: string;
  snapSrc: string;
  children?: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [closed, setClosed] = useState(false);
  const router = useRouter();

  async function pay() {
    setLoading(true);
    setError(null);
    setClosed(false);
    const result = await startPayment(plan);
    if (!result.ok) {
      setError(result.error);
      setLoading(false);
      return;
    }
    try {
      await loadSnapScript(snapSrc);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat Midtrans Snap");
      setLoading(false);
      return;
    }
    if (!window.snap) {
      setError("Midtrans Snap tidak tersedia");
      setLoading(false);
      return;
    }
    const statusUrl = `/billing/status?order_id=${encodeURIComponent(result.orderId)}`;
    window.snap.pay(result.token, {
      onSuccess: () => router.push(statusUrl),
      onPending: () => router.push(statusUrl),
      onError: () => router.push(statusUrl),
      onClose: () => {
        setClosed(true);
        setLoading(false);
      },
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={pay}
        disabled={loading}
        className="inline-flex h-12 w-full items-center justify-center rounded-[12px] bg-[#2563EB] text-[15px] font-bold text-white transition-colors hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Membuka Midtrans…" : children ?? "Bayar Sekarang"}
      </button>
      {error && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-[#DC2626]">
          {error}
        </p>
      )}
      {closed && (
        <p className="mt-3 text-center text-sm text-[#64748B]">
          Pembayaran ditutup. Klik tombol lagi untuk mencoba.
        </p>
      )}
    </div>
  );
}
