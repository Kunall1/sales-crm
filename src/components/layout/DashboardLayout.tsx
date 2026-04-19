"use client";

import { type ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/Primitives";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-50">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-surface-50">
      {/* Decorative backdrop */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-mesh opacity-60" />
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-[0.35]" />

      <Sidebar />

      {/* Main content — offset by sidebar width */}
      <main className="relative ml-60 min-h-screen">
        <div className="mx-auto max-w-7xl px-6 py-8 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
