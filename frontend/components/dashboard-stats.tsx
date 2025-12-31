import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Worker } from "@/lib/database"
import { Eye, MousePointerClick, Phone, MessageCircle } from "lucide-react"

export function DashboardStats({ worker }: { worker: Worker }) {
  const stats = [
    {
      title: "Profile Views",
      value: worker.profileViews,
      icon: Eye,
      color: "text-blue-500",
    },
    {
      title: "Phone Calls",
      value: worker.contactClicks,
      icon: Phone,
      color: "text-purple-500",
    },
    {
      title: "WhatsApp Chats",
      value: worker.whatsappClicks,
      icon: MessageCircle,
      color: "text-green-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
