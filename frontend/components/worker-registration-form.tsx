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
    skills: [] as string[],
    about: "",
    cnicNumber: "",
    cnicFront: null as File | null,
    cnicBack: null as File | null,
    selfie: null as File | null,
    profileImage: null as File | null,
  })

  // State for new skill input
  const [newSkill, setNewSkill] = useState("")
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
              skills: Array.isArray(w.skills) ? w.skills : (w.skills ? w.skills.split(",").map((s: string) => s.trim()) : []),
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

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove)
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

  const validateExperience = (exp: string) => {
    if (!exp) return "Experience is required"
    const val = Number(exp)
    if (isNaN(val) || val < 0) return "Please enter a valid number of years"
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
      formData.skills.forEach((skill) => {
        fd.append("skills", skill)
      })
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
    <form onSubmit={handleSubmit} className="min-h-screen bg-muted/5 pb-20">
      {/* Header / Profile Image Section - Refined to match Edit Profile */}
      <div className="relative mb-6 bg-background border-b shadow-sm">
        <div className="h-32 w-full bg-gradient-to-r from-primary/90 to-primary/70 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        </div>
        <div className="container max-w-3xl mx-auto px-4 relative -mt-16 pb-4 flex flex-col items-center text-center">
          <div className="relative group">
            <Avatar className="h-32 w-32 border-4 border-background shadow-xl ring-4 ring-primary/5">
              <AvatarImage src={profilePreview} className="object-cover" />
              <AvatarFallback className="text-4xl font-bold text-primary/20 bg-muted">{formData.name?.charAt(0) || "W"}</AvatarFallback>
            </Avatar>
            <label
              htmlFor="profile-image"
              className="absolute bottom-1 right-1 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 hover:scale-105 transition-all shadow-lg ring-4 ring-background"
            >
              <Camera className="h-4 w-4" />
              <input id="profile-image" type="file" accept="image/*" className="hidden" onChange={handleProfileImageChange} />
            </label>
          </div>
          <h2 className="text-2xl font-bold mt-3 tracking-tight text-foreground">{formData.name || t("profileImage")}</h2>
          <Badge variant="secondary" className="mt-1 px-3 py-0.5 text-xs font-medium uppercase tracking-wide">
            {formData.category ? categories.find(c => c.slug === formData.category)?.name : t("serviceCategory")}
          </Badge>
        </div>
      </div>

      <div className="container max-w-3xl mx-auto px-4 flex flex-col gap-8">
        <Alert className="bg-blue-50 border-blue-500 py-2 flex items-center gap-3 shadow-sm rounded-xl">
          <Info className="h-4 w-4 text-blue-600 flex-shrink-0" />
          <AlertDescription className="text-blue-900 text-xs font-semibold leading-none">
            Your profile is under review by our admin team. Once verified, you can purchase a package to make your profile visible to customers.
          </AlertDescription>
        </Alert>

        {/* Personal Details */}
        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="border-b bg-muted/30 py-3 px-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Personal Details</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 grid gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold">{t("fullName")} <span className="text-destructive">*</span></Label>
              <div className="relative group">
                <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
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
                  className={`pl-10 h-10 text-sm ${fieldErrors.name ? "border-red-500" : ""}`}
                  required
                />
              </div>
              {fieldErrors.name && <p className="text-xs text-destructive">{fieldErrors.name}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold">{t("email")} <span className="text-destructive">*</span></Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
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
                    className={`pl-10 h-10 text-sm ${fieldErrors.email ? "border-red-500" : ""}`}
                    required
                  />
                </div>
                {fieldErrors.email && <p className="text-xs text-destructive">{fieldErrors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold">{t("password")} {isEditing ? "" : <span className="text-destructive">*</span>}</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={isEditing ? "(Unchanged)" : "********"}
                    className="pl-10 h-10 text-sm"
                    required={!isEditing}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-semibold">{t("phoneNumber")} <span className="text-destructive">*</span></Label>
                <div className="relative group">
                  <Phone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
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
                    className={`pl-10 h-10 text-sm ${fieldErrors.phone ? "border-red-500" : ""}`}
                    required
                  />
                </div>
                {fieldErrors.phone && <p className="text-xs text-destructive">{fieldErrors.phone}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="whatsapp" className="text-xs font-semibold">{t("whatsappNumber")} <span className="text-destructive">*</span></Label>
                <div className="relative group">
                  <MessageCircle className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
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
                    className={`pl-10 h-10 text-sm ${fieldErrors.whatsapp ? "border-red-500" : ""}`}
                    required
                  />
                </div>
                {fieldErrors.whatsapp && <p className="text-xs text-destructive">{fieldErrors.whatsapp}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="about" className="text-xs font-semibold">{t("aboutYou")} <span className="text-destructive">*</span></Label>
              <Textarea
                id="about"
                value={formData.about}
                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                placeholder={t("aboutPlaceholder")}
                className="min-h-[80px] resize-none text-sm"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="border-b bg-muted/30 py-3 px-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <Briefcase className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Professional Information</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="category" className="text-xs font-semibold">{t("serviceCategory")} <span className="text-destructive">*</span></Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger className="h-10 text-sm">
                    <SelectValue placeholder={t("selectCategory")} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.slug} className="text-sm">{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="experience" className="text-xs font-semibold">{t("yearsOfExperience")} <span className="text-destructive">*</span></Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="5"
                  className="h-10 text-sm"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="city" className="text-xs font-semibold">{t("city")} <span className="text-destructive">*</span></Label>
                <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value, locality: [] })}>
                  <SelectTrigger className="h-10 text-sm">
                    <SelectValue placeholder={t("selectCity")} />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.value} value={city.value} className="text-sm">{city.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Localities - Made full width and more spacious */}
            <div className="space-y-2">
              <Label htmlFor="locality" className="text-xs font-semibold">{t("areaLocality")} <span className="text-destructive">*</span></Label>
              <div className="space-y-3">
                <Select onValueChange={handleLocalitySelect} disabled={!formData.city}>
                  <SelectTrigger className="h-11 text-sm bg-background border-slate-200 shadow-sm">
                    <SelectValue placeholder={formData.city ? "Search and Select Areas to Add" : "Select City First"} />
                  </SelectTrigger>
                  <SelectContent>
                    {cityLocalities.length > 0 ? (
                      cityLocalities.map((loc) => (
                        <SelectItem key={loc.value} value={loc.value} disabled={formData.locality.includes(loc.value)} className="text-sm">
                          {loc.label}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="custom" disabled className="text-sm">
                        {formData.city ? "No areas found" : "Select a city first"}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>

                <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 min-h-[70px]">
                  {formData.locality.length === 0 && (
                    <div className="flex flex-col items-center justify-center w-full py-2 text-muted-foreground/60">
                      <MapPin className="h-5 w-5 opacity-20 mb-1" />
                      <span className="text-xs italic">No service areas selected yet</span>
                    </div>
                  )}
                  {formData.locality.map((locValue: string) => {
                    const locLabel = cityLocalities.find(l => l.value === locValue)?.label || locValue;
                    return (
                      <Badge key={locValue} variant="outline" className="px-3 py-1.5 text-xs font-medium flex items-center gap-2 bg-white border-slate-200 shadow-sm hover:border-primary/50 transition-all">
                        <MapPin className="h-3 w-3 text-primary" />
                        {locLabel}
                        <button type="button" onClick={() => removeLocality(locValue)} className="hover:text-destructive transition-colors ml-1 p-0.5 rounded-full hover:bg-slate-100">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Skills - Enhanced Prominence */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">{t("skills")} <span className="text-destructive">*</span></Label>
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder={t("skillsPlaceholder")}
                  className="h-11 text-sm bg-background border-slate-200"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }}
                />
                <Button type="button" onClick={addSkill} variant="default" className="h-11 px-6 flex-shrink-0 shadow-md">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-3 p-4 bg-primary/[0.03] rounded-xl border border-primary/10 min-h-[70px]">
                {formData.skills.length === 0 && (
                  <div className="flex flex-col items-center justify-center w-full py-2 text-muted-foreground/60">
                    <Briefcase className="h-5 w-5 opacity-20 mb-1" />
                    <span className="text-xs italic">Add your professional skills above</span>
                  </div>
                )}
                {formData.skills.map((skill: string) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1.5 text-xs font-semibold flex items-center gap-2 bg-white text-slate-700 hover:bg-primary/5 border border-slate-200 shadow-sm transition-all">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="hover:text-destructive transition-colors ml-1 p-0.5 rounded-full hover:bg-slate-100">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Identity Verification */}
        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="border-b bg-muted/30 py-3 px-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/20 rounded-lg">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base text-primary">Identity Verification</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="cnicNumber" className="text-xs font-semibold">{t("cnicNumber")} <span className="text-destructive">*</span></Label>
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
                className={`h-10 font-mono text-sm tracking-wide ${fieldErrors.cnicNumber ? "border-red-500" : ""}`}
                required
              />
              {fieldErrors.cnicNumber && <p className="text-xs text-destructive">{fieldErrors.cnicNumber}</p>}
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold flex items-center gap-2">
                CNIC Images
                <span className="text-[10px] font-normal text-muted-foreground uppercase">(Front & Back)</span>
              </Label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Front Image */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase">{t("cnicFront")}</span>
                  <div className="border-2 border-dashed rounded-xl p-3 bg-muted/10 hover:bg-muted/30 transition-colors text-center">
                    <div className="relative aspect-video w-full bg-background rounded-lg overflow-hidden border mb-3 flex items-center justify-center">
                      {cnicFrontPreview ? (
                        <div className="relative w-full h-full">
                          <img src={cnicFrontPreview} alt="CNIC Front" className="h-full w-full object-contain" />
                          <button
                            type="button"
                            onClick={() => removeFile("cnicFront")}
                            className="absolute top-1.5 right-1.5 p-1 bg-destructive text-destructive-foreground rounded-full"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <FileText className="h-8 w-8 text-muted-foreground/30" />
                      )}
                    </div>
                    <label className="inline-flex cursor-pointer items-center justify-center rounded-md text-xs font-medium h-8 px-3 bg-primary text-primary-foreground hover:bg-primary/90 w-full shadow-sm">
                      <Upload className="mr-1.5 h-3 w-3" />
                      {cnicFrontPreview ? "Change" : t("uploadFront")}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "cnicFront")} />
                    </label>
                  </div>
                </div>

                {/* Back Image */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase">{t("cnicBack")}</span>
                  <div className="border-2 border-dashed rounded-xl p-3 bg-muted/10 hover:bg-muted/30 transition-colors text-center">
                    <div className="relative aspect-video w-full bg-background rounded-lg overflow-hidden border mb-3 flex items-center justify-center">
                      {cnicBackPreview ? (
                        <div className="relative w-full h-full">
                          <img src={cnicBackPreview} alt="CNIC Back" className="h-full w-full object-contain" />
                          <button
                            type="button"
                            onClick={() => removeFile("cnicBack")}
                            className="absolute top-1.5 right-1.5 p-1 bg-destructive text-destructive-foreground rounded-full"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <FileText className="h-8 w-8 text-muted-foreground/30" />
                      )}
                    </div>
                    <label className="inline-flex cursor-pointer items-center justify-center rounded-md text-xs font-medium h-8 px-3 bg-primary text-primary-foreground hover:bg-primary/90 w-full shadow-sm">
                      <Upload className="mr-1.5 h-3 w-3" />
                      {cnicBackPreview ? "Change" : t("uploadBack")}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "cnicBack")} />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t">
              <Label className="flex items-center gap-2 text-sm font-semibold">
                Selfie
                <Badge variant="destructive" className="text-[10px] h-4 rounded-sm px-1 uppercase">Req</Badge>
              </Label>
              <div className="flex items-center gap-4 border rounded-xl p-4 bg-muted/5 shadow-sm">
                <div className="relative h-20 w-16 bg-black/5 rounded-lg overflow-hidden border-2 border-background shadow-md flex-shrink-0 flex items-center justify-center">
                  {selfiePreview ? (
                    <img src={selfiePreview} alt="Selfie" className="h-full w-full object-cover" />
                  ) : (
                    <Camera className="h-6 w-6 text-muted-foreground/30" />
                  )}
                </div>
                <div className="space-y-1 flex-1">
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-md text-xs font-medium h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all border-none outline-none">
                    <Camera className="mr-1.5 h-4 w-4" />
                    {selfiePreview ? "Retake" : "Take Selfie"}
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
                  <p className="text-[10px] text-muted-foreground">Clear facial view required.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="py-2 shadow-sm rounded-xl">
            <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full h-12 text-base font-bold shadow-lg rounded-xl transition-all" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Updating..." : "Registering..."}
            </>
          ) : (
            isEditing ? "Update Profile" : "Complete Registration"
          )}
        </Button>
      </div>
    </form>
  )
}
