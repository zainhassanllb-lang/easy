"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface PackagePurchaseButtonProps {
  packageType: "basic" | "standard" | "premium"
}

export function PackagePurchaseButton({ packageType }: PackagePurchaseButtonProps) {
  const router = useRouter()

  function handlePurchase() {
    const prices = { basic: 2000, standard: 3000, premium: 7000 }
    router.push(`/packages/payment?package=${packageType}&price=${prices[packageType]}`)
  }

  return (
    <Button onClick={handlePurchase} className="w-full" variant={packageType === "standard" ? "default" : "outline"}>
      Choose {packageType.charAt(0).toUpperCase() + packageType.slice(1)}
    </Button>
  )
}
