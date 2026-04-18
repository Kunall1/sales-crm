"use client";

import { useState } from "react";
import { useLeads } from "@/hooks/useLeads";
import KanbanBoard from "@/components/pipeline/KanbanBoard";
import LeadForm, { type LeadFormData } from "@/components/leads/LeadForm";
import { Spinner } from "@/components/ui/Primitives";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import type { Lead } from "@/types";
import { Plus } from "lucide-react";

export default function PipelinePage() {
  const { leads, loading, addLead, updateLead, updateStage } = useLeads();
  const [formOpen, setFormOpen] = useState(false);

  const activeLeads = leads.filter((l) => !["closed_won", "closed_lost"].includes(l.stage));
  const pipelineValue = activeLeads.reduce((sum, l) => sum + l.deal_value, 0);
  const weightedValue = activeLeads.reduce((sum, l) => sum + (l.deal_value * l.probability / 100), 0);

  const handleSubmit = async (data: LeadFormData) => {
    await addLead(data);
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 font-display">Sales Pipeline</h1>
          <p className="mt-1 text-sm text-surface-500">
            {activeLeads.length} active deals · Pipeline: {formatCurrency(pipelineValue)} · Weighted: {formatCurrency(weightedValue)}
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus size={16} /> Add Lead
        </Button>
      </div>

      {/* Kanban */}
      <KanbanBoard
        leads={leads}
        onMoveStage={updateStage}
        onSelect={() => {}}
      />

      {/* Add Lead Form */}
      <LeadForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={null}
      />
    </div>
  );
}
