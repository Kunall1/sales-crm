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
        "fixed inset-y-0 left-0 z-30 flex flex-col border-r border-surface-200/80 bg-white transition-all duration-200",
        collapsed ? "w-[72px]" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-surface-100 px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
          <Zap size={18} />
        </div>
        {!collapsed && (
          <span className="text-lg font-bold text-surface-900 font-display tracking-tight">
            SalesCRM
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-surface-500 hover:bg-surface-50 hover:text-surface-800"
              )}
            >
              <Icon size={19} className={active ? "text-brand-600" : "text-surface-400"} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mx-3 mb-2 flex items-center justify-center rounded-lg py-2 text-surface-400 hover:bg-surface-50 hover:text-surface-600 transition-colors"
      >
        <ChevronLeft size={18} className={cn("transition-transform", collapsed && "rotate-180")} />
      </button>

      {/* User footer */}
      <div className="border-t border-surface-100 p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
            {getInitials(user?.user_metadata?.full_name || user?.email || "U")}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-surface-800">
                {user?.user_metadata?.full_name || "User"}
              </p>
              <p className="truncate text-xs text-surface-400">{user?.email}</p>
            </div>
          )}
          <button
            onClick={signOut}
            title="Sign out"
            className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 hover:text-danger transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
