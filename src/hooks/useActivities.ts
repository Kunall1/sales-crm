"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import type { Activity, ActivityType } from "@/types";
import { useAuth } from "@/context/AuthContext";

export function useActivities(leadId?: string) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();

  const fetchActivities = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    let query = supabase
      .from("activities")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (leadId) query = query.eq("lead_id", leadId);

    const { data, error } = await query.limit(50);
    if (!error && data) setActivities(data as Activity[]);
    setLoading(false);
  }, [user, leadId]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const addActivity = async (
    lead_id: string,
    type: ActivityType,
    title: string,
    content?: string
  ) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from("activities")
      .insert({ lead_id, user_id: user.id, type, title, content })
      .select()
      .single();

    if (!error && data) {
      setActivities((prev) => [data as Activity, ...prev]);
      return data as Activity;
    }
    return null;
  };

  const deleteActivity = async (id: string) => {
    const { error } = await supabase.from("activities").delete().eq("id", id);
    if (!error) setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  return { activities, loading, fetchActivities, addActivity, deleteActivity };
}
