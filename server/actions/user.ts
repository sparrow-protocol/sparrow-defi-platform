"use server"

import { sql } from "@/app/lib/db"
import type { User } from "@/app/types/users"

export async function getUserData(privyId: string): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const [user] = await sql<User[]>`
      SELECT * FROM users WHERE privy_id = ${privyId};
    `
    if (user) {
      return { success: true, user }
    } else {
      return { success: false, error: "User not found." }
    }
  } catch (error: any) {
    console.error("Database error fetching user:", error)
    return { success: false, error: error.message || "Database error." }
  }
}

export async function updateUserProfile(
  // Exported as updateUserProfile
  privyId: string,
  data: Partial<Omit<User, "id" | "createdAt" | "updatedAt" | "privyId">>,
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const existingUser = await getUserData(privyId)

    if (existingUser.success && existingUser.user) {
      // Update existing user
      const updatedPreferences = { ...existingUser.user.preferences, ...data.preferences }
      const [updatedUser] = await sql<User[]>`
        UPDATE users
        SET
          email = COALESCE(${data.email}, email),
          phone = COALESCE(${data.phone}, phone),
          wallet_address = COALESCE(${data.walletAddress}, wallet_address),
          embedded_wallet_address = COALESCE(${data.embeddedWalletAddress}, embedded_wallet_address),
          username = COALESCE(${data.username}, username),
          avatar_url = COALESCE(${data.avatarUrl}, avatar_url),
          preferences = ${JSON.stringify(updatedPreferences)}::jsonb,
          updated_at = NOW()
        WHERE privy_id = ${privyId}
        RETURNING *;
      `
      if (updatedUser) {
        return { success: true, user: updatedUser }
      } else {
        return { success: false, error: "Failed to update user." }
      }
    } else {
      // Create new user
      const [newUser] = await sql<User[]>`
        INSERT INTO users (privy_id, email, phone, wallet_address, embedded_wallet_address, username, avatar_url, preferences)
        VALUES (
          ${privyId},
          ${data.email || null},
          ${data.phone || null},
          ${data.walletAddress || null},
          ${data.embeddedWalletAddress || null},
          ${data.username || null},
          ${data.avatarUrl || null},
          ${JSON.stringify(data.preferences || { theme: "system", notifications: true })}::jsonb
        )
        RETURNING *;
      `
      if (newUser) {
        return { success: true, user: newUser }
      } else {
        return { success: false, error: "Failed to create user." }
      }
    }
  } catch (error: any) {
    console.error("Database error updating/creating user:", error)
    return { success: false, error: error.message || "Database error." }
  }
}
