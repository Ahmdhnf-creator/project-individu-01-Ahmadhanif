import * as React from "react";

export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-[#2563EB]/15 bg-[#2563EB]/[0.06] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#2563EB] ${className}`}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  className = "",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  action?: React.ReactNode;
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div className={`${centered ? "mx-auto max-w-2xl" : "w-full"} ${className}`}>
      <div className={`flex flex-col ${centered ? "items-center" : "items-start"} gap-4 sm:flex-row sm:items-end sm:justify-between`}>
        <div className={centered ? "text-center" : "max-w-2xl"}>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h2
            className={`mt-3 text-[28px] font-extrabold leading-[1.14] tracking-[-0.02em] text-[#0F172A] md:text-[36px] ${
              centered ? "text-balance" : ""
            }`}
          >
            {title}
          </h2>
          {description && (
            <p
              className={`mt-3 text-[15px] leading-7 text-[#64748B] ${
                centered ? "mx-auto max-w-xl" : "max-w-xl"
              }`}
            >
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0 sm:pb-1">{action}</div>}
      </div>
    </div>
  );
}
