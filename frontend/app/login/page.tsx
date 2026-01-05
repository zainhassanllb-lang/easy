import { LoginForm } from "@/components/login-form"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Poster Image with Quote */}
      <div className="hidden lg:flex relative bg-gradient-to-br from-primary via-primary/95 to-secondary overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/professional-pakistani-worker-smiling-at-work.jpg" alt="Professional worker" fill className="object-cover opacity-40" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <div>
            <div className="relative h-16 w-48">
              <Image src="/logo.svg" alt="EASY Logo" fill className="object-contain brightness-0 invert" priority />
            </div>
          </div>

          {/* Quote Section */}
          <div className="space-y-6 max-w-lg">
            <blockquote className="text-3xl md:text-4xl font-bold leading-tight">
              "Find trusted professionals for all your service needs."
            </blockquote>
            <div className="space-y-1">
              <p className="text-lg font-semibold">Connecting You with Skilled Workers</p>
              <p className="text-sm text-white/80">Your reliable service marketplace</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="relative h-12 w-32 mx-auto">
              <Image src="/logo.svg" alt="EASY Logo" fill className="object-contain" priority />
            </div>
          </div>

          <div className="space-y-2 text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Welcome back to EASY</h1>
            <p className="text-muted-foreground">Sign in to access your account and find trusted service providers</p>
          </div>

          <Card className="shadow-lg border-2">
            <CardContent className="pt-6">
              <LoginForm />
            </CardContent>
          </Card>

          <div className="space-y-3 text-center text-sm">
            <div>
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link href="/register" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

