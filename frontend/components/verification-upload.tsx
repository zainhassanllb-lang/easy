"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Upload, Camera, X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export function VerificationUpload({ workerId, cnicNumber }: { workerId: string; cnicNumber: string }) {
  const [uploading, setUploading] = useState(false)
  const [cnicFront, setCnicFront] = useState<File | null>(null)
  const [cnicBack, setCnicBack] = useState<File | null>(null)
  const [selfie, setSelfie] = useState<File | null>(null)
  const [cnicFrontPreview, setCnicFrontPreview] = useState<string>("")
  const [cnicBackPreview, setCnicBackPreview] = useState<string>("")
  const [selfiePreview, setSelfiePreview] = useState<string>("")
  const [error, setError] = useState("")
  const selfieInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "cnicFront" | "cnicBack" | "selfie") => {
    const file = e.target.files?.[0]
    if (!file) return

    if (type === "cnicFront") {
      setCnicFront(file)
      setCnicFrontPreview(URL.createObjectURL(file))
    } else if (type === "cnicBack") {
      setCnicBack(file)
      setCnicBackPreview(URL.createObjectURL(file))
    } else if (type === "selfie") {
      setSelfie(file)
      setSelfiePreview(URL.createObjectURL(file))
    }
  }

  const removeFile = (type: "cnicFront" | "cnicBack" | "selfie") => {
    if (type === "cnicFront") {
      setCnicFront(null)
      setCnicFrontPreview("")
    } else if (type === "cnicBack") {
      setCnicBack(null)
      setCnicBackPreview("")
    } else if (type === "selfie") {
      setSelfie(null)
      setSelfiePreview("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!cnicFront || !cnicBack) {
      setError("Please upload both CNIC front and back images")
      return
    }

    if (!selfie) {
      setError("Please upload a live selfie")
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("cnicFront", cnicFront)
      formData.append("cnicBack", cnicBack)
      formData.append("selfie", selfie)

      const response = await fetch("/api/upload-verification", {
        method: "POST",
        body: formData,
        credentials: "include",
      })

      const result = await response.json()

      if (result.success) {
        alert("Documents uploaded successfully! Admin will review them shortly.")
        router.refresh()
      } else {
        setError(result.error || "Upload failed. Please try again.")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>CNIC Number</Label>
        <Input value={cnicNumber} disabled className="mt-2" />
      </div>

      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="cnic-front">CNIC Front Side *</Label>
          {cnicFrontPreview ? (
            <Card className="mt-2 p-4 border-2">
              <div className="relative w-full h-48 rounded overflow-hidden bg-muted">
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
            <Card className="mt-2 p-8 border-dashed border-2 hover:border-primary transition-colors cursor-pointer">
              <label htmlFor="cnic-front" className="flex flex-col items-center cursor-pointer">
                <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Click to upload CNIC front image</span>
                <Input
                  id="cnic-front"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "cnicFront")}
                  required
                />
              </label>
            </Card>
          )}
        </div>

        <div>
          <Label htmlFor="cnic-back">CNIC Back Side *</Label>
          {cnicBackPreview ? (
            <Card className="mt-2 p-4 border-2">
              <div className="relative w-full h-48 rounded overflow-hidden bg-muted">
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
            <Card className="mt-2 p-8 border-dashed border-2 hover:border-primary transition-colors cursor-pointer">
              <label htmlFor="cnic-back" className="flex flex-col items-center cursor-pointer">
                <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Click to upload CNIC back image</span>
                <Input
                  id="cnic-back"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "cnicBack")}
                  required
                />
              </label>
            </Card>
          )}
        </div>

        <div>
          <Label htmlFor="selfie">Live Selfie *</Label>
          <p className="text-xs text-muted-foreground mb-2">
            Please take a clear selfie for verification
          </p>
          {selfiePreview ? (
            <Card className="mt-2 p-4 border-2">
              <div className="relative w-full h-64 rounded overflow-hidden bg-muted">
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
            <Card className="mt-2 p-8 border-dashed border-2 hover:border-primary transition-colors">
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
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "selfie")}
                    required
                  />
                </label>
              </div>
            </Card>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={uploading}>
        {uploading ? "Uploading..." : "Submit for Verification"}
      </Button>
    </form>
  )
}
