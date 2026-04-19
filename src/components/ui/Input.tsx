"use client";

import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wide text-surface-600">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-lg border border-surface-200 bg-white/80 px-3.5 py-2.5 text-sm text-surface-900 shadow-[0_1px_0_0_rgb(255_255_255_/_0.5)_inset]",
            "placeholder:text-surface-400",
            "transition-all duration-200",
            "hover:border-surface-300",
            "focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10",
            error && "border-danger focus:border-danger focus:ring-danger/10",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs font-medium text-danger">{error}</p>}
        {hint && !error && <p className="text-xs text-surface-400">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
