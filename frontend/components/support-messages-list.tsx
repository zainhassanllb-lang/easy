"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Calendar, Mail, User, Info, Phone, Search,
    MessageSquare, CheckCircle, Trash2, Clock,
    ChevronRight, Filter, AlertCircle, RefreshCw
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface SupportMessage {
    _id: string
    name: string
    email: string
    subject: string
    message: string
    status: "pending" | "resolved"
    createdAt: string
    phone?: string
}

export function SupportMessagesList({ initialMessages }: { initialMessages: SupportMessage[] }) {
    const router = useRouter()
    const [messages, setMessages] = useState(initialMessages)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "resolved">("all")
    const [loading, setLoading] = useState<string | null>(null)
    const [toast, setToast] = useState<{ message: string, type: "success" | "error" } | null>(null)

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    const pendingCount = messages.filter(m => m.status === 'pending').length
    const resolvedCount = messages.filter(m => m.status === 'resolved').length

    const filteredMessages = messages.filter(msg => {
        const matchesSearch =
            msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.message.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || msg.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const handleUpdateStatus = async (id: string, status: "pending" | "resolved") => {
        setLoading(id)
        try {
            const res = await fetch("/api/admin/support-messages", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status })
            })
            if (res.ok) {
                setMessages(prev => prev.map(m => m._id === id ? { ...m, status } : m))
                showToast(`Message marked as ${status}`, "success")
            } else {
                showToast("Failed to update status", "error")
            }
        } catch (error) {
            console.error("Update error:", error)
            showToast("Network error occurred", "error")
        } finally {
            setLoading(null)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this message?")) return
        setLoading(id)
        try {
            const res = await fetch(`/api/admin/support-messages?id=${id}`, {
                method: "DELETE"
            })
            if (res.ok) {
                setMessages(prev => prev.filter(m => m._id !== id))
                showToast("Message deleted", "success")
            } else {
                showToast("Failed to delete message", "error")
            }
        } catch (error) {
            console.error("Delete error:", error)
            showToast("Network error occurred", "error")
        } finally {
            setLoading(null)
        }
    }

    return (
        <div className="space-y-8 relative">
            {/* Simple Toast */}
            {toast && (
                <div className={cn(
                    "fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-2xl font-bold text-white animate-in fade-in slide-in-from-top-4 duration-300",
                    toast.type === "success" ? "bg-green-600" : "bg-red-600"
                )}>
                    <div className="flex items-center gap-2">
                        {toast.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                        {toast.message}
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">Support Inbox</h2>
                    <p className="text-sm text-muted-foreground">Manage and respond to platform inquiries.</p>
                </div>

                <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <div className="bg-white px-4 py-3 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3 min-w-[120px]">
                        <MessageSquare className="h-4 w-4 text-primary" />
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-none mb-1">Total</p>
                            <p className="text-lg font-bold">{messages.length}</p>
                        </div>
                    </div>
                    <div className="bg-white px-4 py-3 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3 min-w-[120px]">
                        <Clock className="h-4 w-4 text-red-500" />
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-none mb-1 text-red-400">Pending</p>
                            <p className="text-lg font-bold text-red-600">{pendingCount}</p>
                        </div>
                    </div>
                    <div className="bg-white px-4 py-3 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3 min-w-[120px]">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-none mb-1 text-green-500">Resolved</p>
                            <p className="text-lg font-bold text-green-700">{resolvedCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-muted/20 border-2 border-dashed rounded-2xl">
                    <div className="p-5 bg-primary/10 rounded-full mb-4">
                        <MessageSquare className="h-10 w-10 text-primary opacity-50" />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-slate-900">Inbox is clean!</h3>
                    <p className="text-sm text-muted-foreground mt-1">No support inquiries yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Filters Bar */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Search by name, email, or content..."
                                className="pl-11 h-10 border bg-white shadow-none rounded-xl focus-visible:ring-primary"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={statusFilter === "all" ? "default" : "outline"}
                                className={cn(
                                    "h-10 px-4 rounded-xl font-semibold border",
                                    statusFilter === "all" ? "bg-slate-900 text-white hover:bg-slate-800" : ""
                                )}
                                onClick={() => setStatusFilter("all")}
                            >
                                All
                            </Button>
                            <Button
                                variant={statusFilter === "pending" ? "default" : "outline"}
                                className={cn(
                                    "h-10 px-4 rounded-xl font-semibold border transition-all",
                                    statusFilter === "pending" ? "bg-red-500 text-white hover:bg-red-600 border-red-500 shadow-lg shadow-red-100" : "border-red-100 text-red-500 hover:bg-red-50"
                                )}
                                onClick={() => setStatusFilter("pending")}
                            >
                                Pending
                            </Button>
                            <Button
                                variant={statusFilter === "resolved" ? "default" : "outline"}
                                className={cn(
                                    "h-10 px-4 rounded-xl font-semibold border transition-all",
                                    statusFilter === "resolved" ? "bg-green-600 text-white hover:bg-green-700 border-green-600 shadow-lg shadow-green-100" : "border-green-100 text-green-600 hover:bg-green-50"
                                )}
                                onClick={() => setStatusFilter("resolved")}
                            >
                                Resolved
                            </Button>
                        </div>
                    </div>

                    {/* Messages Grid */}
                    <div className="grid gap-6">
                        {filteredMessages.map((msg) => (
                            <Card key={msg._id} className="group border-none shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden bg-white border border-slate-200">
                                <CardContent className="p-0">
                                    <div className="flex flex-col lg:flex-row items-stretch">
                                        {/* Status Indicator */}
                                        <div className={cn(
                                            "w-full lg:w-1.5 min-h-[4px] lg:min-h-full transition-colors",
                                            msg.status === "pending" ? "bg-red-500" : "bg-green-500"
                                        )} />

                                        <div className="p-6 flex-1 space-y-5">
                                            {/* Sender Info & Header */}
                                            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "h-12 w-12 rounded-xl flex items-center justify-center text-base font-bold",
                                                        msg.status === "pending" ? "bg-red-50 text-red-500" : "bg-green-50 text-green-600"
                                                    )}>
                                                        {msg.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <div className="flex items-center gap-3">
                                                            <h3 className="text-lg font-bold tracking-tight text-slate-900">{msg.name}</h3>
                                                            <Badge className={cn(
                                                                "rounded-md px-2 py-0 text-[10px] font-bold uppercase",
                                                                msg.status === "pending" ? "bg-red-500/10 text-red-600" : "bg-green-500/10 text-green-700"
                                                            )}>
                                                                {msg.status}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                                                            <span className="flex items-center gap-1">
                                                                <Mail className="h-3 w-3" /> {msg.email}
                                                            </span>
                                                            {msg.phone && (
                                                                <span className="flex items-center gap-1">
                                                                    <Phone className="h-3 w-3" /> {msg.phone}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(msg.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </div>
                                            </div>

                                            {/* Subject & Message Body */}
                                            <div className="space-y-3">
                                                <h4 className="text-base font-bold text-slate-800">{msg.subject}</h4>
                                                <div className="bg-slate-50/50 p-4 rounded-xl text-sm leading-relaxed text-slate-600 border border-slate-100/80">
                                                    {msg.message}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                                {msg.status === "pending" ? (
                                                    <Button
                                                        size="sm"
                                                        className="rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold gap-2 h-9 px-4 shadow-sm shadow-green-100"
                                                        onClick={() => handleUpdateStatus(msg._id, "resolved")}
                                                        disabled={loading === msg._id}
                                                    >
                                                        {loading === msg._id ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                                                        Mark Resolved
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold gap-2 h-9 px-4"
                                                        onClick={() => handleUpdateStatus(msg._id, "pending")}
                                                        disabled={loading === msg._id}
                                                    >
                                                        {loading === msg._id ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <AlertCircle className="h-3.5 w-3.5" />}
                                                        Re-open
                                                    </Button>
                                                )}

                                                <a href={`mailto:${msg.email}`}>
                                                    <Button variant="outline" size="sm" className="h-9 rounded-lg border-slate-200 font-semibold text-slate-600 gap-2 px-4 hover:bg-slate-50">
                                                        Reply
                                                        <ChevronRight className="h-3.5 w-3.5" />
                                                    </Button>
                                                </a>

                                                <div className="flex-1" />

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50"
                                                    onClick={() => handleDelete(msg._id)}
                                                    disabled={loading === msg._id}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {filteredMessages.length === 0 && (
                            <div className="text-center py-16 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
                                <Search className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                                <h3 className="text-base font-semibold text-slate-900">No results found</h3>
                                <p className="text-xs text-muted-foreground mt-1">Adjust your filters or search terms.</p>
                            </div>
                        )}
                    </div>
                </div>
            )
            }
        </div>
    )
}
