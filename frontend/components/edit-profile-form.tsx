"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Camera, Loader2, Plus, X, User, Phone, MapPin,
    Briefcase, Shield, FileText, Upload, MessageCircle
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { localities, cities } from "@/lib/database"

interface EditProfileFormProps {
    worker: any
}

export function EditProfileForm({ worker }: EditProfileFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    // State for text fields
    const [formData, setFormData] = useState({
        name: worker.name || "",
        phone: worker.phone || "",
        whatsapp: worker.whatsapp || "",
        cnicNumber: worker.cnicNumber || worker.cnic || "",
        city: worker.city || "",
        // Ensure locality is an array. If string, wrap in array.
        locality: Array.isArray(worker.locality) ? worker.locality : (worker.locality ? [worker.locality] : []),
        category: worker.category || "",
        experience: worker.experience || 0,
        about: worker.about || "",
        skills: Array.isArray(worker.skills) ? worker.skills : [],
    })

    // State for files
    const [fileData, setFileData] = useState<{
        profileImage: File | null,
        cnicFront: File | null,
        cnicBack: File | null,
        selfie: File | null
    }>({
        profileImage: null,
        cnicFront: null,
        cnicBack: null,
        selfie: null
    })

    // State for previews
    const [previews, setPreviews] = useState({
        profileImage: worker.profileImage || "",
        cnicFront: worker.cnicImages?.[0] || worker.cnicFront || "",
        cnicBack: worker.cnicImages?.[1] || worker.cnicBack || "",
        selfie: worker.selfieImage || ""
    })

    const [newSkill, setNewSkill] = useState("")
    const [errors, setErrors] = useState<Record<string, string>>({})

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

    const validateExperience = (exp: any) => {
        const val = Number(exp)
        if (isNaN(val) || val < 0) return "Please enter a valid number of years"
        return ""
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
        // Reset locality when city changes
        if (name === "city") {
            setFormData(prev => ({ ...prev, city: value, locality: [] }))
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
            locality: prev.locality.filter((l: string) => l !== locToRemove)
        }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "profileImage" | "cnicFront" | "cnicBack" | "selfie") => {
        const file = e.target.files?.[0]
        if (file) {
            setFileData(prev => ({ ...prev, [field]: file }))
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviews(prev => ({ ...prev, [field]: reader.result as string }))
            }
            reader.readAsDataURL(file)
        }
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
            skills: prev.skills.filter((skill: string) => skill !== skillToRemove)
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const data = new FormData()
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'skills') {
                    if (Array.isArray(value)) value.forEach((skill) => data.append("skills", skill))
                } else if (key === 'locality') {
                    // Ensure locality is sent as array
                    if (Array.isArray(value)) value.forEach((loc) => data.append("locality", loc))
                } else {
                    data.append(key, String(value))
                }
            })

            if (fileData.profileImage) data.append("profileImage", fileData.profileImage)
            if (fileData.cnicFront) data.append("cnicFront", fileData.cnicFront)
            if (fileData.cnicBack) data.append("cnicBack", fileData.cnicBack)
            if (fileData.selfie) data.append("selfie", fileData.selfie)

            // Validate fields
            const newErrors: Record<string, string> = {}
            const phoneError = validatePhone(formData.phone)
            if (phoneError) newErrors.phone = phoneError

            if (formData.whatsapp) {
                const waError = validatePhone(formData.whatsapp)
                if (waError) newErrors.whatsapp = waError
            }

            const cnicError = validateCnic(formData.cnicNumber)
            if (cnicError) newErrors.cnicNumber = cnicError

            const expError = validateExperience(formData.experience)
            if (expError) newErrors.experience = expError

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors)
                setLoading(false)
                // Scroll to first error
                const firstErrorField = Object.keys(newErrors)[0]
                const element = document.getElementById(firstErrorField)
                element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                return
            }
            setErrors({})

            const response = await fetch(`/api/update-worker-profile`, {
                method: "POST",
                body: data,
            })

            const result = await response.json()
            if (!response.ok || !result.success) throw new Error(result.error || "Failed to update profile")

            router.push("/worker/dashboard")
            router.refresh()
        } catch (error: any) {
            console.error(error)
            alert(error.message || "Failed to update profile. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    // Get localities for selected city
    const cityLocalities = formData.city ? localities[formData.city] || [] : [];

    return (
        <form onSubmit={handleSubmit} className="min-h-screen bg-muted/5 pb-20">
            {/* Header / Profile Image Section */}
            <div className="relative mb-6 bg-background border-b shadow-sm">
                <div className="h-32 w-full bg-gradient-to-r from-primary/90 to-primary/70 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
                </div>
                <div className="container max-w-3xl mx-auto px-4 relative -mt-16 pb-4 flex flex-col items-center text-center">
                    <div className="relative group">
                        <Avatar className="h-32 w-32 border-4 border-background shadow-xl ring-4 ring-primary/5">
                            <AvatarImage src={previews.profileImage} className="object-cover" />
                            <AvatarFallback className="text-4xl font-bold text-primary/20 bg-muted">{formData.name?.charAt(0) || "W"}</AvatarFallback>
                        </Avatar>
                        <label
                            htmlFor="profile-image"
                            className="absolute bottom-1 right-1 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 hover:scale-105 transition-all shadow-lg ring-4 ring-background"
                        >
                            <Camera className="h-4 w-4" />
                            <input id="profile-image" type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "profileImage")} />
                        </label>
                    </div>
                    <h2 className="text-2xl font-bold mt-3 tracking-tight text-foreground">{formData.name || "Your Name"}</h2>
                    <Badge variant="secondary" className="mt-1 px-3 py-0.5 text-xs font-medium uppercase tracking-wide">
                        {formData.category || "Service Category"}
                    </Badge>
                </div>
            </div>

            <div className="container max-w-3xl mx-auto px-4 flex flex-col gap-8">

                {/* Personal Information */}
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="name" className="text-xs font-semibold">Full Name</Label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input id="name" name="name" className="pl-10 h-10 text-sm" value={formData.name} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="phone" className="text-xs font-semibold">Phone Number</Label>
                                <div className="relative group">
                                    <Phone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input id="phone" name="phone" className={`pl-10 h-10 text-sm ${errors.phone ? 'border-red-500' : ''}`} value={formData.phone} onChange={handleChange} required />
                                </div>
                                {errors.phone && <p className="text-[10px] text-red-500 mt-1">{errors.phone}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="whatsapp" className="text-xs font-semibold">WhatsApp Number</Label>
                                <div className="relative group">
                                    <MessageCircle className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input id="whatsapp" name="whatsapp" className={`pl-10 h-10 text-sm ${errors.whatsapp ? 'border-red-500' : ''}`} value={formData.whatsapp} onChange={handleChange} />
                                </div>
                                {errors.whatsapp && <p className="text-[10px] text-red-500 mt-1">{errors.whatsapp}</p>}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="about" className="text-xs font-semibold">About You</Label>
                            <Textarea
                                id="about"
                                name="about"
                                value={formData.about}
                                onChange={handleChange}
                                className="min-h-[80px] resize-none text-sm"
                                placeholder="Describe your services..."
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Professional Info */}
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
                                <Label htmlFor="category" className="text-xs font-semibold">Category</Label>
                                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                                    <SelectTrigger className="h-10 text-sm">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="electrician" className="text-sm">Electrician</SelectItem>
                                        <SelectItem value="plumber" className="text-sm">Plumber</SelectItem>
                                        <SelectItem value="carpenter" className="text-sm">Carpenter</SelectItem>
                                        <SelectItem value="painter" className="text-sm">Painter</SelectItem>
                                        <SelectItem value="hvac" className="text-sm">HVAC Technician</SelectItem>
                                        <SelectItem value="mechanic" className="text-sm">Mechanic</SelectItem>
                                        <SelectItem value="cleaner" className="text-sm">Cleaner</SelectItem>
                                        <SelectItem value="gardener" className="text-sm">Gardener</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="experience" className="text-xs font-semibold">Experience (Years)</Label>
                                <Input
                                    id="experience"
                                    name="experience"
                                    type="number"
                                    min="0"
                                    className={`h-10 text-sm ${errors.experience ? 'border-red-500' : ''}`}
                                    value={formData.experience}
                                    onChange={handleChange}
                                />
                                {errors.experience && <p className="text-[10px] text-red-500 mt-1">{errors.experience}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="city" className="text-xs font-semibold">City / Region</Label>
                                <Select value={formData.city} onValueChange={(value) => handleSelectChange("city", value)}>
                                    <SelectTrigger className="h-10 text-sm">
                                        <SelectValue placeholder="Select City" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cities.map((city) => (
                                            <SelectItem key={city.value} value={city.value} className="text-sm">
                                                {city.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Localities - Full width */}
                        <div className="space-y-2">
                            <Label htmlFor="locality" className="text-xs font-semibold">Locality / Area</Label>
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
                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Skills & Specializations</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    placeholder="Type a skill (e.g. Wiring, Leak Fixing)..."
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="cnicNumber" className="text-xs font-semibold">CNIC Number</Label>
                                <Input id="cnicNumber" name="cnicNumber" value={formData.cnicNumber} onChange={handleChange} placeholder="00000-0000000-0" className={`h-10 text-sm font-mono tracking-wide ${errors.cnicNumber ? 'border-red-500' : ''}`} />
                                {errors.cnicNumber && <p className="text-[10px] text-red-500 mt-1">{errors.cnicNumber}</p>}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-xs font-semibold flex items-center gap-2">
                                CNIC Images
                                <span className="text-[10px] font-normal text-muted-foreground uppercase">(Front & Back)</span>
                            </Label>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Front Image */}
                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-semibold text-muted-foreground uppercase">Front Side</span>
                                    <div className="border-2 border-dashed rounded-xl p-3 bg-muted/10 hover:bg-muted/30 transition-colors text-center">
                                        <div className="relative aspect-video w-full bg-background rounded-lg overflow-hidden border mb-3 flex items-center justify-center">
                                            {previews.cnicFront ? (
                                                <img src={previews.cnicFront} alt="CNIC Front" className="h-full w-full object-contain" />
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
                                                    <FileText className="h-8 w-8" />
                                                </div>
                                            )}
                                        </div>
                                        <label className="inline-flex cursor-pointer items-center justify-center rounded-md text-xs font-medium h-8 px-3 bg-primary text-primary-foreground hover:bg-primary/90 w-full shadow-sm">
                                            <Upload className="mr-1.5 h-3 w-3" />
                                            {previews.cnicFront ? "Change" : "Upload"}
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "cnicFront")} />
                                        </label>
                                    </div>
                                </div>

                                {/* Back Image */}
                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-semibold text-muted-foreground uppercase">Back Side</span>
                                    <div className="border-2 border-dashed rounded-xl p-3 bg-muted/10 hover:bg-muted/30 transition-colors text-center">
                                        <div className="relative aspect-video w-full bg-background rounded-lg overflow-hidden border mb-3 flex items-center justify-center">
                                            {previews.cnicBack ? (
                                                <img src={previews.cnicBack} alt="CNIC Back" className="h-full w-full object-contain" />
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
                                                    <FileText className="h-8 w-8" />
                                                </div>
                                            )}
                                        </div>
                                        <label className="inline-flex cursor-pointer items-center justify-center rounded-md text-xs font-medium h-8 px-3 bg-primary text-primary-foreground hover:bg-primary/90 w-full shadow-sm">
                                            <Upload className="mr-1.5 h-3 w-3" />
                                            {previews.cnicBack ? "Change" : "Upload"}
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
                                    {previews.selfie ? (
                                        <img src={previews.selfie} alt="Selfie" className="h-full w-full object-cover" />
                                    ) : (
                                        <Camera className="h-6 w-6 text-muted-foreground/40" />
                                    )}
                                </div>
                                <div className="space-y-1 flex-1">
                                    <label className="inline-flex cursor-pointer items-center justify-center rounded-md text-xs font-medium h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all border-none outline-none">
                                        <Camera className="mr-1.5 h-4 w-4" />
                                        {previews.selfie ? "Retake" : "Take Selfie"}
                                        <input type="file" accept="image/*" capture="user" className="hidden" onChange={(e) => handleFileChange(e, "selfie")} />
                                    </label>
                                    <p className="text-[10px] text-muted-foreground">Clear facial view required.</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Inline Action Buttons with extra spacing */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2 mb-10">
                    <Button type="button" variant="outline" className="flex-1 h-10 text-sm font-medium" onClick={() => router.back()} disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading} className="flex-1 h-10 text-sm font-medium shadow-md hover:shadow-primary/25">
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </div>
            </div>
        </form>
    )
}
