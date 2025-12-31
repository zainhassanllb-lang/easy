"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { Worker } from "@/lib/database"
import { categories, cities, localities } from "@/lib/database"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Upload, ImageIcon, Search, Camera, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"

export function EditProfileForm({ worker }: { worker: Worker }) {
  const [formData, setFormData] = useState({
    name: worker.name,
    phone: worker.phone,
    whatsapp: worker.whatsapp,
    city: worker.city,
    locality: Array.isArray(worker.locality) ? worker.locality : [worker.locality],
    category: worker.category,
    experience: worker.experience,
    about: worker.about,
    skills: worker.skills.join(", "),
    cnicNumber: worker.cnicNumber,
    profileImage: null as File | null,
    cnicFront: null as File | null,
    cnicBack: null as File | null,
    selfie: null as File | null,
  })
  const [profilePreview, setProfilePreview] = useState(worker.profileImage)
  const [selfiePreview, setSelfiePreview] = useState("")
  const [loading, setLoading] = useState(false)
  const [areaSearch, setAreaSearch] = useState("")
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    cnicNumber: "",
  })
  const router = useRouter()

  const handleLocalityToggle = (localityValue: string) => {
    setFormData((prev) => {
      const currentLocalities = Array.isArray(prev.locality) ? prev.locality : [prev.locality]
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

  const handleCnicChange = (type: "front" | "back", e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (type === "front") {
        setFormData({ ...formData, cnicFront: e.target.files[0] })
      } else {
        setFormData({ ...formData, cnicBack: e.target.files[0] })
      }
    }
  }

  const handleSelfieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData({ ...formData, selfie: file })
      setSelfiePreview(URL.createObjectURL(file))
    }
  }

  const removeSelfie = () => {
    setFormData({ ...formData, selfie: null })
    setSelfiePreview("")
  }

  const validateName = (name: string) => {
    const nameRegex = /^[A-Za-z\s]+$/
    if (!name) return "Name is required"
    if (!nameRegex.test(name)) return "Name can only contain alphabets and spaces"
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({ name: "", phone: "", whatsapp: "", cnicNumber: "" })

    // Validate all fields
    const nameError = validateName(formData.name)
    const phoneError = validatePhone(formData.phone)
    const whatsappError = validatePhone(formData.whatsapp)
    const cnicError = validateCnic(formData.cnicNumber)

    if (nameError || phoneError || whatsappError || cnicError) {
      setFieldErrors({
        name: nameError,
        phone: phoneError,
        whatsapp: whatsappError,
        cnicNumber: cnicError,
      })
      return
    }

    setLoading(true)

    const fd = new FormData()
    fd.append("name", formData.name)
    fd.append("phone", formData.phone)
    fd.append("whatsapp", formData.whatsapp)
    fd.append("city", formData.city)

    // Append localities
    formData.locality.forEach((loc) => {
      fd.append("locality", loc)
    })

    fd.append("category", formData.category)
    fd.append("experience", formData.experience.toString())
    fd.append("about", formData.about)
    fd.append("skills", formData.skills)
    fd.append("cnicNumber", formData.cnicNumber)

    if (formData.profileImage) {
      fd.append("profileImage", formData.profileImage)
    }
    if (formData.cnicFront) {
      fd.append("cnicFront", formData.cnicFront)
    }
    if (formData.cnicBack) {
      fd.append("cnicBack", formData.cnicBack)
    }
    if (formData.selfie) {
      fd.append("selfie", formData.selfie)
    }

    const response = await fetch("/api/update-worker-profile", {
      method: "POST",
      body: fd,
      credentials: "include",
    })

    if (response.ok) {
      router.push("/worker/dashboard")
      router.refresh()
    } else {
      setLoading(false)
      const data = await response.json().catch(() => ({}))
      alert(data.error || "Failed to update profile")
    }
  }
  // sample...
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>Profile heheh Image</Label>
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
                {formData.profileImage ? formData.profileImage.name : "Upload Profile Picture"}
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

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
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
          className={fieldErrors.name ? "border-red-500" : ""}
        />
        {fieldErrors.name && (
          <p className="text-sm text-red-500">{fieldErrors.name}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
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
            className={fieldErrors.phone ? "border-red-500" : ""}
          />
          {fieldErrors.phone && (
            <p className="text-sm text-red-500">{fieldErrors.phone}</p>
          )}
          <p className="text-xs text-muted-foreground">Enter 11 digit phone number</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp Number</Label>
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
            className={fieldErrors.whatsapp ? "border-red-500" : ""}
          />
          {fieldErrors.whatsapp && (
            <p className="text-sm text-red-500">{fieldErrors.whatsapp}</p>
          )}
          <p className="text-xs text-muted-foreground">Enter 11 digit WhatsApp number</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
            <SelectTrigger>
              <SelectValue />
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
          <Label>Area/Locality ({Array.isArray(formData.locality) ? formData.locality.length : 1} selected)</Label>
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
                  .map((locality) => {
                    const currentLocalities = Array.isArray(formData.locality) ? formData.locality : [formData.locality]
                    return (
                      <div key={locality.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-locality-${locality.value}`}
                          checked={currentLocalities.includes(locality.value)}
                          onCheckedChange={() => handleLocalityToggle(locality.value)}
                        />
                        <label
                          htmlFor={`edit-locality-${locality.value}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {locality.label}
                        </label>
                      </div>
                    )
                  })}
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
          <Label htmlFor="category">Service Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue />
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
          <Label htmlFor="experience">Years of Experience</Label>
          <Input
            id="experience"
            type="number"
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: Number.parseInt(e.target.value) })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cnicNumber">CNIC Number</Label>
        <Input
          id="cnicNumber"
          placeholder="12345-1234567-1"
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
          className={fieldErrors.cnicNumber ? "border-red-500" : ""}
        />
        {fieldErrors.cnicNumber && (
          <p className="text-sm text-red-500">{fieldErrors.cnicNumber}</p>
        )}
        <p className="text-xs text-muted-foreground">Format: 12345-1234567-1</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="skills">Skills (comma separated)</Label>
        <Input
          id="skills"
          placeholder="Wiring, Installation, Repair"
          value={formData.skills}
          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="about">About You</Label>
        <Textarea
          id="about"
          rows={4}
          value={formData.about}
          onChange={(e) => setFormData({ ...formData, about: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="selfie">
          Live Selfie
        </Label>
        <p className="text-xs text-muted-foreground mb-2">
          Please take a clear selfie for verification (Required for re-verification)
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
                onClick={removeSelfie}
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
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={handleSelfieChange}
                  className="hidden"
                />
              </label>
            </div>
          </Card>
        )}
      </div>

      <div className="space-y-4 pt-4 border-t">
        <div>
          <Label className="text-base font-semibold">Update CNIC Documents (Optional)</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Upload new CNIC images only if you need to update them. This will require re-verification.
          </p>
        </div>

        <Alert>
          <AlertDescription className="text-xs">
            ⚠️ Uploading new CNIC documents will set your verification status to "Pending" until admin re-verifies your
            profile.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cnicFront">CNIC Front Side</Label>
            <Card className="border-2 border-dashed hover:border-primary transition-colors">
              <label htmlFor="cnicFront" className="flex items-center justify-center gap-2 p-6 cursor-pointer">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground text-center">
                  {formData.cnicFront ? formData.cnicFront.name : "Upload CNIC Front"}
                </span>
                <Input
                  id="cnicFront"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleCnicChange("front", e)}
                  className="hidden"
                />
              </label>
            </Card>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cnicBack">CNIC Back Side</Label>
            <Card className="border-2 border-dashed hover:border-primary transition-colors">
              <label htmlFor="cnicBack" className="flex items-center justify-center gap-2 p-6 cursor-pointer">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground text-center">
                  {formData.cnicBack ? formData.cnicBack.name : "Upload CNIC Back"}
                </span>
                <Input
                  id="cnicBack"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleCnicChange("back", e)}
                  className="hidden"
                />
              </label>
            </Card>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        {formData.cnicFront || formData.cnicBack
          ? "Profile changes with new CNIC will require admin re-verification"
          : "Your profile updates will be saved immediately"}
      </p>
    </form >
  )
}
