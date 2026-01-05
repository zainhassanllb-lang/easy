"use server"

import { cookies } from "next/headers"
import { authenticateUser, registerUser } from "./database"

export async function login(email: string, password: string) {
  const user = authenticateUser(email, password)

  if (!user) {
    return { success: false, error: "Invalid email or password" }
  }

  const cookieStore = await cookies()
  cookieStore.set("userId", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })
  cookieStore.set("userRole", user.role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  })
  if (user.profileId) {
    cookieStore.set("profileId", user.profileId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })
  }

  return { success: true, user: { id: user.id, email: user.email, role: user.role } }
}

export async function register(email: string, password: string, role: "worker" | "client", profileId?: string) {
  const user = registerUser(email, password, role, profileId)

  const cookieStore = await cookies()
  cookieStore.set("userId", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  })
  cookieStore.set("userRole", user.role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  })
  if (user.profileId) {
    cookieStore.set("profileId", user.profileId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })
  }

  return { success: true, user: { id: user.id, email: user.email, role: user.role, profileId: user.profileId } }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("userId")
  cookieStore.delete("userRole")
  cookieStore.delete("profileId")
  return { success: true }
}

export async function getCurrentUser() {
  try {
    const backendUrl = process.env.BACKEND_URL || "https://easy-backend-pkd1.onrender.com"
    const cookieStore = await cookies()
    const cookieName = process.env.COOKIE_NAME || "easy_token"
    const token = cookieStore.get(cookieName)

    if (!token) {
      return null
    }

    // Call backend to verify token and get user info
    const res = await fetch(`${backendUrl}/api/current-user`, {
      method: "GET",
      headers: {
        Cookie: `${cookieName}=${token.value}`,
      },
      cache: "no-store",
    })

    if (!res.ok) {
      return null
    }

    const data = await res.json()

    if (!data.user) {
      return null
    }

    return {
      id: data.user.id || data.user.email,
      role: data.user.role as "worker" | "client" | "admin",
      profileId: data.user.profileId || "",
      email: data.user.email,
    }
  } catch (error) {
    console.error("getCurrentUser error:", error)
    return null
  }
}
