import * as React from "react";

export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-[10px] bg-[#2563EB] ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-[58%] w-[58%]">
        <path
          d="M16.8 15.4A6.6 6.6 0 0 1 9.1 5.6a7.2 7.2 0 1 0 8.9 9.6 6.7 6.7 0 0 1-1.2.2Z"
          fill="white"
        />
        <circle cx="16.4" cy="7.2" r="1.3" fill="white" opacity="0.85" />
      </svg>
    </span>
  );
}

export function Logo({ className = "", href = "/" }: { className?: string; href?: string }) {
  return (
    <a href={href} className={`group inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-8 w-8 transition-transform duration-300 group-hover:-translate-y-0.5" />
      <span className="text-[16px] font-extrabold tracking-tight text-[#0F172A]">
        Bulan-01
      </span>
    </a>
  );
}
