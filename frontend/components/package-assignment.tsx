"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Check, Package, Search, Upload, CreditCard, Calendar } from "lucide-react"
import { packages } from "@/lib/database"
import type { Worker } from "@/lib/database"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

interface PackageAssignmentProps {
  workers: Worker[]
}

export function PackageAssignment({ workers }: PackageAssignmentProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<string>("")
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [transactionId, setTransactionId] = useState("")
  const [assignedPackages, setAssignedPackages] = useState<{ [workerId: string]: string }>({})

  const { toast } = useToast()
  const router = useRouter()

  const filteredWorkers = workers.filter(
    (worker) =>
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSelectWorker = (worker: Worker) => {
    setSelectedWorker(worker)
    setSelectedPackage("")
    setPaymentProof(null)
    setTransactionId("")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0])
    }
  }

  const handleAssignPackage = () => {
    if (selectedWorker && selectedPackage && transactionId) {
      setAssignedPackages({
        ...assignedPackages,
        [selectedWorker.id]: selectedPackage,
      })
      setSelectedWorker(null)
      setSelectedPackage("")
      setPaymentProof(null)
      setTransactionId("")
    }
  }

  const getPackageName = (packageId: string) => {
    const pkg = packages.find((p) => p.id === packageId || p.name.toLowerCase() === packageId.toLowerCase())
    return pkg?.name || "Unknown"
  }



  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search workers by name, email, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12"
        />
      </div>

      {/* Step 1: Select Worker */}
      {!selectedWorker && (
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Select a Worker</h3>
          {filteredWorkers.map((worker) => {
            const assignedPackageId = assignedPackages[worker.id]
            const assignedPackage = packages.find((p) => p.id === assignedPackageId)

            return (
              <Card
                key={worker.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleSelectWorker(worker)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-semibold text-primary">{worker.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{worker.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {worker.email} • ID: {worker.id}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {worker.category} • {worker.city}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {worker.hasPurchasedPackage ? (
                        <>
                          <div className="flex flex-col items-end">
                            <Badge variant="default" className="gap-1 mb-1">
                              <Check className="h-3 w-3" />
                              {worker.packageType ? worker.packageType.charAt(0).toUpperCase() + worker.packageType.slice(1) : "Standard"} Package
                            </Badge>
                            {worker.packagePurchasedAt && (
                              <div className="flex items-center gap-1 text-[10px] text-muted-foreground mr-1">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(worker.packagePurchasedAt), "PPP")}
                              </div>
                            )}
                          </div>
                          {/* Cancel button removed */}
                        </>
                      ) : (
                        <Badge variant="outline">No Active Package</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {filteredWorkers.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No workers found matching your search.</p>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Select Package */}
      {selectedWorker && !selectedPackage && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">
              Select Package for <span className="text-primary">{selectedWorker.name}</span>
            </h3>
            <Button variant="outline" onClick={() => setSelectedWorker(null)}>
              Back
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {packages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${selectedPackage === pkg.id ? "border-primary border-2" : ""
                  }`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                    <div className="text-3xl font-bold text-primary mb-1">Rs. {pkg.price.toLocaleString()}</div>
                    <p className="text-sm text-muted-foreground">{pkg.duration} days</p>
                  </div>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-secondary mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Upload Payment Proof and Transaction ID */}
      {selectedWorker && selectedPackage && (
        <Card className="bg-muted/50">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">Payment Details</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedWorker.name} • {getPackageName(selectedPackage)} Package
                </p>
              </div>
              <Button variant="outline" onClick={() => setSelectedPackage("")}>
                Back
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Transaction ID</Label>
              <Input
                placeholder="Enter transaction ID or reference number"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label>Payment Proof</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="payment-proof"
                />
                <label htmlFor="payment-proof" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">
                    {paymentProof ? paymentProof.name : "Upload payment proof"}
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG or PDF (max 5MB)</p>
                </label>
              </div>
            </div>

            <Button onClick={handleAssignPackage} disabled={!transactionId} className="w-full h-12" size="lg">
              <CreditCard className="mr-2 h-4 w-4" />
              Assign Package to Worker
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
