import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
    try {
        const backendUrl = process.env.BACKEND_URL || "https://easy-e6lz.onrender.com"

        // Forward cookies for authentication
        const cookieStore = await cookies()
        const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join("; ")

        const res = await fetch(`${backendUrl}/api/admin/support-messages`, {
            method: "GET",
            headers: {
                Cookie: cookieHeader,
            },
            cache: "no-store",
        })

        const data = await res.json()
        return NextResponse.json(data, { status: res.status })
    } catch (error) {
        console.error("Proxy /api/admin/support-messages error:", error)
        return NextResponse.json({ success: false, error: "Proxy error" }, { status: 500 })
    }
}
