
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-accent to-secondary text-primary-foreground px-6 py-16 md:px-16 md:py-20 text-center shadow-2xl">

          {/* Abstract Background Shapes */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
            <div className="absolute top-[-50%] left-[-20%] w-[800px] h-[800px] bg-white rounded-full blur-[120px]" />
            <div className="absolute bottom-[-50%] right-[-20%] w-[600px] h-[600px] bg-white/20 rounded-full blur-[100px]" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Ready to Simplify Your Life?</h2>
            <p className="text-xl opacity-90 leading-relaxed">
              Whether you need a quick repair or a full home renovation, EASY connects you with the best professionals in town.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/services">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto text-lg h-14 px-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                  Find a Professional
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 border-2 bg-transparent border-white/30 text-white hover:bg-white/10 hover:border-white transition-all group">
                  Join as a Pro
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
