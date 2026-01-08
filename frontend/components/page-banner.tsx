"use client"

import type { ReactNode } from "react"

interface PageBannerProps {
  image: string
  title: string
  description?: string
  children?: ReactNode
  height?: "sm" | "md" | "lg"
}

export function PageBanner({ image, title, description, children, height = "md" }: PageBannerProps) {
  const heightClasses = {
    sm: "h-64 md:h-72",
    md: "h-80 md:h-96",
    lg: "h-96 md:h-[32rem]",
  }

  return (
    <section
      className={`relative ${heightClasses[height]} bg-cover bg-center flex items-center justify-center overflow-hidden`}
      style={{ backgroundImage: `url(${image})` }}
    >
      {/* Overlay - Branded colorful gradient for site-wide consistency */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-secondary/70" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 text-balance drop-shadow-2xl">
          {title}
        </h1>
        {description && (
          <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto text-balance drop-shadow-lg">
            {description}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  )
}
