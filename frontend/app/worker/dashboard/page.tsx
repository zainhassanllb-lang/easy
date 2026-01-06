import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { DashboardStats } from "@/components/dashboard-stats"
import { ProfileCard } from "@/components/profile-card"
import { PackageCard } from "@/components/package-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { PageBanner } from "@/components/page-banner"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AlertCircle, CheckCircle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

async function getWorkerProfile() {
  try {
    const backendUrl = process.env.BACKEND_URL || "https://easy-backend-pkd1.onrender.com"
    const { cookies } = await import("next/headers")
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join("; ")

    // First get current user to get profileId
    const userRes = await fetch(`${backendUrl}/api/current-user`, {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    })

    const userData = await userRes.json()

    if (!userData.user || userData.user.role !== "worker" || !userData.user.profileId) {
      return null
    }

    // Fetch worker profile by ID
    const workerRes = await fetch(`${backendUrl}/api/workers/${userData.user.profileId}`, {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    })

    if (!workerRes.ok) {
      return null
    }

    const workerData = await workerRes.json()
    const worker = workerData.worker || null

    // Convert MongoDB _id to id for compatibility
    if (worker && worker._id) {
      worker.id = worker._id.toString()
    }

    // Convert date strings to Date objects for compatibility
    if (worker) {
      if (worker.packageExpiry && typeof worker.packageExpiry === 'string') {
        worker.packageExpiry = new Date(worker.packageExpiry)
      }
      if (worker.verifiedAt && typeof worker.verifiedAt === 'string') {
        worker.verifiedAt = new Date(worker.verifiedAt)
      }
      if (worker.createdAt && typeof worker.createdAt === 'string') {
        worker.createdAt = new Date(worker.createdAt)
      }
    }

    return worker
  } catch (error) {
    console.error("Failed to fetch worker profile:", error)
    return null
  }
}

function isPackageExpired(worker: any): boolean {
  if (!worker.packageExpiry) return false
  // Handle both string and Date object
  const expiryDate = typeof worker.packageExpiry === 'string'
    ? new Date(worker.packageExpiry)
    : worker.packageExpiry
  return expiryDate < new Date()
}

function getDaysUntilExpiry(worker: any): number {
  if (!worker.packageExpiry) return 0
  // Handle both string and Date object
  const expiryDate = typeof worker.packageExpiry === 'string'
    ? new Date(worker.packageExpiry)
    : worker.packageExpiry
  const today = new Date()
  const diff = expiryDate.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export default async function WorkerDashboard() {
  const user = await getCurrentUser()

  if (!user || user.role !== "worker") {
    redirect("/login")
  }

  // Fetch worker profile from backend
  const worker = await getWorkerProfile()

  if (!worker) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Worker Profile Not Found</h1>
          <p className="text-muted-foreground mb-6">Your worker profile could not be loaded. Please contact support.</p>
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  const packageExpired = isPackageExpired(worker)
  const daysUntilExpiry = getDaysUntilExpiry(worker)

  return (
    <div className="flex flex-col min-h-screen bg-muted/5">
      <Header />

      <PageBanner
        image="/worker-dashboard-banner.jpg"
        title={`Welcome back, ${worker.name}`}
        description="Manage your profile, track analytics, and grow your business"
        height="md"
      />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-6xl">

          {/* Status Alerts Section */}
          <div className="space-y-4 mb-10">
            {worker.paymentStatus === "pending" && (
              <Alert variant="default" className="border-orange-500/50 bg-orange-50 dark:bg-orange-950/20">
                <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <AlertTitle className="text-orange-900 dark:text-orange-100 font-semibold ml-2">Payment Verification Pending</AlertTitle>
                <AlertDescription className="text-orange-800 dark:text-orange-200 ml-2 mt-1">
                  Your payment proof is under review. Once approved, your profile will be public.
                </AlertDescription>
              </Alert>
            )}

            {worker.paymentStatus === "rejected" && (
              <Alert variant="destructive">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle className="font-semibold ml-2">Payment Check Failed</AlertTitle>
                <AlertDescription className="ml-2 mt-1 flex items-center justify-between flex-wrap gap-4">
                  <span>Your payment proof was rejected. Please try again.</span>
                  <Button asChild size="sm" variant="outline" className="bg-background">
                    <Link href="/packages">Retry Payment</Link>
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {worker.verificationStatus === "rejected" && (
              <Alert variant="destructive">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle className="font-semibold ml-2">Verification Rejected</AlertTitle>
                <AlertDescription className="ml-2 mt-1 flex items-center justify-between flex-wrap gap-4">
                  <span>Your documents were rejected. Please re-submit correct information.</span>
                  <Button asChild size="sm" variant="outline" className="bg-background">
                    <Link href="/worker/verification">Re-submit Documents</Link>
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {worker.verificationStatus === "pending" && !worker.isVerified && (
              <Alert variant="default" className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <AlertTitle className="text-yellow-900 dark:text-yellow-100 font-semibold ml-2">Verification Pending</AlertTitle>
                <AlertDescription className="text-yellow-800 dark:text-yellow-200 ml-2 mt-1">
                  Your profile is being reviewed. You'll be able to purchase a package once verified.
                </AlertDescription>
              </Alert>
            )}

            {packageExpired && (
              <Alert variant="destructive">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle className="font-semibold ml-2">Package Expired</AlertTitle>
                <AlertDescription className="ml-2 mt-1 flex items-center justify-between flex-wrap gap-4">
                  <span>Your profile is currently hidden. Renew your package to be visible again.</span>
                  <Button asChild size="sm" className="bg-white text-destructive hover:bg-gray-100 dark:bg-destructive-foreground dark:text-destructive">
                    <Link href="/packages">Renew Package</Link>
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {!packageExpired && daysUntilExpiry <= 7 && daysUntilExpiry > 0 && (
              <Alert className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <AlertTitle className="text-yellow-900 dark:text-yellow-100 font-semibold ml-2">Package Expiring Soon</AlertTitle>
                <AlertDescription className="text-yellow-800 dark:text-yellow-200 ml-2 mt-1 flex items-center justify-between flex-wrap gap-4">
                  <span>Your package expires in {daysUntilExpiry} days.</span>
                  <Button asChild size="sm" variant="outline" className="border-yellow-600 text-yellow-900 hover:bg-yellow-100">
                    <Link href="/packages">Renew Now</Link>
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </div>


          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Stats & Quick Actions */}
            <div className="lg:col-span-8 space-y-8">

              {/* Quick Actions Grid */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold tracking-tight">Quick Actions</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href="/worker/edit-profile" className="contents">
                    <Card className="hover:shadow-md transition-all cursor-pointer hover:border-primary/50 group">
                      <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                        <span className="font-medium text-sm">Edit Profile</span>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/packages" className="contents">
                    <Card className="hover:shadow-md transition-all cursor-pointer hover:border-primary/50 group">
                      <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <Clock className="h-5 w-5" />
                        </div>
                        <span className="font-medium text-sm">Packages</span>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/worker/verification" className="contents">
                    <Card className="hover:shadow-md transition-all cursor-pointer hover:border-primary/50 group">
                      <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <AlertCircle className="h-5 w-5" />
                        </div>
                        <span className="font-medium text-sm">Verification</span>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href={`/worker/${worker.id}`} className="contents">
                    <Card className="hover:shadow-md transition-all cursor-pointer hover:border-primary/50 group">
                      <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <Clock className="h-5 w-5" />
                        </div>
                        <span className="font-medium text-sm">View Public Profile</span>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </section>

              {/* Stats Section */}
              <section>
                <h2 className="text-xl font-bold tracking-tight mb-4">Analytics Overview</h2>
                <DashboardStats worker={worker} />
              </section>

              {/* Recent Reviews or Activity could go here */}

            </div>

            {/* Right Column - Profile Snapshot & Package */}
            <div className="lg:col-span-4 space-y-8">

              {/* Profile Snapshot */}
              <Card className="overflow-hidden border-none shadow-lg">
                <div className="h-24 bg-gradient-to-r from-primary/80 to-primary/40" />
                <CardContent className="relative pt-0 px-6 pb-6">
                  <div className="absolute -top-12 left-6 border-4 border-background rounded-full overflow-hidden h-24 w-24">
                    {/* Use a simpleimg tag or Avatar here since we might not have the complexity of ProfileCard */}
                    <img src={worker.profileImage || "/placeholder.svg"} alt={worker.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="mt-14 mb-4">
                    <h3 className="text-xl font-bold">{worker.name}</h3>
                    <p className="text-muted-foreground capitalize">{worker.category} • {worker.city}</p>
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant={worker.isVerified ? "default" : "outline"} className={worker.isVerified ? "bg-green-600" : ""}>
                        {worker.isVerified ? "Verified" : "Unverified"}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Member Since</span>
                      <span className="font-medium">{worker.createdAt ? new Date(worker.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>

                  <Button asChild className="w-full mt-6" variant="outline">
                    <Link href="/worker/edit-profile">Edit Full Profile</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Current Package */}
              <PackageCard worker={worker} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

