"use client";

import { useLeads } from "@/hooks/useLeads";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";
import { Spinner } from "@/components/ui/Primitives";

export default function AnalyticsPage() {
  const { leads, loading } = useLeads();

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 font-display">Analytics</h1>
        <p className="mt-1 text-sm text-surface-500">Deep dive into your sales performance</p>
      </div>
      <AnalyticsDashboard leads={leads} />
    </div>
  );
}
