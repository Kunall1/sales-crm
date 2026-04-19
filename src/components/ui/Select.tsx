"use client";

import { cn } from "@/lib/utils";
import { type SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDown } from "lucide-react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wide text-surface-600">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={cn(
              "w-full appearance-none rounded-lg border border-surface-200 bg-white/80 px-3.5 py-2.5 pr-10 text-sm text-surface-900 shadow-[0_1px_0_0_rgb(255_255_255_/_0.5)_inset]",
              "transition-all duration-200",
              "hover:border-surface-300",
              "focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10",
              error && "border-danger focus:border-danger focus:ring-danger/10",
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-surface-400"
          />
        </div>
        {error && <p className="text-xs font-medium text-danger">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
