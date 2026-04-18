"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import type { Lead, LeadInsert, LeadUpdate, LeadStage } from "@/types";
import { useAuth } from "@/context/AuthContext";

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();

  const fetchLeads = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) setLeads(data as Lead[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const addLead = async (lead: Omit<LeadInsert, "user_id">) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from("leads")
      .insert({ ...lead, user_id: user.id })
      .select()
      .single();

    if (!error && data) {
      setLeads((prev) => [data as Lead, ...prev]);
      return data as Lead;
    }
    return null;
  };

  const updateLead = async (id: string, updates: LeadUpdate) => {
    const { data, error } = await supabase
      .from("leads")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (!error && data) {
      setLeads((prev) => prev.map((l) => (l.id === id ? (data as Lead) : l)));
      return data as Lead;
    }
    return null;
  };

  const updateStage = async (id: string, stage: LeadStage) => {
    return updateLead(id, { stage });
  };

  const deleteLead = async (id: string) => {
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (!error) {
      setLeads((prev) => prev.filter((l) => l.id !== id));
      return true;
    }
    return false;
  };

  return { leads, loading, fetchLeads, addLead, updateLead, updateStage, deleteLead };
}
