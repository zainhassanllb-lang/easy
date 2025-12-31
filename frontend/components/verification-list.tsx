"use client"

import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Worker } from "@/lib/database"
import { MapPin, Phone, Mail, CheckCircle, XCircle, Eye, TrendingUp } from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"

export function VerificationList({ workers }: { workers: Worker[] }) {
  const [localWorkers, setLocalWorkers] = useState(workers)
  const [loading, setLoading] = useState<string | null>(null)
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null)

  const handleVerify = async (workerId: string, approved: boolean) => {
    setLoading(workerId)

    try {
      const response = await fetch("/api/admin/verify-worker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workerId, approved }),
        credentials: "include",
      })

      if (response.ok) {
        // Remove from local list
        setLocalWorkers((prev) => prev.filter((w) => w.id !== workerId))
        setSelectedWorker(null)
        // Optionally reload the page to refresh stats
        window.location.reload()
      } else {
        alert("Failed to verify worker. Please try again.")
      }
    } catch (error) {
      console.error("Verification error:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  if (localWorkers.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
        <p>No pending verifications</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {localWorkers.map((worker) => (
        <Card key={worker.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto overflow-hidden">
            <div className="relative w-14 h-14 rounded-full overflow-hidden bg-muted flex-shrink-0 border-2 border-primary/10">
              <Image
                src={
                  worker.profileImage
                    ? (worker.profileImage.startsWith('http')
                      ? worker.profileImage
                      : worker.profileImage.startsWith('/')
                        ? `${process.env.NEXT_PUBLIC_BACKEND_URL || "https://easy-e6lz.onrender.com"}${worker.profileImage}`
                        : `${process.env.NEXT_PUBLIC_BACKEND_URL || "https://easy-e6lz.onrender.com"}/uploads/workers/${worker.profileImage}`)
                    : "/placeholder.svg"
                }
                alt={worker.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-lg truncate uppercase">{worker.name}</h3>
              <p className="text-sm text-muted-foreground capitalize flex items-center gap-1">
                <Badge variant="secondary" className="px-2 py-0 h-5 text-[10px] font-bold">
                  {worker.category}
                </Badge>
              </p>
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" size="sm" className="w-full sm:w-auto font-semibold px-6 shadow-sm" onClick={() => setSelectedWorker(worker)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-10xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Worker Verification Details</DialogTitle>
              </DialogHeader>

              {selectedWorker && (
                <div className="space-y-6 py-4">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0 mx-auto md:mx-0">
                      <Image
                        src={
                          selectedWorker.profileImage
                            ? (selectedWorker.profileImage.startsWith('http')
                              ? selectedWorker.profileImage
                              : selectedWorker.profileImage.startsWith('/')
                                ? `${process.env.NEXT_PUBLIC_BACKEND_URL || "https://easy-e6lz.onrender.com"}${selectedWorker.profileImage}`
                                : `${process.env.NEXT_PUBLIC_BACKEND_URL || "https://easy-e6lz.onrender.com"}/uploads/workers/${selectedWorker.profileImage}`)
                            : "/placeholder.svg"
                        }
                        alt={selectedWorker.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h2 className="text-2xl font-bold">{selectedWorker.name}</h2>
                          <Badge className="capitalize">{selectedWorker.category}</Badge>
                        </div>
                        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span className="capitalize">{Array.isArray(selectedWorker.locality) ? selectedWorker.locality.join(', ') : selectedWorker.locality}, {selectedWorker.city}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{selectedWorker.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>{selectedWorker.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-2">CNIC Information</h4>
                        <p className="text-sm text-muted-foreground">Number: {selectedWorker.cnicNumber}</p>
                      </div>
                      {selectedWorker.cnicImages && selectedWorker.cnicImages.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2">CNIC Documents</h4>
                          <div className="flex flex-col gap-2">
                            {selectedWorker.cnicImages.map((img: string, idx: number) => {
                              const imageUrl = img.startsWith('http')
                                ? img
                                : img.startsWith('/')
                                  ? `${process.env.NEXT_PUBLIC_BACKEND_URL || "https://easy-e6lz.onrender.com"}${img}`
                                  : `${process.env.NEXT_PUBLIC_BACKEND_URL || "https://easy-e6lz.onrender.com"}/uploads/workers/${img}`
                              return (
                                <div key={idx} className="relative w-full h-40 rounded border overflow-hidden bg-muted">
                                  <Image
                                    src={imageUrl}
                                    alt={`CNIC ${idx === 0 ? 'Front' : 'Back'}`}
                                    fill
                                    className="object-contain"
                                    unoptimized
                                  />
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {selectedWorker.selfieImage && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Live Selfie</h4>
                          <div className="relative w-full h-64 rounded border overflow-hidden bg-muted">
                            <Image
                              src={
                                selectedWorker.selfieImage.startsWith('http')
                                  ? selectedWorker.selfieImage
                                  : selectedWorker.selfieImage.startsWith('/')
                                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL || "https://easy-e6lz.onrender.com"}${selectedWorker.selfieImage}`
                                    : `${process.env.NEXT_PUBLIC_BACKEND_URL || "https://easy-e6lz.onrender.com"}/uploads/workers/${selectedWorker.selfieImage}`
                              }
                              alt="Worker Selfie"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-semibold mb-2">About & Experience</h4>
                        <p className="text-xs text-muted-foreground mb-4 whitespace-pre-wrap">{selectedWorker.about}</p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium bg-muted/30 p-3 rounded-lg border border-primary/5">
                          <span className="flex items-center gap-1 text-primary">
                            <TrendingUp className="h-3 w-3" />
                            {selectedWorker.experience} yrs exp
                          </span>
                          <span className="text-muted-foreground hidden sm:inline">•</span>
                          <span className="text-muted-foreground flex-1 min-w-[200px]">
                            <span className="font-bold text-foreground mr-1">Skills:</span>
                            {selectedWorker.skills.join(", ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t">
                    <Button
                      onClick={() => handleVerify(selectedWorker.id, false)}
                      disabled={loading === selectedWorker.id}
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-50 flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleVerify(selectedWorker.id, true)}
                      disabled={loading === selectedWorker.id}
                      className="bg-green-600 hover:bg-green-700 flex-1"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {loading === selectedWorker.id ? "Verifying..." : "Approve"}
                    </Button>
                  </DialogFooter>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </Card>
      ))}
    </div>
  )
}
