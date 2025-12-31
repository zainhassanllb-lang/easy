"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Phone, MessageCircle } from "lucide-react"

export function ContactActions({
    workerId,
    phone,
    whatsapp
}: {
    workerId: string
    phone: string
    whatsapp: string
}) {
    const [loading, setLoading] = useState(false)

    const handleAction = async (type: "contactClicks" | "whatsappClicks", value: string) => {
        try {
            setLoading(true)
            // Track the click
            await fetch("/api/stats/increment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ workerId, stat: type }),
            })

            // Perform the action
            if (type === "contactClicks") {
                window.location.href = `tel:${value}`
            } else {
                // WhatsApp format
                const cleanNumber = value.replace(/\D/g, '')
                window.open(`https://wa.me/${cleanNumber}`, '_blank')
            }
        } catch (error) {
            console.error("Error tracking stat:", error)
            // Still try to open 
            if (type === "contactClicks") {
                window.location.href = `tel:${value}`
            } else {
                const cleanNumber = value.replace(/\D/g, '')
                window.open(`https://wa.me/${cleanNumber}`, '_blank')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-3">
            <div>
                <div className="text-xs md:text-sm text-muted-foreground mb-2">Phone</div>
                <Button
                    variant="outline"
                    className="w-full justify-start gap-2 h-auto py-2"
                    onClick={() => handleAction("contactClicks", phone)}
                    disabled={loading}
                >
                    <Phone className="h-4 w-4" />
                    <span className="font-medium text-sm md:text-base">{phone}</span>
                </Button>
            </div>

            <div>
                <div className="text-xs md:text-sm text-muted-foreground mb-2">WhatsApp</div>
                <Button
                    variant="outline"
                    className="w-full justify-start gap-2 h-auto py-2 text-green-600 border-green-200 hover:bg-green-50"
                    onClick={() => handleAction("whatsappClicks", whatsapp)}
                    disabled={loading}
                >
                    <MessageCircle className="h-4 w-4" />
                    <span className="font-medium text-sm md:text-base">{whatsapp}</span>
                </Button>
            </div>
        </div>
    )
}
