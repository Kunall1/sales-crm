"use client";

import { useState } from "react";
import { cn, formatCurrency, timeAgo } from "@/lib/utils";
import { Badge } from "@/components/ui/Primitives";
import { STAGE_CONFIG, type Lead } from "@/types";
import { Pencil, Trash2, Search, ChevronDown } from "lucide-react";

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

  return (
    <div>
      {/* Search & Sort Bar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-surface-200 bg-white py-2 pl-9 pr-3 text-sm text-surface-800 placeholder:text-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-surface-500">
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="rounded-md border border-surface-200 bg-white px-2 py-1.5 text-sm text-surface-700 focus:outline-none"
          >
            <option value="created_at">Newest</option>
            <option value="deal_value">Deal Value</option>
            <option value="company">Company</option>
          </select>
          <span className="text-surface-400">{filtered.length} leads</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-surface-200/80 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-100 bg-surface-50/50">
              <th className="px-4 py-3 text-left font-medium text-surface-500">Name</th>
              <th className="px-4 py-3 text-left font-medium text-surface-500 hidden sm:table-cell">Company</th>
              <th className="px-4 py-3 text-left font-medium text-surface-500 hidden md:table-cell">Stage</th>
              <th className="px-4 py-3 text-left font-medium text-surface-500 hidden lg:table-cell">Deal Value</th>
              <th className="px-4 py-3 text-left font-medium text-surface-500 hidden lg:table-cell">Source</th>
              <th className="px-4 py-3 text-left font-medium text-surface-500 hidden xl:table-cell">Added</th>
              <th className="px-4 py-3 text-right font-medium text-surface-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {filtered.map((lead) => {
              const stage = getStageConfig(lead.stage);
              return (
                <tr
                  key={lead.id}
                  onClick={() => onSelect(lead)}
                  className="cursor-pointer transition-colors hover:bg-surface-50"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-surface-900">{lead.first_name} {lead.last_name}</p>
                      <p className="text-xs text-surface-400">{lead.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-surface-600 hidden sm:table-cell">{lead.company || "—"}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <Badge color={stage.color} textColor={stage.textColor}>{stage.label}</Badge>
                  </td>
                  <td className="px-4 py-3 font-medium text-surface-800 hidden lg:table-cell">
                    {formatCurrency(lead.deal_value)}
                  </td>
                  <td className="px-4 py-3 text-surface-500 capitalize hidden lg:table-cell">
                    {lead.source.replace("_", " ")}
                  </td>
                  <td className="px-4 py-3 text-surface-400 hidden xl:table-cell">{timeAgo(lead.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onEdit(lead)}
                        className="rounded-md p-1.5 text-surface-400 hover:bg-surface-100 hover:text-brand-600 transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => { if (confirm("Delete this lead?")) onDelete(lead.id); }}
                        className="rounded-md p-1.5 text-surface-400 hover:bg-red-50 hover:text-danger transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-surface-400">
            {search ? "No leads match your search." : "No leads yet. Add your first one!"}
          </div>
        )}
      </div>
    </div>
  );
}
