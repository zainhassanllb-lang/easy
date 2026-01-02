import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { PageBanner } from "@/components/page-banner"

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <PageBanner
          image="/services-banner.jpg"
          title="Privacy Policy"
          description="Last updated: January 2025"
          height="md"
        />

        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8 prose prose-slate max-w-none">
              <h2 className="text-2xl font-bold mb-4">Introduction</h2>
              <p className="text-muted-foreground mb-6">
                At EASY, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you use our service marketplace platform.
              </p>

              <h2 className="text-2xl font-bold mb-4 mt-8">Information We Collect</h2>
              <p className="text-muted-foreground mb-4">We collect information that you provide directly to us:</p>
              <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                <li>Personal information (name, email, phone number, address)</li>
                <li>Profile information for workers (skills, experience, CNIC)</li>
                <li>Payment and billing information</li>
                <li>Communications between clients and workers</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 mt-8">How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                <li>Provide and maintain our services</li>
                <li>Process transactions and send related information</li>
                <li>Verify worker identities and maintain platform trust</li>
                <li>Send administrative information and updates</li>
                <li>Improve and personalize user experience</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 mt-8">Information Sharing</h2>
              <p className="text-muted-foreground mb-6">
                We do not sell your personal information. We may share your information with service providers, business
                partners, or as required by law to protect our rights and safety.
              </p>

              <h2 className="text-2xl font-bold mb-4 mt-8">Your Rights</h2>
              <p className="text-muted-foreground mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                <li>Access and update your personal information</li>
                <li>Request deletion of your account and data</li>
                <li>Opt-out of marketing communications</li>
                <li>Object to certain data processing activities</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 mt-8">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have questions about this Privacy Policy, please contact us at support@easy.com
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}
