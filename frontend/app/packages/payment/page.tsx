import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageBanner } from "@/components/page-banner"
import { PaymentMethodSelector } from "@/components/payment-method-selector"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface PageProps {
  searchParams: Promise<{
    package?: string
    price?: string
  }>
}

export default async function PaymentPage({ searchParams }: PageProps) {
  const user = await getCurrentUser()
  const params = await searchParams

  if (!user || user.role !== "worker") {
    redirect("/login")
  }

  const packageType = params.package || "basic"
  const price = params.price || "2000"

  return (
    <>
      <Header />
      <PageBanner
        image="/packages-banner.jpg"
        title="Complete Your Payment"
        description="Choose your preferred payment method"
        height="sm"
      />
      <main className="min-h-screen bg-muted/40 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Link href="/packages">
            <Button variant="default" size="sm" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Packages
            </Button>
          </Link>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>
                Package: <span className="capitalize font-semibold">{packageType}</span> - Rs{" "}
                {Number.parseInt(price).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentMethodSelector
                packageType={packageType as "basic" | "standard" | "premium"}
                price={Number.parseInt(price)}
              />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}

