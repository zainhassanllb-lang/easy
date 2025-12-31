import type { Client } from "@/lib/database"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Mail, Phone, MapPin } from "lucide-react"

interface UserClientProfileProps {
  client: Client | undefined
}

export function UserClientProfile({ client }: UserClientProfileProps) {
  if (!client) {
    return <div className="text-center py-12 text-muted-foreground">Profile not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={client.profileImage || "/placeholder.svg?height=96&width=96"} />
          <AvatarFallback className="text-2xl">{client.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold">{client.name}</h2>
          <p className="text-muted-foreground">Customer</p>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Mail className="h-5 w-5" />
          <span>{client.email}</span>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <Phone className="h-5 w-5" />
          <span>{client.phone}</span>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <MapPin className="h-5 w-5" />
          <span className="capitalize">
            {client.city}, {client.locality}
          </span>
        </div>
      </div>
    </div>
  )
}
