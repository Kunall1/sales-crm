"use client";

import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area,
} from "recharts";
import { Card, StatCard } from "@/components/ui/Primitives";
import { formatCurrency, formatCompact } from "@/lib/utils";
import { STAGE_CONFIG, type Lead } from "@/types";
import { Users, TrendingUp, DollarSign, Target, CheckCircle2, XCircle } from "lucide-react";

interface AnalyticsDashboardProps {
  leads: Lead[];
}

const CHART_COLORS = ["#2547f5", "#8b3bee", "#6366f1", "#f59e0b", "#f97316", "#22c55e", "#ef4444"];

export default function AnalyticsDashboard({ leads }: AnalyticsDashboardProps) {
  const stats = useMemo(() => {
    const total = leads.length;
    const won = leads.filter((l) => l.stage === "closed_won");
    const lost = leads.filter((l) => l.stage === "closed_lost");
    const active = leads.filter((l) => !["closed_won", "closed_lost"].includes(l.stage));

    const conversionRate = total > 0 ? ((won.length / total) * 100).toFixed(1) : "0";
    const totalRevenue = won.reduce((sum, l) => sum + l.deal_value, 0);
    const pipelineValue = active.reduce((sum, l) => sum + (l.deal_value * l.probability / 100), 0);

    return { total, won: won.length, lost: lost.length, active: active.length, conversionRate, totalRevenue, pipelineValue };
  }, [leads]);

  // Pipeline by stage
  const pipelineData = useMemo(() =>
    STAGE_CONFIG.map((stage) => ({
      name: stage.label,
      count: leads.filter((l) => l.stage === stage.key).length,
      value: leads.filter((l) => l.stage === stage.key).reduce((s, l) => s + l.deal_value, 0),
    })),
  [leads]);

  // Source distribution
  const sourceData = useMemo(() => {
    const sourceCounts: Record<string, number> = {};
    leads.forEach((l) => {
      const label = l.source.replace("_", " ");
      sourceCounts[label] = (sourceCounts[label] || 0) + 1;
    });
    return Object.entries(sourceCounts).map(([name, value]) => ({ name, value }));
  }, [leads]);

  // Monthly trend (last 6 months)
  const monthlyData = useMemo(() => {
    const months: Record<string, { won: number; total: number; revenue: number }> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      months[key] = { won: 0, total: 0, revenue: 0 };
    }
    leads.forEach((l) => {
      const d = new Date(l.created_at);
      const key = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      if (months[key]) {
        months[key].total++;
        if (l.stage === "closed_won") {
          months[key].won++;
          months[key].revenue += l.deal_value;
        }
      }
    });
    return Object.entries(months).map(([month, data]) => ({ month, ...data }));
  }, [leads]);

  return (
    <div className="space-y-6">
      {/* Stat Cards Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total Leads" value={stats.total} icon={<Users size={18} />} accent="brand" />
        <StatCard label="Conversion" value={`${stats.conversionRate}%`} icon={<TrendingUp size={18} />} accent="accent" />
        <StatCard label="Revenue" value={formatCurrency(stats.totalRevenue)} icon={<DollarSign size={18} />} accent="success" />
        <StatCard label="Pipeline" value={formatCurrency(stats.pipelineValue)} icon={<Target size={18} />} accent="warning" />
        <StatCard label="Closed Won" value={stats.won} icon={<CheckCircle2 size={18} />} accent="success" />
        <StatCard label="Closed Lost" value={stats.lost} icon={<XCircle size={18} />} accent="danger" />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pipeline Funnel */}
        <Card>
          <h3 className="mb-4 text-base font-semibold text-surface-800 font-display">Pipeline by Stage</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={pipelineData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13 }}
                formatter={(value: number) => [value, "Leads"]}
              />
              <Bar dataKey="count" fill="#2547f5" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Lead Sources Pie */}
        <Card>
          <h3 className="mb-4 text-base font-semibold text-surface-800 font-display">Lead Sources</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={sourceData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={{ stroke: "#cbd5e1" }}
              >
                {sourceData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card>
        <h3 className="mb-4 text-base font-semibold text-surface-800 font-display">Monthly Trend</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} />
            <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} />
            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13 }} />
            <Area type="monotone" dataKey="total" stroke="#2547f5" fill="#2547f5" fillOpacity={0.1} name="New Leads" />
            <Area type="monotone" dataKey="won" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} name="Won" />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
