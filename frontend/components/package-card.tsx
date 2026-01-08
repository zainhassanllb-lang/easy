import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Worker } from "@/lib/database"
import { Calendar, AlertCircle, Clock } from "lucide-react"
import Link from "next/link"

export function PackageCard({ worker }: { worker: Worker }) {
  // Handle packageExpiry as string (from MongoDB) or Date object
  const expiryDate = worker.packageExpiry
    ? (typeof worker.packageExpiry === 'string' ? new Date(worker.packageExpiry) : worker.packageExpiry)
    : null

  const daysLeft = expiryDate
    ? Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0
  const isExpired = daysLeft < 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Package</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {worker.paymentStatus === 'pending' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Current Plan</span>
              <Badge className="capitalize">{worker.packageType}</Badge>
            </div>
            <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-700 rounded-lg border border-amber-100">
              <Clock className="h-4 w-4" />
              <p className="text-xs font-semibold">Payment Proof Pending Verification</p>
            </div>
            <p className="text-[10px] text-muted-foreground italic text-center">Your profile will be visible once admin verifies the payment.</p>
          </div>
        ) : worker.paymentStatus === 'rejected' ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg border border-red-100">
              <AlertCircle className="h-4 w-4" />
              <p className="text-xs font-semibold">Payment Rejected</p>
            </div>
            <p className="text-xs text-muted-foreground">The admin rejected your payment proof. Please resubmit or contact support.</p>
            <Link href="/packages">
              <Button className="w-full" variant="destructive">Try Again</Button>
            </Link>
          </div>
        ) : worker.packageType && worker.paymentStatus === 'verified' ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Current Plan</span>
              <Badge className="capitalize">{worker.packageType}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Days Remaining</span>
              <div className="flex items-center gap-1">
                {isExpired ? (
                  <>
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="font-semibold text-red-500">Expired</span>
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className={`font-semibold ${daysLeft <= 7 ? "text-yellow-600" : ""}`}>{daysLeft} days</span>
                  </>
                )}
              </div>
            </div>
            <Link href="/packages" className="block">
              <Button variant="outline" className="w-full bg-transparent">
                {isExpired ? "Renew Package" : "View Package"}
              </Button>
            </Link>
          </>
        ) : worker.isVerified ? (
          <>
            <p className="text-sm text-muted-foreground">Purchase a package to make your profile visible</p>
            <Link href="/packages">
              <Button className="w-full">Choose Package</Button>
            </Link>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">Complete verification first, then purchase a package</p>
            <Link href="/worker/verification">
              <Button className="w-full">Complete Verification</Button>
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  )
}
