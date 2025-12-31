"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Worker } from "@/lib/database"
import { categories, cities } from "@/lib/database"
import { MapPin, Phone, Eye, MousePointerClick, Search, Calendar, AlertCircle } from "lucide-react"

import { useRouter } from "next/navigation"

export function WorkersOverview({ workers }: { workers: Worker[] }) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCity, setFilterCity] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch =
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCity = filterCity === "all" || worker.city === filterCity
    const matchesCategory = filterCategory === "all" || worker.category === filterCategory
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "verified" && worker.isVerified) ||
      (filterStatus === "unverified" && !worker.isVerified)

    return matchesSearch && matchesCity && matchesCategory && matchesStatus
  })

  function isPackageExpired(worker: Worker): boolean {
    if (!worker.packageExpiry) return false
    return new Date(worker.packageExpiry) < new Date()
  }

  function getDaysUntilExpiry(worker: Worker): number {
    if (!worker.packageExpiry) return 0
    const diff = new Date(worker.packageExpiry).getTime() - new Date().getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filterCity} onValueChange={setFilterCity}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by City" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city.value} value={city.value}>
                {city.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="unverified">Unverified</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredWorkers.length} of {workers.length} workers
      </div>

      {/* Workers List */}
      <div className="space-y-4">
        {filteredWorkers.map((worker) => {
          const expired = isPackageExpired(worker)
          const daysLeft = getDaysUntilExpiry(worker)

          return (
            <Card key={worker.id} className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={worker.profileImage || "/placeholder.svg"}
                    alt={worker.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-lg font-semibold">{worker.name}</h3>
                        {worker.isVerified && (
                          <Badge className="bg-secondary text-secondary-foreground">Verified</Badge>
                        )}
                        {worker.packageType && (
                          <Badge variant="outline" className="capitalize">
                            {worker.packageType}
                          </Badge>
                        )}
                        {expired && (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Expired
                          </Badge>
                        )}
                        {!expired && worker.packageExpiry && daysLeft <= 7 && (
                          <Badge
                            variant="outline"
                            className="border-yellow-500 text-yellow-700 flex items-center gap-1"
                          >
                            <Calendar className="h-3 w-3" />
                            {daysLeft}d left
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground capitalize">{worker.category}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Joined: {worker.createdAt ? new Date(worker.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Link href={`/worker/${worker.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          View Profile
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          if (confirm(`Are you sure you want to delete worker ${worker.name} and their account?`)) {
                            try {
                              const res = await fetch(`/api/admin/workers/${worker.id}`, { method: 'DELETE' });
                              const data = await res.json();
                              if (data.success) {
                                alert('User deleted successfully');
                                router.refresh();
                              } else {
                                alert(data.error || 'Failed to delete user');
                              }
                            } catch (error) {
                              alert('An error occurred');
                            }
                          }
                        }}
                      >
                        Delete User
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="capitalize">
                        {worker.locality}, {worker.city}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{worker.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      <span>{worker.profileViews} views</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MousePointerClick className="h-4 w-4" />
                      <span>{worker.contactClicks} contacts</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">{worker.about}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {filteredWorkers.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">No workers found matching your filters</div>
      )}
    </div>
  )
}
