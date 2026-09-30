import * as React from "react";
import Image, { type StaticImageData } from "next/image";
import { BagIcon } from "./icons";

export function BusinessCard({
  image,
  imageAlt,
  icon,
  title,
  description,
  badgeLabel,
  badgeValue,
}: {
  image: StaticImageData;
  imageAlt: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  badgeLabel: string;
  badgeValue: string;
}) {
  return (
    <article className="group">
      <div className="relative overflow-hidden rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC]">
        <Image
          src={image}
          alt={imageAlt}
          className="aspect-[16/10] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute right-3 top-3 flex items-center gap-2 rounded-[12px] border border-[#E2E8F0] bg-white/95 px-3 py-2 shadow-[0_8px_20px_-8px_rgba(15,23,42,0.25)] backdrop-blur-sm">
          <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#EFF6FF] text-[#2563EB]">
            <BagIcon className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-[10px] font-medium text-[#64748B]">{badgeLabel}</span>
            <span className="block text-[11px] font-bold text-[#0F172A]">{badgeValue}</span>
          </span>
        </div>
      </div>

      <div className="relative z-10 -mt-7 mr-4 rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-[0_12px_32px_-16px_rgba(15,23,42,0.25)] transition-transform duration-300 ease-out group-hover:-translate-y-1">
        <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#2563EB] text-white">
          {icon}
        </span>
        <h3 className="mt-3.5 text-[16px] font-bold tracking-tight text-[#0F172A]">{title}</h3>
        <p className="mt-1.5 text-sm leading-6 text-[#64748B]">{description}</p>
      </div>
    </article>
  );
}
