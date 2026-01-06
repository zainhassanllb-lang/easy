
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { EditProfileForm } from "@/components/edit-profile-form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageBanner } from "@/components/page-banner"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

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

        if (worker) {
            if (worker._id) worker.id = worker._id.toString()
            // Ensure arrays
            if (typeof worker.skills === 'string') {
                worker.skills = worker.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
            }
            if (typeof worker.locality === 'string') {
                worker.locality = [worker.locality]
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

    const worker = await getWorkerProfile()

    if (!worker) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 flex items-center justify-center bg-muted/40">
                    <div className="text-center p-8">
                        <h1 className="text-2xl font-bold mb-4">Worker Profile Not Found</h1>
                        <p className="text-muted-foreground mb-6">Your worker profile could not be loaded. Please contact support.</p>
                        <Button asChild>
                            <Link href="/worker/dashboard">Back to Dashboard</Link>
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-1 bg-muted/40 pb-12">
                <PageBanner
                    image="/worker-profile-banner.jpg"
                    title="Edit Your Profile"
                    description="Update your information to attract more customers"
                    height="md"
                />

                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    <div className="mb-6">
                        <Link href="/worker/dashboard" className="inline-flex items-center text-sm text-primary hover:underline">
                            <Button variant="default" size="sm" className="mb-6">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Dashboard
                            </Button>
                        </Link>
                    </div>

                    <Alert className="mb-6 border-blue-500 bg-blue-50">
                        <Info className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-900 text-sm">
                            Note: Updating sensitive information (like CNIC) will require admin re-verification before your profile becomes visible again.
                        </AlertDescription>
                    </Alert>

                    <Card className="shadow-lg border-0 bg-card">
                        <CardHeader className="border-b bg-muted/20 pb-8">
                            <CardTitle className="text-2xl">Profile Information</CardTitle>
                            <CardDescription>
                                Ensure your details are accurate and professional.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <EditProfileForm worker={worker} />
                        </CardContent>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    )
}
