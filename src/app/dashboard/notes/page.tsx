"use client";

import { useLeads } from "@/hooks/useLeads";
import { useActivities } from "@/hooks/useActivities";
import ActivityTimeline from "@/components/notes/ActivityTimeline";
import { Spinner } from "@/components/ui/Primitives";

export default function NotesPage() {
  const { leads, loading: leadsLoading } = useLeads();
  const { activities, loading: actLoading, addActivity, deleteActivity } = useActivities();

  if (leadsLoading || actLoading) return <Spinner />;

  return (
    <ActivityTimeline
      activities={activities}
      leads={leads}
      onAdd={addActivity}
      onDelete={deleteActivity}
    />
  );
}
