import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import type { Worker } from "@/lib/database"
import { Star, MapPin } from "lucide-react"

export function ProfileCard({ worker }: { worker: Worker }) {
  return (
    <div className="flex items-start gap-4">
      <div className="relative w-20 h-20 rounded-full overflow-hidden bg-muted flex-shrink-0">
        <Image src={worker.profileImage || "/placeholder.svg"} alt={worker.name} fill className="object-cover" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-xl font-semibold">{worker.name}</h3>
          {worker.isVerified && <Badge className="bg-secondary text-secondary-foreground">Verified</Badge>}
        </div>
        <p className="text-muted-foreground capitalize mb-2">{worker.category}</p>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{worker.rating}</span>
            <span className="text-muted-foreground">({worker.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="capitalize">
              {worker.locality}, {worker.city}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
