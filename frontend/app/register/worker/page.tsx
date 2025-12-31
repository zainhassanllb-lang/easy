import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageBanner } from "@/components/page-banner"
import { WorkerRegistrationForm } from "@/components/worker-registration-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function WorkerRegisterPage() {
  return (
    <>
      <Header />
      <PageBanner
        image="/auth-banner.jpg"
        title="Edit Your Profile"
        description="Create your account to get started"
        height="md"
      />
      <main className="min-h-screen bg-muted/40 py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Worker Registration</CardTitle>
              <CardDescription>Complete your profile to start receiving customer inquiries</CardDescription>
            </CardHeader>
            <CardContent>
              <WorkerRegistrationForm />
              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}