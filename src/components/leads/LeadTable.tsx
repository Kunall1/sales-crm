"use client";

import { useState } from "react";
import { cn, formatCurrency, timeAgo, getInitials } from "@/lib/utils";
import { Badge } from "@/components/ui/Primitives";
import { STAGE_CONFIG, type Lead } from "@/types";
import { Pencil, Trash2, Search, ArrowUpDown } from "lucide-react";

interface LeadTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onSelect: (lead: Lead) => void;
}

export default function LeadTable({ leads, onEdit, onDelete, onSelect }: LeadTableProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"created_at" | "deal_value" | "company">("created_at");

  const filtered = leads
    .filter((l) => {
      const q = search.toLowerCase();
      return (
        l.first_name.toLowerCase().includes(q) ||
        l.last_name.toLowerCase().includes(q) ||
        (l.company || "").toLowerCase().includes(q) ||
        (l.email || "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === "deal_value") return b.deal_value - a.deal_value;
      if (sortBy === "company") return (a.company || "").localeCompare(b.company || "");
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const getStageConfig = (stage: string) =>
    STAGE_CONFIG.find((s) => s.key === stage) || STAGE_CONFIG[0];

  // Rotating gradient palettes for lead avatars
  const AVATAR_GRADIENTS = [
    "from-brand-400 to-brand-600",
    "from-accent-400 to-accent-600",
    "from-emerald-400 to-emerald-600",
    "from-amber-400 to-amber-500",
    "from-rose-400 to-rose-600",
    "from-cyan-400 to-cyan-600",
    "from-violet-400 to-violet-600",
  ];

  const getAvatarGradient = (index: number) =>
    AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];

  return (
    <div>
      {/* Search & Sort Bar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-surface-200 bg-white/80 py-2.5 pl-10 pr-4 text-sm text-surface-800 shadow-[0_1px_0_0_rgb(255_255_255_/_0.5)_inset] placeholder:text-surface-400 transition-all hover:border-surface-300 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex items-center gap-2 rounded-xl border border-surface-200 bg-white px-3 py-2 text-sm shadow-card">
            <ArrowUpDown size={13} className="text-surface-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="appearance-none bg-transparent pr-1 text-sm font-medium text-surface-700 focus:outline-none"
            >
              <option value="created_at">Newest first</option>
              <option value="deal_value">Deal value</option>
              <option value="company">Company</option>
            </select>
          </div>
          <span className="rounded-full bg-surface-100 px-2.5 py-1 text-xs font-semibold text-surface-500">
            {filtered.length} {filtered.length === 1 ? "lead" : "leads"}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-surface-200/70 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-100/80 bg-surface-50/60">
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-surface-500">
                Name
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-surface-500 hidden sm:table-cell">
                Company
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-surface-500 hidden md:table-cell">
                Stage
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-surface-500 hidden lg:table-cell">
                Deal Value
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-surface-500 hidden lg:table-cell">
                Source
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-surface-500 hidden xl:table-cell">
                Added
              </th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-surface-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100/80">
            {filtered.map((lead, index) => {
              const stage = getStageConfig(lead.stage);
              return (
                <tr
                  key={lead.id}
                  onClick={() => onSelect(lead)}
                  className="group cursor-pointer transition-colors duration-150 hover:bg-brand-50/40"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white ring-2 ring-white",
                          getAvatarGradient(index)
                        )}
                      >
                        {getInitials(`${lead.first_name} ${lead.last_name}`)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-surface-900 truncate">
                          {lead.first_name} {lead.last_name}
                        </p>
                        <p className="text-xs text-surface-400 truncate">{lead.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-surface-600 hidden sm:table-cell">
                    {lead.company || <span className="text-surface-300">—</span>}
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <Badge color={stage.color} textColor={stage.textColor} dot>
                      {stage.label}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <span className="font-semibold tabular-nums text-surface-800">
                      {formatCurrency(lead.deal_value)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-surface-500 capitalize hidden lg:table-cell">
                    {lead.source.replace(/_/g, " ")}
                  </td>
                  <td className="px-5 py-3.5 text-surface-400 hidden xl:table-cell">
                    {timeAgo(lead.created_at)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div
                      className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => onEdit(lead)}
                        className="rounded-lg p-1.5 text-surface-400 transition-colors hover:bg-brand-50 hover:text-brand-600"
                        title="Edit lead"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this lead?")) onDelete(lead.id);
                        }}
                        className="rounded-lg p-1.5 text-surface-400 transition-colors hover:bg-danger-light hover:text-danger"
                        title="Delete lead"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-100 text-surface-400">
              <Search size={22} />
            </div>
            <p className="text-sm font-medium text-surface-600">
              {search ? "No leads match your search." : "No leads yet. Add your first one!"}
            </p>
            {search && (
              <p className="mt-1 text-xs text-surface-400">Try a different name, company, or email.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
