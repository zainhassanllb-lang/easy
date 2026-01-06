import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LanguageProvider } from "@/components/language-provider"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EASY - Find Trusted Service Providers",
  description:
    "Connect with verified professionals for all your home and office service needs. Find electricians, plumbers, carpenters, and more near you.",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased min-h-screen flex flex-col`}>
        <LanguageProvider>
          <div className="flex-1 flex flex-col">{children}</div>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}

