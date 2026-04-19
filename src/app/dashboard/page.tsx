"use client";

import { useLeads } from "@/hooks/useLeads";
import { useFollowups } from "@/hooks/useFollowups";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";
import { Card, Spinner, Badge, SectionHeader } from "@/components/ui/Primitives";
import { formatCurrency, timeAgo, formatDate } from "@/lib/utils";
import { STAGE_CONFIG } from "@/types";
import { Clock, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { leads, loading: leadsLoading } = useLeads();
  const { followups } = useFollowups();
  const { user } = useAuth();

  if (leadsLoading) return <Spinner />;

  const upcomingFollowups = followups.filter((f) => !f.is_completed).slice(0, 5);
  const recentLeads = leads.slice(0, 5);
  const firstName = (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0];

  return (
    <div className="space-y-8">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-3xl border border-surface-200/70 bg-gradient-to-br from-white via-brand-50/50 to-accent-50/40 p-8 shadow-card">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-accent-200/40 blur-3xl" />

        <div className="relative">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-200/60 backdrop-blur-sm">
            <Sparkles size={12} className="text-accent-500" />
            Your sales cockpit
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-surface-900 font-display">
            {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
          </h1>
          <p className="mt-1.5 text-sm text-surface-500">
            Here&apos;s how your pipeline is performing right now.
          </p>
        </div>
      </div>

      {/* Analytics */}
      <AnalyticsDashboard leads={leads} />

      {/* Bottom Row: Recent Leads + Upcoming Follow-ups */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Leads */}
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-surface-900 font-display tracking-tight">Recent Leads</h3>
              <p className="text-xs text-surface-500 mt-0.5">Latest additions to your pipeline</p>
            </div>
            <Link
              href="/dashboard/leads"
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-50 transition-colors"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {recentLeads.map((lead) => {
              const stage = STAGE_CONFIG.find((s) => s.key === lead.stage)!;
              return (
                <div
                  key={lead.id}
                  className="group flex items-center justify-between rounded-xl border border-transparent p-3 transition-all duration-200 hover:border-surface-200/70 hover:bg-surface-50/60"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-surface-800 truncate">
                      {lead.first_name} {lead.last_name}
                    </p>
                    <p className="text-xs text-surface-400 truncate">
                      {lead.company || "No company"} · {timeAgo(lead.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-semibold text-surface-700 tabular-nums">{formatCurrency(lead.deal_value)}</span>
                    <Badge color={stage.color} textColor={stage.textColor} dot>
                      {stage.label}
                    </Badge>
                  </div>
                </div>
              );
            })}
            {recentLeads.length === 0 && (
              <p className="py-8 text-center text-sm text-surface-400">No leads yet</p>
            )}
          </div>
        </Card>

        {/* Upcoming Follow-ups */}
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-surface-900 font-display tracking-tight">Upcoming Follow-ups</h3>
              <p className="text-xs text-surface-500 mt-0.5">Don&apos;t miss these check-ins</p>
            </div>
            <Link
              href="/dashboard/followups"
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-50 transition-colors"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {upcomingFollowups.map((f) => {
              const isOverdue = new Date(f.due_date) < new Date();
              return (
                <div
                  key={f.id}
                  className="group flex items-center justify-between rounded-xl border border-transparent p-3 transition-all duration-200 hover:border-surface-200/70 hover:bg-surface-50/60"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-surface-800 truncate">{f.title}</p>
                    <p className="text-xs text-surface-400 truncate">
                      {(f.lead as any)?.first_name} {(f.lead as any)?.last_name}
                    </p>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 text-xs shrink-0 rounded-full px-2.5 py-1 ring-1 ring-inset ${
                      isOverdue
                        ? "bg-danger-light text-danger-dark ring-danger/20"
                        : "bg-surface-50 text-surface-600 ring-surface-200/60"
                    }`}
                  >
                    <Clock size={12} />
                    <span className="font-medium">{formatDate(f.due_date)}</span>
                  </div>
                </div>
              );
            })}
            {upcomingFollowups.length === 0 && (
              <p className="py-8 text-center text-sm text-surface-400">No upcoming follow-ups</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
