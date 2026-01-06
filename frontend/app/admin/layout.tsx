import type React from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Header } from "@/components/header" // Reusing the main header logic if needed, or creating a custom topbar
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await getCurrentUser()

    if (!user || user.role !== "admin") {
        redirect("/login")
    }

    return (
        <div className="flex min-h-screen bg-muted/20">
            {/* Sidebar - Hidden on mobile, handled via drawer in real app, keeping simple for now */}
            <aside className="hidden w-64 border-r bg-background lg:block fixed inset-y-0 z-50">
                <AdminSidebar />
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 lg:pl-64 flex flex-col min-h-screen transition-all duration-300">
                <main className="flex-1 p-6 md:p-8 animate-in fade-in duration-500">
                    {children}
                </main>
            </div>
        </div>
    )
}
