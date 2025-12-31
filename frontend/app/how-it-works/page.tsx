import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageBanner } from "@/components/page-banner"
import { Card, CardContent } from "@/components/ui/card"
import { Search, CheckCircle, Phone, UserPlus, FileCheck, CreditCard } from "lucide-react"

export default function HowItWorksPage() {
  const clientSteps = [
    {
      icon: Search,
      title: "Select Your Location",
      description: "Choose your city and area to find services available near you",
    },
    {
      icon: CheckCircle,
      title: "Browse Services",
      description: "Explore different service categories and view verified worker profiles",
    },
    {
      icon: Phone,
      title: "Contact Workers",
      description: "Call or WhatsApp workers directly to discuss your requirements and book services",
    },
  ]

  const workerSteps = [
    {
      icon: UserPlus,
      title: "Register Your Profile",
      description: "Create your account with complete details including skills, experience, and service area",
    },
    {
      icon: FileCheck,
      title: "Get Verified",
      description: "Upload your CNIC documents for admin verification to build trust with clients",
    },
    {
      icon: CreditCard,
      title: "Choose a Package",
      description: "Select a package that fits your needs to increase visibility and get more leads",
    },
  ]

  return (
    <>
      <Header />

      <PageBanner
        image="/how-it-works-banner.jpg"
        title="How EASY Works"
        description="Simple steps to connect service providers with clients"
        height="md"
      />

      <main className="min-h-screen bg-muted/40">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
            {/* For Clients */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">For Clients</h2>
              <div className="space-y-6">
                {clientSteps.map((step, index) => (
                  <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex gap-3 md:gap-4">
                        <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <step.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                        </div>
                        <div>
                          <div className="mb-1 text-xs md:text-sm font-semibold text-primary">Step {index + 1}</div>
                          <h3 className="font-semibold text-base md:text-lg mb-2">{step.title}</h3>
                          <p className="text-xs md:text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* For Workers */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">For Workers</h2>
              <div className="space-y-6">
                {workerSteps.map((step, index) => (
                  <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex gap-3 md:gap-4">
                        <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                          <step.icon className="h-5 w-5 md:h-6 md:w-6 text-secondary" />
                        </div>
                        <div>
                          <div className="mb-1 text-xs md:text-sm font-semibold text-secondary">Step {index + 1}</div>
                          <h3 className="font-semibold text-base md:text-lg mb-2">{step.title}</h3>
                          <p className="text-xs md:text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
