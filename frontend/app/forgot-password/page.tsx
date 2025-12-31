import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ForgotPasswordForm } from "@/components/forgot-password-form"
import { PageBanner } from "@/components/page-banner"

export default function ForgotPasswordPage() {
    return (
        <>
            <Header />
            <PageBanner
                image="/services-banner.jpg"
                title="Forgot Password"
                description="Reset your password securely"
                height="md"
            />
            <main className="min-h-screen bg-muted/40">
                <div className="container mx-auto px-4 py-12 flex justify-center">
                    <div className="w-full max-w-md">
                        <ForgotPasswordForm />
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
