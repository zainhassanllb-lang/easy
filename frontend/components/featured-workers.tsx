"use client"

import { useState, useEffect } from "react"
import { WorkerCard } from "@/components/worker-card"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export function FeaturedWorkers() {
  const [workers, setWorkers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeaturedWorkers() {
      try {
        const res = await fetch("/api/workers-featured?limit=4") // Show 4 for better grid

        if (res.ok) {
          const data = await res.json()
          const formattedWorkers = (data.workers || []).map((w: any) => ({
            ...w,
            id: w._id?.toString() || w.id,
            packageExpiry: w.packageExpiry ? (typeof w.packageExpiry === 'string' ? new Date(w.packageExpiry) : w.packageExpiry) : null,
          }))
          setWorkers(formattedWorkers)
        }
      } catch (error) {
        console.error("Failed to fetch featured workers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedWorkers()
  }, [])

  if (loading) {
    return (
      <section className="py-20 bg-blue-50/50">
        <div className="container mx-auto px-4">
          <div className="flex animate-pulse space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (workers.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-blue-50/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Top Rated <span className="text-secondary">Professionals</span></h2>
            <p className="text-lg text-muted-foreground">Certified experts with a proven track record of excellence.</p>
          </div>
          <Link href="/services" className="hidden md:flex items-center gap-2 text-secondary font-semibold hover:gap-3 transition-all">
            Find More Professionals <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {workers.map((worker) => (
            <div key={worker.id} className="transform transition-all duration-300 hover:scale-[1.02]">
              <WorkerCard worker={worker} />
            </div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/services" className="inline-flex items-center gap-2 text-secondary font-semibold">
            Find More Professionals <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
