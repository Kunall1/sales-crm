"use client";

import { useState, type FormEvent } from "react";
import { cn, formatDate, timeAgo } from "@/lib/utils";
import { Card, Badge, EmptyState } from "@/components/ui/Primitives";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import type { Followup, Lead } from "@/types";
import { Bell, Check, Clock, Plus, Trash2, AlertCircle } from "lucide-react";

interface FollowupListProps {
  followups: Followup[];
  leads: Lead[];
  onAdd: (leadId: string, title: string, dueDate: string, description?: string) => Promise<any>;
  onToggle: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
}

export default function FollowupList({ followups, leads, onAdd, onToggle, onDelete }: FollowupListProps) {
  const [showForm, setShowForm] = useState(false);

  const now = new Date();
  const overdue = followups.filter((f) => !f.is_completed && new Date(f.due_date) < now);
  const upcoming = followups.filter((f) => !f.is_completed && new Date(f.due_date) >= now);
  const completed = followups.filter((f) => f.is_completed);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await onAdd(
      fd.get("lead_id") as string,
      fd.get("title") as string,
      fd.get("due_date") as string,
      fd.get("description") as string
    );
    setShowForm(false);
  };

  const renderItem = (f: Followup) => {
    const isOverdue = !f.is_completed && new Date(f.due_date) < now;
    const lead = f.lead as any;
    return (
      <div
        key={f.id}
        className={cn(
          "flex items-start gap-3 rounded-lg border p-4 transition-colors",
          f.is_completed
            ? "border-surface-100 bg-surface-50/50 opacity-60"
            : isOverdue
            ? "border-danger/20 bg-red-50/50"
            : "border-surface-200/80 bg-white"
        )}
      >
        <button
          onClick={() => onToggle(f.id, f.is_completed)}
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
            f.is_completed
              ? "border-success bg-success text-white"
              : "border-surface-300 hover:border-brand-500"
          )}
        >
          {f.is_completed && <Check size={12} />}
        </button>

        <div className="flex-1 min-w-0">
          <p className={cn("font-medium text-surface-800", f.is_completed && "line-through")}>
            {f.title}
          </p>
          {f.description && (
            <p className="mt-0.5 text-sm text-surface-500">{f.description}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-surface-400">
            {lead && (
              <span className="font-medium text-surface-600">
                {lead.first_name} {lead.last_name}
                {lead.company ? ` · ${lead.company}` : ""}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {formatDate(f.due_date)}
              {isOverdue && (
                <Badge color="bg-danger-light" textColor="text-danger-dark" className="ml-1">
                  Overdue
                </Badge>
              )}
            </span>
          </div>
        </div>

        <button
          onClick={() => { if (confirm("Delete this follow-up?")) onDelete(f.id); }}
          className="shrink-0 rounded-md p-1 text-surface-300 hover:bg-red-50 hover:text-danger transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-surface-900 font-display">Follow-ups & Reminders</h2>
          <p className="mt-1 text-sm text-surface-500">
            {overdue.length > 0 && (
              <span className="text-danger font-medium">{overdue.length} overdue · </span>
            )}
            {upcoming.length} upcoming · {completed.length} completed
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} size="sm">
          <Plus size={16} /> Add Follow-up
        </Button>
      </div>

      {/* Overdue */}
      {overdue.length > 0 && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <AlertCircle size={16} className="text-danger" />
            <h3 className="text-sm font-semibold text-danger">Overdue ({overdue.length})</h3>
          </div>
          <div className="space-y-2">{overdue.map(renderItem)}</div>
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-surface-600">Upcoming ({upcoming.length})</h3>
          <div className="space-y-2">{upcoming.map(renderItem)}</div>
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-surface-400">Completed ({completed.length})</h3>
          <div className="space-y-2">{completed.map(renderItem)}</div>
        </div>
      )}

      {followups.length === 0 && (
        <EmptyState
          icon={<Bell size={28} />}
          title="No follow-ups yet"
          description="Create reminders to stay on top of your pipeline."
          action={<Button onClick={() => setShowForm(true)} size="sm"><Plus size={16} /> Add Follow-up</Button>}
        />
      )}

      {/* Add Follow-up Modal */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title="New Follow-up" size="sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-surface-700">Lead</label>
            <select
              name="lead_id"
              required
              className="w-full rounded-lg border border-surface-200 bg-white px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="">Select a lead...</option>
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.first_name} {l.last_name} {l.company ? `(${l.company})` : ""}
                </option>
              ))}
            </select>
          </div>
          <Input label="Title" name="title" required placeholder="Schedule demo call" />
          <Input label="Due Date" name="due_date" type="datetime-local" required />
          <Input label="Description (optional)" name="description" placeholder="Notes about this follow-up" />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
