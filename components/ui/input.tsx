import * as React from "react";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    className={`w-full rounded-[12px] border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-[#0F172A] placeholder:text-[#64748B]/60 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 ${className}`}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className = "", ...props }, ref) => (
  <textarea
    ref={ref}
    className={`w-full rounded-[12px] border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-[#0F172A] placeholder:text-[#64748B]/60 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 ${className}`}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export function Label({ className = "", ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={`mb-1.5 block text-sm font-medium text-[#0F172A] ${className}`} {...props} />;
}
export function Select({ className = "", children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`w-full rounded-[12px] border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
