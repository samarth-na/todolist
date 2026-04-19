"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  EyeIcon,
  ViewOffIcon,
  Loading01Icon,
  AlertCircleIcon,
  CheckmarkCircle01Icon,
  CircleIcon,
} from "@hugeicons/core-free-icons";

type Requirement = {
  label: string;
  met: boolean;
};

function getPasswordRequirements(password: string): Requirement[] {
  return [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One lowercase letter", met: /[a-z]/.test(password) },
    { label: "One number", met: /\d/.test(password) },
    { label: "One special character", met: /[^a-zA-Z0-9]/.test(password) },
  ];
}

function getPasswordStrength(password: string): "weak" | "medium" | "strong" {
  const requirements = getPasswordRequirements(password);
  const met = requirements.filter((r) => r.met).length;
  if (met <= 2) return "weak";
  if (met <= 4) return "medium";
  return "strong";
}

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const requirements = useMemo(
    () => getPasswordRequirements(password),
    [password]
  );
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: signUpError } = await authClient.signUp.email({
        email,
        password,
        name,
      });
      if (signUpError) {
        setError(signUpError.message ?? "Sign up failed");
        setLoading(false);
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg flex min-h-screen items-center justify-center p-4">
      <div
        className={`w-full max-w-sm transition-all duration-700 ease-out ${
          mounted
            ? "translate-y-0 opacity-100"
            : "translate-y-3 opacity-0"
        }`}
      >
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight">Create account</h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Enter your details to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && (
            <div className="flex items-start gap-2.5 rounded-lg bg-destructive/10 px-3.5 py-3 text-sm text-destructive">
              <HugeiconsIcon icon={AlertCircleIcon} className="size-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              className="h-10"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="h-10"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                className="h-10 pr-10"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <HugeiconsIcon
                  icon={showPassword ? ViewOffIcon : EyeIcon}
                  className="size-4"
                />
              </button>
            </div>
            {password && (
              <div className="flex flex-col gap-2 pt-1">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {requirements.map((req) => (
                    <div key={req.label} className="flex items-center gap-1.5 text-xs">
                      <HugeiconsIcon
                        icon={req.met ? CheckmarkCircle01Icon : CircleIcon}
                        className={`size-3.5 shrink-0 ${
                          req.met
                            ? "text-foreground"
                            : "text-muted-foreground/50"
                        }`}
                      />
                      <span
                        className={
                          req.met
                            ? "text-foreground"
                            : "text-muted-foreground/70"
                        }
                      >
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button type="submit" disabled={loading} className="h-10 mt-2 w-full">
            {loading ? (
              <>
                <HugeiconsIcon
                  icon={Loading01Icon}
                  className="size-4 animate-spin"
                />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground pt-2">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-foreground font-medium underline underline-offset-4 hover:no-underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
