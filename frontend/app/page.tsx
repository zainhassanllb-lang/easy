import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ServiceCategories } from "@/components/service-categories"
import { FeaturedWorkers } from "@/components/featured-workers"
import { HowItWorks } from "@/components/how-it-works"
import { CTASection } from "@/components/cta-section"
import { HeroSlider } from "@/components/hero-slider"


export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSlider />

        <section id="services-section" className="bg-gradient-to-br from-slate-50 via-blue-50/40 to-green-50/30 py-4">
          <div className="container mx-auto px-4">
            <ServiceCategories />
          </div>
        </section>

        <section className="bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/20 py-4">
          <div className="container mx-auto px-4">
            <FeaturedWorkers />
          </div>
        </section>

        <section className="bg-gradient-to-br from-green-50/30 via-teal-50/20 to-cyan-50/30">
          <HowItWorks />
        </section>

        <section className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 py-0 mt-20">
          <CTASection />
        </section>
      </main>
      <Footer />
    </div>
  )
}

