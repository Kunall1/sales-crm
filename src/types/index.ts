// ─── Lead ──────────────────────────────────────────────
export type LeadStage =
  | "new_lead"
  | "contacted"
  | "qualified"
  | "demo_scheduled"
  | "proposal_sent"
  | "closed_won"
  | "closed_lost";

export type LeadSource =
  | "website"
  | "referral"
  | "linkedin"
  | "cold_call"
  | "email_campaign"
  | "event"
  | "partner"
  | "other";

export interface Lead {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  job_title: string | null;
  stage: LeadStage;
  source: LeadSource;
  deal_value: number;
  probability: number;
  owner_name: string | null;
  next_action: string | null;
  next_action_date: string | null;
  created_at: string;
  updated_at: string;
}

export type LeadInsert = Omit<Lead, "id" | "created_at" | "updated_at">;
export type LeadUpdate = Partial<LeadInsert>;

// ─── Activity / Notes ──────────────────────────────────
export type ActivityType =
  | "note"
  | "call"
  | "email"
  | "meeting"
  | "demo"
  | "status_change"
  | "deal_update";

export interface Activity {
  id: string;
  lead_id: string;
  user_id: string;
  type: ActivityType;
  title: string;
  content: string | null;
  created_at: string;
}

// ─── Follow-up ─────────────────────────────────────────
export interface Followup {
  id: string;
  lead_id: string;
  user_id: string;
  title: string;
  description: string | null;
  due_date: string;
  is_completed: boolean;
  created_at: string;
  lead?: Lead;           // joined
}

// ─── Profile ───────────────────────────────────────────
export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  role: "admin" | "member";
  created_at: string;
  updated_at: string;
}

// ─── Pipeline stage config ─────────────────────────────
export interface StageConfig {
  key: LeadStage;
  label: string;
  color: string;        // tailwind bg class
  textColor: string;    // tailwind text class
}

export const STAGE_CONFIG: StageConfig[] = [
  { key: "new_lead",       label: "New Lead",       color: "bg-blue-100",    textColor: "text-blue-700" },
  { key: "contacted",      label: "Contacted",      color: "bg-indigo-100",  textColor: "text-indigo-700" },
  { key: "qualified",      label: "Qualified",      color: "bg-violet-100",  textColor: "text-violet-700" },
  { key: "demo_scheduled", label: "Demo Scheduled", color: "bg-amber-100",   textColor: "text-amber-700" },
  { key: "proposal_sent",  label: "Proposal Sent",  color: "bg-orange-100",  textColor: "text-orange-700" },
  { key: "closed_won",     label: "Closed Won",     color: "bg-emerald-100", textColor: "text-emerald-700" },
  { key: "closed_lost",    label: "Closed Lost",    color: "bg-red-100",     textColor: "text-red-700" },
];

export const SOURCE_OPTIONS: { value: LeadSource; label: string }[] = [
  { value: "website",        label: "Website" },
  { value: "referral",       label: "Referral" },
  { value: "linkedin",       label: "LinkedIn" },
  { value: "cold_call",      label: "Cold Call" },
  { value: "email_campaign", label: "Email Campaign" },
  { value: "event",          label: "Event" },
  { value: "partner",        label: "Partner" },
  { value: "other",          label: "Other" },
];

export const ACTIVITY_TYPE_OPTIONS: { value: ActivityType; label: string; icon: string }[] = [
  { value: "note",          label: "Note",          icon: "📝" },
  { value: "call",          label: "Phone Call",    icon: "📞" },
  { value: "email",         label: "Email",         icon: "✉️" },
  { value: "meeting",       label: "Meeting",       icon: "🤝" },
  { value: "demo",          label: "Demo",          icon: "🖥️" },
  { value: "status_change", label: "Status Change", icon: "🔄" },
  { value: "deal_update",   label: "Deal Update",   icon: "💰" },
];
