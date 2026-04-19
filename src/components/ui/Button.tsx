"use client";

import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "group/btn relative inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
          "disabled:pointer-events-none disabled:opacity-50",
          "active:scale-[0.98]",
          // variants
          variant === "primary" &&
            "bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-[0_1px_0_0_rgb(255_255_255_/_0.15)_inset,0_2px_8px_-2px_rgb(37_71_245_/_0.4)] hover:from-brand-500 hover:to-brand-700 hover:shadow-[0_1px_0_0_rgb(255_255_255_/_0.15)_inset,0_4px_14px_-2px_rgb(37_71_245_/_0.45)]",
          variant === "secondary" &&
            "bg-white text-surface-700 border border-surface-200 shadow-card hover:bg-surface-50 hover:border-surface-300 hover:shadow-elevated",
          variant === "outline" &&
            "bg-transparent text-brand-700 border border-brand-200 hover:bg-brand-50 hover:border-brand-300",
          variant === "ghost" &&
            "text-surface-600 hover:bg-surface-100 hover:text-surface-900",
          variant === "danger" &&
            "bg-gradient-to-b from-danger to-danger-dark text-white shadow-[0_1px_0_0_rgb(255_255_255_/_0.15)_inset,0_2px_8px_-2px_rgb(239_68_68_/_0.4)] hover:shadow-[0_1px_0_0_rgb(255_255_255_/_0.15)_inset,0_4px_14px_-2px_rgb(239_68_68_/_0.45)]",
          // sizes
          size === "sm" && "h-8 px-3 text-sm",
          size === "md" && "h-10 px-4 text-sm",
          size === "lg" && "h-12 px-6 text-base",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
