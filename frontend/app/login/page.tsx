
import { LoginForm } from "@/components/login-form"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle2 } from "lucide-react"

export default function LoginPage() {
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
          />
          {/* Bottom-weighted gradient overlay for text legibility at the bottom */}
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

          <div className="mt-auto space-y-8 max-w-md">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow-2xl">
                Welcome Back!
              </h1>
              <p className="text-lg md:text-xl font-medium opacity-95 drop-shadow-lg leading-relaxed">
                Access your dashboard, manage bookings, and connect with top-rated professionals.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 drop-shadow-md">
                <div className="p-1 rounded-full bg-white/20 backdrop-blur-sm">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="font-semibold text-lg">Instant Booking</span>
              </div>
              <div className="flex items-center gap-3 drop-shadow-md">
                <div className="p-1 rounded-full bg-white/20 backdrop-blur-sm">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="font-semibold text-lg">Track Your Requests</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md space-y-8 bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-slate-100">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">Sign in</h2>
            <p className="text-muted-foreground">Enter your credentials to access your account</p>
          </div>

          <LoginForm />

          <div className="pt-6 border-t text-center space-y-4">
            <div className="text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="font-bold text-primary hover:underline">
                Sign up now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
