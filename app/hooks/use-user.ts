"use client"

import { useState, useEffect, useCallback } from "react"
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { getUserData, updateUserData } from "@/server/actions/user"
import type { User, UserPreferences } from "@/app/types/users"
import { useToast } from "@/hooks/use-toast"

export function useUser() {
  const { ready, authenticated, user: privyUser } = usePrivy()
  const { wallets } = useWallets()
  const { toast } = useToast()

  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      if (ready && authenticated && privyUser?.id) {
        const { success, user: fetchedUser, error: fetchError } = await getUserData(privyUser.id)
        if (success && fetchedUser) {
          setUser(fetchedUser)
        } else {
          // If user not found in DB, create a new entry
          const walletAddress = wallets.find((w) => w.chainType === "solana")?.publicAddress || null
          const embeddedWalletAddress = wallets.find((w) => w.walletClientType === "privy")?.publicAddress || null

          const newUser: Omit<User, "id" | "createdAt" | "updatedAt"> = {
            privyId: privyUser.id,
            email: privyUser.email?.address || null,
            phone: privyUser.phone?.number || null,
            walletAddress: walletAddress,
            embeddedWalletAddress: embeddedWalletAddress,
            username:
              privyUser.username || privyUser.email?.address?.split("@")[0] || privyUser.phone?.number || "User",
            avatarUrl: privyUser.profileImage || null,
            preferences: { theme: "system", notifications: true },
          }
          const {
            success: createSuccess,
            user: createdUser,
            error: createError,
          } = await updateUserData(privyUser.id, newUser)
          if (createSuccess && createdUser) {
            setUser(createdUser)
          } else {
            setError(fetchError || createError || "Failed to fetch or create user data.")
            toast({
              title: "Error",
              description: fetchError || createError || "Failed to load user data.",
              variant: "destructive",
            })
          }
        }
      } else {
        setUser(null)
      }
    } catch (err: any) {
      console.error("Error fetching user data:", err)
      setError(err.message || "Failed to load user data.")
      toast({
        title: "Error",
        description: err.message || "Failed to load user data.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [ready, authenticated, privyUser, wallets, toast])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const updatePreferences = useCallback(
    async (preferences: UserPreferences) => {
      if (!user?.privyId) {
        toast({
          title: "Error",
          description: "User not authenticated.",
          variant: "destructive",
        })
        return false
      }
      setIsLoading(true)
      setError(null)
      try {
        const { success, user: updatedUser, error: updateError } = await updateUserData(user.privyId, { preferences })
        if (success && updatedUser) {
          setUser(updatedUser)
          toast({
            title: "Preferences Updated",
            description: "Your user preferences have been saved.",
          })
          return true
        } else {
          setError(updateError || "Failed to update preferences.")
          toast({
            title: "Error",
            description: updateError || "Failed to update preferences.",
            variant: "destructive",
          })
          return false
        }
      } catch (err: any) {
        console.error("Error updating preferences:", err)
        setError(err.message || "Failed to update preferences.")
        toast({
          title: "Error",
          description: err.message || "Failed to update preferences.",
          variant: "destructive",
        })
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [user, toast],
  )

  return { user, isLoading, error, refetch: fetchUser, updatePreferences }
}
