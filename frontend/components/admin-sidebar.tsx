"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Users,
    UserCheck,
    CreditCard,
    MessageSquare,
    Settings,
    LogOut,
    ShieldCheck
} from "lucide-react"

const sidebarItems = [
    {
        title: "Overview",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Worker Verification",
        href: "/admin/verification",
        icon: UserCheck,
    },
    {
        title: "Payment Approvals",
        href: "/admin/payments",
        icon: CreditCard,
    },
    {
        title: "Manage Workers",
        href: "/admin/workers",
        icon: Users,
    },
    {
        title: "Support Messages",
        href: "/admin/support",
        icon: MessageSquare,
    },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = () => {
        // Clear admin and general tokens
        document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"

        // Redirect to home or login
        router.push("/")
        router.refresh()
    }

    return (
        <div className="flex h-full w-64 flex-col bg-slate-900 text-white">
            <div className="flex h-16 items-center border-b border-slate-800 px-6">
                <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <span>AdminPanel</span>
                </Link>
            </div>
            <div className="flex-1 overflow-y-auto py-6">
                <nav className="grid items-start px-4 text-sm font-medium gap-2">
                    {sidebarItems.map((item, index) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)

                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={cn(
                                    "group flex items-center gap-3 rounded-xl px-3 py-3 transition-all hover:bg-slate-800",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                        : "text-slate-400 hover:text-white"
                                )}
                            >
                                <Icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "text-slate-400 group-hover:text-white")} />
                                {item.title}
                            </Link>
                        )
                    })}
                </nav>
            </div>
            <div className="border-t border-slate-800 p-4">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl bg-slate-800/50 p-3 hover:bg-slate-800 transition-colors cursor-pointer text-left"
                >
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-xs font-bold ring-2 ring-slate-900">
                        AD
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <h4 className="truncate text-sm font-semibold">Administrator</h4>
                        <p className="truncate text-xs text-slate-400">admin@easy.com</p>
                    </div>
                    <LogOut className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
                </button>
            </div>
        </div>
    )
}
