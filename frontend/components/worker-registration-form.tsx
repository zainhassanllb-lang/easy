"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { categories, cities, localities } from "@/lib/database"
import {
  Upload, Info, ImageIcon, Camera, X, Search,
  User, Mail, Lock, Phone, MessageCircle, MapPin,
  Briefcase, Shield, FileText, Loader2, Plus
} from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export function WorkerRegistrationForm() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    whatsapp: "",
    city: "",
    locality: [] as string[],
    category: "",
    experience: "",
    skills: "",
    about: "",
    cnicNumber: "",
    cnicFront: null as File | null,
    cnicBack: null as File | null,
    selfie: null as File | null,
    profileImage: null as File | null,
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [profilePreview, setProfilePreview] = useState<string>("")
  const [cnicFrontPreview, setCnicFrontPreview] = useState<string>("")
  const [cnicBackPreview, setCnicBackPreview] = useState<string>("")
  const [selfiePreview, setSelfiePreview] = useState<string>("")
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    cnicNumber: "",
  })

  const selfieInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    const checkWorkerProfile = async () => {
      try {
        const res = await fetch("/api/check-worker-profile")
        const data = await res.json()

        if (data.hasProfile && data.workerId) {
          setIsEditing(true)
          const profileRes = await fetch(`/api/workers/${data.workerId}`)
          const profileData = await profileRes.json()

          if (profileData.success && profileData.worker) {
            const w = profileData.worker
            setFormData({
              name: w.name || "",
              email: w.email || "",
              password: "",
              phone: w.phone || "",
              whatsapp: w.whatsapp || "",
              city: w.city || "",
              locality: Array.isArray(w.locality) ? w.locality : (w.locality ? [w.locality] : []),
              category: w.category || "",
              experience: w.experience ? String(w.experience) : "",
              skills: Array.isArray(w.skills) ? w.skills.join(", ") : w.skills || "",
              about: w.about || "",
              cnicNumber: w.cnicNumber || "",
              cnicFront: null,
              cnicBack: null,
              selfie: null,
              profileImage: null,
            })

            if (w.profileImage) setProfilePreview(w.profileImage)
            if (w.cnicImages && w.cnicImages[0]) setCnicFrontPreview(w.cnicImages[0])
            if (w.cnicImages && w.cnicImages[1]) setCnicBackPreview(w.cnicImages[1])
            if (w.selfieImage) setSelfiePreview(w.selfieImage)
          }
        }
      } catch (err) {
        console.error("Failed to check worker profile", err)
      }
    }

    checkWorkerProfile()
  }, [])


  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData({ ...formData, profileImage: file })
      setProfilePreview(URL.createObjectURL(file))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "cnicFront" | "cnicBack" | "selfie") => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData({ ...formData, [field]: file })

      if (field === "cnicFront") {
        setCnicFrontPreview(URL.createObjectURL(file))
      } else if (field === "cnicBack") {
        setCnicBackPreview(URL.createObjectURL(file))
      } else if (field === "selfie") {
        setSelfiePreview(URL.createObjectURL(file))
      }
    }
  }

  const handleLocalitySelect = (value: string) => {
    if (!formData.locality.includes(value)) {
      setFormData(prev => ({
        ...prev,
        locality: [...prev.locality, value]
      }))
    }
  }

  const removeLocality = (locToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      locality: prev.locality.filter((l) => l !== locToRemove)
    }))
  }

  // Validation functions (kept same)
  const validateName = (name: string) => {
    const nameRegex = /^[A-Za-z\s]+$/
    if (!name) return "Name is required"
    if (!nameRegex.test(name)) return "Name can only contain alphabets and spaces"
    return ""
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) return "Email is required"
    if (!emailRegex.test(email)) return "Please enter a valid email address"
    return ""
  }

  const validatePhone = (phone: string) => {
    const digitsOnly = phone.replace(/[^0-9]/g, "")
    if (!phone) return "Phone number is required"
    if (digitsOnly.length !== 11) return "Phone number must be exactly 11 digits"
    return ""
  }

  const validateCnic = (cnic: string) => {
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/
    if (!cnic) return "CNIC is required"
    if (!cnicRegex.test(cnic)) return "CNIC must be in format: 12345-1234567-1"
    return ""
  }

  const removeFile = (type: "cnicFront" | "cnicBack" | "selfie") => {
    if (type === "cnicFront") {
      setFormData({ ...formData, cnicFront: null })
      setCnicFrontPreview("")
    } else if (type === "cnicBack") {
      setFormData({ ...formData, cnicBack: null })
      setCnicBackPreview("")
    } else if (type === "selfie") {
      setFormData({ ...formData, selfie: null })
      setSelfiePreview("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setFieldErrors({ name: "", email: "", phone: "", whatsapp: "", cnicNumber: "" })

    const nameError = validateName(formData.name)
    const emailError = validateEmail(formData.email)
    const phoneError = validatePhone(formData.phone)
    const whatsappError = validatePhone(formData.whatsapp)
    const cnicError = validateCnic(formData.cnicNumber)

    if (nameError || emailError || phoneError || whatsappError || cnicError) {
      setFieldErrors({
        name: nameError,
        email: emailError,
        phone: phoneError,
        whatsapp: whatsappError,
        cnicNumber: cnicError,
      })
      setLoading(false)
      return
    }

    if (!isEditing && (!formData.cnicFront || !formData.cnicBack)) {
      setError("Please upload both front and back images of your CNIC")
      setLoading(false)
      return
    }

    if (!isEditing && !formData.selfie) {
      setError("Please upload a live selfie")
      setLoading(false)
      return
    }

    if (!formData.locality || formData.locality.length === 0) {
      setError("Please select at least one area")
      setLoading(false)
      return
    }

    setLoading(true)

    try {
      const fd = new FormData()
      fd.append("name", formData.name)
      fd.append("email", formData.email)
      fd.append("password", formData.password)
      fd.append("phone", formData.phone)
      fd.append("whatsapp", formData.whatsapp)
      fd.append("city", formData.city)
      formData.locality.forEach((loc) => {
        fd.append("locality", loc)
      })
      fd.append("category", formData.category)
      fd.append("experience", formData.experience)
      fd.append("skills", formData.skills)
      fd.append("about", formData.about)
      fd.append("cnicNumber", formData.cnicNumber)

      if (formData.cnicFront) fd.append("cnicFront", formData.cnicFront)
      if (formData.cnicBack) fd.append("cnicBack", formData.cnicBack)
      if (formData.selfie) fd.append("selfie", formData.selfie)
      if (formData.profileImage) fd.append("profileImage", formData.profileImage)

      const url = isEditing ? "/api/update-worker-profile" : "/api/register-worker"

      const response = await fetch(url, {
        method: "POST",
        body: fd,
        credentials: "include",
      })

      const result = await response.json()

      if (result.success) {
        router.push("/worker/dashboard")
        router.refresh()
      } else {
        setError(result.error || "Registration failed. Please try again.")
        setLoading(false)
      }
    } catch (err) {
      setError("Registration failed. Please try again.")
      setLoading(false)
    }
  }

  const cityLocalities = formData.city ? localities[formData.city] || [] : [];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 pb-10">

      {/* Header Profile Section */}
      <div className="flex flex-col items-center justify-center p-6 bg-muted/20 rounded-2xl border-2 border-dashed border-muted-foreground/10">
        <div className="relative group mb-4">
          <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
            <AvatarImage src={profilePreview || "/placeholder.svg"} className="object-cover" />
            <AvatarFallback className="text-4xl text-muted-foreground"><User className="h-12 w-12" /></AvatarFallback>
          </Avatar>
          <label
            htmlFor="profileImage"
            className="absolute bottom-1 right-1 p-2.5 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-all shadow-md ring-2 ring-background"
          >
            <Camera className="h-4 w-4" />
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              className="hidden"
            />
          </label>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold">{t("profileImage")}</h3>
          <p className="text-sm text-muted-foreground">Upload a professional photo to build trust</p>
        </div>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900 text-sm">{t("verificationPendingMsg")}</AlertDescription>
      </Alert>

      {/* Personal Details */}
      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="border-b bg-muted/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Personal Details</CardTitle>
              <CardDescription>Your contact information.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 grid gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold">{t("fullName")} <span className="text-destructive">*</span></Label>
            <div className="relative group">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === "" || /^[A-Za-z\s]+$/.test(value)) {
                    setFormData({ ...formData, name: value })
                    setFieldErrors({ ...fieldErrors, name: "" })
                  }
                }}
                onBlur={() => setFieldErrors({ ...fieldErrors, name: validateName(formData.name) })}
                placeholder="John Doe"
                className={`pl-10 h-12 ${fieldErrors.name ? "border-red-500" : ""}`}
                required
              />
            </div>
            {fieldErrors.name && <p className="text-sm text-destructive">{fieldErrors.name}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">{t("email")} <span className="text-destructive">*</span></Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value })
                    setFieldErrors({ ...fieldErrors, email: "" })
                  }}
                  onBlur={() => setFieldErrors({ ...fieldErrors, email: validateEmail(formData.email) })}
                  placeholder="you@example.com"
                  className={`pl-10 h-12 ${fieldErrors.email ? "border-red-500" : ""}`}
                  required
                />
              </div>
              {fieldErrors.email && <p className="text-sm text-destructive">{fieldErrors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold">{t("password")} {isEditing ? "" : <span className="text-destructive">*</span>}</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={isEditing ? "(Unchanged)" : "********"}
                  className="pl-10 h-12"
                  required={!isEditing}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">{t("phoneNumber")} <span className="text-destructive">*</span></Label>
              <div className="relative group">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "")
                    if (value.length <= 11) {
                      setFormData({ ...formData, phone: value })
                      setFieldErrors({ ...fieldErrors, phone: "" })
                    }
                  }}
                  onBlur={() => setFieldErrors({ ...fieldErrors, phone: validatePhone(formData.phone) })}
                  placeholder="03001234567"
                  className={`pl-10 h-12 ${fieldErrors.phone ? "border-red-500" : ""}`}
                  required
                />
              </div>
              {fieldErrors.phone && <p className="text-sm text-destructive">{fieldErrors.phone}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">{t("whatsappNumber")} <span className="text-destructive">*</span></Label>
              <div className="relative group">
                <MessageCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "")
                    if (value.length <= 11) {
                      setFormData({ ...formData, whatsapp: value })
                      setFieldErrors({ ...fieldErrors, whatsapp: "" })
                    }
                  }}
                  onBlur={() => setFieldErrors({ ...fieldErrors, whatsapp: validatePhone(formData.whatsapp) })}
                  placeholder="03001234567"
                  className={`pl-10 h-12 ${fieldErrors.whatsapp ? "border-red-500" : ""}`}
                  required
                />
              </div>
              {fieldErrors.whatsapp && <p className="text-sm text-destructive">{fieldErrors.whatsapp}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="about">{t("aboutYou")} <span className="text-destructive">*</span></Label>
            <Textarea
              id="about"
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              placeholder={t("aboutPlaceholder")}
              className="min-h-[100px] resize-none text-base"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="border-b bg-muted/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Professional Information</CardTitle>
              <CardDescription>Your work experience and skills.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">{t("serviceCategory")} <span className="text-destructive">*</span></Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={t("selectCategory")} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">{t("yearsOfExperience")} <span className="text-destructive">*</span></Label>
              <Input
                id="experience"
                type="number"
                min="0"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="5"
                className="h-12"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="city">{t("city")} <span className="text-destructive">*</span></Label>
              <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value, locality: [] })}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={t("selectCity")} />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.value} value={city.value}>{city.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="locality" className="text-sm font-semibold">{t("areaLocality")} <span className="text-destructive">*</span></Label>
              {/* Multi-select Dropdown UI */}
              <div className="space-y-3">
                <Select onValueChange={handleLocalitySelect} disabled={!formData.city}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder={formData.city ? "Select Areas" : "Select City First"} />
                  </SelectTrigger>
                  <SelectContent>
                    {cityLocalities.length > 0 ? (
                      cityLocalities.map((loc) => (
                        <SelectItem key={loc.value} value={loc.value} disabled={formData.locality.includes(loc.value)}>
                          {loc.label}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="custom" disabled>
                        {formData.city ? "No areas found" : "Select a city first"}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>

                {formData.locality.length > 0 && (
                  <div className="flex flex-wrap gap-2 min-h-[44px] p-3 bg-muted/10 rounded-lg border border-dashed border-muted-foreground/20">
                    {formData.locality.map((locValue: string) => {
                      const locLabel = cityLocalities.find(l => l.value === locValue)?.label || locValue;
                      return (
                        <Badge key={locValue} variant="outline" className="px-3 py-1 text-sm flex items-center gap-1.5 bg-background hover:bg-secondary/10">
                          <MapPin className="h-3 w-3 text-primary" />
                          {locLabel}
                          <button type="button" onClick={() => removeLocality(locValue)} className="hover:text-destructive transition-colors ml-1 p-0.5 rounded-full hover:bg-muted">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">{t("skills")} <span className="text-destructive">*</span></Label>
            <Input
              id="skills"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              placeholder={t("skillsPlaceholder")}
              className="h-12"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Identity Verification */}
      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="border-b bg-gradient-to-r from-primary/10 to-transparent pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg shadow-sm">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg text-primary">Identity Verification</CardTitle>
              <CardDescription>Required for verified badge.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <div className="space-y-2">
            <Label htmlFor="cnicNumber">{t("cnicNumber")} <span className="text-destructive">*</span></Label>
            <Input
              id="cnicNumber"
              value={formData.cnicNumber}
              onChange={(e) => {
                let val = e.target.value.replace(/\D/g, "")
                if (val.length > 5) val = val.slice(0, 5) + "-" + val.slice(5)
                if (val.length > 13) val = val.slice(0, 13) + "-" + val.slice(13)
                setFormData({ ...formData, cnicNumber: val.slice(0, 15) })
                setFieldErrors({ ...fieldErrors, cnicNumber: "" })
              }}
              onBlur={() => setFieldErrors({ ...fieldErrors, cnicNumber: validateCnic(formData.cnicNumber) })}
              placeholder="42101-1234567-1"
              className={`h-12 font-mono tracking-wide ${fieldErrors.cnicNumber ? "border-red-500" : ""}`}
              required
            />
            {fieldErrors.cnicNumber && <p className="text-sm text-destructive">{fieldErrors.cnicNumber}</p>}
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-semibold flex items-center gap-2">
              CNIC Images
              <span className="text-xs font-normal text-muted-foreground">(Front & Back)</span>
            </Label>

            <div className="space-y-6">
              {/* Front Image */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("cnicFront")}</span>
                <div className="border-2 border-dashed rounded-xl p-4 bg-muted/10 hover:bg-muted/30 transition-colors text-center">
                  <div className="relative aspect-video w-full bg-background rounded-lg overflow-hidden border shadow-inner mb-4 flex items-center justify-center">
                    {cnicFrontPreview ? (
                      <div className="relative w-full h-full">
                        <img src={cnicFrontPreview} alt="CNIC Front" className="h-full w-full object-contain" />
                        <button
                          type="button"
                          onClick={() => removeFile("cnicFront")}
                          className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
                        <FileText className="h-12 w-12" />
                        <span className="text-xs">No Front Image</span>
                      </div>
                    )}
                  </div>
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto shadow-sm">
                    <Upload className="mr-2 h-4 w-4" />
                    {cnicFrontPreview ? "Change Front Image" : t("uploadFront")}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "cnicFront")} />
                  </label>
                </div>
              </div>

              {/* Back Image */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("cnicBack")}</span>
                <div className="border-2 border-dashed rounded-xl p-4 bg-muted/10 hover:bg-muted/30 transition-colors text-center">
                  <div className="relative aspect-video w-full bg-background rounded-lg overflow-hidden border shadow-inner mb-4 flex items-center justify-center">
                    {cnicBackPreview ? (
                      <div className="relative w-full h-full">
                        <img src={cnicBackPreview} alt="CNIC Back" className="h-full w-full object-contain" />
                        <button
                          type="button"
                          onClick={() => removeFile("cnicBack")}
                          className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
                        <FileText className="h-12 w-12" />
                        <span className="text-xs">No Back Image</span>
                      </div>
                    )}
                  </div>
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto shadow-sm">
                    <Upload className="mr-2 h-4 w-4" />
                    {cnicBackPreview ? "Change Back Image" : t("uploadBack")}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "cnicBack")} />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <Label className="flex items-center gap-2 text-lg font-semibold">
              Live Selfie
              <Badge variant="destructive" className="text-[10px] h-5 rounded-sm px-1.5 uppercase tracking-wide">Required</Badge>
            </Label>
            <div className="border rounded-2xl p-6 bg-gradient-to-b from-muted/30 to-background text-center shadow-sm">
              <div className="relative aspect-[3/4] w-full max-w-[240px] mx-auto bg-black/5 rounded-xl overflow-hidden mb-6 border-4 border-background shadow-lg flex items-center justify-center">
                {selfiePreview ? (
                  <img src={selfiePreview} alt="Selfie" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
                    <div className="p-4 bg-background rounded-full shadow-sm">
                      <Camera className="h-8 w-8 text-primary/60" />
                    </div>
                    <span className="text-sm font-medium">No Selfie Yet</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="inline-flex w-full sm:w-auto cursor-pointer items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transform active:scale-95 transition-all">
                  <Camera className="mr-2 h-5 w-5" />
                  {selfiePreview ? "Retake Selfie" : "Take Live Selfie"}
                  <input
                    id="selfie"
                    ref={selfieInputRef}
                    type="file"
                    accept="image/*"
                    capture="user"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "selfie")}
                  />
                </label>
                <p className="text-xs text-muted-foreground mt-2">
                  Please ensure your face is clearly visible.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" size="lg" className="w-full h-14 text-lg font-medium shadow-xl hover:shadow-primary/25 rounded-xl transition-all hover:scale-[1.01]" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            {isEditing ? "Updating Profile..." : t("registering")}
          </>
        ) : (
          isEditing ? "Update Profile" : t("completeRegistration")
        )}
      </Button>
    </form>
  )
}
