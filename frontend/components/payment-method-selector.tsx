"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Smartphone, Banknote, Upload } from "lucide-react"

interface PaymentMethodSelectorProps {
  packageType: "basic" | "standard" | "premium"
  price: number
}

export function PaymentMethodSelector({ packageType, price }: PaymentMethodSelectorProps) {
  const [paymentMethod, setPaymentMethod] = useState<"jazzcash" | "easypaisa" | "bank">("jazzcash")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [paymentProof, setPaymentProof] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPaymentProof(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePayment = async () => {
    setIsProcessing(true)

    // Validate based on payment method
    if ((paymentMethod === "jazzcash" || paymentMethod === "easypaisa") && !phoneNumber) {
      alert("Please enter your phone number")
      setIsProcessing(false)
      return
    }

    if (paymentMethod === "bank" && !accountNumber) {
      alert("Please enter your account number")
      setIsProcessing(false)
      return
    }

    if (!paymentProof) {
      alert("Please upload payment proof screenshot")
      setIsProcessing(false)
      return
    }

    // Call API to process payment
    const response = await fetch("/api/process-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        packageType,
        paymentMethod,
        phoneNumber,
        accountNumber,
        amount: price,
        paymentProof,
      }),
      credentials: "include",
    })

    if (response.ok) {
      // Redirect to success page or dashboard
      router.push("/worker/dashboard?payment=pending")
      router.refresh()
    } else {
      alert("Payment failed. Please try again.")
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold">Select Payment Method</h3>
        <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as typeof paymentMethod)}>
          <Card
            className={`cursor-pointer transition-colors ${paymentMethod === "jazzcash" ? "border-primary bg-primary/5" : ""}`}
          >
            <label htmlFor="jazzcash" className="flex items-center gap-4 p-4 cursor-pointer">
              <RadioGroupItem value="jazzcash" id="jazzcash" />
              <Smartphone className="h-8 w-8 text-red-600" />
              <div className="flex-1">
                <div className="font-semibold">JazzCash</div>
                <div className="text-sm text-muted-foreground">Pay via JazzCash Mobile Account</div>
              </div>
            </label>
          </Card>

          <Card
            className={`cursor-pointer transition-colors ${paymentMethod === "easypaisa" ? "border-primary bg-primary/5" : ""}`}
          >
            <label htmlFor="easypaisa" className="flex items-center gap-4 p-4 cursor-pointer">
              <RadioGroupItem value="easypaisa" id="easypaisa" />
              <Smartphone className="h-8 w-8 text-green-600" />
              <div className="flex-1">
                <div className="font-semibold">EasyPaisa</div>
                <div className="text-sm text-muted-foreground">Pay via EasyPaisa Mobile Account</div>
              </div>
            </label>
          </Card>

          <Card
            className={`cursor-pointer transition-colors ${paymentMethod === "bank" ? "border-primary bg-primary/5" : ""}`}
          >
            <label htmlFor="bank" className="flex items-center gap-4 p-4 cursor-pointer">
              <RadioGroupItem value="bank" id="bank" />
              <Banknote className="h-8 w-8 text-blue-600" />
              <div className="flex-1">
                <div className="font-semibold">Bank Transfer</div>
                <div className="text-sm text-muted-foreground">Direct bank account transfer</div>
              </div>
            </label>
          </Card>
        </RadioGroup>
      </div>

      {(paymentMethod === "jazzcash" || paymentMethod === "easypaisa") && (
        <div className="space-y-2">
          <Label htmlFor="phone">Mobile Account Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="03XX XXXXXXX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">Send payment to: 03XX-XXXXXXX (EASY Services)</p>
        </div>
      )}

      {paymentMethod === "bank" && (
        <div className="space-y-2">
          <Label htmlFor="account">Bank Account Number</Label>
          <Input
            id="account"
            placeholder="Enter your account number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">Transfer to: EASY Services - Account: 1234567890 - Bank: HBL</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="proof">Upload Payment Proof Screenshot</Label>
        <div className="flex items-center gap-4">
          <Input id="proof" type="file" accept="image/*" onChange={handleFileUpload} required className="flex-1" />
          {paymentProof && (
            <div className="text-sm text-green-600 flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Uploaded
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Please upload a clear screenshot of your payment transaction</p>
      </div>

      <div className="pt-4 border-t">
        <div className="flex items-center justify-between mb-4">
          <span className="text-muted-foreground">Package:</span>
          <span className="font-semibold capitalize">{packageType}</span>
        </div>
        <div className="flex items-center justify-between mb-6">
          <span className="text-muted-foreground">Total Amount:</span>
          <span className="text-2xl font-bold text-primary">Rs {price.toLocaleString()}</span>
        </div>
        <Button onClick={handlePayment} className="w-full h-12" size="lg" disabled={isProcessing}>
          {isProcessing ? "Submitting..." : "Submit Payment"}
        </Button>
      </div>
    </div>
  )
}
