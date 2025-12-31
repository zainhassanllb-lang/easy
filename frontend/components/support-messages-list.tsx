"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Mail, User, Info, Phone } from "lucide-react"

interface SupportMessage {
    _id: string
    name: string
    email: string
    subject: string
    message: string
    status: string
    createdAt: string
    phone?: string
}

export function SupportMessagesList({ messages }: { messages: SupportMessage[] }) {
    if (messages.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <Info className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p>No support inquiries yet</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {messages.map((msg) => (
                <Card key={msg._id} className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold">{msg.subject}</h3>
                                <Badge variant={msg.status === "pending" ? "destructive" : "secondary"}>
                                    {msg.status}
                                </Badge>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <User className="h-4 w-4" /> {msg.name}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Mail className="h-4 w-4" /> {msg.email}
                                </span>
                                {msg.phone && (
                                    <span className="flex items-center gap-1">
                                        <Phone className="h-4 w-4" /> {msg.phone}
                                    </span>
                                )}
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" /> {new Date(msg.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg text-sm leading-relaxed">
                        <p className="whitespace-pre-wrap">{msg.message}</p>
                    </div>
                </Card>
            ))}
        </div>
    )
}
