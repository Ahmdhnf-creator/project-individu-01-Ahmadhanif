import * as React from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary: "bg-[#2563EB] text-white hover:bg-[#1D4ED8] border-transparent",
  secondary: "bg-white text-[#0F172A] border-[#E2E8F0] hover:bg-[#F8FAFC]",
  ghost: "bg-transparent text-[#64748B] hover:bg-[#F8FAFC] border-transparent",
  danger: "bg-white text-[#DC2626] border-[#E2E8F0] hover:bg-red-50",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-6 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-[12px] border font-semibold transition-colors disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
}
