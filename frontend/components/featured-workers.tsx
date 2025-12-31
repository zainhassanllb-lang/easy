"use client"

import { useState, useEffect } from "react"
import { WorkerCard } from "@/components/worker-card"

export function FeaturedWorkers() {
  const [workers, setWorkers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeaturedWorkers() {
      try {
        const res = await fetch("/api/workers-featured?limit=6")
        
        if (res.ok) {
          const data = await res.json()
          // Convert MongoDB _id to id and dates for compatibility
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
      <section className="py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3">Featured Workers</h2>
          <p className="text-muted-foreground">Top-rated professionals ready to help you</p>
        </div>
        <div className="text-center text-muted-foreground">Loading...</div>
      </section>
    )
  }

  if (workers.length === 0) {
    return null
  }

  return (
    <section className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3">Featured Workers</h2>
        <p className="text-muted-foreground">Top-rated professionals ready to help you</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {workers.map((worker) => (
          <WorkerCard key={worker.id} worker={worker} />
        ))}
      </div>
    </section>
  )
}
