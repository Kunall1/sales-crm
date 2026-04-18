"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Zap } from "lucide-react";

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

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50 px-4">
        <div className="w-full max-w-sm rounded-2xl border border-surface-200/80 bg-white p-8 shadow-elevated text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-success-light text-success">
            <Zap size={24} />
          </div>
          <h2 className="text-lg font-bold text-surface-900 font-display">Check your email</h2>
          <p className="mt-2 text-sm text-surface-500">
            We&apos;ve sent a confirmation link. Click it to activate your account, then log in.
          </p>
          <Link href="/auth/login" className="mt-6 inline-block text-sm font-medium text-brand-600 hover:text-brand-700">
            Go to Login →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Zap size={24} />
          </div>
          <h1 className="text-2xl font-bold text-surface-900 font-display">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1.5 text-sm text-surface-500">
            {mode === "login"
              ? "Sign in to your SalesCRM dashboard"
              : "Start managing your sales pipeline today"}
          </p>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-surface-200/80 bg-white p-6 shadow-elevated">
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
              <div className="rounded-lg bg-danger-light px-3 py-2 text-sm text-danger-dark">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? mode === "login" ? "Signing in..." : "Creating account..."
                : mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>
        </div>

        {/* Toggle */}
        <p className="mt-5 text-center text-sm text-surface-500">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="font-medium text-brand-600 hover:text-brand-700">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/auth/login" className="font-medium text-brand-600 hover:text-brand-700">
                Sign in
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
