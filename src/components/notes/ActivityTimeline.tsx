"use client";

import { useState, type FormEvent } from "react";
import { cn, timeAgo } from "@/lib/utils";
import { Card, EmptyState } from "@/components/ui/Primitives";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import { ACTIVITY_TYPE_OPTIONS, type Activity, type ActivityType, type Lead } from "@/types";
import { FileText, Plus, Trash2 } from "lucide-react";

interface ActivityTimelineProps {
  activities: Activity[];
  leads: Lead[];
  onAdd: (leadId: string, type: ActivityType, title: string, content?: string) => Promise<any>;
  onDelete: (id: string) => void;
}

export default function ActivityTimeline({ activities, leads, onAdd, onDelete }: ActivityTimelineProps) {
  const [showForm, setShowForm] = useState(false);

  const getTypeConfig = (type: ActivityType) =>
    ACTIVITY_TYPE_OPTIONS.find((t) => t.value === type) || ACTIVITY_TYPE_OPTIONS[0];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await onAdd(
      fd.get("lead_id") as string,
      fd.get("type") as ActivityType,
      fd.get("title") as string,
      fd.get("content") as string
    );
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-surface-900 font-display">Activity Timeline</h2>
          <p className="mt-1 text-sm text-surface-500">{activities.length} activities logged</p>
        </div>
        <Button onClick={() => setShowForm(true)} size="sm">
          <Plus size={16} /> Log Activity
        </Button>
      </div>

      {/* Timeline */}
      {activities.length > 0 ? (
        <div className="relative space-y-0">
          {/* Vertical line */}
          <div className="absolute left-5 top-2 bottom-2 w-px bg-surface-200" />

          {activities.map((activity, i) => {
            const config = getTypeConfig(activity.type);
            return (
              <div key={activity.id} className="relative flex gap-4 py-3 animate-fade-in">
                {/* Dot */}
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white border-2 border-surface-200 text-base">
                  {config.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 rounded-lg border border-surface-200/80 bg-white p-4 shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-medium text-brand-600 uppercase tracking-wider">
                          {config.label}
                        </span>
                        <span className="text-xs text-surface-400">{timeAgo(activity.created_at)}</span>
                      </div>
                      <p className="mt-1 font-medium text-surface-800">{activity.title}</p>
                      {activity.content && (
                        <p className="mt-1.5 text-sm text-surface-500 whitespace-pre-wrap">{activity.content}</p>
                      )}
                    </div>
                    <button
                      onClick={() => { if (confirm("Delete this activity?")) onDelete(activity.id); }}
                      className="shrink-0 rounded-md p-1 text-surface-300 hover:bg-red-50 hover:text-danger transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<FileText size={28} />}
          title="No activities yet"
          description="Log calls, emails, meetings, and notes for your leads."
          action={<Button onClick={() => setShowForm(true)} size="sm"><Plus size={16} /> Log Activity</Button>}
        />
      )}

      {/* Add Activity Modal */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title="Log Activity" size="sm">
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
          <Select
            label="Type"
            name="type"
            options={ACTIVITY_TYPE_OPTIONS.map((t) => ({ value: t.value, label: `${t.icon} ${t.label}` }))}
          />
          <Input label="Title" name="title" required placeholder="Had a discovery call" />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-surface-700">Notes (optional)</label>
            <textarea
              name="content"
              rows={3}
              placeholder="Details about this activity..."
              className="w-full rounded-lg border border-surface-200 bg-white px-3.5 py-2.5 text-sm placeholder:text-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit">Log Activity</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
