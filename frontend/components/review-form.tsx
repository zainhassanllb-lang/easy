"use client"

import React, { useState } from "react"

export function ReviewForm({ workerId, onSuccess }: { workerId: string; onSuccess?: (data: any) => void }) {
  const [rating, setRating] = useState<number>(5)
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  if (!workerId) {
    return <div className="text-red-600">Invalid worker id. Cannot submit review.</div>
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    console.log('Submitting review', { workerId, rating, text, url: `/api/workers/${workerId}/reviews` })
    try {
      const res = await fetch(`/api/workers/${workerId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, text })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit review')
      setSuccess('Review submitted')
      setText('')
      if (onSuccess) onSuccess(data)
    } catch (err: any) {
      setError(err.message || 'Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow-sm">
      <div className="mb-2">
        <div className="text-sm font-semibold mb-1">Your rating</div>
        <div className="flex gap-2 items-center">
          {[1,2,3,4,5].map((n) => (
            <button key={n} type="button" onClick={() => setRating(n)} className={`px-3 py-1 rounded ${rating===n ? 'bg-yellow-400 text-black' : 'bg-muted/50'}`}>
              {n}★
            </button>
          ))}
        </div>
      </div>

      <div className="mb-2">
        <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full p-2 border rounded" rows={4} placeholder="Write your review (optional)" />
      </div>

      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}

      <div className="flex justify-end">
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Submitting…' : 'Submit Review'}</button>
      </div>
    </form>
  )
}
