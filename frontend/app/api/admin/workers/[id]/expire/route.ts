import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export const runtime = "nodejs"

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params
        const backendUrl = process.env.BACKEND_URL || "https://easy-backend-pkd1.onrender.com"

        const cookieStore = await cookies()
        const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join("; ")

        const res = await fetch(`${backendUrl}/api/admin/workers/${id}/expire`, {
            method: "POST",
            headers: {
                Cookie: cookieHeader,
            },
        })

        const data = await res.json()
        return NextResponse.json(data, { status: res.status })
    } catch (error) {
        console.error("Worker expire proxy error:", error)
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
    }
}
