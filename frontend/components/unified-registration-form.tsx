"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cities } from "@/lib/database";
import { useLanguage } from "@/components/language-provider";
import { GoogleAuthButton } from "@/components/google-auth-button";

export function UnifiedRegistrationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const router = useRouter();
  const { t } = useLanguage();

  const validateName = (name: string) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!name) return "Name is required";
    if (!nameRegex.test(name)) return "Name can only contain alphabets and spaces";
    return "";
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^(\+92|0|92)?[0-9]{11}$/;
    const digitsOnly = phone.replace(/[^0-9]/g, "");
    if (!phone) return "Phone number is required";
    if (digitsOnly.length !== 11) return "Phone number must be exactly 11 digits";
    if (!phoneRegex.test(phone)) return "Please enter a valid phone number";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({ name: "", email: "", phone: "" });

    // Validate all fields
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const phoneError = validatePhone(formData.phone);

    if (nameError || emailError || phoneError) {
      setFieldErrors({
        name: nameError,
        email: emailError,
        phone: phoneError,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register-customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const result = await response.json();

      if (result.success) {
        router.push("/login");
        router.refresh();
      } else {
        setError(result.error || "Registration failed");
        setLoading(false);
      }
    } catch (err) {
      setError("Registration failed");
      setLoading(false);
    }
  };

  const handleGoogleSuccess = () => {
    setLoading(false);
    router.push("/");
    router.refresh();
  };

  const handleGoogleError = (error: string) => {
    setError(error);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t("fullName")} *</Label>
          <Input
            id="name"
            placeholder="Ahmad Khan"
            value={formData.name}
            onChange={(e) => {
              const value = e.target.value;
              // Only allow alphabets and spaces
              if (value === "" || /^[A-Za-z\s]+$/.test(value)) {
                setFormData({ ...formData, name: value });
                setFieldErrors({ ...fieldErrors, name: "" });
              }
            }}
            onBlur={() => setFieldErrors({ ...fieldErrors, name: validateName(formData.name) })}
            required
            className={`h-12 ${fieldErrors.name ? "border-red-500" : ""}`}
          />
          {fieldErrors.name && (
            <p className="text-sm text-red-500">{fieldErrors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t("email")} *</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              setFieldErrors({ ...fieldErrors, email: "" });
            }}
            onBlur={() => setFieldErrors({ ...fieldErrors, email: validateEmail(formData.email) })}
            required
            className={`h-12 ${fieldErrors.email ? "border-red-500" : ""}`}
          />
          {fieldErrors.email && (
            <p className="text-sm text-red-500">{fieldErrors.email}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t("password")} *</Label>
        <Input
          id="password"
          type="password"
          placeholder="Create a strong password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
          className="h-12"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">{t("phoneNumber")} *</Label>
          <Input
            id="phone"
            placeholder="03001234567"
            value={formData.phone}
            onChange={(e) => {
              const value = e.target.value;
              // Only allow numbers and limit to 11 digits
              const digitsOnly = value.replace(/[^0-9]/g, "");
              if (digitsOnly.length <= 11) {
                setFormData({ ...formData, phone: digitsOnly });
                setFieldErrors({ ...fieldErrors, phone: "" });
              }
            }}
            onBlur={() => setFieldErrors({ ...fieldErrors, phone: validatePhone(formData.phone) })}
            required
            maxLength={11}
            className={`h-12 ${fieldErrors.phone ? "border-red-500" : ""}`}
          />
          {fieldErrors.phone && (
            <p className="text-sm text-red-500">{fieldErrors.phone}</p>
          )}
          <p className="text-xs text-muted-foreground">Enter 11 digit phone number (e.g., 03001234567)</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">{t("city")} *</Label>
          <Select
            value={formData.city}
            onValueChange={(value) => setFormData({ ...formData, city: value })}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder={t("selectCity")} />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city.value} value={city.value}>
                  {city.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full h-12" disabled={loading}>
        {loading ? t("creatingAccount") : t("createAccount")}
      </Button>

      <GoogleAuthButton mode="signup" onSuccess={handleGoogleSuccess} onError={handleGoogleError} />

    </form>
  );
}
