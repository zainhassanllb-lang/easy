import Link from "next/link"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"
import Image from "next/image"
export function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="relative h-8 w-24 sm:h-10 sm:w-32 md:h-12 md:w-40 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo.svg"
                  alt="EASY Logo"
                  fill
                  className="object-contain brightness-0 invert"
                  priority
                />
              </div>

            </div>
            <p className="text-slate-300 mb-6 text-sm leading-relaxed">
              Connecting skilled Pakistani workers with customers across major cities. Your trusted marketplace for
              quality services.
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-slate-300 hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-slate-300 hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Browse Services
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-slate-300 hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/packages"
                  className="text-slate-300 hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Packages
                </Link>
              </li>
            </ul>
          </div>

          {/* For Workers */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white">For Workers</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/register/worker"
                  className="text-slate-300 hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Join as Worker
                </Link>
              </li>
              <li>
                <Link
                  href="/worker/dashboard"
                  className="text-slate-300 hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Worker Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/worker/verification"
                  className="text-slate-300 hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Verification Status
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-slate-300 hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-slate-300">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-400" />
                <span>Karachi, Lahore, Islamabad, Pakistan</span>
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <Phone className="h-5 w-5 flex-shrink-0 text-green-400" />
                <span>+92 300 1234567</span>
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <Mail className="h-5 w-5 flex-shrink-0 text-yellow-400" />
                <span>support@easy.pk</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">&copy; 2025 EASY. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-slate-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
