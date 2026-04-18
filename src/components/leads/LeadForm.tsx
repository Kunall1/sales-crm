"use client";

import { useState, type FormEvent } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { STAGE_CONFIG, SOURCE_OPTIONS, type Lead, type LeadStage, type LeadSource } from "@/types";

interface LeadFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: LeadFormData) => Promise<void>;
  initialData?: Lead | null;
}

export interface LeadFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  job_title: string;
  stage: LeadStage;
  source: LeadSource;
  deal_value: number;
  probability: number;
  owner_name: string;
  next_action: string;
  next_action_date: string;
}

export default function LeadForm({ open, onClose, onSubmit, initialData }: LeadFormProps) {
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const data: LeadFormData = {
      first_name: fd.get("first_name") as string,
      last_name: fd.get("last_name") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
      company: fd.get("company") as string,
      job_title: fd.get("job_title") as string,
      stage: fd.get("stage") as LeadStage,
      source: fd.get("source") as LeadSource,
      deal_value: parseFloat(fd.get("deal_value") as string) || 0,
      probability: parseInt(fd.get("probability") as string) || 10,
      owner_name: fd.get("owner_name") as string,
      next_action: fd.get("next_action") as string,
      next_action_date: fd.get("next_action_date") as string,
    };
    await onSubmit(data);
    setSaving(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={initialData ? "Edit Lead" : "Add New Lead"} size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Contact Info */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-surface-500 uppercase tracking-wider">Contact Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" name="first_name" required defaultValue={initialData?.first_name || ""} placeholder="John" />
            <Input label="Last Name" name="last_name" defaultValue={initialData?.last_name || ""} placeholder="Doe" />
            <Input label="Email" name="email" type="email" defaultValue={initialData?.email || ""} placeholder="john@company.com" />
            <Input label="Phone" name="phone" type="tel" defaultValue={initialData?.phone || ""} placeholder="+91 98765 43210" />
            <Input label="Company" name="company" defaultValue={initialData?.company || ""} placeholder="Acme Corp" />
            <Input label="Job Title" name="job_title" defaultValue={initialData?.job_title || ""} placeholder="VP Sales" />
          </div>
        </div>

        {/* Pipeline Info */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-surface-500 uppercase tracking-wider">Pipeline Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Stage"
              name="stage"
              defaultValue={initialData?.stage || "new_lead"}
              options={STAGE_CONFIG.map((s) => ({ value: s.key, label: s.label }))}
            />
            <Select
              label="Source"
              name="source"
              defaultValue={initialData?.source || "other"}
              options={SOURCE_OPTIONS}
            />
            <Input label="Deal Value (₹)" name="deal_value" type="number" min="0" defaultValue={initialData?.deal_value || 0} />
            <Input label="Probability (%)" name="probability" type="number" min="0" max="100" defaultValue={initialData?.probability || 10} />
            <Input label="Lead Owner" name="owner_name" defaultValue={initialData?.owner_name || ""} placeholder="Sales rep name" />
          </div>
        </div>

        {/* Follow-up */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-surface-500 uppercase tracking-wider">Follow-up</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Next Action" name="next_action" defaultValue={initialData?.next_action || ""} placeholder="Schedule demo call" />
            <Input label="Next Action Date" name="next_action_date" type="date" defaultValue={initialData?.next_action_date || ""} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-surface-100">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : initialData ? "Update Lead" : "Add Lead"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
