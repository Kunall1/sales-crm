"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

// ─── Badge ─────────────────────────────────────────────
interface BadgeProps {
  children: ReactNode;
  color?: string;
  textColor?: string;
  className?: string;
  dot?: boolean;
}

export function Badge({
  children,
  color = "bg-surface-100",
  textColor = "text-surface-700",
  className,
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ring-surface-900/5",
        color,
        textColor,
        className
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", textColor.replace("text-", "bg-"))} />}
      {children}
    </span>
  );
}

// ─── Card ──────────────────────────────────────────────
interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
  hover?: boolean;
}

export function Card({ children, className, padding = true, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-surface-200/70 bg-white shadow-card transition-all duration-200",
        hover && "hover:shadow-elevated hover:border-surface-200 hover:-translate-y-0.5",
        padding && "p-6",
        className
      )}
    >
      {children}
    </div>
  );
}

// ─── Stat Card ─────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: { value: string; positive: boolean };
  accent?: "brand" | "accent" | "success" | "warning" | "danger";
  className?: string;
}

const ACCENT_STYLES: Record<NonNullable<StatCardProps["accent"]>, { bg: string; text: string; ring: string }> = {
  brand: { bg: "bg-brand-50", text: "text-brand-600", ring: "ring-brand-100" },
  accent: { bg: "bg-accent-50", text: "text-accent-600", ring: "ring-accent-100" },
  success: { bg: "bg-success-light", text: "text-success-dark", ring: "ring-success/20" },
  warning: { bg: "bg-warning-light", text: "text-warning-dark", ring: "ring-warning/20" },
  danger: { bg: "bg-danger-light", text: "text-danger-dark", ring: "ring-danger/20" },
};

export function StatCard({ label, value, icon, trend, accent = "brand", className }: StatCardProps) {
  const styles = ACCENT_STYLES[accent];
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-surface-200/70 bg-white p-5 shadow-card transition-all duration-200 hover:shadow-elevated hover:-translate-y-0.5",
        className
      )}
    >
      {/* decorative glow */}
      <div
        className={cn(
          "pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-40 blur-2xl transition-opacity duration-300 group-hover:opacity-70",
          styles.bg
        )}
      />

      <div className="relative flex items-start gap-4">
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1", styles.bg, styles.text, styles.ring)}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-surface-500 truncate">{label}</p>
          <p className="mt-1 text-2xl font-bold text-surface-900 font-display tracking-tight">{value}</p>
          {trend && (
            <p className={cn("mt-1 inline-flex items-center gap-0.5 text-xs font-semibold", trend.positive ? "text-success-dark" : "text-danger-dark")}>
              {trend.positive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ───────────────────────────────────────
interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 rounded-2xl bg-gradient-brand-soft blur-xl opacity-60" />
        <div className="relative rounded-2xl border border-surface-200/60 bg-white p-4 text-surface-500 shadow-card">
          {icon}
        </div>
      </div>
      <h3 className="mt-5 text-lg font-semibold text-surface-900 font-display tracking-tight">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-surface-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// ─── Spinner ───────────────────────────────────────────
export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-[3px] border-surface-200" />
        <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-brand-600 border-r-brand-500" />
      </div>
    </div>
  );
}

// ─── Section Header ────────────────────────────────────
interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, description, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-surface-900 font-display">{title}</h1>
        {description && <p className="mt-1 text-sm text-surface-500">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
