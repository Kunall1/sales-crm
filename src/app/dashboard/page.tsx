"use client";

import { useLeads } from "@/hooks/useLeads";
import { useFollowups } from "@/hooks/useFollowups";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";
import { Card, Spinner, Badge } from "@/components/ui/Primitives";
import { formatCurrency, timeAgo, formatDate } from "@/lib/utils";
import { STAGE_CONFIG } from "@/types";
import { Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { leads, loading: leadsLoading } = useLeads();
  const { followups, loading: fuLoading } = useFollowups();

  if (leadsLoading) return <Spinner />;

  const upcomingFollowups = followups
    .filter((f) => !f.is_completed)
    .slice(0, 5);

  const recentLeads = leads.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900 font-display">Dashboard</h1>
        <p className="mt-1 text-sm text-surface-500">Your sales overview at a glance</p>
      </div>

      {/* Analytics */}
      <AnalyticsDashboard leads={leads} />

      {/* Bottom Row: Recent Leads + Upcoming Follow-ups */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Leads */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-surface-800 font-display">Recent Leads</h3>
            <Link href="/dashboard/leads" className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentLeads.map((lead) => {
              const stage = STAGE_CONFIG.find((s) => s.key === lead.stage)!;
              return (
                <div key={lead.id} className="flex items-center justify-between rounded-lg border border-surface-100 p-3">
                  <div className="min-w-0">
                    <p className="font-medium text-surface-800 truncate">{lead.first_name} {lead.last_name}</p>
                    <p className="text-xs text-surface-400">{lead.company || "No company"} · {timeAgo(lead.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-medium text-surface-700">{formatCurrency(lead.deal_value)}</span>
                    <Badge color={stage.color} textColor={stage.textColor}>{stage.label}</Badge>
                  </div>
                </div>
              );
            })}
            {recentLeads.length === 0 && (
              <p className="py-6 text-center text-sm text-surface-400">No leads yet</p>
            )}
          </div>
        </Card>

        {/* Upcoming Follow-ups */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-surface-800 font-display">Upcoming Follow-ups</h3>
            <Link href="/dashboard/followups" className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingFollowups.map((f) => {
              const isOverdue = new Date(f.due_date) < new Date();
              return (
                <div key={f.id} className="flex items-center justify-between rounded-lg border border-surface-100 p-3">
                  <div className="min-w-0">
                    <p className="font-medium text-surface-800 truncate">{f.title}</p>
                    <p className="text-xs text-surface-400">
                      {(f.lead as any)?.first_name} {(f.lead as any)?.last_name}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs shrink-0">
                    <Clock size={12} className={isOverdue ? "text-danger" : "text-surface-400"} />
                    <span className={isOverdue ? "text-danger font-medium" : "text-surface-500"}>
                      {formatDate(f.due_date)}
                    </span>
                  </div>
                </div>
              );
            })}
            {upcomingFollowups.length === 0 && (
              <p className="py-6 text-center text-sm text-surface-400">No upcoming follow-ups</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
