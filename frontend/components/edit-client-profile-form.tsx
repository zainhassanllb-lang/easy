"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Client } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Camera } from "lucide-react"

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-center">
        <div className="relative">
          <Avatar className="h-32 w-32">
            <AvatarImage src={formData.profileImage || "/placeholder.svg?height=128&width=128"} />
            <AvatarFallback className="text-4xl">{formData.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <label
            htmlFor="profile-image"
            className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90"
          >
            <Camera className="h-5 w-5" />
            <input id="profile-image" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={uploading}>
        {uploading ? "Updating..." : "Save Changes"}
      </Button>
    </form>
  )
}
