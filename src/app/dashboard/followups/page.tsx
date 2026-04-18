"use client";

import { useLeads } from "@/hooks/useLeads";
import { useFollowups } from "@/hooks/useFollowups";
import FollowupList from "@/components/followups/FollowupList";
import { Spinner } from "@/components/ui/Primitives";

export default function FollowupsPage() {
  const { leads, loading: leadsLoading } = useLeads();
  const { followups, loading: fuLoading, addFollowup, toggleComplete, deleteFollowup } = useFollowups();

  if (leadsLoading || fuLoading) return <Spinner />;

  return (
    <FollowupList
      followups={followups}
      leads={leads}
      onAdd={addFollowup}
      onToggle={toggleComplete}
      onDelete={deleteFollowup}
    />
  );
}
