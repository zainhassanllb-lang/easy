import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
        const body = await req.json();

        console.log(`[PROXY] Sending to ${backendUrl}/api/forgot-password:`, body);

        // Simple fetch without AbortController for debugging
        const res = await fetch(`${backendUrl}/api/forgot-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        console.log(`[PROXY] Raw status: ${res.status}`);
        const data = await res.json();
        console.log(`[PROXY] Received from backend:`, data);

        return NextResponse.json(data, { status: res.status });
    } catch (error: any) {
        console.error("[PROXY] CRITICAL ERROR:", error.message);
        return NextResponse.json({
            success: false,
            error: `Connection failed: ${error.message}`,
            details: "Backend on 127.0.0.1:5000 is not responding or unreachable."
        }, { status: 500 });
    }
}
