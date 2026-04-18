"use client";

import { useState } from "react";
import { useLeads } from "@/hooks/useLeads";
import LeadTable from "@/components/leads/LeadTable";
import LeadForm, { type LeadFormData } from "@/components/leads/LeadForm";
import { Spinner, EmptyState } from "@/components/ui/Primitives";
import Button from "@/components/ui/Button";
import type { Lead } from "@/types";
import { Plus, Users } from "lucide-react";

export default function LeadsPage() {
  const { leads, loading, addLead, updateLead, deleteLead } = useLeads();
  const [formOpen, setFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const handleSubmit = async (data: LeadFormData) => {
    if (editingLead) {
      await updateLead(editingLead.id, data);
    } else {
      await addLead(data);
    }
    setEditingLead(null);
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setFormOpen(true);
  };

  const handleClose = () => {
    setFormOpen(false);
    setEditingLead(null);
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 font-display">Leads</h1>
          <p className="mt-1 text-sm text-surface-500">
            Manage your sales leads and contacts
          </p>
        </div>
        <Button onClick={() => { setEditingLead(null); setFormOpen(true); }}>
          <Plus size={16} /> Add Lead
        </Button>
      </div>

      {/* Content */}
      {leads.length > 0 ? (
        <LeadTable
          leads={leads}
          onEdit={handleEdit}
          onDelete={deleteLead}
          onSelect={setSelectedLead}
        />
      ) : (
        <EmptyState
          icon={<Users size={28} />}
          title="No leads yet"
          description="Add your first lead to start building your pipeline."
          action={
            <Button onClick={() => setFormOpen(true)} size="sm">
              <Plus size={16} /> Add Lead
            </Button>
          }
        />
      )}

      {/* Lead Form Modal */}
      <LeadForm
        open={formOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initialData={editingLead}
      />

      {/* Lead Detail Drawer */}
      {selectedLead && (
        <LeadDetailDrawer
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onEdit={() => { handleEdit(selectedLead); setSelectedLead(null); }}
        />
      )}
    </div>
  );
}

// ─── Inline Lead Detail Drawer ────────────────────────
function LeadDetailDrawer({
  lead,
  onClose,
  onEdit,
}: {
  lead: Lead;
  onClose: () => void;
  onEdit: () => void;
}) {
  const { formatCurrency, formatDate } = require("@/lib/utils");
  const { STAGE_CONFIG, SOURCE_OPTIONS } = require("@/types");
  const { X, Pencil, Building2, Mail, Phone, Calendar, Target } = require("lucide-react");

  const stage = STAGE_CONFIG.find((s: any) => s.key === lead.stage);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-surface-950/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white shadow-modal animate-slide-in overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-surface-100 bg-white px-6 py-4">
          <h2 className="text-lg font-semibold text-surface-900 font-display">Lead Details</h2>
          <div className="flex items-center gap-2">
            <button onClick={onEdit} className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 hover:text-brand-600 transition-colors">
              <Pencil size={16} />
            </button>
            <button onClick={onClose} className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 hover:text-surface-600 transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Name & Company */}
          <div>
            <h3 className="text-xl font-bold text-surface-900">
              {lead.first_name} {lead.last_name}
            </h3>
            {lead.job_title && <p className="text-sm text-surface-500">{lead.job_title}</p>}
            {lead.company && (
              <div className="mt-1 flex items-center gap-1.5 text-sm text-surface-600">
                <Building2 size={14} /> {lead.company}
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Contact</h4>
            {lead.email && (
              <div className="flex items-center gap-2.5 text-sm text-surface-700">
                <Mail size={14} className="text-surface-400" /> {lead.email}
              </div>
            )}
            {lead.phone && (
              <div className="flex items-center gap-2.5 text-sm text-surface-700">
                <Phone size={14} className="text-surface-400" /> {lead.phone}
              </div>
            )}
          </div>

          {/* Pipeline */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Pipeline</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-surface-50 p-3">
                <p className="text-xs text-surface-400">Stage</p>
                <p className={`mt-0.5 text-sm font-semibold ${stage?.textColor}`}>{stage?.label}</p>
              </div>
              <div className="rounded-lg bg-surface-50 p-3">
                <p className="text-xs text-surface-400">Deal Value</p>
                <p className="mt-0.5 text-sm font-semibold text-surface-800">{formatCurrency(lead.deal_value)}</p>
              </div>
              <div className="rounded-lg bg-surface-50 p-3">
                <p className="text-xs text-surface-400">Probability</p>
                <p className="mt-0.5 text-sm font-semibold text-surface-800">{lead.probability}%</p>
              </div>
              <div className="rounded-lg bg-surface-50 p-3">
                <p className="text-xs text-surface-400">Source</p>
                <p className="mt-0.5 text-sm font-semibold text-surface-800 capitalize">{lead.source.replace("_", " ")}</p>
              </div>
            </div>
          </div>

          {/* Follow-up */}
          {(lead.next_action || lead.next_action_date) && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Next Action</h4>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                {lead.next_action && <p className="text-sm font-medium text-amber-800">{lead.next_action}</p>}
                {lead.next_action_date && (
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-amber-600">
                    <Calendar size={12} /> {formatDate(lead.next_action_date)}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Owner */}
          {lead.owner_name && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Owner</h4>
              <p className="text-sm text-surface-700">{lead.owner_name}</p>
            </div>
          )}

          {/* Metadata */}
          <div className="border-t border-surface-100 pt-4 text-xs text-surface-400">
            <p>Created: {formatDate(lead.created_at)}</p>
            <p>Updated: {formatDate(lead.updated_at)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
