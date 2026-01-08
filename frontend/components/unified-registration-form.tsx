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
import { User, Mail, Lock, Phone, MapPin } from "lucide-react";

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">{t("fullName")}</Label>
          <div className="relative group">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              id="name"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || /^[A-Za-z\s]+$/.test(value)) {
                  setFormData({ ...formData, name: value });
                  setFieldErrors({ ...fieldErrors, name: "" });
                }
              }}
              onBlur={() => setFieldErrors({ ...fieldErrors, name: validateName(formData.name) })}
              required
              className={`pl-10 h-10 ${fieldErrors.name ? "border-red-500" : ""}`}
            />
          </div>
          {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">{t("email")}</Label>
          <div className="relative group">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
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
              className={`pl-10 h-10 ${fieldErrors.email ? "border-red-500" : ""}`}
            />
          </div>
          {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">{t("password")}</Label>
        <div className="relative group">
          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            id="password"
            type="password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
            className="pl-10 h-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="phone">{t("phoneNumber")}</Label>
          <div className="relative group">
            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              id="phone"
              placeholder="03001234567"
              value={formData.phone}
              onChange={(e) => {
                const value = e.target.value;
                const digitsOnly = value.replace(/[^0-9]/g, "");
                if (digitsOnly.length <= 11) {
                  setFormData({ ...formData, phone: digitsOnly });
                  setFieldErrors({ ...fieldErrors, phone: "" });
                }
              }}
              onBlur={() => setFieldErrors({ ...fieldErrors, phone: validatePhone(formData.phone) })}
              required
              maxLength={11}
              className={`pl-10 h-10 ${fieldErrors.phone ? "border-red-500" : ""}`}
            />
          </div>
          {fieldErrors.phone && <p className="text-xs text-red-500 mt-1">{fieldErrors.phone}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="city">{t("city")}</Label>
          <Select
            value={formData.city}
            onValueChange={(value) => setFormData({ ...formData, city: value })}
          >
            <SelectTrigger className="h-10 pl-10 relative">
              <MapPin className="absolute left-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
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
        <div className="p-2 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full h-10" disabled={loading}>
        {loading ? t("creatingAccount") : t("createAccount")}
      </Button>

      <GoogleAuthButton mode="signup" onSuccess={handleGoogleSuccess} onError={handleGoogleError} />

    </form>
  );
}
