import { Card, CardContent } from "@/components/ui/card"
import type { Worker } from "@/lib/database"
import { Eye, MousePointerClick, Phone, MessageCircle, Star } from "lucide-react"

export function DashboardStats({ worker }: { worker: Worker }) {
  const stats = [
    {
      title: "Profile Views",
      value: worker.profileViews,
      icon: Eye,
      gradient: "from-blue-500 to-blue-400",
      bg: "bg-blue-50",
    },
    {
      title: "Phone Calls",
      value: worker.contactClicks,
      icon: Phone,
      gradient: "from-purple-500 to-purple-400",
      bg: "bg-purple-50",
    },
    {
      title: "WhatsApp Chats",
      value: worker.whatsappClicks,
      icon: MessageCircle,
      gradient: "from-green-500 to-green-400",
      bg: "bg-green-50",
    },
    {
      title: "Reviews",
      value: worker.reviewCount || 0,
      icon: Star,
      gradient: "from-orange-500 to-orange-400",
      bg: "bg-orange-50",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <Card key={i} className={`border-none shadow-md ${stat.bg}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}>
                <stat.icon className="h-5 w-5" />
              </div>
              {/* Optional: Add percentage growth here */}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
