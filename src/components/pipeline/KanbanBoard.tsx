"use client";

import { useState } from "react";
import { cn, formatCurrency, getInitials } from "@/lib/utils";
import { STAGE_CONFIG, type Lead, type LeadStage } from "@/types";
import { ChevronRight, Building2, TrendingUp, LayoutGrid } from "lucide-react";

interface KanbanBoardProps {
  leads: Lead[];
  onMoveStage: (leadId: string, newStage: LeadStage) => void;
  onSelect: (lead: Lead) => void;
}

// Map stage keys to richer accent colors for column headers
const STAGE_ACCENTS: Record<string, { bg: string; dot: string; value: string }> = {
  new_lead:       { bg: "bg-blue-50",    dot: "bg-blue-500",    value: "text-blue-600" },
  contacted:      { bg: "bg-indigo-50",  dot: "bg-indigo-500",  value: "text-indigo-600" },
  qualified:      { bg: "bg-violet-50",  dot: "bg-violet-500",  value: "text-violet-600" },
  demo_scheduled: { bg: "bg-amber-50",   dot: "bg-amber-500",   value: "text-amber-600" },
  proposal_sent:  { bg: "bg-orange-50",  dot: "bg-orange-500",  value: "text-orange-600" },
  closed_won:     { bg: "bg-emerald-50", dot: "bg-emerald-500", value: "text-emerald-600" },
  closed_lost:    { bg: "bg-red-50",     dot: "bg-red-500",     value: "text-red-600" },
};

export default function KanbanBoard({ leads, onMoveStage, onSelect }: KanbanBoardProps) {
  const [movingId, setMovingId] = useState<string | null>(null);

  const getLeadsForStage = (stage: LeadStage) => leads.filter((l) => l.stage === stage);
  const stageValue = (stage: LeadStage) =>
    getLeadsForStage(stage).reduce((sum, l) => sum + l.deal_value, 0);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
      {STAGE_CONFIG.map((stage) => {
        const stageLeads = getLeadsForStage(stage.key);
        const accent = STAGE_ACCENTS[stage.key] ?? STAGE_ACCENTS.new_lead;

        return (
          <div key={stage.key} className="flex-shrink-0 w-72">
            {/* Column Header */}
            <div className={cn("mb-3 rounded-xl border border-surface-200/60 p-3 shadow-card", accent.bg)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full", accent.dot)} />
                  <h3 className="text-sm font-semibold text-surface-800">{stage.label}</h3>
                  <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-semibold text-surface-600 ring-1 ring-surface-900/5">
                    {stageLeads.length}
                  </span>
                </div>
              </div>
              {stageValue(stage.key) > 0 && (
                <div className={cn("mt-2 flex items-center gap-1 text-xs font-semibold", accent.value)}>
                  <TrendingUp size={11} />
                  {formatCurrency(stageValue(stage.key))}
                </div>
              )}
            </div>

            {/* Column Cards */}
            <div className="space-y-2.5 min-h-[200px] rounded-xl border border-dashed border-surface-200/60 bg-surface-50/40 p-2">
              {stageLeads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => onSelect(lead)}
                  className="group cursor-pointer rounded-xl border border-surface-200/70 bg-white p-4 shadow-card transition-all duration-200 hover:border-brand-200/80 hover:shadow-elevated hover:-translate-y-0.5"
                >
                  {/* Lead header with avatar */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-100 to-accent-100 text-xs font-bold text-brand-700 ring-1 ring-white">
                      {getInitials(`${lead.first_name} ${lead.last_name}`)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-surface-900 leading-tight truncate">
                        {lead.first_name} {lead.last_name}
                      </p>
                      {lead.company && (
                        <div className="mt-0.5 flex items-center gap-1 text-xs text-surface-500">
                          <Building2 size={11} className="shrink-0" />
                          <span className="truncate">{lead.company}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {lead.deal_value > 0 && (
                    <div className="mt-3 inline-flex items-center gap-1 rounded-lg bg-surface-50 px-2.5 py-1 text-xs font-semibold text-surface-800 ring-1 ring-surface-200/60">
                      {formatCurrency(lead.deal_value)}
                    </div>
                  )}

                  {lead.next_action && (
                    <p className="mt-2.5 text-xs text-surface-500 truncate border-t border-surface-100 pt-2">
                      <span className="font-medium text-surface-400">Next:</span> {lead.next_action}
                    </p>
                  )}

                  {/* Stage move buttons */}
                  {movingId === lead.id ? (
                    <div className="mt-3 flex flex-wrap gap-1 border-t border-surface-100 pt-2.5">
                      {STAGE_CONFIG.filter((s) => s.key !== lead.stage).map((s) => (
                        <button
                          key={s.key}
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoveStage(lead.id, s.key);
                            setMovingId(null);
                          }}
                          className={cn(
                            "rounded-md px-2 py-1 text-[10px] font-semibold transition-opacity hover:opacity-80",
                            s.color,
                            s.textColor
                          )}
                        >
                          {s.label}
                        </button>
                      ))}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMovingId(null);
                        }}
                        className="rounded-md px-2 py-1 text-[10px] text-surface-400 hover:bg-surface-100 hover:text-surface-600"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMovingId(lead.id);
                      }}
                      className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-brand-600 opacity-0 transition-all group-hover:opacity-100 hover:text-brand-700"
                    >
                      Move stage <ChevronRight size={11} />
                    </button>
                  )}
                </div>
              ))}

              {stageLeads.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-surface-100 text-surface-400">
                    <LayoutGrid size={15} />
                  </div>
                  <p className="text-xs text-surface-400">No leads here</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
