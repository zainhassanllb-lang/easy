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
        height="md"
      />
      <main className="min-h-screen bg-muted/40 py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Link href="/packages" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8 group">
            <Button variant="default" size="sm" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Packages
            </Button>
          </Link>

          <div className="space-y-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold tracking-tight">Check Out</h1>
              <p className="text-muted-foreground">Securely upgrade your profile to start receiving more leads.</p>
            </div>

            <Card className="border-none shadow-xl overflow-hidden ring-1 ring-black/5">
              <CardHeader className="bg-primary/5 border-b pb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl">Plan Summary</CardTitle>
                    <CardDescription className="mt-1">Review your selected package</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Amount</div>
                    <div className="text-2xl font-black text-primary">Rs {Number.parseInt(price).toLocaleString()}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-6 border-b bg-white/50">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <div className="h-6 w-6 rounded-full bg-primary animate-pulse" />
                    </div>
                    <div>
                      <div className="font-bold text-lg capitalize">{packageType} Package</div>
                      <div className="text-sm text-muted-foreground">Valid for 30 days once approved</div>
                    </div>
                  </div>
                </div>
                <div className="p-6 pt-8">
                  <PaymentMethodSelector
                    packageType={packageType as "basic" | "standard" | "premium"}
                    price={Number.parseInt(price)}
                  />
                </div>
              </CardContent>
            </Card>

            <p className="text-center text-xs text-muted-foreground px-8 mt-6">
              By completing this payment, you agree to our Terms of Service. Your package will be activated after our team verifies the payment proof.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

