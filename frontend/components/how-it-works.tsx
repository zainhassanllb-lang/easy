
import { Card, CardContent } from "@/components/ui/card"
import { Search, ShieldCheck, MessageSquare } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Find Your Expert",
      description: "Browse categorized lists of verified local professionals tailored to your needs.",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: ShieldCheck,
      title: "Verify & Choose",
      description: "Check verified badges, read authentic reviews, and compare profiles.",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: MessageSquare,
      title: "Connect Directly",
      description: "Chat or call the worker directly to discuss details and negotiate pricing.",
      color: "bg-purple-100 text-purple-600"
    },
  ]

  return (
    <section className="py-24 bg-slate-50/50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-[40%] -left-[10%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Simple Steps to Get Things Done</h2>
          <p className="text-lg text-muted-foreground">
            We made it incredibly easy to find reliable help. No complex forms, just direct connections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connecting Line (Desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gray-200 -z-10 group-hover:bg-primary/20 transition-colors" />
              )}

              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-transparent hover:border-border/50 hover:shadow-xl transition-all duration-300 h-full">
                <div className={`w-24 h-24 mb-6 rounded-2xl ${step.color} flex items-center justify-center shadow-lg transform group-hover:-translate-y-2 transition-transform duration-300`}>
                  <step.icon className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
