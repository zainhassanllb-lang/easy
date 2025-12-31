"use client"

import { useEffect } from "react"

export function IncrementStats({ workerId }: { workerId: string }) {
  useEffect(() => {
    // Increment profile views on page load
    fetch("/api/stats/increment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workerId, stat: "profileViews" }),
      credentials: "include",
    })
  }, [workerId])

  return null
}
