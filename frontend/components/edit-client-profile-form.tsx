"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Client } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Camera, User, Phone } from "lucide-react"

interface EditClientProfileFormProps {
  client: Client
}

export function EditClientProfileForm({ client }: EditClientProfileFormProps) {
  const [formData, setFormData] = useState({
    name: client.name,
    phone: client.phone,
    profileImage: client.profileImage,
  })
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, profileImage: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    const response = await fetch("/api/update-client-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      credentials: "include",
    })

    if (response.ok) {
      router.push("/profile")
      router.refresh()
    } else {
      alert("Failed to update profile")
    }
    setUploading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-center">
        <div className="relative">
          <Avatar className="h-24 w-24 border">
            <AvatarImage src={formData.profileImage || "/placeholder.svg?height=96&width=96"} />
            <AvatarFallback className="text-3xl bg-muted">{formData.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <label
            htmlFor="profile-image"
            className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 cursor-pointer hover:bg-primary/90 shadow-sm"
          >
            <Camera className="h-4 w-4" />
            <input id="profile-image" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs font-semibold">Full Name</Label>
          <div className="relative group">
            <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="pl-9 h-10 text-sm"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-xs font-semibold">Phone Number</Label>
          <div className="relative group">
            <Phone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              className="pl-9 h-10 text-sm"
            />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full h-10 text-sm font-medium" disabled={uploading}>
        {uploading ? "Updating..." : "Save Changes"}
      </Button>
    </form>
  )
}
