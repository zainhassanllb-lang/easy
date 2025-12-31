import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { EditProfileForm } from "@/components/edit-profile-form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageBanner } from "@/components/page-banner"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

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

export default async function EditProfilePage() {
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
            <Link href="/worker/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <PageBanner
        image="/worker-profile-banner.jpg"
        title="Edit Your Profile"
        description="Update your information to attract more customers"
        height="md"
      />
      <main className="min-h-[60vh] bg-muted/40 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link href="/worker/dashboard">
            <Button variant="default" size="sm" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <Alert className="mb-6 border-blue-500 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900 text-sm">
              After saving changes, your profile will be sent for admin verification again before becoming visible to
              customers.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Update your professional information</CardDescription>
            </CardHeader>
            <CardContent>
              <EditProfileForm worker={worker} />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}
