import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VerificationList } from "@/components/verification-list"
import { WorkersOverview } from "@/components/workers-overview"
import { PaymentVerificationList } from "@/components/payment-verification-list"
import { PackageAssignment } from "@/components/package-assignment"
import { SupportMessagesList } from "@/components/support-messages-list"
import { Users, UserCheck, UserX, TrendingUp, MessageSquare } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageBanner } from "@/components/page-banner"

async function fetchUnverifiedWorkers() {
  try {
    const backendUrl = process.env.BACKEND_URL || "https://easy-e6lz.onrender.com"
    const { cookies } = await import("next/headers")
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join("; ")

    const res = await fetch(`${backendUrl}/api/admin/unverified-workers`, {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    })

    if (!res.ok) {
      return []
    }

    const data = await res.json()
    // Convert MongoDB _id to id for compatibility
    return (data.workers || []).map((w: any) => ({
      ...w,
      id: w._id?.toString() || w.id,
    }))
  } catch (error) {
    console.error("Failed to fetch unverified workers:", error)
    return []
  }
}

async function fetchPendingPaymentWorkers() {
  try {
    const backendUrl = process.env.BACKEND_URL || "https://easy-e6lz.onrender.com"
    const { cookies } = await import("next/headers")
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join("; ")

    const res = await fetch(`${backendUrl}/api/admin/payments-pending`, {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    })

    if (!res.ok) {
      return []
    }

    const data = await res.json()
    // Convert MongoDB _id to id and dates for compatibility
    return (data.workers || []).map((w: any) => ({
      ...w,
      id: w._id?.toString() || w.id,
      packageExpiry: w.packageExpiry ? (typeof w.packageExpiry === 'string' ? new Date(w.packageExpiry) : w.packageExpiry) : null,
      verifiedAt: w.verifiedAt ? (typeof w.verifiedAt === 'string' ? new Date(w.verifiedAt) : w.verifiedAt) : null,
      createdAt: w.createdAt ? (typeof w.createdAt === 'string' ? new Date(w.createdAt) : w.createdAt) : null,
    }))
  } catch (error) {
    console.error("Failed to fetch pending payment workers:", error)
    return []
  }
}

async function fetchAllWorkers() {
  try {
    const backendUrl = process.env.BACKEND_URL || "https://easy-e6lz.onrender.com"
    const res = await fetch(`${backendUrl}/api/workers`, {
      method: "GET",
      cache: "no-store",
    })

    if (!res.ok) {
      return []
    }

    const data = await res.json()
    // Convert MongoDB _id to id and dates for compatibility
    return (data.workers || []).map((w: any) => ({
      ...w,
      id: w._id?.toString() || w.id,
      packageExpiry: w.packageExpiry ? (typeof w.packageExpiry === 'string' ? new Date(w.packageExpiry) : w.packageExpiry) : null,
      verifiedAt: w.verifiedAt ? (typeof w.verifiedAt === 'string' ? new Date(w.verifiedAt) : w.verifiedAt) : null,
      createdAt: w.createdAt ? (typeof w.createdAt === 'string' ? new Date(w.createdAt) : w.createdAt) : null,
    }))
  } catch (error) {
    console.error("Failed to fetch all workers:", error)
    return []
  }
}

async function fetchClientCount() {
  try {
    const backendUrl = process.env.BACKEND_URL || "https://easy-e6lz.onrender.com"
    const { cookies } = await import("next/headers")
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join("; ")

    const res = await fetch(`${backendUrl}/api/admin/client-count`, {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    })

    if (!res.ok) {
      return 0
    }

    const data = await res.json()
    return data.count || 0
  } catch (error) {
    console.error("Failed to fetch client count:", error)
    return 0
  }
}

async function fetchSupportMessages() {
  try {
    const backendUrl = process.env.BACKEND_URL || "https://easy-e6lz.onrender.com"
    const { cookies } = await import("next/headers")
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join("; ")

    const res = await fetch(`${backendUrl}/api/admin/support-messages`, {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    })

    if (!res.ok) {
      return []
    }

    const data = await res.json()
    return data.messages || []
  } catch (error) {
    console.error("Failed to fetch support messages:", error)
    return []
  }
}

export default async function AdminDashboard() {
  const user = await getCurrentUser()

  if (!user || user.role !== "admin") {
    redirect("/login")
  }

  const [unverifiedWorkers, pendingPaymentWorkers, allWorkers, clientCount, supportMessages] = await Promise.all([
    fetchUnverifiedWorkers(),
    fetchPendingPaymentWorkers(),
    fetchAllWorkers(),
    fetchClientCount(),
    fetchSupportMessages(),
  ])

  const verifiedWorkers = allWorkers.filter((w: any) => w.isVerified)

  return (
    <>
      <Header />

      <PageBanner
        image="/admin-banner.jpg"
        title="Admin Dashboard"
        description="Manage workers, verifications, and platform operations"
        height="sm"
      />

      <main className="min-h-screen bg-muted/40">
        <div className="container mx-auto px-4 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total clients</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clientCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Verified Workers</CardTitle>
                <UserCheck className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{verifiedWorkers.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending Verification</CardTitle>
                <UserX className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{unverifiedWorkers.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payment</CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingPaymentWorkers.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Inquiries</CardTitle>
                <MessageSquare className="h-4 w-4 text-pink-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{supportMessages.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="verification" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 max-w-4xl">
              <TabsTrigger value="verification">Pending</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="packages">Packages</TabsTrigger>
              <TabsTrigger value="workers">Workers</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
            </TabsList>

            <TabsContent value="verification">
              <Card>
                <CardHeader>
                  <CardTitle>Workers Pending Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <VerificationList workers={unverifiedWorkers} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle>Workers Pending Payment Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <PaymentVerificationList workers={pendingPaymentWorkers} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="packages">
              <Card>
                <CardHeader>
                  <CardTitle>Assign Packages to Workers</CardTitle>
                </CardHeader>
                <CardContent>
                  <PackageAssignment workers={verifiedWorkers} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="workers">
              <Card>
                <CardHeader>
                  <CardTitle>All Registered Workers</CardTitle>
                </CardHeader>
                <CardContent>
                  <WorkersOverview workers={allWorkers} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="support">
              <Card>
                <CardHeader>
                  <CardTitle>Help & Support Inquiries</CardTitle>
                </CardHeader>
                <CardContent>
                  <SupportMessagesList messages={supportMessages} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </>
  )
}
