"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import type { Followup } from "@/types";
import { useAuth } from "@/context/AuthContext";

export function useFollowups() {
  const [followups, setFollowups] = useState<Followup[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();

  const fetchFollowups = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("followups")
      .select("*, lead:leads(id, first_name, last_name, company, stage)")
      .eq("user_id", user.id)
      .order("due_date", { ascending: true });

    if (!error && data) setFollowups(data as Followup[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchFollowups();
  }, [fetchFollowups]);

  const addFollowup = async (
    lead_id: string,
    title: string,
    due_date: string,
    description?: string
  ) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from("followups")
      .insert({ lead_id, user_id: user.id, title, due_date, description })
      .select("*, lead:leads(id, first_name, last_name, company, stage)")
      .single();

    if (!error && data) {
      setFollowups((prev) => [...prev, data as Followup].sort(
        (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
      ));
      return data as Followup;
    }
    return null;
  };

  const toggleComplete = async (id: string, current: boolean) => {
    const { data, error } = await supabase
      .from("followups")
      .update({ is_completed: !current })
      .eq("id", id)
      .select("*, lead:leads(id, first_name, last_name, company, stage)")
      .single();

    if (!error && data) {
      setFollowups((prev) => prev.map((f) => (f.id === id ? (data as Followup) : f)));
    }
  };

  const deleteFollowup = async (id: string) => {
    const { error } = await supabase.from("followups").delete().eq("id", id);
    if (!error) setFollowups((prev) => prev.filter((f) => f.id !== id));
  };

  return { followups, loading, fetchFollowups, addFollowup, toggleComplete, deleteFollowup };
}
