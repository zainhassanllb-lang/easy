import { Card, CardContent } from "@/components/ui/card"
import { Search, CheckCircle, Phone } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Search for Services",
      description: "Select your city and area, then browse service categories to find what you need",
    },
    {
      icon: CheckCircle,
      title: "Choose Verified Workers",
      description: "View profiles of verified professionals with ratings, reviews, and experience",
    },
    {
      icon: Phone,
      title: "Connect & Book",
      description: "Contact workers directly via call or WhatsApp to discuss your requirements",
    },
  ]

  return (
    <section className="py-16 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">How EASY Works</h2>
          <p className="text-muted-foreground">Get connected with trusted professionals in 3 simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <Card key={index} className="border-2">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="mb-2 text-sm font-semibold text-primary">Step {index + 1}</div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
