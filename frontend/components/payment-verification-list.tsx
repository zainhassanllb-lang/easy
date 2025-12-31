"use client"

import { useState } from "react"
import type { Worker } from "@/lib/database"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, Eye, Phone, Mail, MapPin } from "lucide-react"
import Image from "next/image"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface PaymentVerificationListProps {
  workers: Worker[]
}

export function PaymentVerificationList({ workers }: PaymentVerificationListProps) {
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleVerifyPayment = async (workerId: string, approved: boolean) => {
    setProcessing(true)
    try {
      const response = await fetch("/api/admin/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workerId, approved }),
        credentials: "include",
      })

      if (response.ok) {
        window.location.reload()
      } else {
        const error = await response.json().catch(() => ({ error: "Failed to verify payment" }))
        alert(error.error || "Failed to verify payment")
      }
    } catch (error) {
      console.error("Payment verification error:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setProcessing(false)
    }
  }

  if (workers.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No workers pending payment verification</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {workers.map((worker) => (
          <Card key={worker.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <Image
                    src={
                      worker.profileImage
                        ? (worker.profileImage.startsWith('http')
                          ? worker.profileImage
                          : worker.profileImage.startsWith('/')
                            ? `${process.env.NEXT_PUBLIC_BACKEND_URL || "https://easy-e6lz.onrender.com"}${worker.profileImage}`
                            : `${process.env.NEXT_PUBLIC_BACKEND_URL || "https://easy-e6lz.onrender.com"}/uploads/workers/${worker.profileImage}`)
                        : "/placeholder.svg?height=120&width=120"
                    }
                    alt={worker.name}
                    width={120}
                    height={120}
                    className="rounded-lg object-cover"
                    unoptimized
                  />
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{worker.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{worker.category}</p>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {worker.packageType || "No Package"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {worker.email}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {worker.phone}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {worker.city}, {worker.locality}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedWorker(worker)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Payment Proof
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleVerifyPayment(worker.id, true)}
                      disabled={processing}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleVerifyPayment(worker.id, false)}
                      disabled={processing}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedWorker} onOpenChange={() => setSelectedWorker(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Payment Proof - {selectedWorker?.name}</DialogTitle>
            <DialogDescription>
              Package: <span className="capitalize font-semibold">{selectedWorker?.packageType}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedWorker?.paymentProof && (
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <Image
                  src={
                    selectedWorker.paymentProof.startsWith('http')
                      ? selectedWorker.paymentProof
                      : selectedWorker.paymentProof.startsWith('/')
                        ? `https://easy-e6lz.onrender.com${selectedWorker.paymentProof}`
                        : `https://easy-e6lz.onrender.com/uploads/payments/${selectedWorker.paymentProof}`
                  }
                  alt="Payment Proof"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            )}
            {!selectedWorker?.paymentProof && (
              <div className="text-center py-12 text-muted-foreground">No payment proof uploaded</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
