"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { getInitials } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Kanban,
  Bell,
  FileText,
  LogOut,
  ChevronLeft,
  Zap,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/dashboard",           label: "Overview",    icon: LayoutDashboard },
  { href: "/dashboard/leads",     label: "Leads",       icon: Users },
  { href: "/dashboard/pipeline",  label: "Pipeline",    icon: Kanban },
  { href: "/dashboard/followups", label: "Follow-ups",  icon: Bell },
  { href: "/dashboard/notes",     label: "Activity",    icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard" || pathname === "/dashboard/analytics";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex flex-col border-r border-surface-200/70 bg-white/80 backdrop-blur-xl transition-all duration-300",
        collapsed ? "w-[72px]" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-surface-100/80 px-4">
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-[0_4px_12px_-2px_rgb(37_71_245_/_0.45)] ring-1 ring-white/20">
          <Zap size={18} strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <span className="text-lg font-bold font-display tracking-tight text-gradient">
            SalesCRM
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-gradient-to-r from-brand-50 to-accent-50/50 text-brand-700 shadow-[0_1px_0_0_rgb(255_255_255_/_0.8)_inset]"
                  : "text-surface-500 hover:bg-surface-50 hover:text-surface-900"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-brand-500 to-accent-500" />
              )}
              <Icon
                size={18}
                strokeWidth={active ? 2.25 : 2}
                className={cn(
                  "transition-colors duration-200",
                  active ? "text-brand-600" : "text-surface-400 group-hover:text-surface-600"
                )}
              />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mx-3 mb-2 flex items-center justify-center rounded-lg py-1.5 text-surface-400 hover:bg-surface-50 hover:text-surface-700 transition-all duration-150"
      >
        <ChevronLeft size={16} className={cn("transition-transform duration-300", collapsed && "rotate-180")} />
      </button>

      {/* User footer */}
      <div className="border-t border-surface-100/80 p-3">
        <div className="flex items-center gap-3 rounded-xl p-1.5 hover:bg-surface-50 transition-colors">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-100 to-accent-100 text-sm font-bold text-brand-700 ring-1 ring-white">
            {getInitials(user?.user_metadata?.full_name || user?.email || "U")}
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-white" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-surface-800">
                {user?.user_metadata?.full_name || "User"}
              </p>
              <p className="truncate text-xs text-surface-400">{user?.email}</p>
            </div>
          )}
          <button
            onClick={signOut}
            title="Sign out"
            className="rounded-lg p-1.5 text-surface-400 hover:bg-danger-light hover:text-danger transition-all duration-150"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
