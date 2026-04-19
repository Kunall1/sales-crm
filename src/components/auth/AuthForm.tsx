"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Zap, Mail, ArrowRight, Sparkles } from "lucide-react";

interface AuthFormProps {
  mode: "login" | "signup";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const email = fd.get("email") as string;
    const password = fd.get("password") as string;

    if (mode === "signup") {
      const fullName = fd.get("full_name") as string;
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (err) {
        setError(err.message);
      } else {
        setSuccess(true);
      }
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        setError(err.message);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    }

    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-50 px-4">
      {/* Decorative gradient mesh */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-auth" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />

      {/* Floating blur blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-brand-400/20 blur-3xl animate-float" />
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-accent-400/20 blur-3xl animate-float"
        style={{ animationDelay: "2s" }}
      />

      {success ? (
        <div className="relative z-10 w-full max-w-sm animate-slide-up">
          <div className="rounded-2xl border border-white/60 bg-white/90 p-8 text-center shadow-float backdrop-blur-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-success-light text-success-dark ring-4 ring-success/10">
              <Mail size={26} />
            </div>
            <h2 className="text-xl font-bold text-surface-900 font-display tracking-tight">
              Check your email
            </h2>
            <p className="mt-2 text-sm text-surface-500">
              We&apos;ve sent a confirmation link. Click it to activate your account, then log in.
            </p>
            <Link
              href="/auth/login"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
            >
              Go to login <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="relative z-10 w-full max-w-sm animate-slide-up">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-[0_8px_24px_-6px_rgb(37_71_245_/_0.5)] ring-1 ring-white/20">
              <Zap size={26} strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-bold text-surface-900 font-display tracking-tight">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-2 text-sm text-surface-500">
              {mode === "login"
                ? "Sign in to your SalesCRM dashboard"
                : "Start managing your sales pipeline today"}
            </p>
          </div>

          {/* Form card */}
          <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-float backdrop-blur-xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <Input label="Full Name" name="full_name" required placeholder="Your full name" />
              )}
              <Input label="Email" name="email" type="email" required placeholder="you@company.com" />
              <Input
                label="Password"
                name="password"
                type="password"
                required
                minLength={6}
                placeholder={mode === "signup" ? "Min 6 characters" : "Your password"}
              />

              {error && (
                <div className="rounded-lg border border-danger/20 bg-danger-light px-3 py-2.5 text-sm font-medium text-danger-dark animate-fade-in">
                  {error}
                </div>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    {mode === "login" ? "Signing in..." : "Creating account..."}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {mode === "login" ? "Sign in" : "Create account"}
                    <ArrowRight size={16} />
                  </span>
                )}
              </Button>
            </form>
          </div>

          {/* Toggle */}
          <p className="mt-6 text-center text-sm text-surface-500">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <Link href="/auth/signup" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link href="/auth/login" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                  Sign in
                </Link>
              </>
            )}
          </p>

          {/* Trust line */}
          <div className="mt-8 flex items-center justify-center gap-1.5 text-xs text-surface-400">
            <Sparkles size={12} className="text-accent-500" />
            <span>Built for modern sales teams</span>
          </div>
        </div>
      )}
    </div>
  );
}
