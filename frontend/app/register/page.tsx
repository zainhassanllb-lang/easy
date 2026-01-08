
import { UnifiedRegistrationForm } from "@/components/unified-registration-form"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle2 } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Poster */}
      <div className="hidden lg:flex relative bg-gradient-to-tr from-secondary to-primary overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/pakistani_labour_worker_login_1767787469688.png"
            alt="Join Easy"
            fill
            className="object-cover"
            priority
          />
          {/* Bottom-weighted gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        </div>

        <div className="relative z-10 p-12 lg:p-16 flex flex-col h-full text-white">
          <div className="mb-12">
            <Link href="/" className="inline-block p-2 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 hover:bg-black/30 transition-colors">
              <Image
                src="/logo.svg"
                width={130}
                height={35}
                alt="Logo"
                className="brightness-0 invert"
              />
            </Link>
          </div>

          <div className="mt-auto max-w-md">
            <h1 className="text-5xl font-extrabold leading-tight mb-6 drop-shadow-2xl">
              Join the Community of Experts
            </h1>
            <p className="text-xl font-medium mb-12 opacity-95 drop-shadow-lg">
              Create an account to connect with top-rated professionals or manage your service requests.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4 drop-shadow-md">
                <div className="p-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold">Verified Professionals</span>
              </div>
              <div className="flex items-center gap-4 drop-shadow-md">
                <div className="p-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold">Secure Payments</span>
              </div>
              <div className="flex items-center gap-4 drop-shadow-md">
                <div className="p-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-xl space-y-8 bg-white p-8 md:p-12 rounded-2xl shadow-xl">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">Create your account</h2>
            <p className="text-muted-foreground">Get started with EASY today</p>
          </div>

          <UnifiedRegistrationForm />

          <div className="pt-6 border-t text-center space-y-4">
            <div className="text-sm">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-primary hover:underline">
                Sign in
              </Link>
            </div>

            <div className="text-xs text-muted-foreground">
              Looking to find work?{" "}
              <Link href="/register/worker" className="font-bold text-secondary hover:underline">
                Register as a Service Provider
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
