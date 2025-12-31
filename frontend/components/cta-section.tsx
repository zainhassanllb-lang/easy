import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function CTASection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="bg-primary text-primary-foreground p-8 border-0">
            <h3 className="text-2xl font-bold mb-3">Looking for Services?</h3>
            <p className="mb-6 opacity-90">
              Find trusted and verified professionals in your area for all your service needs
            </p>
            <Link href="/services">
              <Button variant="secondary" size="lg">
                Browse Services
              </Button>
            </Link>
          </Card>

          <Card className="bg-secondary text-secondary-foreground p-8 border-0">
            <h3 className="text-2xl font-bold mb-3">Are You a Worker?</h3>
            <p className="mb-6 opacity-90">Join EASY and connect with thousands of clients looking for your skills</p>
            <Link href="/register">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 bg-transparent">
                Register Now
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </section>
  )
}
