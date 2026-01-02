"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { GoogleAuthButton } from "@/components/google-auth-button";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleLogin = async (loginEmail: string, loginPassword: string) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Login failed" }));
        return { success: false, error: errorData.error || "Login failed" };
      }

      const result = await response.json();
      return result;
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setError("");
    setLoading(true);
    setEmail(demoEmail);
    setPassword(demoPassword);

    const result = await handleLogin(demoEmail, demoPassword);

    if (result.success && result.user) {
      if (result.user.role === "admin") {
        router.push("/admin/dashboard");
      } else if (result.user.role === "worker") {
        router.push("/worker/dashboard");
      } else if (result.user.role === "client") {
        router.push("/services");
      }
      router.refresh();
    } else {
      setError(result.error || "Login failed");
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await handleLogin(email, password);

    if (result.success && result.user) {
      if (result.user.role === "admin") {
        router.push("/admin/dashboard");
      } else if (result.user.role === "worker") {
        router.push("/worker/dashboard");
      } else if (result.user.role === "client") {
        router.push("/");
      }
      router.refresh();
    } else {
      setError(result.error || "Login failed");
      setLoading(false);
    }
  };

  const handleGoogleError = (error: string) => {
    setError(error);
    setLoading(false);
  };

  const handleGoogleSuccess = () => {
    setLoading(false);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pr-10 h-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Link href="/forgot-password" className="text-sm text-primary hover:underline">
          Forgot password?
        </Link>
      </div>

      <div className="flex items-center justify-between py-2">
        <Label
          htmlFor="remember"
          className="text-sm text-muted-foreground font-normal cursor-pointer"
        >
          Remember sign in details
        </Label>
        <Switch
          id="remember"
          checked={rememberMe}
          onCheckedChange={setRememberMe}
        />
      </div>

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full h-12 text-base"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Log in"}
      </Button>

      <GoogleAuthButton mode="signin" onSuccess={handleGoogleSuccess} onError={handleGoogleError} />

    </form>
  );
}
