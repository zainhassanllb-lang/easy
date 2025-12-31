"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, X, LogOut, User, Settings, Languages } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<{ role: string; email: string; profileImage?: string } | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()
  const { language, setLanguage, t } = useLanguage()

  useEffect(() => {
    fetch("/api/current-user")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user)
        }
      })
      .catch(() => { })

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" })
    setUser(null)
    router.push("/")
    router.refresh()
  }

  const handleJoinAsWorker = async () => {
    try {
      const response = await fetch("/api/check-worker-profile")
      const data = await response.json()

      if (data.hasProfile) {
        router.push("/worker/dashboard")
      } else {
        router.push("/register/worker")
      }
    } catch (error) {
      router.push("/register/worker")
    }
  }

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${scrolled
        ? "bg-background/95 backdrop-blur-xl shadow-lg border-b border-border/50"
        : "bg-background/20 backdrop-blur-md border-b border-white/10"
        }`}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center group">
          <div className="relative h-8 w-24 sm:h-10 sm:w-32 md:h-12 md:w-40 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/logo.svg"
              alt="EASY Logo"
              fill
              className={`object-contain transition-all duration-300 ${scrolled ? "brightness-100" : "brightness-0 invert"
                }`}
              priority
            />
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {[
            { href: "/", label: t("home") },
            { href: "/services", label: t("services") },
            { href: "/how-it-works", label: t("howItWorks") },
            { href: "/help", label: t("helpSupport") },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-semibold transition-all relative group ${scrolled ? "text-foreground hover:text-primary" : "text-white/90 hover:text-white"
                }`}
            >
              {item.label}
              <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`gap-2 transition-all hover:scale-105 ${scrolled ? "text-foreground" : "text-white hover:bg-white/10"
                  }`}
              >
                <Languages className="h-4 w-4" />
                <span className="text-xs font-semibold">{language === "en" ? "EN" : "اردو"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="backdrop-blur-xl bg-background/90">
              <DropdownMenuItem onClick={() => setLanguage("en")} className="cursor-pointer">
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("ur")} className="cursor-pointer">
                اردو (Urdu)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>


          {user ? (
            <div className="flex items-center gap-3">
              {user.role !== "worker" && (
                <Button
                  variant="outline"
                  size="sm"
                  className={`hidden md:flex font-semibold transition-transform hover:scale-105 ${scrolled
                    ? "border-secondary text-secondary bg-transparent hover:bg-transparent hover:text-secondary"
                    : "border-white/30 text-white bg-transparent backdrop-blur-sm hover:bg-transparent hover:text-white"
                    }`}
                  onClick={handleJoinAsWorker}
                >
                  {t("joinAsWorker")}
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:scale-110 transition-transform duration-300">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden bg-gradient-to-br from-primary to-secondary border-2 border-white/20 shadow-lg ring-2 ring-primary/20">
                      {user.profileImage ? (
                        <Image
                          src={user.profileImage || "/placeholder.svg"}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 backdrop-blur-xl bg-background/90">
                  <div className="px-2 py-1.5 text-sm font-medium">{user.email}</div>
                  <DropdownMenuSeparator />
                  {user.role === "worker" && (
                    <DropdownMenuItem asChild>
                      <Link href="/worker/dashboard" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        {t("dashboard")}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        {t("adminDashboard")}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              {/* <Button
                variant="outline"
                size="sm"
                className={`font-semibold transition-transform hover:scale-105 ${
                  scrolled
                    ? "border-secondary text-secondary bg-transparent hover:bg-transparent hover:text-secondary"
                    : "border-white/30 text-white bg-transparent backdrop-blur-sm hover:bg-transparent hover:text-white"
                }`}
                onClick={handleJoinAsWorker}
              >
                {t("joinAsWorker")}
              </Button> */}

              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`transition-all hover:scale-105 font-semibold ${scrolled ? "text-foreground" : "text-white hover:bg-white/10"
                    }`}
                >
                  {t("login")}
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-secondary via-accent to-secondary bg-[length:200%_auto] hover:bg-right-bottom transition-all duration-500 hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
                >
                  {t("signUp")}
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          className={`md:hidden transition-all hover:scale-110 ${scrolled ? "text-foreground" : "text-white"}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-xl shadow-xl">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("home")}
            </Link>
            <Link
              href="/services"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("services")}
            </Link>
            <Link
              href="/how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("howItWorks")}
            </Link>
            <Link
              href="/help"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("helpSupport")}
            </Link>

            <div className="flex gap-2 pt-2 border-t">
              <Button
                variant={language === "en" ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setLanguage("en")}
              >
                English
              </Button>
              <Button
                variant={language === "ur" ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setLanguage("ur")}
              >
                اردو
              </Button>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t">
              {user ? (
                <>
                  {user.role === "worker" && (
                    <Link href="/worker/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        {t("dashboard")}
                      </Button>
                    </Link>
                  )}
                  {user.role !== "worker" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-secondary border-secondary bg-transparent hover:bg-secondary/10"
                      onClick={() => {
                        handleJoinAsWorker()
                        setMobileMenuOpen(false)
                      }}
                    >
                      {t("joinAsWorker")}
                    </Button>
                  )}
                  {user.role === "admin" && (
                    <Link href="/admin/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        {t("adminDashboard")}
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-red-600 bg-transparent"
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                  >
                    {t("logout")}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-secondary text-secondary bg-transparent"
                    onClick={() => {
                      handleJoinAsWorker()
                      setMobileMenuOpen(false)
                    }}
                  >
                    {t("joinAsWorker")}
                  </Button>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      {t("login")}
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full bg-secondary hover:bg-secondary/90">
                      {t("signUp")}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div >
      )
      }
    </header >
  )
}