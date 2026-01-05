import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageBanner } from "@/components/page-banner"
import { UnifiedRegistrationForm } from "@/components/unified-registration-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <>
      <Header />
      <PageBanner
        image="/auth-banner.jpg"
        title="Join EASY"
        description="Create your account to get started"
        height="md"
      />
      <main className="min-h-screen bg-muted/40 py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Create Customer Account</CardTitle>
              <CardDescription>Sign up to find and hire skilled service providers</CardDescription>
              {/* </CHANGE> */}
            </CardHeader>
            <CardContent>
              <UnifiedRegistrationForm />
              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </div>
              <div className="mt-4 text-center text-sm">
                <span className="text-muted-foreground">Want to offer services? </span>
                <Link href="/register/worker" className="text-secondary hover:underline font-medium">
                  Join as a Service Provider
                </Link>
              </div>
              {/* </CHANGE> */}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}

