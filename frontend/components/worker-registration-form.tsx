"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { categories, cities, localities } from "@/lib/database"
import { Upload, Info, ImageIcon, Camera, X, Search } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/components/language-provider"
import { useEffect } from "react"

export function WorkerRegistrationForm() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    whatsapp: "",
    city: "", // Start empty - worker must select city first
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
  const [areaSearch, setAreaSearch] = useState("")
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    cnicNumber: "",
  })
  const selfieInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const checkWorkerProfile = async () => {
      try {
        const res = await fetch("/api/check-worker-profile")
        const data = await res.json()

        if (data.hasProfile && data.workerId) {
          setIsEditing(true)
          // Fetch full profile details
          const profileRes = await fetch(`/api/workers/${data.workerId}`)
          const profileData = await profileRes.json()

          if (profileData.success && profileData.worker) {
            const w = profileData.worker
            setFormData({
              name: w.name || "",
              email: w.email || "",
              password: "", // Don't pre-fill password
              phone: w.phone || "",
              whatsapp: w.whatsapp || "",
              city: w.city || "",
              locality: Array.isArray(w.locality) ? w.locality : w.locality ? [w.locality] : [],
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

            // Set previews if images exist
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

  const { t } = useLanguage()

  const handleLocalityToggle = (localityValue: string) => {
    setFormData((prev) => {
      const currentLocalities = prev.locality || []
      if (currentLocalities.includes(localityValue)) {
        return { ...prev, locality: currentLocalities.filter((l) => l !== localityValue) }
      } else {
        return { ...prev, locality: [...currentLocalities, localityValue] }
      }
    })
  }

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

      // Set previews
      if (field === "cnicFront") {
        setCnicFrontPreview(URL.createObjectURL(file))
      } else if (field === "cnicBack") {
        setCnicBackPreview(URL.createObjectURL(file))
      } else if (field === "selfie") {
        setSelfiePreview(URL.createObjectURL(file))
      }
    }
  }

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

    // Validate all fields
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
      // ✅ Use FormData so files can be uploaded
      const fd = new FormData()
      fd.append("name", formData.name)
      fd.append("email", formData.email)
      fd.append("password", formData.password)
      fd.append("phone", formData.phone)
      fd.append("whatsapp", formData.whatsapp)
      fd.append("city", formData.city)
      // Append localities as array
      formData.locality.forEach((loc) => {
        fd.append("locality", loc)
      })
      fd.append("category", formData.category)
      fd.append("experience", formData.experience) // keep as string
      fd.append("skills", formData.skills)
      fd.append("about", formData.about)
      fd.append("cnicNumber", formData.cnicNumber)

      // ✅ required files
      fd.append("cnicFront", formData.cnicFront)
      fd.append("cnicBack", formData.cnicBack)
      fd.append("selfie", formData.selfie)

      // ✅ optional profile image
      if (formData.profileImage) {
        fd.append("profileImage", formData.profileImage)
      }

      const url = isEditing ? "/api/update-worker-profile" : "/api/register-worker"

      const response = await fetch(url, {
        method: "POST",
        body: fd, // ✅ No headers
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900 text-sm">{t("verificationPendingMsg")}</AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label>{t("profileImage")}</Label>
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-muted border-2 border-border">
            {profilePreview ? (
              <Image src={profilePreview || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
          </div>

          <Card className="flex-1 border-2 border-dashed hover:border-primary transition-colors">
            <label htmlFor="profileImage" className="flex items-center justify-center gap-2 p-4 cursor-pointer">
              <Upload className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {formData.profileImage ? formData.profileImage.name : t("uploadProfilePicture")}
              </span>
              <Input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden"
              />
            </label>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            {t("fullName")} {t("required")}
          </Label>
          <Input
            id="name"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => {
              const value = e.target.value
              // Only allow alphabets and spaces
              if (value === "" || /^[A-Za-z\s]+$/.test(value)) {
                setFormData({ ...formData, name: value })
                setFieldErrors({ ...fieldErrors, name: "" })
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
          <Label htmlFor="email">
            {t("email")} {t("required")}
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value })
              setFieldErrors({ ...fieldErrors, email: "" })
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
        <Label htmlFor="password">
          {t("password")} {isEditing ? "(Leave blank to keep current)" : t("required")}
        </Label>
        <Input
          id="password"
          type="password"
          placeholder={isEditing ? "Leave blank to keep current" : "Create a strong password"}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required={!isEditing}
          className="h-12"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">
            {t("phoneNumber")} {t("required")}
          </Label>
          <Input
            id="phone"
            placeholder="03001234567"
            value={formData.phone}
            onChange={(e) => {
              const value = e.target.value
              const digitsOnly = value.replace(/[^0-9]/g, "")
              if (digitsOnly.length <= 11) {
                setFormData({ ...formData, phone: digitsOnly })
                setFieldErrors({ ...fieldErrors, phone: "" })
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
          <p className="text-xs text-muted-foreground">Enter 11 digit phone number</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp">
            {t("whatsappNumber")} {t("required")}
          </Label>
          <Input
            id="whatsapp"
            placeholder="03001234567"
            value={formData.whatsapp}
            onChange={(e) => {
              const value = e.target.value
              const digitsOnly = value.replace(/[^0-9]/g, "")
              if (digitsOnly.length <= 11) {
                setFormData({ ...formData, whatsapp: digitsOnly })
                setFieldErrors({ ...fieldErrors, whatsapp: "" })
              }
            }}
            onBlur={() => setFieldErrors({ ...fieldErrors, whatsapp: validatePhone(formData.whatsapp) })}
            required
            maxLength={11}
            className={`h-12 ${fieldErrors.whatsapp ? "border-red-500" : ""}`}
          />
          {fieldErrors.whatsapp && (
            <p className="text-sm text-red-500">{fieldErrors.whatsapp}</p>
          )}
          <p className="text-xs text-muted-foreground">Enter 11 digit WhatsApp number</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">
            {t("city")} {t("required")}
          </Label>
          <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value, locality: [] })}>
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

        <div className="space-y-2">
          <Label>
            {t("areaLocality")} {t("required")} ({formData.locality.length} selected)
          </Label>
          {formData.city ? (
            <Card className="p-4 border-2 max-h-64 overflow-y-auto">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search areas..."
                  value={areaSearch}
                  onChange={(e) => setAreaSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="space-y-2">
                {localities[formData.city]
                  ?.filter((locality) =>
                    locality.label.toLowerCase().includes(areaSearch.toLowerCase())
                  )
                  .map((locality) => (
                    <div key={locality.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`locality-${locality.value}`}
                        checked={formData.locality.includes(locality.value)}
                        onCheckedChange={() => handleLocalityToggle(locality.value)}
                      />
                      <label
                        htmlFor={`locality-${locality.value}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {locality.label}
                      </label>
                    </div>
                  ))}
              </div>
            </Card>
          ) : (
            <Card className="p-4 border-2">
              <p className="text-sm text-muted-foreground">Please select a city first</p>
            </Card>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">
            {t("serviceCategory")} {t("required")}
          </Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder={t("selectCategory")} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.slug}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience">
            {t("yearsOfExperience")} {t("required")}
          </Label>
          <Input
            id="experience"
            type="number"
            placeholder="5"
            min="0"
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            required
            className="h-12"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="skills">
          {t("skills")} {t("required")}
        </Label>
        <Input
          id="skills"
          placeholder={t("skillsPlaceholder")}
          value={formData.skills}
          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          required
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cnic">
          {t("cnicNumber")} {t("required")}
        </Label>
        <Input
          id="cnic"
          placeholder="42101-1234567-1"
          value={formData.cnicNumber}
          onChange={(e) => {
            let val = e.target.value.replace(/\D/g, "")
            if (val.length > 5) {
              val = val.slice(0, 5) + "-" + val.slice(5)
            }
            if (val.length > 13) {
              val = val.slice(0, 13) + "-" + val.slice(13)
            }
            setFormData({ ...formData, cnicNumber: val.slice(0, 15) })
            setFieldErrors({ ...fieldErrors, cnicNumber: "" })
          }}
          onBlur={() => setFieldErrors({ ...fieldErrors, cnicNumber: validateCnic(formData.cnicNumber) })}
          required
          className={`h-12 ${fieldErrors.cnicNumber ? "border-red-500" : ""}`}
        />
        {fieldErrors.cnicNumber && (
          <p className="text-sm text-red-500">{fieldErrors.cnicNumber}</p>
        )}
        <p className="text-xs text-muted-foreground">Format: 12345-1234567-1</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cnicFront">
            {t("cnicFront")} {isEditing ? "(Upload to update)" : t("required")}
          </Label>
          {cnicFrontPreview ? (
            <Card className="border-2 p-4">
              <div className="relative w-full h-32 rounded overflow-hidden bg-muted">
                <Image src={cnicFrontPreview} alt="CNIC Front" fill className="object-contain" />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => removeFile("cnicFront")}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="border-2 border-dashed hover:border-primary transition-colors">
              <label htmlFor="cnicFront" className="flex items-center justify-center gap-2 p-6 cursor-pointer">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {formData.cnicFront ? formData.cnicFront.name : t("uploadFront")}
                </span>
                <Input
                  id="cnicFront"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "cnicFront")}
                  className="hidden"
                />
              </label>
            </Card>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cnicBack">
            {t("cnicBack")} {isEditing ? "(Upload to update)" : t("required")}
          </Label>
          {cnicBackPreview ? (
            <Card className="border-2 p-4">
              <div className="relative w-full h-32 rounded overflow-hidden bg-muted">
                <Image src={cnicBackPreview} alt="CNIC Back" fill className="object-contain" />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => removeFile("cnicBack")}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="border-2 border-dashed hover:border-primary transition-colors">
              <label htmlFor="cnicBack" className="flex items-center justify-center gap-2 p-6 cursor-pointer">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {formData.cnicBack ? formData.cnicBack.name : t("uploadBack")}
                </span>
                <Input
                  id="cnicBack"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "cnicBack")}
                  className="hidden"
                />
              </label>
            </Card>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="selfie">
          Live Selfie {isEditing ? "(Upload to update)" : t("required")}
        </Label>
        <p className="text-xs text-muted-foreground mb-2">
          Please take a clear selfie for verification
        </p>
        {selfiePreview ? (
          <Card className="border-2 p-4">
            <div className="relative w-full h-48 rounded overflow-hidden bg-muted">
              <Image src={selfiePreview} alt="Selfie" fill className="object-cover" />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => removeFile("selfie")}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="border-2 border-dashed hover:border-primary transition-colors p-6">
            <div className="flex flex-col items-center gap-4">
              <label htmlFor="selfie" className="flex flex-col items-center cursor-pointer w-full">
                <Camera className="h-12 w-12 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground mb-2">Click to take selfie with camera</span>
                <Input
                  id="selfie"
                  ref={selfieInputRef}
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={(e) => handleFileChange(e, "selfie")}
                  className="hidden"
                  required={!isEditing}
                />
              </label>
            </div>
          </Card>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="about">
          {t("aboutYou")} {t("required")}
        </Label>
        <Textarea
          id="about"
          placeholder={t("aboutPlaceholder")}
          rows={4}
          value={formData.about}
          onChange={(e) => setFormData({ ...formData, about: e.target.value })}
          required
          className="resize-none"
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full h-12" disabled={loading}>
        {loading ? (isEditing ? "Updating..." : t("registering")) : (isEditing ? "Update Profile" : t("completeRegistration"))}
      </Button>

      <p className="text-xs text-muted-foreground text-center">{t("verificationPendingMsg")}</p>
    </form>
  )
}
