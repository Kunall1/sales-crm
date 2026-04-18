"use client";

import { useState } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/Primitives";
import { STAGE_CONFIG, type Lead, type LeadStage } from "@/types";
import { ChevronRight, Building2, DollarSign } from "lucide-react";

interface KanbanBoardProps {
  leads: Lead[];
  onMoveStage: (leadId: string, newStage: LeadStage) => void;
  onSelect: (lead: Lead) => void;
}

export default function KanbanBoard({ leads, onMoveStage, onSelect }: KanbanBoardProps) {
  const [movingId, setMovingId] = useState<string | null>(null);

  const getLeadsForStage = (stage: LeadStage) =>
    leads.filter((l) => l.stage === stage);

  const stageValue = (stage: LeadStage) =>
    getLeadsForStage(stage).reduce((sum, l) => sum + l.deal_value, 0);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2">
      {STAGE_CONFIG.map((stage) => {
        const stageLeads = getLeadsForStage(stage.key);
        return (
          <div key={stage.key} className="flex-shrink-0 w-72">
            {/* Column Header */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn("h-2.5 w-2.5 rounded-full", stage.color.replace("bg-", "bg-").replace("-100", "-500"))} />
                <h3 className="text-sm font-semibold text-surface-700">{stage.label}</h3>
                <span className="rounded-full bg-surface-100 px-2 py-0.5 text-xs font-medium text-surface-500">
                  {stageLeads.length}
                </span>
              </div>
              <span className="text-xs font-medium text-surface-400">
                {formatCurrency(stageValue(stage.key))}
              </span>
            </div>

            {/* Column Cards */}
            <div className="space-y-2.5 min-h-[200px] rounded-xl bg-surface-50/50 p-2">
              {stageLeads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => onSelect(lead)}
                  className="cursor-pointer rounded-lg border border-surface-200/80 bg-white p-3.5 shadow-card transition-all hover:shadow-elevated hover:border-surface-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-surface-900 truncate">
                        {lead.first_name} {lead.last_name}
                      </p>
                      {lead.company && (
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-surface-500">
                          <Building2 size={12} />
                          <span className="truncate">{lead.company}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {lead.deal_value > 0 && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-sm font-semibold text-surface-800">
                      <DollarSign size={13} className="text-success" />
                      {formatCurrency(lead.deal_value)}
                    </div>
                  )}

                  {lead.next_action && (
                    <p className="mt-2 text-xs text-surface-400 truncate">
                      Next: {lead.next_action}
                    </p>
                  )}

                  {/* Quick stage move buttons */}
                  {movingId === lead.id ? (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {STAGE_CONFIG.filter((s) => s.key !== lead.stage).map((s) => (
                        <button
                          key={s.key}
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoveStage(lead.id, s.key);
                            setMovingId(null);
                          }}
                          className={cn(
                            "rounded-md px-2 py-1 text-[10px] font-medium transition-colors",
                            s.color, s.textColor, "hover:opacity-80"
                          )}
                        >
                          {s.label}
                        </button>
                      ))}
                      <button
                        onClick={(e) => { e.stopPropagation(); setMovingId(null); }}
                        className="rounded-md px-2 py-1 text-[10px] text-surface-400 hover:bg-surface-100"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); setMovingId(lead.id); }}
                      className="mt-3 flex items-center gap-1 text-[11px] font-medium text-brand-600 hover:text-brand-700 transition-colors"
                    >
                      Move stage <ChevronRight size={12} />
                    </button>
                  )}
                </div>
              ))}

              {stageLeads.length === 0 && (
                <div className="flex items-center justify-center py-10 text-xs text-surface-400">
                  No leads
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
