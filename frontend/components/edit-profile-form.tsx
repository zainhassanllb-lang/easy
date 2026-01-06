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
    // In database.ts, localities is Record<string, {value: string, label: string}[]>
    // formData.city is stored as value (e.g. "lahore"), so we can access directly
    const cityLocalities = formData.city ? localities[formData.city] || [] : [];

    return (
        <form onSubmit={handleSubmit} className="min-h-screen bg-muted/5 pb-20">
            {/* Header / Profile Image Section */}
            <div className="relative mb-8 bg-background border-b shadow-sm">
                <div className="h-48 w-full bg-gradient-to-r from-primary/90 to-primary/70 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
                </div>
                <div className="container max-w-3xl mx-auto px-4 relative -mt-20 pb-6 flex flex-col items-center text-center">
                    <div className="relative group">
                        <Avatar className="h-40 w-40 border-4 border-background shadow-2xl ring-4 ring-primary/5">
                            <AvatarImage src={previews.profileImage} className="object-cover" />
                            <AvatarFallback className="text-5xl font-bold text-primary/20 bg-muted">{formData.name?.charAt(0) || "W"}</AvatarFallback>
                        </Avatar>
                        <label
                            htmlFor="profile-image"
                            className="absolute bottom-2 right-2 p-3 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 hover:scale-105 transition-all shadow-lg ring-4 ring-background"
                        >
                            <Camera className="h-5 w-5" />
                            <input id="profile-image" type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "profileImage")} />
                        </label>
                    </div>
                    <h2 className="text-3xl font-bold mt-4 tracking-tight text-foreground">{formData.name || "Your Name"}</h2>
                    <Badge variant="secondary" className="mt-2 px-4 py-1 text-sm font-medium uppercase tracking-wide">
                        {formData.category || "Service Category"}
                    </Badge>
                </div>
            </div>

            <div className="container max-w-3xl mx-auto px-4 flex flex-col gap-8">

                {/* Personal Information */}
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
                            <Label htmlFor="name" className="text-sm font-semibold">Full Name</Label>
                            <div className="relative group">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input id="name" name="name" className="pl-10 h-11" value={formData.name} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-semibold">Phone Number</Label>
                            <div className="relative group">
                                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input id="phone" name="phone" className="pl-10 h-11" value={formData.phone} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="whatsapp" className="text-sm font-semibold">WhatsApp Number</Label>
                            <div className="relative group">
                                <MessageCircle className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input id="whatsapp" name="whatsapp" className="pl-10 h-11" value={formData.whatsapp} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="about" className="text-sm font-semibold">About You</Label>
                            <Textarea
                                id="about"
                                name="about"
                                value={formData.about}
                                onChange={handleChange}
                                className="min-h-[120px] resize-none"
                                placeholder="Describe your services, expertise, and what makes you the best choice..."
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Professional Info */}
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
                                <Label htmlFor="category" className="text-sm font-semibold">Category</Label>
                                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="electrician">Electrician</SelectItem>
                                        <SelectItem value="plumber">Plumber</SelectItem>
                                        <SelectItem value="carpenter">Carpenter</SelectItem>
                                        <SelectItem value="painter">Painter</SelectItem>
                                        <SelectItem value="hvac">HVAC Technician</SelectItem>
                                        <SelectItem value="mechanic">Mechanic</SelectItem>
                                        <SelectItem value="cleaner">Cleaner</SelectItem>
                                        <SelectItem value="gardener">Gardener</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="experience" className="text-sm font-semibold">Experience (Years)</Label>
                                <Input
                                    id="experience"
                                    name="experience"
                                    type="number"
                                    min="0"
                                    className="h-11"
                                    value={formData.experience}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="city" className="text-sm font-semibold">City / Region</Label>
                                <Select value={formData.city} onValueChange={(value) => handleSelectChange("city", value)}>
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Select City" />
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
                                <Label htmlFor="locality" className="text-sm font-semibold">Locality / Area</Label>
                                {/* Multi-select Dropdown UI */}
                                <div className="space-y-3">
                                    <Select onValueChange={handleLocalitySelect} disabled={!formData.city}>
                                        <SelectTrigger className="h-11">
                                            <SelectValue placeholder={formData.city ? "Select Areas to Add" : "Select City First"} />
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
                                                    {formData.city ? "No areas found for this city" : "Select a city first"}
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>

                                    <div className="flex flex-wrap gap-2 min-h-[44px] p-3 bg-muted/10 rounded-lg border border-dashed border-muted-foreground/20">
                                        {formData.locality.length === 0 && (
                                            <span className="text-muted-foreground text-sm italic w-full text-center self-center">
                                                No areas selected
                                            </span>
                                        )}
                                        {formData.locality.map((locValue: string) => {
                                            // Find label for value
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
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-sm font-semibold">Skills</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    placeholder="Add a skill (e.g. Wiring, Pipe Fitting)"
                                    className="h-11"
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }}
                                />
                                <Button type="button" onClick={addSkill} variant="secondary" className="h-11 w-11 p-0">
                                    <Plus className="h-5 w-5" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 min-h-[60px] p-4 bg-secondary/20 rounded-xl border border-dashed border-secondary">
                                {formData.skills.length === 0 && (
                                    <span className="text-muted-foreground text-sm italic w-full text-center py-2">No skills added yet</span>
                                )}
                                {formData.skills.map((skill: string) => (
                                    <Badge key={skill} variant="secondary" className="px-3 py-1.5 text-sm flex items-center gap-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-transparent">
                                        {skill}
                                        <button type="button" onClick={() => removeSkill(skill)} className="hover:text-destructive transition-colors ml-1 p-0.5 rounded-full hover:bg-background/20">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
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
                            <Label htmlFor="cnicNumber" className="text-sm font-semibold">CNIC Number</Label>
                            <Input id="cnicNumber" name="cnicNumber" value={formData.cnicNumber} onChange={handleChange} placeholder="00000-0000000-0" className="h-11 font-mono tracking-wide" />
                        </div>

                        <div className="space-y-4">
                            <Label className="text-sm font-semibold flex items-center gap-2">
                                CNIC Images
                                <span className="text-xs font-normal text-muted-foreground">(Front & Back)</span>
                            </Label>

                            <div className="space-y-6">
                                {/* Front Image */}
                                <div className="space-y-2">
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Front Side</span>
                                    <div className="border-2 border-dashed rounded-xl p-4 bg-muted/10 hover:bg-muted/30 transition-colors text-center">
                                        <div className="relative aspect-video w-full bg-background rounded-lg overflow-hidden border shadow-inner mb-4 flex items-center justify-center">
                                            {previews.cnicFront ? (
                                                <img src={previews.cnicFront} alt="CNIC Front" className="h-full w-full object-contain" />
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
                                                    <FileText className="h-12 w-12" />
                                                    <span className="text-xs">No Front Image</span>
                                                </div>
                                            )}
                                        </div>
                                        <label className="inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto shadow-sm">
                                            <Upload className="mr-2 h-4 w-4" />
                                            {previews.cnicFront ? "Change Front Image" : "Upload Front Image"}
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "cnicFront")} />
                                        </label>
                                    </div>
                                </div>

                                {/* Back Image */}
                                <div className="space-y-2">
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Back Side</span>
                                    <div className="border-2 border-dashed rounded-xl p-4 bg-muted/10 hover:bg-muted/30 transition-colors text-center">
                                        <div className="relative aspect-video w-full bg-background rounded-lg overflow-hidden border shadow-inner mb-4 flex items-center justify-center">
                                            {previews.cnicBack ? (
                                                <img src={previews.cnicBack} alt="CNIC Back" className="h-full w-full object-contain" />
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
                                                    <FileText className="h-12 w-12" />
                                                    <span className="text-xs">No Back Image</span>
                                                </div>
                                            )}
                                        </div>
                                        <label className="inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto shadow-sm">
                                            <Upload className="mr-2 h-4 w-4" />
                                            {previews.cnicBack ? "Change Back Image" : "Upload Back Image"}
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
                                    {previews.selfie ? (
                                        <img src={previews.selfie} alt="Selfie" className="h-full w-full object-cover" />
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
                                        {previews.selfie ? "Retake Selfie" : "Take Live Selfie"}
                                        <input type="file" accept="image/*" capture="user" className="hidden" onChange={(e) => handleFileChange(e, "selfie")} />
                                    </label>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Please ensure your face is clearly visible.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Inline Action Buttons with extra spacing */}
                <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4 mt-8 mb-20">
                    <Button type="button" variant="outline" size="lg" className="flex-1 h-12 text-base font-medium" onClick={() => router.back()} disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading} size="lg" className="flex-1 h-12 text-base font-medium shadow-lg hover:shadow-primary/25">
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Saving Changes...
                            </>
                        ) : (
                            "Save All Changes"
                        )}
                    </Button>
                </div>
            </div>
        </form>
    )
}
