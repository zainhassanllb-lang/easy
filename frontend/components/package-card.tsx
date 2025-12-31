import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Worker } from "@/lib/database"
import { Calendar, AlertCircle } from "lucide-react"
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
        <CardTitle>Your Package imran </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {worker.packageType ? (
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
