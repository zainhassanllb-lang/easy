"use client"

import React, { useEffect, useState } from "react"

interface Review {
  _id: string
  rating: number
  text: string
  createdAt: string
  client: { name: string; profileImage?: string }
}

export function ReviewList({ workerId }: { workerId: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReviews = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/workers/${workerId}/reviews`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to load reviews')
      setReviews(data.reviews || [])
    } catch (err: any) {
      setError(err.message || 'Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [workerId])

  if (loading) return <div>Loading reviews…</div>
  if (error) return <div className="text-red-600">{error}</div>
  if (!reviews.length) return <div className="text-muted-foreground">No reviews yet.</div>

  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <div key={r._id} className="bg-white p-4 rounded shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-sm">{r.client?.name || 'Anonymous'}</div>
                <div className="text-sm font-semibold">{r.rating.toFixed(1)}</div>
              </div>
              <div className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</div>
              {r.text && <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
