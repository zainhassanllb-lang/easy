"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Banknote, Upload, CheckCircle2, Info, Loader2, Image as ImageIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"

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
  const fileInputRef = useRef<HTMLInputElement>(null)
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

  const removeFile = () => {
    setPaymentProof("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handlePayment = async () => {
    setIsProcessing(true)

    if ((paymentMethod === "jazzcash" || paymentMethod === "easypaisa") && !phoneNumber) {
      alert("Please enter your mobile account number")
      setIsProcessing(false)
      return
    }

    if (paymentMethod === "bank" && !accountNumber) {
      alert("Please enter your bank account number")
      setIsProcessing(false)
      return
    }

    if (!paymentProof) {
      alert("Please upload payment proof screenshot")
      setIsProcessing(false)
      return
    }

    try {
      const response = await fetch("/api/process-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageType: packageType.toLowerCase(),
          paymentMethod,
          phoneNumber,
          accountNumber,
          amount: price,
          paymentProof,
        }),
        credentials: "include",
      })

      if (response.ok) {
        router.push("/worker/dashboard?payment=pending")
        router.refresh()
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.error || "Payment submission failed. Please try again.");
        setIsProcessing(false);
      }
    } catch (error) {
      alert("Network error. Please check your connection.")
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-1 bg-primary rounded-full" />
          <h3 className="font-bold text-lg">Choose Your Method</h3>
        </div>

        <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as typeof paymentMethod)} className="grid grid-cols-1 gap-4">
          <label
            htmlFor="jazzcash"
            className={cn(
              "relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer group",
              paymentMethod === "jazzcash" ? "border-primary bg-primary/5 ring-4 ring-primary/10" : "border-muted hover:border-muted-foreground/30 hover:bg-muted/5"
            )}
          >
            <RadioGroupItem value="jazzcash" id="jazzcash" className="sr-only" />
            <div className={cn(
              "h-12 w-12 rounded-lg flex items-center justify-center transition-colors",
              paymentMethod === "jazzcash" ? "bg-red-600 text-white" : "bg-red-100 text-red-600 group-hover:bg-red-200"
            )}>
              <Smartphone className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="font-bold">JazzCash</div>
              <div className="text-xs text-muted-foreground group-hover:text-muted-foreground/80">Mobile Wallet</div>
            </div>
            {paymentMethod === "jazzcash" && <CheckCircle2 className="h-5 w-5 text-primary animate-in zoom-in" />}
          </label>

          <label
            htmlFor="easypaisa"
            className={cn(
              "relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer group",
              paymentMethod === "easypaisa" ? "border-primary bg-primary/5 ring-4 ring-primary/10" : "border-muted hover:border-muted-foreground/30 hover:bg-muted/5"
            )}
          >
            <RadioGroupItem value="easypaisa" id="easypaisa" className="sr-only" />
            <div className={cn(
              "h-12 w-12 rounded-lg flex items-center justify-center transition-colors",
              paymentMethod === "easypaisa" ? "bg-green-600 text-white" : "bg-green-50 text-green-600 group-hover:bg-green-100"
            )}>
              <Smartphone className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="font-bold">EasyPaisa</div>
              <div className="text-xs text-muted-foreground group-hover:text-muted-foreground/80">Mobile Wallet</div>
            </div>
            {paymentMethod === "easypaisa" && <CheckCircle2 className="h-5 w-5 text-primary animate-in zoom-in" />}
          </label>

          <label
            htmlFor="bank"
            className={cn(
              "relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer group",
              paymentMethod === "bank" ? "border-primary bg-primary/5 ring-4 ring-primary/10" : "border-muted hover:border-muted-foreground/30 hover:bg-muted/5"
            )}
          >
            <RadioGroupItem value="bank" id="bank" className="sr-only" />
            <div className={cn(
              "h-12 w-12 rounded-lg flex items-center justify-center transition-colors",
              paymentMethod === "bank" ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
            )}>
              <Banknote className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="font-bold">Local Bank</div>
              <div className="text-xs text-muted-foreground group-hover:text-muted-foreground/80">Direct Transfer</div>
            </div>
            {paymentMethod === "bank" && <CheckCircle2 className="h-5 w-5 text-primary animate-in zoom-in" />}
          </label>
        </RadioGroup>
      </div>

      <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
        <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-primary">
            <Info className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-widest">How to pay</span>
          </div>

          {paymentMethod !== "bank" ? (
            <div className="space-y-4">
              <div className="flex flex-col gap-1 px-4 py-3 bg-white/5 rounded-xl border border-white/10 group active:scale-95 transition-transform cursor-pointer overflow-hidden relative">
                <div className="absolute top-0 right-0 p-2 opacity-5">
                  <Smartphone className="h-12 w-12" />
                </div>
                <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-tight">Account Number</span>
                <span className="text-xl font-mono font-bold tracking-widest text-primary">0300 1234567</span>
                <span className="text-[10px] text-zinc-500 font-medium">Click to copy</span>
              </div>
              <div className="flex flex-col gap-1 px-4 py-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-tight">Account Name</span>
                <span className="text-lg font-bold">EASY Services (Pvt) Ltd</span>
              </div>
              <p className="text-xs text-zinc-400 italic">
                * Send exactly Rs {price.toLocaleString()} to the number above via {paymentMethod === "jazzcash" ? "JazzCash" : "EasyPaisa"}.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col gap-1 px-4 py-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-tight">Bank Name</span>
                <span className="text-lg font-bold text-primary">HBL - Habib Bank Limited</span>
              </div>
              <div className="flex flex-col gap-1 px-4 py-3 bg-white/5 rounded-xl border border-white/10 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-2 opacity-5">
                  <Banknote className="h-12 w-12" />
                </div>
                <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-tight">IBAN / Account Number</span>
                <span className="text-lg font-mono font-bold tracking-tight text-primary">PK12 HBLA 1234 5678 9012 34</span>
              </div>
              <div className="flex flex-col gap-1 px-4 py-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-tight">Account Title</span>
                <span className="text-lg font-bold">EASY SERVICES PVT LTD</span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="account-info" className="text-sm font-bold flex items-center justify-between">
            {paymentMethod === "bank" ? "Your Account Number" : "Your Mobile Number"}
            <Badge variant="outline" className="text-[10px] h-5">Required</Badge>
          </Label>
          <div className="relative group">
            {paymentMethod === "bank" ? <Banknote className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" /> : <Smartphone className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />}
            <Input
              id="account-info"
              type={paymentMethod === "bank" ? "text" : "tel"}
              placeholder={paymentMethod === "bank" ? "Enter your bank account or IBAN" : "03XX XXXXXXX"}
              value={paymentMethod === "bank" ? accountNumber : phoneNumber}
              onChange={(e) => paymentMethod === "bank" ? setAccountNumber(e.target.value) : setPhoneNumber(e.target.value)}
              className="pl-10 h-11 rounded-xl"
              required
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-bold">Upload Payment Receipt</Label>
          <div
            className={cn(
              "relative group flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 transition-all overflow-hidden min-h-[160px]",
              paymentProof ? "border-primary/50 bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5"
            )}
          >
            {paymentProof ? (
              <div className="space-y-4 w-full flex flex-col items-center">
                <div className="relative w-full max-w-[240px] aspect-video border-4 border-background rounded-lg shadow-xl overflow-hidden group/preview">
                  <img src={paymentProof} alt="Payment Proof" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={removeFile}
                    className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover/preview:opacity-100 transition-opacity shadow-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  Screenshot Uploaded
                </div>
                <Button variant="outline" size="sm" type="button" onClick={() => fileInputRef.current?.click()}>
                  Change Image
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="p-4 bg-muted/20 rounded-full group-hover:scale-110 transition-transform">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-bold text-sm">Upload Payment Proof</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG or Screenshot up to 10MB</p>
                </div>
                <Button variant="secondary" size="sm" className="mt-2 rounded-full px-8 pointer-events-none">
                  Select File
                </Button>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
            />
          </div>
        </div>
      </div>

      <div className="pt-6 border-t space-y-4">
        <Button
          onClick={handlePayment}
          className="w-full h-14 text-lg font-bold rounded-2xl shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
          size="lg"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            "Complete My Payment"
          )}
        </Button>
      </div>
    </div>
  )
}
