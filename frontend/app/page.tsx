"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"
import { ServiceCategories } from "@/components/service-categories"
import { FeaturedWorkers } from "@/components/featured-workers"
import { HowItWorks } from "@/components/how-it-works"
import { TestimonialsSection } from "@/components/testimonials-section"
import { FAQSection } from "@/components/faq-section"
import { CTASection } from "@/components/cta-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />

        <StatsSection />

        <ServiceCategories />

        <FeaturedWorkers />

        <HowItWorks />

        <TestimonialsSection />

        <FAQSection />

        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
