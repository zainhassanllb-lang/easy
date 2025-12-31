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

async function getWorkerProfile() {
  try {
    const backendUrl = process.env.BACKEND_URL || "https://easy-e6lz.onrender.com"
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
    <>
      <Header />

      <PageBanner
        image="/worker-dashboard-banner.jpg"
        title={`Welcome back, ${worker.name}`}
        description="Manage your profile, track analytics, and grow your business"
        height="md"
      />

      <main className="min-h-screen bg-muted/40">
        <div className="container mx-auto px-4 py-8">
          {worker.paymentStatus === "pending" && (
            <Alert variant="default" className="mb-6 border-orange-500 bg-orange-50">
              <Clock className="h-4 w-4 text-orange-600" />
              <AlertTitle className="text-orange-900">Payment Verification Pending</AlertTitle>
              <AlertDescription className="text-orange-800">
                Your payment proof is under review by the admin team. Once approved, your profile will be visible to
                customers.
              </AlertDescription>
            </Alert>
          )}

          {worker.paymentStatus === "rejected" && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Payment Check Failed</AlertTitle>
              <AlertDescription>
                Your payment proof was rejected. Please try again or contact support.
                <Link href="/packages" className="block mt-3">
                  <Button size="sm" variant="outline" className="border-red-600 text-red-900 bg-white hover:bg-red-50">
                    Retry Payment
                  </Button>
                </Link>
              </AlertDescription>
            </Alert>
          )}

          {worker.verificationStatus === "rejected" && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Verification Rejected</AlertTitle>
              <AlertDescription>
                Your verification documents were rejected by our admin team. Please re-submit your documents with the
                correct information.
                <Link href="/worker/verification" className="block mt-3">
                  <Button size="sm" variant="outline" className="border-red-600 text-red-900 bg-white hover:bg-red-50">
                    Re-submit Documents
                  </Button>
                </Link>
              </AlertDescription>
            </Alert>
          )}

          {worker.verificationStatus === "pending" && !worker.isVerified && (
            <Alert variant="default" className="mb-6 border-yellow-500 bg-yellow-50">
              <Clock className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-900">Verification Pending</AlertTitle>
              <AlertDescription className="text-yellow-800">
                Your profile is under review by our admin team. You cannot purchase a package until verified.
              </AlertDescription>
            </Alert>
          )}

          {worker.isVerified && !worker.hasPurchasedPackage && (
            <Alert className="mb-6 border-blue-500 bg-blue-50">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-900">Profile Verified!</AlertTitle>
              <AlertDescription className="text-blue-800">
                Your profile is verified. Purchase a package to make your profile visible to customers.
                <Link href="/packages" className="block mt-3">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Choose Package
                  </Button>
                </Link>
              </AlertDescription>
            </Alert>
          )}

          {packageExpired && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Package Expired</AlertTitle>
              <AlertDescription>
                Your package has expired. Your profile is no longer visible to customers. Please renew your package to
                continue receiving leads.
              </AlertDescription>
              <Link href="/packages" className="mt-3 inline-block">
                <Button size="sm">Renew Package</Button>
              </Link>
            </Alert>
          )}

          {!packageExpired && daysUntilExpiry <= 7 && daysUntilExpiry > 0 && (
            <Alert className="mb-6 border-yellow-500 bg-yellow-50">
              <Clock className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-900">Package Expiring Soon</AlertTitle>
              <AlertDescription className="text-yellow-800">
                Your package will expire in {daysUntilExpiry} {daysUntilExpiry === 1 ? "day" : "days"}. Renew now to
                avoid service interruption.
              </AlertDescription>
              <Link href="/packages" className="mt-3 inline-block">
                <Button size="sm" variant="outline" className="border-yellow-600 text-yellow-900 bg-transparent">
                  Renew Now
                </Button>
              </Link>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats */}
              <DashboardStats worker={worker} />

              {/* Profile Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProfileCard worker={worker} />
                </CardContent>
              </Card>

              {worker.verificationStatus === "pending" && !worker.isVerified && (
                <Card className="border-yellow-500/50 bg-yellow-500/5">
                  <CardHeader>
                    <CardTitle className="text-yellow-600">Verification Pending</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Your profile is under review. Please upload your CNIC documents to get verified.
                    </p>
                    <Link href="/worker/verification">
                      <Button>Upload Documents</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              {worker.isVerified && !worker.hasPurchasedPackage && (
                <Card className="border-blue-500/50 bg-blue-500/5">
                  <CardHeader>
                    <CardTitle className="text-blue-600 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Verified! Now Choose a Package
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Congratulations! Your profile is verified. To make your profile visible to customers, please
                      purchase a package.
                    </p>
                    <Link href="/packages">
                      <Button>Choose Package</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Package Info */}
              <PackageCard worker={worker} />

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">

                  <Link href="/worker/verification" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      Verification
                    </Button>
                  </Link>
                  <Link href="/register/worker" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      Edit Profile
                    </Button>
                  </Link>
                  <Link href="/packages" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      View Packages
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
