"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

// ─── Badge ─────────────────────────────────────────────
interface BadgeProps {
  children: ReactNode;
  color?: string;
  textColor?: string;
  className?: string;
}

export function Badge({ children, color = "bg-surface-100", textColor = "text-surface-700", className }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", color, textColor, className)}>
      {children}
    </span>
  );
}

// ─── Card ──────────────────────────────────────────────
interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

export function Card({ children, className, padding = true }: CardProps) {
  return (
    <div className={cn("rounded-xl border border-surface-200/80 bg-white shadow-card", padding && "p-6", className)}>
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
  className?: string;
}

export function StatCard({ label, value, icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn("flex items-start gap-4", className)}>
      <div className="rounded-lg bg-brand-50 p-2.5 text-brand-600">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-surface-500 truncate">{label}</p>
        <p className="mt-1 text-2xl font-bold text-surface-900 font-display">{value}</p>
        {trend && (
          <p className={cn("mt-1 text-xs font-medium", trend.positive ? "text-success-dark" : "text-danger-dark")}>
            {trend.positive ? "↑" : "↓"} {trend.value}
          </p>
        )}
      </div>
    </Card>
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
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-xl bg-surface-100 p-4 text-surface-400">{icon}</div>
      <h3 className="mt-4 text-lg font-semibold text-surface-800">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-surface-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// ─── Spinner ───────────────────────────────────────────
export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-surface-200 border-t-brand-600" />
    </div>
  );
}
