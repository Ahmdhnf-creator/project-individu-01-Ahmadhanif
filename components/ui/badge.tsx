import * as React from "react";

const variants: Record<string, string> = {
  default: "bg-slate-100 text-slate-600",
  baru: "bg-slate-100 text-[#64748B]",
  diproses: "bg-amber-50 text-[#D97706]",
  dikirim: "bg-blue-50 text-[#2563EB]",
  selesai: "bg-emerald-50 text-[#16A34A]",
  batal: "bg-red-50 text-[#DC2626]",
  menunggu: "bg-slate-100 text-[#64748B]",
  success: "bg-emerald-50 text-[#16A34A]",
  warning: "bg-amber-50 text-[#D97706]",
  error: "bg-red-50 text-[#DC2626]",
};

export function Badge({ variant = "default", className = "", children }: { variant?: string; className?: string; children: React.ReactNode }) {
  const v = variants[variant.toLowerCase()] ?? variants.default;
  return <span className={`inline-flex items-center rounded-[10px] px-2.5 py-1 text-xs font-medium ${v} ${className}`}>{children}</span>;
}
