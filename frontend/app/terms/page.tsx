import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { PageBanner } from "@/components/page-banner"

export default function TermsPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen">
        <PageBanner
          image="/services-banner.jpg"
          title="Terms & Conditions"
          description="Last updated: January 2025"
          height="md"
        />

        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8 prose prose-slate max-w-none">
              <h2 className="text-2xl font-bold mb-4">Agreement to Terms</h2>
              <p className="text-muted-foreground mb-6">
                By accessing or using EASY, you agree to be bound by these Terms and Conditions. If you disagree with
                any part of the terms, you may not access the service.
              </p>

              <h2 className="text-2xl font-bold mb-4 mt-8">User Accounts</h2>
              <p className="text-muted-foreground mb-4">
                When you create an account with us, you must provide accurate and complete information. You are
                responsible for:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                <li>Safeguarding your password and account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized access</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 mt-8">Worker Verification</h2>
              <p className="text-muted-foreground mb-6">
                Workers must provide valid identification documents (CNIC) for verification. False information may
                result in immediate account termination. Verification does not guarantee service quality but confirms
                identity authentication.
              </p>

              <h2 className="text-2xl font-bold mb-4 mt-8">Packages and Payments</h2>
              <p className="text-muted-foreground mb-6">
                Workers can purchase packages to enhance profile visibility. All payments are non-refundable unless
                required by law. Package features and pricing are subject to change with notice.
              </p>

              <h2 className="text-2xl font-bold mb-4 mt-8">User Conduct</h2>
              <p className="text-muted-foreground mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                <li>Post false, misleading, or fraudulent information</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Use the platform for any illegal or unauthorized purpose</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 mt-8">Limitation of Liability</h2>
              <p className="text-muted-foreground mb-6">
                EASY serves as a platform to connect clients with workers. We are not responsible for the quality of
                services provided, disputes between users, or any damages arising from interactions facilitated through
                our platform.
              </p>

              <h2 className="text-2xl font-bold mb-4 mt-8">Termination</h2>
              <p className="text-muted-foreground mb-6">
                We may terminate or suspend your account immediately, without prior notice, for conduct that violates
                these Terms or is harmful to other users or the platform.
              </p>

              <h2 className="text-2xl font-bold mb-4 mt-8">Contact</h2>
              <p className="text-muted-foreground">For questions about these Terms, contact us at support@easy.com</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}

