"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"

type Review = {
  _id?: string
  rating: number
  text: string
  clientName?: string
  clientProfileImage?: string
  createdAt?: string
}

function Stars({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const v = i + 1
        const filled = v <= value
        return (
          <button key={v} type="button" onClick={() => onChange(v)} className="p-0.5">
            <Star className={`h-5 w-5 ${filled ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
          </button>
        )
      })}
    </div>
  )
}

export function ReviewsSection({ workerId, canReview }: { workerId: string; canReview: boolean }) {
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  const [myRating, setMyRating] = useState(0)
  const [myText, setMyText] = useState("")
  const [hasMyReview, setHasMyReview] = useState(false)
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(`/api/reviews?workerId=${workerId}`)
      const data = await res.json()
      setReviews(data.reviews || [])

      if (canReview) {
        const myRes = await fetch(`/api/reviews?workerId=${workerId}&my=1`)
        const myData = await myRes.json()
        if (myData.review) {
          setHasMyReview(true)
          setMyRating(myData.review.rating)
          setMyText(myData.review.text || "")
        } else {
          setHasMyReview(false)
          setMyRating(0)
          setMyText("")
        }
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workerId])

  async function submit() {
    if (!myRating) return alert("Please select a star rating (1–5).")
    setSaving(true)
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workerId, rating: myRating, text: myText }),
      })
      await load()
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  async function remove() {
    if (!confirm("Delete your review?")) return
    setSaving(true)
    try {
      await fetch(`/api/reviews?workerId=${workerId}`, { method: "DELETE" })
      await load()
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-4 md:p-6 space-y-4">
        <h2 className="text-lg md:text-xl font-semibold">Reviews</h2>

        {canReview && (
          <div className="border rounded-lg p-3 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <Stars value={myRating} onChange={setMyRating} />
              {hasMyReview && (
                <Button variant="outline" size="sm" onClick={remove} disabled={saving}>
                  Delete
                </Button>
              )}
            </div>

            <Textarea
              placeholder="Write your review..."
              value={myText}
              onChange={(e) => setMyText(e.target.value)}
            />

            <Button onClick={submit} disabled={saving}>
              {hasMyReview ? "Update Review" : "Submit Review"}
            </Button>
          </div>
        )}

        {loading ? (
          <div className="text-muted-foreground">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-muted-foreground">No reviews yet.</div>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r._id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{r.clientName || "Client"}</div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">{r.rating}</span>
                  </div>
                </div>
                {r.text ? <p className="text-sm text-muted-foreground mt-2">{r.text}</p> : null}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
