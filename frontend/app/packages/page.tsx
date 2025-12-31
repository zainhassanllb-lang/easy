import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { packages } from "@/lib/database"
import { Check } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageBanner } from "@/components/page-banner"
import { PackagePurchaseButton } from "@/components/package-purchase-button"

export default async function PackagesPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "worker") {
    redirect("/login")
  }

  return (
    <>
      <Header />
      <PageBanner
        image="/packages-banner.jpg"
        title="Choose Your Package"
        description="Select the package that best fits your business needs"
        height="md"
      />
      <main className="min-h-screen bg-muted/40 py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center max-w-5xl mx-auto">
            {packages.map((pkg) => (
              <Card key={pkg.id} className="border-primary border-2 shadow-lg relative w-full max-w-md">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary">Standard Plan</Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-center">
                    <div className="text-2xl font-bold mb-2">{pkg.name}</div>
                    <div className="text-3xl font-bold text-primary">
                      Rs {pkg.price.toLocaleString()}
                      <span className="text-base font-normal text-muted-foreground">/month</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <PackagePurchaseButton packageType={pkg.name.toLowerCase() as "basic" | "standard" | "premium"} />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
