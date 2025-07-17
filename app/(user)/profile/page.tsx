"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useUser } from "@/app/hooks/use-user"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { updateUserProfile } from "@/server/actions/user"

export default function ProfilePage() {
  const { user, authenticated, refreshUser } = useUser()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")

  const handleSaveProfile = async () => {
    if (!authenticated || !user) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile.",
        type: "error",
      })
      return
    }

    setIsSaving(true)
    try {
      const result = await updateUserProfile(user.id, { name, email })
      if (result.success) {
        toast({
          title: "Success",
          description: "Profile updated successfully!",
          type: "success",
        })
        refreshUser() // Refresh user data in context
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update profile.",
          type: "error",
        })
      }
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        type: "error",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (!authenticated) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-gold">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Please log in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-gold">User Profile</CardTitle>
          <CardDescription>Manage your personal information and settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              disabled={!!user?.email} // Disable if email is already set (e.g., from social login)
            />
            {user?.email && (
              <p className="text-sm text-muted-foreground">
                Email is linked to your login method and cannot be changed here.
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="wallet-address">Connected Wallet Address</Label>
            <Input id="wallet-address" type="text" value={user?.walletAddress || "N/A"} readOnly className="bg-muted" />
          </div>
          <Button
            onClick={handleSaveProfile}
            className="w-full bg-gold hover:bg-dark-gold text-white"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Profile"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
